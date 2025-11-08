/**
 * @fileoverview Seed script для заполнения базы данных тестовыми данными
 * @description Создаёт категории и курсы для тестирования
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../server/models/Course');
const CourseCategory = require('../server/models/CourseCategory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/catalog_app';

/**
 * Категории курсов
 */
const categories = [
  {
    name: 'Instagram для косметологов',
    slug: 'instagram',
    description: 'Курсы по продвижению в Instagram',
    icon: '📱',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Продажи и маркетинг',
    slug: 'sales-marketing',
    description: 'Курсы по увеличению продаж',
    icon: '💰',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Личный бренд',
    slug: 'personal-brand',
    description: 'Создание личного бренда косметолога',
    icon: '✨',
    isActive: true,
    sortOrder: 3
  }
];

/**
 * Тестовые курсы
 */
const courses = [
  {
    title: 'Instagram для косметологов: с 0 до первых клиентов',
    slug: 'instagram-for-cosmetologists',
    description: 'Научу продавать процедуры через сторис и рилс без навязчивых продаж. Получишь готовые шаблоны и стратегию контента.',
    fullDescription: `Этот курс создан специально для косметологов, которые хотят привлекать клиентов через Instagram, но не знают с чего начать.

Вы научитесь:
• Создавать продающий контент, который не выглядит как реклама
• Использовать сторис и рилс для привлечения клиентов
• Настраивать таргетированную рекламу с минимальным бюджетом
• Работать с возражениями в директе
• Выстраивать воронку продаж в Instagram

Результат: стабильный поток заявок от целевых клиентов через 4 недели после старта курса.`,
    coverImage: {
      url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Instagram+Course',
      alt: 'Курс Instagram для косметологов'
    },
    price: {
      amount: 19900,
      currency: 'RUB',
      originalPrice: 29900,
      isDiscounted: true
    },
    category: null, // Заполним после создания категорий
    tags: ['instagram', 'smm', 'продвижение', 'контент'],
    duration: '4 недели',
    lessonsCount: 20,
    includes: [
      '20 видео-уроков',
      '30 готовых шаблонов постов',
      'Чек-лист проверки аккаунта',
      'Чат с поддержкой',
      'Доступ к курсу навсегда'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Основы Instagram для бизнеса',
        lessons: [
          'Настройка бизнес-аккаунта',
          'Оформление профиля',
          'Анализ конкурентов'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Контент-стратегия',
        lessons: [
          'Виды контента для косметолога',
          'План публикаций',
          'Работа со сторис'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Рилс и видео',
        lessons: [
          'Идеи для рилс',
          'Монтаж на телефоне',
          'Вирусные форматы'
        ]
      },
      {
        moduleNumber: 4,
        title: 'Продажи и реклама',
        lessons: [
          'Настройка таргета',
          'Работа с возражениями',
          'Воронка продаж'
        ]
      }
    ],
    purchaseLinks: {
      telegram: 'https://t.me/polya_smyslova',
      whatsapp: 'https://wa.me/1234567890',
      website: 'https://polya-smyslova.ru/instagram-course'
    },
    status: 'published',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    views: 0,
    clicks: 0
  },
  {
    title: 'Продажи без "впаривания": как продавать с заботой',
    slug: 'sales-without-pressure',
    description: 'Увеличь средний чек и количество повторных записей без агрессивных продаж. Научу продавать через ценность.',
    fullDescription: `Курс для косметологов, которые хотят увеличить доход, но не любят агрессивные продажи.

Вы научитесь:
• Выявлять реальные потребности клиента
• Предлагать дополнительные услуги естественно
• Увеличивать средний чек на 30-50%
• Работать с возражениями экологично
• Создавать программы лояльности

Результат: увеличение среднего чека и рост повторных продаж уже через месяц.`,
    coverImage: {
      url: 'https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Sales+Course',
      alt: 'Курс по продажам для косметологов'
    },
    price: {
      amount: 24900,
      currency: 'RUB',
      originalPrice: 34900,
      isDiscounted: true
    },
    category: null,
    tags: ['продажи', 'коммуникация', 'средний чек'],
    duration: '3 недели',
    lessonsCount: 15,
    includes: [
      '15 видео-уроков',
      'Скрипты продаж',
      'Шаблоны программ лояльности',
      'Разбор кейсов',
      'Сертификат'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Психология продаж',
        lessons: [
          'Почему клиенты покупают',
          'Выявление потребностей',
          'Работа с ценой'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Техники продаж',
        lessons: [
          'Допродажи и апсейл',
          'Кросс-продажи',
          'Программы ухода'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Удержание клиентов',
        lessons: [
          'Программы лояльности',
          'Работа с базой',
          'Повторные продажи'
        ]
      }
    ],
    purchaseLinks: {
      telegram: 'https://t.me/polya_smyslova',
      whatsapp: 'https://wa.me/1234567890'
    },
    status: 'published',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    views: 0,
    clicks: 0
  },
  {
    title: 'Личный бренд косметолога: от специалиста к эксперту',
    slug: 'personal-brand',
    description: 'Построй личный бренд, который привлекает клиентов и позволяет повысить цены. Стань экспертом в своей нише.',
    fullDescription: `Курс для косметологов, которые хотят выделиться среди конкурентов и работать с премиум-сегментом.

Вы научитесь:
• Определять свою уникальность и позиционирование
• Создавать экспертный контент
• Выступать на камеру уверенно
• Работать с медиа и блогерами
• Повышать цены обоснованно

Результат: узнаваемый личный бренд, который привлекает платежеспособных клиентов.`,
    coverImage: {
      url: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Personal+Brand',
      alt: 'Курс по личному бренду'
    },
    price: {
      amount: 29900,
      currency: 'RUB',
      isDiscounted: false
    },
    category: null,
    tags: ['личный бренд', 'позиционирование', 'эксперт'],
    duration: '6 недель',
    lessonsCount: 25,
    includes: [
      '25 видео-уроков',
      'Индивидуальная консультация',
      'Разбор твоего позиционирования',
      'Контент-план на месяц',
      'Чат с поддержкой'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Позиционирование',
        lessons: [
          'Поиск уникальности',
          'Целевая аудитория',
          'Ценностное предложение'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Экспертность',
        lessons: [
          'Создание экспертного контента',
          'Выступления и вебинары',
          'Публикации в СМИ'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Визуальная айдентика',
        lessons: [
          'Фотосессия для бренда',
          'Визуальный стиль',
          'Оформление соцсетей'
        ]
      }
    ],
    purchaseLinks: {
      telegram: 'https://t.me/polya_smyslova',
      website: 'https://polya-smyslova.ru/personal-brand'
    },
    status: 'published',
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    views: 0,
    clicks: 0
  },
  {
    title: 'Telegram-канал для косметолога: запуск и продвижение',
    slug: 'telegram-channel',
    description: 'Создай и раскрути свой Telegram-канал. Научу привлекать подписчиков и монетизировать канал.',
    fullDescription: `Telegram становится всё более популярным. Этот курс поможет тебе создать канал, который будет приносить клиентов и доход.

Вы научитесь:
• Создавать структуру канала
• Писать вовлекающий контент
• Привлекать подписчиков
• Настраивать рекламу в Telegram
• Монетизировать канал

Результат: работающий Telegram-канал с первыми 500+ подписчиками за 2 месяца.`,
    coverImage: {
      url: 'https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Telegram+Channel',
      alt: 'Курс по Telegram-каналу'
    },
    price: {
      amount: 14900,
      currency: 'RUB',
      originalPrice: 19900,
      isDiscounted: true
    },
    category: null,
    tags: ['telegram', 'контент', 'продвижение'],
    duration: '3 недели',
    lessonsCount: 12,
    includes: [
      '12 видео-уроков',
      'Шаблоны постов',
      'Чек-лист запуска канала',
      'База каналов для рекламы',
      'Доступ навсегда'
    ],
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Запуск канала',
        lessons: [
          'Создание и оформление',
          'Контент-стратегия',
          'Первые публикации'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Привлечение подписчиков',
        lessons: [
          'Бесплатные методы',
          'Реклама в каналах',
          'Telegram Ads'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Монетизация',
        lessons: [
          'Продажа услуг',
          'Платные подписки',
          'Партнёрские программы'
        ]
      }
    ],
    purchaseLinks: {
      telegram: 'https://t.me/polya_smyslova',
      whatsapp: 'https://wa.me/1234567890'
    },
    status: 'published',
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    views: 0,
    clicks: 0
  }
];

/**
 * Основная функция seed
 */
async function seed() {
  try {
    console.log('🌱 Starting seed process...');
    console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}`);

    // Подключение к БД
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Очистка существующих данных
    console.log('\n🗑️  Clearing existing data...');
    await Course.deleteMany({});
    await CourseCategory.deleteMany({});
    console.log('✅ Existing data cleared');

    // Создание категорий
    console.log('\n📁 Creating categories...');
    const createdCategories = await CourseCategory.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories:`);
    createdCategories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });

    // Привязка курсов к категориям
    console.log('\n📚 Creating courses...');
    const categoryMap = {
      'instagram-for-cosmetologists': createdCategories[0]._id, // Instagram
      'sales-without-pressure': createdCategories[1]._id,        // Продажи
      'personal-brand': createdCategories[2]._id,                // Личный бренд
      'telegram-channel': createdCategories[0]._id               // Instagram (можно изменить)
    };

    // Назначаем категории курсам
    courses[0].category = categoryMap['instagram-for-cosmetologists'];
    courses[1].category = categoryMap['sales-without-pressure'];
    courses[2].category = categoryMap['personal-brand'];
    courses[3].category = categoryMap['telegram-channel'];

    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses:`);
    createdCourses.forEach(course => {
      console.log(`   📖 ${course.title}`);
      console.log(`      💰 ${course.price.amount} ${course.price.currency}`);
      console.log(`      🏷️  ${course.slug}`);
      console.log('');
    });

    // Статистика
    console.log('\n📊 Seed Statistics:');
    console.log('='.repeat(50));
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Courses: ${createdCourses.length}`);
    console.log(`Total lessons: ${courses.reduce((sum, c) => sum + c.lessonsCount, 0)}`);
    console.log(`Total price range: ${Math.min(...courses.map(c => c.price.amount))} - ${Math.max(...courses.map(c => c.price.amount))} RUB`);
    console.log('='.repeat(50));

    console.log('\n✅ Seed completed successfully!\n');

    // Закрытие соединения
    await mongoose.connection.close();
    console.log('👋 Database connection closed');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Запуск seed
if (require.main === module) {
  seed();
}

module.exports = seed;