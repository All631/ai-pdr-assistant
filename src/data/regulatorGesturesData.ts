export type RegulatorGestureId = 'stop' | 'arms-out' | 'arm-forward';
export type ApproachSide = 'chest' | 'back' | 'left' | 'right';
export type VehicleMove = 'straight' | 'right' | 'left' | 'u-turn';

export interface MovementSet {
  /** Дозволені напрямки для авто (порожньо = усі заборонені). */
  allowed: VehicleMove[];
  summary: string;
}

export interface TramMovementSet {
  /** Дозволені напрямки для трамвая «з рукава в рукав». */
  allowed: Array<'straight' | 'left' | 'right'>;
  summary: string;
}

export interface PedestrianRule {
  allowed: boolean;
  summary: string;
}

export interface ApproachRule {
  side: ApproachSide;
  label: string;
  vehicles: MovementSet;
  trams: TramMovementSet;
  pedestrians: PedestrianRule;
  /** Загальний статус для бейджа на схемі (чи є хоч один дозволений рух для ТЗ). */
  allowed: boolean;
}

export interface RegulatorGestureGroup {
  id: RegulatorGestureId;
  title: string;
  summary: string;
  pdrReference: string;
  approaches: ApproachRule[];
}

const ALL_FORBIDDEN_V: MovementSet = {
  allowed: [],
  summary: 'Рух заборонено в усіх напрямках. Негайно зупинитися.',
};

const ALL_FORBIDDEN_T: TramMovementSet = {
  allowed: [],
  summary: 'Рух заборонено.',
};

const PED_FORBIDDEN: PedestrianRule = {
  allowed: false,
  summary: 'Перехід проїзної частини заборонено.',
};

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
        vehicles: ALL_FORBIDDEN_V,
        trams: ALL_FORBIDDEN_T,
        pedestrians: {
          allowed: false,
          summary: 'Перехід заборонено. Чекати наступного сигналу.',
        },
        allowed: false,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: ALL_FORBIDDEN_V,
        trams: ALL_FORBIDDEN_T,
        pedestrians: PED_FORBIDDEN,
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: ALL_FORBIDDEN_V,
        trams: ALL_FORBIDDEN_T,
        pedestrians: PED_FORBIDDEN,
        allowed: false,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: ALL_FORBIDDEN_V,
        trams: ALL_FORBIDDEN_T,
        pedestrians: PED_FORBIDDEN,
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
        vehicles: { allowed: [], summary: 'Рух заборонено в усіх напрямках.' },
        trams: ALL_FORBIDDEN_T,
        pedestrians: PED_FORBIDDEN,
        allowed: false,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: { allowed: [], summary: 'Рух заборонено в усіх напрямках.' },
        trams: ALL_FORBIDDEN_T,
        pedestrians: PED_FORBIDDEN,
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: {
          allowed: ['straight', 'right'],
          summary: 'Дозволено: прямо та праворуч. Ліворuch і розворот заборонено.',
        },
        trams: {
          allowed: ['straight'],
          summary: 'Дозволено лише прямо за напрямком рейок («з рукава в рукав»). Повороти заборонено.',
        },
        pedestrians: {
          allowed: true,
          summary:
            'Дозволено переходити за спиною та перед грудьми регулювальника (паралельно його осі).',
        },
        allowed: true,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: {
          allowed: ['straight', 'right'],
          summary: 'Дозволено: прямо та праворuch. Ліворuch і розворот заборонено.',
        },
        trams: {
          allowed: ['straight'],
          summary: 'Дозволено лише прямо за напрямком рейок («з рукава в рукав»).',
        },
        pedestrians: {
          allowed: true,
          summary:
            'Дозволено переходити за спиною та перед грудьми регулювальника (паралельно його осі).',
        },
        allowed: true,
      },
    ],
  },
  {
    id: 'arm-forward',
    title: 'Права рука витягнута вперед',
    summary:
      'Жест п. 8.8 (б): з лівого боку — нерейковим ТЗ у всіх напрямках, трамваю лише ліворuch; з грудей — усім ТЗ лише праворuch; з правого боку та спини — рух ТЗ заборонено.',
    pdrReference: 'п. 8.8 (б) ПДР',
    approaches: [
      {
        side: 'chest',
        label: 'Підхід з боку ГРУДЕЙ',
        vehicles: {
          allowed: ['right'],
          summary: 'Дозволено лише праворuch. Прямо, ліворuch і розворот заборонено.',
        },
        trams: {
          allowed: ['right'],
          summary: 'Дозволено лише праворuch за напрямком рейок.',
        },
        pedestrians: PED_FORBIDDEN,
        allowed: true,
      },
      {
        side: 'back',
        label: 'Підхід з боку СПИНИ',
        vehicles: ALL_FORBIDDEN_V,
        trams: ALL_FORBIDDEN_T,
        pedestrians: {
          allowed: true,
          summary:
            'Дозволено переходити лише за спиною регулювальника (паралельно його спині).',
        },
        allowed: false,
      },
      {
        side: 'left',
        label: 'Підхід з ЛІВОГО БОКУ',
        vehicles: {
          allowed: ['straight', 'left', 'right', 'u-turn'],
          summary: 'Дозволено: прямо, ліворuch, праворuch та розворот.',
        },
        trams: {
          allowed: ['left'],
          summary:
            'Дозволено лише ліворuch («з рукава в рукав»). Прямо та праворuch заборонено.',
        },
        pedestrians: {
          allowed: true,
          summary:
            'Дозволено переходити лише за спиною регулювальника (паралельно його спині).',
        },
        allowed: true,
      },
      {
        side: 'right',
        label: 'Підхід з ПРАВОГО БОКУ',
        vehicles: ALL_FORBIDDEN_V,
        trams: ALL_FORBIDDEN_T,
        pedestrians: PED_FORBIDDEN,
        allowed: false,
      },
    ],
  },
];

/** @deprecated Use REGULATOR_GESTURE_GROUPS */
export const REGULATOR_GESTURES = REGULATOR_GESTURE_GROUPS.map((g, i) => ({
  variant: (i + 1) as 1 | 2 | 3,
  label: g.title,
  description: g.summary,
  legalDetails: g.pdrReference,
}));

export const VEHICLE_MOVE_LABELS: Record<VehicleMove, string> = {
  straight: 'Прямо',
  right: 'Праворuch',
  left: 'Ліворuch',
  'u-turn': 'Розворот',
};
