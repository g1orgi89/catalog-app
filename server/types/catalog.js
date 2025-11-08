/**
 * @fileoverview JSDoc типы для Catalog Mini App проекта
 * @description Все typedef определения для курсов, категорий и аналитики
 */

// ==========================================
// ОСНОВНЫЕ ТИПЫ МОДЕЛЕЙ
// ==========================================

/**
 * @typedef {Object} CourseImage
 * @property {string} url - URL изображения
 * @property {string} [cloudinaryId] - ID в Cloudinary (опционально)
 * @property {string} alt - Альтернативный текст
 */

/**
 * @typedef {Object} CoursePrice
 * @property {number} amount - Актуальная цена курса
 * @property {string} currency - Валюта (RUB, USD, EUR)
 * @property {number} [originalPrice] - Исходная цена до скидки
 * @property {boolean} isDiscounted - Есть ли скидка
 */

/**
 * @typedef {Object} CourseModule
 * @property {number} moduleNumber - Номер модуля
 * @property {string} title - Название модуля
 * @property {string[]} lessons - Массив названий уроков
 */

/**
 * @typedef {Object} PurchaseLinks
 * @property {string} [telegram] - Ссылка на Telegram для покупки
 * @property {string} [whatsapp] - Ссылка на WhatsApp для покупки
 * @property {string} [website] - Ссылка на сайт для покупки
 */

/**
 * @typedef {Object} Course
 * @property {import('mongoose').Types.ObjectId} _id - ID документа
 * @property {string} title - Название курса
 * @property {string} slug - URL-friendly slug для маршрутизации
 * @property {string} description - Краткое описание для карточки курса
 * @property {string} fullDescription - Полное описание курса
 * @property {CourseImage} coverImage - Обложка курса
 * @property {CoursePrice} price - Информация о цене
 * @property {import('mongoose').Types.ObjectId} category - Ссылка на категорию
 * @property {string[]} tags - Теги для фильтрации и поиска
 * @property {string} duration - Длительность курса (например "4 недели")
 * @property {number} lessonsCount - Количество уроков в курсе
 * @property {string[]} includes - Что входит в курс (список)
 * @property {CourseModule[]} curriculum - Программа курса (модули и уроки)
 * @property {PurchaseLinks} purchaseLinks - Ссылки для покупки
 * @property {('draft'|'published'|'archived')} status - Статус публикации
 * @property {boolean} isActive - Активен ли курс
 * @property {boolean} isFeatured - Рекомендуемый курс (для выделения)
 * @property {number} sortOrder - Порядок сортировки
 * @property {number} views - Счётчик просмотров
 * @property {number} clicks - Счётчик кликов на кнопку "Купить"
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата последнего обновления
 */

/**
 * @typedef {Object} CourseCategory
 * @property {import('mongoose').Types.ObjectId} _id - ID документа
 * @property {string} name - Название категории
 * @property {string} slug - URL-friendly slug
 * @property {string} [description] - Описание категории
 * @property {string} [icon] - Иконка или эмодзи для категории
 * @property {boolean} isActive - Активна ли категория
 * @property {number} sortOrder - Порядок сортировки
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата последнего обновления
 */

// ==========================================
// ТИПЫ ДЛЯ АНАЛИТИКИ
// ==========================================

/**
 * @typedef {Object} AnalyticsUser
 * @property {number} telegramId - Telegram user ID
 * @property {string} [firstName] - Имя пользователя
 * @property {string} [lastName] - Фамилия пользователя
 * @property {string} [username] - Telegram username
 * @property {string} [languageCode] - Код языка пользователя
 */

/**
 * @typedef {Object} AnalyticsUTM
 * @property {string} [source] - UTM source (например "instagram")
 * @property {string} [medium] - UTM medium (например "stories")
 * @property {string} [campaign] - UTM campaign (например "launch")
 * @property {string} [term] - UTM term
 * @property {string} [content] - UTM content
 */

/**
 * @typedef {Object} AnalyticsDevice
 * @property {string} platform - Платформа (ios | android | web)
 * @property {string} [version] - Версия Telegram
 * @property {string} [userAgent] - User Agent браузера
 */

/**
 * @typedef {Object} CourseAnalytics
 * @property {import('mongoose').Types.ObjectId} _id - ID документа
 * @property {('app_open'|'course_view'|'course_click')} eventType - Тип события
 * @property {AnalyticsUser} user - Информация о пользователе
 * @property {import('mongoose').Types.ObjectId} [courseId] - ID курса (для course_view, course_click)
 * @property {string} [courseSlug] - Slug курса
 * @property {AnalyticsUTM} [utm] - UTM параметры
 * @property {AnalyticsDevice} device - Информация об устройстве
 * @property {Date} timestamp - Время события
 * @property {Date} createdAt - Дата создания записи
 */

// ==========================================
// ТИПЫ ДЛЯ API ЗАПРОСОВ/ОТВЕТОВ
// ==========================================

/**
 * @typedef {Object} GetCoursesQuery
 * @property {string} [category] - Фильтр по категории (slug)
 * @property {number} [limit] - Количество результатов
 * @property {number} [page] - Номер страницы
 * @property {string} [sort] - Поле для сортировки
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Статус выполнения
 * @property {*} [data] - Данные ответа
 * @property {string} [error] - Сообщение об ошибке
 * @property {Object} [pagination] - Информация о пагинации
 * @property {number} [pagination.page] - Текущая страница
 * @property {number} [pagination.limit] - Лимит на странице
 * @property {number} [pagination.total] - Всего записей
 * @property {number} [pagination.pages] - Всего страниц
 */

/**
 * @typedef {Object} CreateCourseInput
 * @property {string} title - Название курса
 * @property {string} slug - URL slug
 * @property {string} description - Краткое описание
 * @property {string} fullDescription - Полное описание
 * @property {CourseImage} coverImage - Обложка
 * @property {CoursePrice} price - Цена
 * @property {string} category - ID категории
 * @property {string[]} [tags] - Теги
 * @property {string} duration - Длительность
 * @property {number} lessonsCount - Количество уроков
 * @property {string[]} includes - Что входит
 * @property {CourseModule[]} [curriculum] - Программа
 * @property {PurchaseLinks} purchaseLinks - Ссылки покупки
 */

/**
 * @typedef {Object} TrackEventInput
 * @property {string} eventType - Тип события
 * @property {Object} user - Данные пользователя Telegram
 * @property {string} [courseSlug] - Slug курса
 * @property {Object} [utm] - UTM параметры
 * @property {Object} device - Данные устройства
 */

module.exports = {};