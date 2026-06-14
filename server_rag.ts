import fs from "fs";
import path from "path";

export interface Chunk {
  id: string;
  section: string;
  content: string;
}

export interface ChunkWithEmbedding extends Chunk {
  embedding?: number[];
}

// Chunks builder splits the PDR text by paragraphs and points while preserving section headers
export function buildChunks(rawText: string): Chunk[] {
  const lines = rawText.split('\n');
  const chunks: Chunk[] = [];
  let currentSection = "Загальні ПДР України";
  let currentBlock: string[] = [];
  let chunkCounter = 0;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Detect section heading
    if (line.startsWith("РОЗДІЛ")) {
      if (currentBlock.length > 0) {
        chunkCounter++;
        chunks.push({
          id: `chunk-${chunkCounter}`,
          section: currentSection,
          content: currentBlock.join('\n')
        });
        currentBlock = [];
      }
      currentSection = line;
      continue;
    }

    // Numbered subpoints like "1.1.", "12.3.", etc. trigger a new chunk
    const isNumberedRule = /^\d+\.\d+\./.test(line);

    if (isNumberedRule) {
      if (currentBlock.length > 0) {
        chunkCounter++;
        chunks.push({
          id: `chunk-${chunkCounter}`,
          section: currentSection,
          content: currentBlock.join('\n')
        });
        currentBlock = [];
      }
    }

    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    chunkCounter++;
    chunks.push({
      id: `chunk-${chunkCounter}`,
      section: currentSection,
      content: currentBlock.join('\n')
    });
  }

  return chunks;
}

// Simple fallback keyword metric to rank chunks when OpenAI API key is missing
function computeKeywordOverlaps(query: string, chunk: Chunk): number {
  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?" Ukraine]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2); // only consider significant words
  };

  const queryWords = normalize(query);
  const contentWords = normalize(chunk.content + " " + chunk.section);

  if (queryWords.length === 0) return 0;

  let matches = 0;
  for (const qWord of queryWords) {
    // Simple stem matching: if word matches or is contained in content
    if (contentWords.some(cWord => cWord.includes(qWord) || qWord.includes(cWord))) {
      matches++;
    }
  }

  return matches / queryWords.length;
}

// Cosine similarity for real vector embeddings
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const PDR_DATA_DIR = path.join(process.cwd(), "src", "data");
const PDR_EMBEDDINGS_PATH = path.join(PDR_DATA_DIR, "pdr_embeddings.json");
const PDR_UKRAINE_PATH = path.join(PDR_DATA_DIR, "pdr_ukraine.txt");

export class PdrVectorDb {
  private chunks: ChunkWithEmbedding[] = [];
  private dbPath = PDR_EMBEDDINGS_PATH;
  private rawPdrPath = PDR_UKRAINE_PATH;

  constructor() {
    this.loadOrBuildDb();
  }

  /**
   * Loads chunks from file, and falls back to building chunks from raw text
   */
  private loadOrBuildDb() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const rawJson = fs.readFileSync(this.dbPath, "utf-8");
        this.chunks = JSON.parse(rawJson);
        console.log(`[RAG VectorDB] Loaded ${this.chunks.length} chunks with embeddings from cache.`);
      } else {
        console.log(`[RAG VectorDB] Cache not found. Loading raw text from ${this.rawPdrPath}`);
        this.rebuildFromRawText();
      }
    } catch (err) {
      console.error("[RAG VectorDB] Error initializing DB:", err);
      this.rebuildFromRawText();
    }
  }

  private rebuildFromRawText() {
    try {
      if (fs.existsSync(this.rawPdrPath)) {
        const rawText = fs.readFileSync(this.rawPdrPath, "utf-8");
        const built = buildChunks(rawText);
        this.chunks = built.map(c => ({ ...c }));
        console.log(`[RAG VectorDB] Successfully chunked raw text into ${this.chunks.length} items.`);
      } else {
        console.error(`[RAG VectorDB] Critical Error: ${this.rawPdrPath} does not exist.`);
        this.chunks = [];
      }
    } catch (e) {
      console.error("[RAG VectorDB] Failed to build chunks from raw text:", e);
      this.chunks = [];
    }
  }

  /**
   * Compute embeddings using Google Gemini API for chunks that are missing them
   */
  public async ensureEmbeddingsInitialized(apiKey: string | undefined): Promise<void> {
    if (!apiKey) {
      console.log("[RAG VectorDB] Missing API key, skipping Vector calculations. Using fallback keyword matching.");
      return;
    }

    // Find chunks that do not have embeddings yet
    const missingEmbeddings = this.chunks.filter(c => !c.embedding || c.embedding.length === 0);
    if (missingEmbeddings.length === 0) {
      return;
    }

    console.log(`[RAG VectorDB] Computing embeddings for ${missingEmbeddings.length} missing chunks utilizing Google Gemini API...`);
    
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Fetch in batches to stay within quota limits and handle cleanly
      const batchSize = 10;
      for (let i = 0; i < missingEmbeddings.length; i += batchSize) {
        const batch = missingEmbeddings.slice(i, i + batchSize);
        const promises = batch.map(async (c) => {
          try {
            const inputText = `Section: ${c.section}\nContent: ${c.content}`;
            const res = await ai.models.embedContent({
              model: "text-embedding-004",
              contents: inputText,
            });
            const embeddingObj = (res as any).embedding || (res as any).embeddings;
            const values = embeddingObj?.values || (Array.isArray(embeddingObj) ? embeddingObj[0]?.values : undefined);
            return { id: c.id, embedding: values };
          } catch (itemErr) {
            console.error(`[RAG VectorDB] Error embedding chunk ${c.id}:`, itemErr);
            return { id: c.id, embedding: undefined };
          }
        });

        const results = await Promise.all(promises);

        results.forEach((res) => {
          if (res.embedding) {
            const chunkIndex = this.chunks.findIndex(c => c.id === res.id);
            if (chunkIndex !== -1) {
              this.chunks[chunkIndex].embedding = res.embedding;
            }
          }
        });
      }

      // Vercel serverless has a read-only filesystem — skip cache write there
      if (process.env.VERCEL !== "1") {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.chunks, null, 2), "utf-8");
        console.log(`[RAG VectorDB] Computed & saved ${missingEmbeddings.length} embeddings to cache!`);
      } else {
        console.log(`[RAG VectorDB] Computed ${missingEmbeddings.length} embeddings (cache write skipped on Vercel).`);
      }
    } catch (err) {
      console.error("[RAG VectorDB] Error computing embeddings:", err);
    }
  }

  /**
   * Search for top K relevant chunks using the specified query text
   */
  public async search(query: string, apiKey: string | undefined, limit: number = 3): Promise<Chunk[]> {
    if (this.chunks.length === 0) {
      this.loadOrBuildDb();
    }

    const hasApiKeyAndValidEmbeddings = apiKey && this.chunks.some(c => c.embedding && c.embedding.length > 0);

    if (hasApiKeyAndValidEmbeddings) {
      console.log(`[RAG VectorDB] Performing Google Gemini semantic vector search for: "${query}"`);
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const res = await ai.models.embedContent({
          model: "text-embedding-004",
          contents: query,
        });

        const embeddingObj = (res as any).embedding || (res as any).embeddings;
        const queryVector = embeddingObj?.values || (Array.isArray(embeddingObj) ? embeddingObj[0]?.values : undefined);
        if (!queryVector) {
          throw new Error("Failed to yield embedding for user query.");
        }

        // Rank by cosine similarity
        const scoredChunks = this.chunks.map(chunk => {
          const score = chunk.embedding ? cosineSimilarity(queryVector, chunk.embedding) : 0;
          return { chunk, score };
        });

        // Sort descending
        scoredChunks.sort((a, b) => b.score - a.score);
        console.log(`[RAG VectorDB] Top similarity scores:`, scoredChunks.slice(0, 3).map(s => `${s.chunk.id} (Score: ${s.score.toFixed(3)})`));

        return scoredChunks.slice(0, limit).map(s => s.chunk);
      } catch (err) {
        console.error("[RAG VectorDB] Real vector search failed. Falling back to keyword ranking:", err);
      }
    }

    console.log(`[RAG VectorDB] Performing search via local keyword stem overlap for: "${query}"`);
    // Fallback: simple token intersection rating
    const scoredChunks = this.chunks.map(chunk => {
      const score = computeKeywordOverlaps(query, chunk);
      return { chunk, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    // filter chunks that have 0 score if there are other matching ones
    const bestMatches = scoredChunks.filter(s => s.score > 0);
    const results = bestMatches.length > 0 ? bestMatches : scoredChunks;

    return results.slice(0, limit).map(s => s.chunk);
  }
}

// Single instance
export const pdrVectorDbInstance = new PdrVectorDb();
