export type RegulatorGestureId = 'stop' | 'arms-out' | 'arm-forward';
export type ApproachSide = 'chest' | 'back' | 'left' | 'right';

export interface ApproachRule {
  side: ApproachSide;
  label: string;
  vehicles: string;
  trams: string;
  pedestrians: string;
  allowed: boolean;
}

export interface RegulatorGestureGroup {
  id: RegulatorGestureId;
  title: string;
  summary: string;
  pdrReference: string;
  approaches: ApproachRule[];
}

/** Правила за п. 8.7.3 ПДР України */
export const REGULATOR_GESTURE_GROUPS: RegulatorGestureGroup[] = [
  {
    id: 'stop',
    title: 'Сигнал «Увага! Всім стояти!»',
    summary: 'Регулювальник підняв руку вгору або обидві руки. Рух заборонено з усіх напрямків.',
    pdrReference: 'п. 8.7.3 (1) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: 'Зупинитися. Рух заборонено в усіх напрямках.',
        trams: 'Зупинитися. Рух заборонено.',
        pedestrians: 'Не переходити проїзну частину. Чекати сигналу.',
        allowed: false,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: 'Зупинитися. Рух заборонено в усіх напрямках.',
        trams: 'Зупинитися. Рух заборонено.',
        pedestrians: 'Не переходити проїзну частину.',
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: 'Зупинитися. Рух заборонено.',
        trams: 'Зупинитися. Рух заборонено.',
        pedestrians: 'Не переходити проїзну частину.',
        allowed: false,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: 'Зупинитися. Рух заборонено.',
        trams: 'Зупинитися. Рух заборонено.',
        pedestrians: 'Не переходити проїзну частину.',
        allowed: false,
      },
    ],
  },
  {
    id: 'arms-out',
    title: 'Руки опущені або витягнуті в сторони',
    summary:
      'З боків регулювальника дозволено рух у певних напрямках; з грудей і спини — заборонено.',
    pdrReference: 'п. 8.7.3 (2) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Не переходити проїзну частину.',
        allowed: false,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Дозволено переходити проїзну частину за спиною регулювальника.',
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: 'Дозволено: прямо та ліворуч.',
        trams: 'Дозволено: прямо (за напрямком рейок).',
        pedestrians: 'Переходити лише за напрямком руху транспорту з цього боку.',
        allowed: true,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: 'Дозволено: прямо та праворуч.',
        trams: 'Дозволено: прямо (за напрямком рейок).',
        pedestrians: 'Переходити лише за напрямком руху транспорту з цього боку.',
        allowed: true,
      },
    ],
  },
  {
    id: 'arm-forward',
    title: 'Права рука витягнута вперед',
    summary:
      'З лівого боку — рух у всіх напрямках; з грудей — лише праворуч; з правого боку та спини — заборонено.',
    pdrReference: 'п. 8.7.3 (3) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: 'Дозволено лише праворуч.',
        trams: 'Дозволено: прямо (за напрямком рейок).',
        pedestrians: 'Не переходити проїзну частину.',
        allowed: true,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Дозволено переходити проїзну частину за спиною регулювальника.',
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: 'Дозволено: прямо, ліворуч, праворуч та розворот.',
        trams: 'Дозволено: прямо; якщо рейки праворуч — можливий від'їзд праворуч.',
        pedestrians: 'Переходити за напрямком дозволеного руху з цього боку.',
        allowed: true,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Не переходити проїзну частину.',
        allowed: false,
      },
    ],
  },
];

/** @deprecated Use REGULATOR_GESTURE_GROUPS — kept for backward compat in exports */
export const REGULATOR_GESTURES = REGULATOR_GESTURE_GROUPS.map((g, i) => ({
  variant: (i + 1) as 1 | 2 | 3,
  label: g.title,
  description: g.summary,
  legalDetails: g.pdrReference,
}));
