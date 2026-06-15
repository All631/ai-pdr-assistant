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

/** Правила за п. 8.8 ПДР України (Постанова КМУ № 1306) */
export const REGULATOR_GESTURE_GROUPS: RegulatorGestureGroup[] = [
  {
    id: 'stop',
    title: 'Сигнал «Увага! Всім стояти!»',
    summary:
      'Регулювальник підняв руку вгору (п. 8.8 в)). Рух усіх транспортних засобів і пішоходів заборонено в усіх напрямках.',
    pdrReference: 'п. 8.8 (в) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: 'Негайно зупинитися. Рух заборонено в усіх напрямках.',
        trams: 'Негайно зупинитися. Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено. Чекати наступного сигналу.',
        allowed: false,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: 'Негайно зупинитися. Рух заборонено в усіх напрямках.',
        trams: 'Негайно зупинитися. Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено.',
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: 'Негайно зупинитися. Рух заборонено.',
        trams: 'Негайно зупинитися. Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено.',
        allowed: false,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: 'Негайно зупинитися. Рух заборонено.',
        trams: 'Негайно зупинитися. Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено.',
        allowed: false,
      },
    ],
  },
  {
    id: 'arms-out',
    title: 'Руки опущені або витягнуті в сторони',
    summary:
      'Жест п. 8.8 (а): з боків — нерейковим ТЗ дозволено прямо та праворуч, трамваям — лише прямо («з рукава в рукав»); з грудей і спини — рух усіх заборонено.',
    pdrReference: 'п. 8.8 (а) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено.',
        allowed: false,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено.',
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: 'Дозволено: прямо та праворуч.',
        trams: 'Дозволено: лише прямо за напрямком рейок («з рукава в рукав»).',
        pedestrians:
          'Дозволено переходити проїзну частину за спиною та перед грудьми регулювальника (паралельно його осі).',
        allowed: true,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: 'Дозволено: прямо та праворуч.',
        trams: 'Дозволено: лише прямо за напрямком рейок («з рукава в рукав»).',
        pedestrians:
          'Дозволено переходити проїзну частину за спиною та перед грудьми регулювальника (паралельно його осі).',
        allowed: true,
      },
    ],
  },
  {
    id: 'arm-forward',
    title: 'Права рука витягнута вперед',
    summary:
      'Жест п. 8.8 (б): з лівого боку нерейковим ТЗ — у всіх напрямках, трамваю — лише ліворуч; з грудей — усім ТЗ лише праворуч; з правого боку та спини — рух ТЗ заборонено.',
    pdrReference: 'п. 8.8 (б) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: 'Дозволено лише праворуч.',
        trams: 'Дозволено лише праворуч (за напрямком рейок, якщо траєкторія дозволяє).',
        pedestrians: 'Перехід проїзної частини заборонено.',
        allowed: true,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians:
          'Дозволено переходити проїзну частину лише за спиною регулювальника (паралельно його спині).',
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: 'Дозволено: прямо, ліворуч, праворуч та розворот.',
        trams: 'Дозволено: лише ліворуч («з рукава в рукав»). Прямо та праворуч заборонено.',
        pedestrians:
          'Дозволено переходити проїзну частину лише за спиною регулювальника (паралельно його спині).',
        allowed: true,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: 'Рух заборонено в усіх напрямках.',
        trams: 'Рух заборонено.',
        pedestrians: 'Перехід проїзної частини заборонено.',
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
