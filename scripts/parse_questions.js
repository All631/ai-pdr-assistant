/**
 * UTILITY SCRIPT FOR DEVELOPERS (Node.js)
 * ========================================
 * This script parses raw text files of Ukrainian PDR questions (copied from official decrees or open databases)
 * and converts them into the structured JSON format utilized by the application in /src/data/questions.json.
 * 
 * DESIGN PROTOCOL & FORMATS
 * -------------------------
 * The parser expects question blocks in the following standard formats:
 * 
 * --- FORMAT EXAMPLE A (Numeric answers): ---
 * Питання №125:
 * Яка мінімальна відстань від пішохідного переходу встановлена для дозволеної зупинки або стоянки транспортних засобів?
 * 1. Безпосередньо перед переходом
 * 2. Не ближче ніж 5 метрів з обох боків від переходу
 * 3. Не ближче ніж 10 метрів з обох боків від переходу
 * 4. Не ближче ніж 15 метрів перед переходом
 * Правильна відповідь: 3
 * Пояснення: Відповідно до пункту 15.9 (г) ПДР України, зупинка забороняється ближче ніж 10 метрів від них з обох боків.
 * 
 * --- FORMAT EXAMPLE B (Alphabetical answers with colon/dashes): ---
 * Питання №126
 * Чи дозволяється рух транспортних засобів по тротуарах і пішохідних доріжках?
 * А) Дозволяється у будь-який час, якщо водій не створює небезпеки
 * Б) Дозволяється лише для обслуговування підприємств за відсутності інших під'їздів
 * В) Категорично забороняється
 * Правильна відповідь: Б
 * Пояснення: Згідно з пунктом 11.13 ПДР України рух по тротуарах заборонено крім випадків обслуговування...
 * 
 * RUNNING THE PARSER
 * ------------------
 * 1) Create a file called `raw_questions.txt` and paste your raw question text there.
 * 2) Run the script:
 *    node scripts/parse_questions.js raw_questions.txt
 * 
 * Alternatively, to run the built-in test demonstration:
 *    node scripts/parse_questions.js --demo
 */

const fs = require('fs');
const path = require('path');

// Target file locations
const QUESTIONS_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'questions.json');

// Built-in demonstration text for the --demo flow
const DEMO_TEXT = `
Питання №21:
Яка максимальна швидкість руху встановлена для транспортних засобів у житлових зонах?
1. 10 км/год.
2. 20 км/год.
3. 30 км/год.
Правильна відповідь: 2
Пояснення: Відповідно до **пункту 12.5 ПДР**, швидкість у житловій зоні не повинна перевищувати 20 км/год.

Питання №22:
У якому випадку дозволено обгін на перехресті?
А) Якщо дорога є головною по відношенню до перехресної
Б) На будь-якому нерегульованому перехресті
В) Обгін на всіх перехрестях категорично забороняється
Правильна відповідь: В
Пояснення: Відповідно до **пункту 14.6 (а)** ПДР України, обгін заборонено на перехрестях.
`;

function parseRawText(rawText) {
  // Normalize newline sequences
  const text = rawText.replace(/\r\n/g, '\n');
  
  // Split the file contents by "Питання" markers to isolate individual questions
  // Matches "Питання №..." or "Питання ..."
  const questionBlocks = text.split(/(?=Питання\s*(?:№|\d+))/gi);
  const parsedQuestions = [];

  for (const block of questionBlocks) {
    if (!block.trim()) continue;

    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 3) continue; // Skip invalid fragments

    // 1. Identify raw ID or build automatic sequence ID
    let questionIdStr = null;
    let titleLineIndex = 0;
    
    const idMatch = lines[0].match(/Питання\s*(?:№)?\s*(\d+)/i);
    if (idMatch) {
      questionIdStr = `q-${idMatch[1]}`;
      // Check if the title line also contains the question itself (e.g., "Питання №12: Чи дозволяється...")
      const colonIndex = lines[0].indexOf(':');
      if (colonIndex !== -1 && lines[0].substring(colonIndex + 1).trim().length > 10) {
        // Question is on the same line as the ID
        lines[0] = lines[0].substring(colonIndex + 1).trim();
      } else {
        titleLineIndex = 1;
      }
    }

    // 2. Extract Question Text
    if (titleLineIndex >= lines.length) continue;
    let questionText = lines[titleLineIndex];

    // If the next line doesn't look like an answer or correct answer or explanation, it belongs to the question description
    let currentIndex = titleLineIndex + 1;
    while (
      currentIndex < lines.length &&
      !isAnswerChoiceLine(lines[currentIndex]) &&
      !isCorrectAnswerLine(lines[currentIndex]) &&
      !isExplanationLine(lines[currentIndex])
    ) {
      questionText += ' ' + lines[currentIndex];
      currentIndex++;
    }

    // 3. Extract Answer Choices
    const answers = [];
    const answerRefs = []; // Stores labels like '1', '2', 'А', 'Б' for correct answer matching
    
    while (currentIndex < lines.length && isAnswerChoiceLine(lines[currentIndex])) {
      const choiceLine = lines[currentIndex];
      const match = choiceLine.match(/^([0-9А-Яа-яA-Za-z]+)(?:\.|\)|-)\s*(.*)$/u);
      if (match) {
        answerRefs.push(match[1].toUpperCase());
        // Clean trailing periods or whitespaces
        answers.push(match[2].trim().replace(/\.$/, ''));
      } else {
        answers.push(choiceLine);
      }
      currentIndex++;
    }

    // 4. Extract Correct Answer Reference Index
    let correctAnswerIndex = 0;
    let explanationStr = '';

    while (currentIndex < lines.length) {
      const line = lines[currentIndex];
      if (isCorrectAnswerLine(line)) {
        // Matches digits or letters (e.g. "2" or "Б")
        const ansMatch = line.match(/(?:Правильна відповідь|Правильний варіант|Правильно|Відповідь)\s*(?::|№)?\s*([0-9А-Яа-яA-Za-z]+)/u);
        if (ansMatch) {
          const rawAnswerToken = ansMatch[1].toUpperCase();
          // Find numerical equivalent (0-indexed) or physical label mapping
          const mappedIndex = answerRefs.indexOf(rawAnswerToken);
          if (mappedIndex !== -1) {
            correctAnswerIndex = mappedIndex;
          } else {
            // Fallback: If it's a number like "1", converted directly to index "0"
            const parsedNum = parseInt(rawAnswerToken, 10);
            if (!isNaN(parsedNum)) {
              correctAnswerIndex = Math.max(0, parsedNum - 1);
            }
          }
        }
      } else if (isExplanationLine(line)) {
        explanationStr = line.replace(/^(?:Пояснення|Роз'яснення|Юридична довідка):\s*/gi, '').trim();
      } else if (explanationStr) {
        // Collect multi-line explanations
        explanationStr += ' ' + line;
      } else {
        // If not flagged as Correct Answer line or Explanation, but comes after answers, default to appended explanation
        explanationStr = (explanationStr ? explanationStr + ' ' : '') + line;
      }
      currentIndex++;
    }

    // Add back fallback elements if missing
    if (!questionIdStr) {
      questionIdStr = `q-parsed-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    parsedQuestions.push({
      id: questionIdStr,
      question: questionText.trim(),
      image: "",
      answers,
      correctAnswer: correctAnswerIndex,
      explanation: explanationStr.trim()
    });
  }

  return parsedQuestions;
}

// Helper methods to classify lines
function isAnswerChoiceLine(line) {
  // Matches "1. Text", "А) Text", "Б - Text", "a) Text" etc.
  return /^[0-9А-Яа-яa-zA-Z](?:\.|\)|-)/u.test(line);
}

function isCorrectAnswerLine(line) {
  return /^(?:Правильна відповідь|Правильний варіант|Правильно|Відповідь)/i.test(line);
}

function isExplanationLine(line) {
  return /^(?:Пояснення|Роз'яснення|Юридична довідка)/i.test(line);
}

function main() {
  const args = process.argv.slice(2);
  let rawContent = '';
  let isDemo = false;

  if (args.length === 0 || args[0] === '--demo') {
    console.log('[Developer Parser] No source file specified. Running demonstration mode (--demo)...');
    rawContent = DEMO_TEXT;
    isDemo = true;
  } else {
    const filePath = path.resolve(args[0]);
    if (!fs.existsSync(filePath)) {
      console.error(`[Error] File not found: ${filePath}`);
      process.exit(1);
    }
    rawContent = fs.readFileSync(filePath, 'utf8');
    console.log(`[Developer Parser] Reading raw questions file from: ${filePath}`);
  }

  const newQuestions = parseRawText(rawContent);
  if (newQuestions.length === 0) {
    console.warn('[Warning] No valid question structures parsed from the input. Double-check patterns and templates.');
    process.exit(0);
  }

  console.log(`[Success] Successfully parsed ${newQuestions.length} questions.`);

  // Load existing questions for merging or appending
  let finalQuestions = [];
  try {
    if (fs.existsSync(QUESTIONS_JSON_PATH)) {
      const existingRaw = fs.readFileSync(QUESTIONS_JSON_PATH, 'utf8');
      finalQuestions = JSON.parse(existingRaw);
      console.log(`[Merge] Found ${finalQuestions.length} existing questions in /src/data/questions.json`);
    }
  } catch (err) {
    console.warn('[Warning] Failed to read existing questions.json. Will overwrite file. Error:', err.message);
  }

  // Deduplicate and append/update questions based on their parsed ID
  let addedCount = 0;
  let updatedCount = 0;

  newQuestions.forEach(newQ => {
    const existingIndex = finalQuestions.findIndex(q => q.id === newQ.id);
    if (existingIndex !== -1) {
      // Overwrite/update existing
      finalQuestions[existingIndex] = newQ;
      updatedCount++;
    } else {
      // Append new question
      finalQuestions.push(newQ);
      addedCount++;
    }
  });

  // Sort final questions by ID if possible
  finalQuestions.sort((a, b) => {
    const idA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const idB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return idA - idB;
  });

  // Write output
  try {
    fs.writeFileSync(QUESTIONS_JSON_PATH, JSON.stringify(finalQuestions, null, 2), 'utf8');
    console.log(`[Write Complete] /src/data/questions.json updated successfully.`);
    console.log(`   -> Added: ${addedCount}`);
    console.log(`   -> Updated: ${updatedCount}`);
    console.log(`   -> Total catalog capacity: ${finalQuestions.length} items.`);
    
    if (isDemo) {
      console.log('\n--- DEMO ITEM PARSED EXAMPLE ---');
      console.log(JSON.stringify(newQuestions[0], null, 2));
    }
  } catch (writeErr) {
    console.error('[Error] Failed to write to questions.json:', writeErr.message);
    process.exit(1);
  }
}

main();
