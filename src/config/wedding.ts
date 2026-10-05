// ==================================================
// ✏️ МЕНЯТЬ ДАННЫЕ СВАДЬБЫ ЗДЕСЬ
// ==================================================
// Этот файл содержит все данные конкретной свадьбы.
// Компоненты сайта менять не нужно.

export const weddingConfig = {
  couple: {
    bride: 'Алина',
    groom: 'Тимур',
  },

  wedding: {
    // Формат даты обязателен: ГГГГ-ММ-ДД. Из него автоматически работает таймер.
    date: '2026-12-20',
    time: '17:00',
    weekday: 'воскресенье',
    city: 'Бишкек',
  },

  location: {
    name: 'Ресторан «Арзу»',
    address: 'г. Бишкек, ул. Тоголок Молдо, 13/1',
    twoGisUrl: 'https://2gis.kg/bishkek/search/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%20%C2%AB%D0%90%D1%80%D0%B7%D1%83%C2%BB%2C%20%D0%A2%D0%BE%D0%B3%D0%BE%D0%BB%D0%BE%D0%BA%20%D0%9C%D0%BE%D0%BB%D0%B4%D0%BE%2C%2013%2F1',
  },

  // Чтобы заменить фото, достаточно заменить файлы с такими же именами.
  photos: {
    hero: '/images/wedding/hero.jpg',
    couple1: '/images/wedding/couple-1.jpg',
    couple2: '/images/wedding/couple-2.jpg',
    couple3: '/images/wedding/couple-3.jpg',
    couple4: '/images/wedding/couple-4.jpg',
  },

  music: {
    src: '/music/wedding.mp3',
  },

  // События можно добавлять, удалять и переставлять местами.
  schedule: [
    { time: '16:30', title: 'Сбор гостей' },
    { time: '17:00', title: 'Начало торжества' },
    { time: '18:00', title: 'Праздничный ужин' },
    { time: '20:00', title: 'Танцы и программа' },
    { time: '23:00', title: 'Завершение вечера' },
  ],

  dressCode: {
    colors: ['#F4EFE6', '#D8C3A5', '#A88F70', '#7C8668', '#272727'],
    colorNames: 'ivory · champagne · mocha · sage · black',
    text: 'Нам будет особенно приятно, если вы поддержите цветовую палитру нашего торжества.',
  },

  // Все тексты приглашения также можно менять здесь.
  text: {
    heroEyebrow: 'Мы женимся',
    heroSubtitle: 'И очень хотим разделить этот день с вами',
    invitationTitle: 'Дорогие родные и близкие!',
    invitationBody: 'Совсем скоро состоится один из самых важных дней нашей жизни. Мы будем счастливы разделить этот особенный момент вместе с вами.',
    quote: 'Любовь — это тихое обещание выбирать друг друга каждый день.',
    storyTitleFirst: 'Всё самое важное',
    storyTitleSecond: 'начинается с любви',
    storyBody: 'В этот день мы хотим собрать рядом самых дорогих людей и сохранить каждую улыбку, каждое объятие, каждое мгновение.',
    photoCaption: 'two hearts, one story',
    scheduleTitleFirst: 'Один день.',
    scheduleTitleSecond: 'На всю жизнь.',
    footerTitle: 'НАЧАЛО НАШЕЙ ГЛАВНОЙ ИСТОРИИ',
    footerMessage: 'До встречи в этот особенный день',
  },
} as const

export type WeddingConfig = typeof weddingConfig
