export { TrafficLightsGallery, StandardTrafficLight } from './lights';
export { RegulatorGestureSection } from './regulator/RegulatorGestureSection';
export { REGULATOR_GESTURE_GROUPS, REGULATOR_GESTURES } from '../../data/regulatorGesturesData';
export type { RegulatorGestureId } from '../../data/regulatorGesturesData';
export { RoadMarking } from './RoadMarking';
export { MiniQuiz } from './MiniQuiz';
export type { QuizQuestion } from './MiniQuiz';
export {
  VISUAL_LESSONS_STORAGE_KEY,
  loadVisualLessonsProgress,
  saveVisualLessonsProgress,
  DEFAULT_PROGRESS,
} from './visualLessonsProgress';
export type { VisualLessonsProgress } from './visualLessonsProgress';
export { SignGallery } from './signs/SignGallery';

/** @deprecated Use TrafficLightsGallery */
export { StandardTrafficLight as TrafficLightCard } from './lights';

/** @deprecated Use RegulatorGestureSection */
export { RegulatorGestureSection as RegulatorGesture } from './regulator/RegulatorGestureSection';
