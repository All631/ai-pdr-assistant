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
  { id: 'warning', label: 'Попереджувальні', hint: 'Трикутник, червона облямівка' },
  { id: 'priority', label: 'Пріоритету', hint: 'STOP, дати дорогу, головна' },
  { id: 'prohibitory', label: 'Заборонні', hint: 'Круг, червона облямівка' },
  { id: 'mandatory', label: 'Наказові', hint: 'Круглий синій' },
  { id: 'info', label: 'Інформаційні', hint: 'Сині/зелені прямокутники' },
  { id: 'service', label: 'Сервісу', hint: 'Сині квадрати — послуги' },
];

export const TRAFFIC_SIGN_CATALOG: SignCatalogEntry[] = [
  // Попереджувальні (12)
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

  // Пріоритет (6)
  { id: 'stop', code: '2.2', name: 'STOP', description: 'Повна зупинка перед стоп-лінією або краєм проїзної частини.', category: 'priority' },
  { id: 'give-way', code: '2.4', name: 'Дати дорогу', description: 'Поступитися транспорту на перехресті.', category: 'priority' },
  { id: 'main-road', code: '2.1', name: 'Головна дорога', description: 'Ви рухаєтесь головною дорогою.', category: 'priority' },
  { id: 'end-main-road', code: '2.2', name: 'Кінець головної', description: 'Закінчення пріоритету головної дороги.', category: 'priority' },
  { id: 'give-way-oncoming', code: '2.5', name: 'Поступись зустрічному', description: 'Вузька ділянка — дати дорогу зустрічному.', category: 'priority' },
  { id: 'priority-intersection', code: '2.3', name: 'Перехрестя з головною', description: 'Головна дорога перетинає ваш шлях.', category: 'priority' },

  // Заборонні (10)
  { id: 'no-entry', code: '3.1', name: "В'їзд заборонено", description: "Заборона в'їзду всіх ТЗ.", category: 'prohibitory' },
  { id: 'no-overtaking', code: '3.20', name: 'Обгін заборонено', description: 'Заборона обгону транспортних засобів.', category: 'prohibitory' },
  { id: 'no-left', code: '3.18', name: 'Поворот ліворuch заборонено', description: 'Заборона повороту ліворuch.', category: 'prohibitory' },
  { id: 'no-u-turn', code: '3.19', name: 'Розворот заборонено', description: 'Заборона розвороту на 180°.', category: 'prohibitory' },
  { id: 'speed-30', code: '3.29', name: '30 км/год', description: 'Обмеження максимальної швидкості.', category: 'prohibitory' },
  { id: 'speed-50', code: '3.29', name: '50 км/год', description: 'Обмеження в населеному пункті.', category: 'prohibitory' },
  { id: 'speed-70', code: '3.29', name: '70 км/год', description: 'Обмеження поза населеним пунктом.', category: 'prohibitory' },
  { id: 'speed-90', code: '3.29', name: '90 км/год', description: 'Обмеження на трасі.', category: 'prohibitory' },
  { id: 'no-parking', code: '3.34', name: 'Стоянка заборонена', description: 'Заборона стоянки ТЗ.', category: 'prohibitory' },
  { id: 'no-stopping', code: '3.33', name: 'Зупинка заборонена', description: 'Заборона зупинки та стоянки.', category: 'prohibitory' },
  { id: 'no-horns', code: '3.32', name: 'Сигнали заборонено', description: 'Заборона звукових сигналів.', category: 'prohibitory' },

  // Наказові (7)
  { id: 'straight', code: '4.1.1', name: 'Рух прямо', description: 'Дозволено лише прямий рух.', category: 'mandatory' },
  { id: 'turn-right', code: '4.1.2', name: 'Поворот праворuch', description: 'Дозволено поворот праворuch.', category: 'mandatory' },
  { id: 'turn-left', code: '4.1.2', name: 'Поворот ліворuch', description: 'Дозволено поворот ліворuch.', category: 'mandatory' },
  { id: 'roundabout-mandatory', code: '4.3', name: 'Круговий рух', description: 'Обов\'язковий рух у напрямку стрілок.', category: 'mandatory' },
  { id: 'bicycle-lane', code: '4.4.1', name: 'Велосипедна доріжка', description: 'Доріжка для велосипедистів.', category: 'mandatory' },
  { id: 'bus-lane', code: '5.14', name: 'Смуга автобусів', description: 'Виділена смуга для маршрутних ТЗ.', category: 'mandatory' },
  { id: 'min-speed-40', code: '3.27', name: 'Мін. 40 км/год', description: 'Мінімально дозволена швидкість.', category: 'mandatory' },

  // Інформаційні (7)
  { id: 'parking', code: '6.4', name: 'Парковка', description: 'Місце для стоянки ТЗ.', category: 'info' },
  { id: 'direction', code: '5.7', name: 'Напрямок руху', description: 'Вказує дозволений напрямок.', category: 'info' },
  { id: 'one-way', code: '5.5', name: 'Односторонній рух', description: 'Рух у одному напрямку.', category: 'info' },
  { id: 'dead-end', code: '5.6', name: 'Тупик', description: 'Дорога не має крізного проїзду.', category: 'info' },
  { id: 'pedestrian-zone', code: '5.38', name: 'Пішохідна зона', description: 'Перевага пішоходів.', category: 'info' },
  { id: 'living-zone', code: '5.38', name: 'Житлова зона', description: 'Житлова або пішохідна зона, обмеження 20 км/год.', category: 'info' },
  { id: 'motorway', code: '5.1', name: 'Автомагістраль', description: 'Початок автомагістралі.', category: 'info' },

  // Сервісу (8)
  { id: 'hospital', code: '5.29', name: 'Лікарня', description: 'Медичний заклад поблизу.', category: 'service' },
  { id: 'gas-station', code: '5.15', name: 'АЗС', description: 'Паливна станція.', category: 'service' },
  { id: 'rest-area', code: '5.26', name: 'Місце відпочинку', description: 'Зона відпочинку для водіїв.', category: 'service' },
  { id: 'hotel', code: '6.2', name: 'Готель', description: 'Готель або мотель.', category: 'service' },
  { id: 'food', code: '6.4', name: 'Харчування', description: 'Заклад харчування.', category: 'service' },
  { id: 'telephone', code: '6.6', name: 'Телефон', description: 'Телефон-автомат або зв\'язок.', category: 'service' },
  { id: 'first-aid', code: '6.1', name: 'Медична допомога', description: 'Пункт медичної допомоги.', category: 'service' },
  { id: 'car-service', code: '6.8', name: 'СТО', description: 'Станція технічного обслуговування.', category: 'service' },
  { id: 'sign-plate', code: '8.1.1', name: 'Табличка «200 м»', description: 'Уточнює відстань до об\'єкта або дію знака.', category: 'service' },
];

export function getSignsByCategory(category: SignCategoryId): SignCatalogEntry[] {
  return TRAFFIC_SIGN_CATALOG.filter((s) => s.category === category);
}
