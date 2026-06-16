export type SignCategoryId =
  | 'warning'
  | 'priority'
  | 'prohibitory'
  | 'mandatory'
  | 'info'
  | 'service';

export interface SignCatalogEntry {
  id: string;
  code: string;
  name: string;
  description: string;
  category: SignCategoryId;
}

export const SIGN_CATEGORIES: { id: SignCategoryId; label: string; hint: string }[] = [
  { id: 'warning', label: 'Попереджувальні', hint: 'Трикутні, червона облямівка · ДСТУ 2.3.2' },
  { id: 'priority', label: 'Знаки пріоритету', hint: 'STOP, дати дорогу, головна · ДСТУ 2.3.2' },
  { id: 'prohibitory', label: 'Заборонні', hint: 'Круглі, червона облямівка · ДСТУ 2.3.2' },
  { id: 'mandatory', label: 'Наказові', hint: 'Круглі сині · ДСТУ 2.3.2' },
  { id: 'info', label: 'Інформаційні', hint: 'Сині/зелені квадрати · ДСТУ 2.3.2' },
  { id: 'service', label: 'Знаки сервісу та таблички', hint: 'Послуги, таблички · ДСТУ 2.3.2' },
];

/** Каталог узгоджено з ДСТУ 4100:2021 та додатком 1 ПДР України */
export const TRAFFIC_SIGN_CATALOG: SignCatalogEntry[] = [
  // Попереджувальні (13)
  { id: 'dangerous-turn', code: '1.12', name: 'Небезпечний поворот', description: 'Попереджає про різкий поворот дороги.', category: 'warning' },
  { id: 'crossroads', code: '1.30', name: 'Перехрестя', description: 'Наближення до перехрестя рівнозначних доріг.', category: 'warning' },
  { id: 'general-danger', code: '1.33', name: 'Небезпека', description: 'Загальне попередження про небезпеку.', category: 'warning' },
  { id: 'pedestrian-crossing', code: '1.22', name: 'Пішохідний перехід', description: 'Попередження про перехід поза населеним пунктом.', category: 'warning' },
  { id: 'children', code: '1.23', name: 'Діти', description: 'Можливий вихід дітей на проїзну частину.', category: 'warning' },
  { id: 'steep-descent', code: '1.14', name: 'Крутий спуск', description: 'Крутий спуск; потрібне гальмування.', category: 'warning' },
  { id: 'steep-ascent', code: '1.13', name: 'Крутий підйом', description: 'Крутий підйом; можливе зниження швидкості.', category: 'warning' },
  { id: 'wild-animals', code: '1.24', name: 'Дикі тварини', description: 'Можливий вихід тварин на дорогу.', category: 'warning' },
  { id: 'road-works', code: '1.34', name: 'Дорожні роботи', description: 'Ремонт або будівництво дороги.', category: 'warning' },
  { id: 'slippery', code: '1.19', name: 'Слизька дорога', description: 'Зменшити швидкість — слизьке покриття.', category: 'warning' },
  { id: 'roundabout-warn', code: '1.29', name: 'Круговий рух', description: 'Попередження про кругове перехрестя.', category: 'warning' },
  { id: 'railway', code: '1.31', name: 'Залізничний переїзд', description: 'Наближення до залізничного переїзду.', category: 'warning' },
  { id: 'tunnel', code: '1.32', name: 'Тунель', description: 'Попередження про тунель попереду.', category: 'warning' },

  // Пріоритет (6) — ДСТУ 4100:2021, група 2
  { id: 'give-way', code: '2.1', name: 'Дати дорогу', description: 'Поступитися транспорту на головній дорозі або за табличкою 7.8.', category: 'priority' },
  { id: 'stop', code: '2.2', name: 'STOP', description: 'Повна зупинка перед стоп-лінією або краєм проїзної частини.', category: 'priority' },
  { id: 'main-road', code: '2.3', name: 'Головна дорога', description: 'Перевага проїзду нерегульованих перехресть.', category: 'priority' },
  { id: 'end-main-road', code: '2.4', name: 'Кінець головної', description: 'Скасування пріоритету головної дороги.', category: 'priority' },
  { id: 'give-way-oncoming', code: '2.5', name: 'Перевага зустрічного', description: 'Вузька ділянка — дати дорогу зустрічному транспорту.', category: 'priority' },
  { id: 'priority-before-oncoming', code: '2.6', name: 'Перевага перед зустрічним', description: 'Вузька ділянка — перевага перед зустрічними ТЗ.', category: 'priority' },

  // Заборонні (11)
  { id: 'no-entry', code: '3.1', name: "В'їзд заборонено", description: "Заборона в'їзду всіх ТЗ.", category: 'prohibitory' },
  { id: 'no-overtaking', code: '3.20', name: 'Обгін заборонено', description: 'Заборона обгону транспортних засобів.', category: 'prohibitory' },
  { id: 'no-left', code: '3.18', name: 'Поворот ліворуч заборонено', description: 'Заборона повороту ліворуч.', category: 'prohibitory' },
  { id: 'no-u-turn', code: '3.19', name: 'Розворот заборонено', description: 'Заборона розвороту на 180°.', category: 'prohibitory' },
  { id: 'speed-30', code: '3.29', name: '30 км/год', description: 'Обмеження максимальної швидкості.', category: 'prohibitory' },
  { id: 'speed-50', code: '3.29', name: '50 км/год', description: 'Обмеження в населеному пункті.', category: 'prohibitory' },
  { id: 'speed-70', code: '3.29', name: '70 км/год', description: 'Обмеження поза населеним пунктом.', category: 'prohibitory' },
  { id: 'speed-90', code: '3.29', name: '90 км/год', description: 'Обмеження на трасі.', category: 'prohibitory' },
  { id: 'no-parking', code: '3.34', name: 'Стоянка заборонена', description: 'Заборона стоянки ТЗ.', category: 'prohibitory' },
  { id: 'no-stopping', code: '3.33', name: 'Зупинка заборонена', description: 'Заборона зупинки та стоянки.', category: 'prohibitory' },
  { id: 'no-horns', code: '3.32', name: 'Сигнали заборонено', description: 'Заборона звукових сигналів.', category: 'prohibitory' },

  // Наказові (6)
  { id: 'straight', code: '4.1.1', name: 'Рух прямо', description: 'Дозволено лише прямий рух.', category: 'mandatory' },
  { id: 'turn-right', code: '4.1.2', name: 'Поворот праворуч', description: 'Дозволено поворот праворуч.', category: 'mandatory' },
  { id: 'turn-left', code: '4.1.2', name: 'Поворот ліворуч', description: 'Дозволено поворот ліворuch.', category: 'mandatory' },
  { id: 'roundabout-mandatory', code: '4.3', name: 'Круговий рух', description: 'Обов\'язковий рух у напрямку стрілок.', category: 'mandatory' },
  { id: 'bicycle-lane', code: '4.4.1', name: 'Велосипедна доріжка', description: 'Доріжка для велосипедистів.', category: 'mandatory' },
  { id: 'min-speed-40', code: '4.16', name: 'Мін. 40 км/год', description: 'Мінімально дозволена швидкість руху.', category: 'mandatory' },

  // Інформаційні (8)
  { id: 'parking', code: '5.38.1', name: 'Місце для стоянки', description: 'Позначає майданчик або місце для стоянки ТЗ.', category: 'info' },
  { id: 'direction', code: '5.53.1', name: 'Покажчик напрямку', description: 'Напрямок руху до населених пунктів або об\'єктів.', category: 'info' },
  { id: 'one-way', code: '5.5', name: 'Односторонній рух', description: 'Рух у одному напрямку.', category: 'info' },
  { id: 'dead-end', code: '5.29.1', name: 'Тупик', description: 'Дорога без наскрізного проїзду.', category: 'info' },
  { id: 'pedestrian-zone', code: '5.33', name: 'Пішохідна зона', description: 'Особливі умови руху з перевагою пішоходів.', category: 'info' },
  { id: 'living-zone', code: '5.31', name: 'Житлова зона', description: 'Житлова зона, обмеження 20 км/год.', category: 'info' },
  { id: 'motorway', code: '5.1', name: 'Автомагістраль', description: 'Початок автомагістралі.', category: 'info' },
  { id: 'bus-lane', code: '5.11', name: 'Смуга маршрутних ТЗ', description: 'Початок смуги для автобусів, трамваїв та велосипедистів.', category: 'info' },

  // Сервісу (9)
  { id: 'first-aid', code: '6.1', name: 'Перша медична допомога', description: 'Пункт першої медичної допомоги.', category: 'service' },
  { id: 'hospital', code: '6.2', name: 'Лікарня', description: 'Медичний заклад (лікарня) поблизу.', category: 'service' },
  { id: 'car-service', code: '6.5', name: 'Технічне обслуговування', description: 'Пункт технічного обслуговування автомобілів.', category: 'service' },
  { id: 'telephone', code: '6.8', name: 'Телефон', description: 'Телефон-автомат або зв\'язок.', category: 'service' },
  { id: 'gas-station', code: '6.7.1', name: 'АЗС', description: 'Автозаправна станція.', category: 'service' },
  { id: 'food', code: '6.13', name: 'Харчування', description: 'Ресторан або їдальня.', category: 'service' },
  { id: 'rest-area', code: '6.15', name: 'Місце відпочинку', description: 'Зона відпочинку для водіїв.', category: 'service' },
  { id: 'hotel', code: '6.16', name: 'Готель', description: 'Готель або мотель.', category: 'service' },
  { id: 'sign-plate', code: '8.1.1', name: 'Табличка «200 м»', description: 'Уточнює відстань до об\'єкта або дію знака.', category: 'service' },
];

export function getSignsByCategory(category: SignCategoryId): SignCatalogEntry[] {
  return TRAFFIC_SIGN_CATALOG.filter((s) => s.category === category);
}

export function getCategorySignCount(category: SignCategoryId): number {
  return TRAFFIC_SIGN_CATALOG.filter((s) => s.category === category).length;
}
