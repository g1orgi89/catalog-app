# ✅ TODO - CATALOG MINI APP

Актуальный список задач проекта. Обновляется в конце каждой сессии.

**Последнее обновление:** 8 ноября 2024 (Сессия 2 завершена)

---

## 🎉 ШАГ 1: Backend API - ЗАВЕРШЁН 100% ✅

### Что готово:
- [x] Создать репозиторий catalog-app
- [x] Загрузить базовую структуру
- [x] Настроить package.json
- [x] Настроить jsconfig.json
- [x] Создать server/types/catalog.js
- [x] Создать server/config/database.js
- [x] Создать модель Course.js
- [x] Создать модель CourseCategory.js
- [x] Создать модель CourseAnalytics.js
- [x] Создать API routes courses.js
- [x] Создать API routes categories.js
- [x] Создать API routes analytics.js
- [x] Обновить server/index.js
- [x] Создать seed script (scripts/seed.js)
- [x] Создать .env.example
- [x] Добавить npm scripts

**Backend полностью готов к deployment! 🚀**

---

## 🔥 ТЕКУЩИЙ СТАТУС

**ШАГ 2: Frontend Mini App** (СЕЙЧАС)

### Приоритет на следующую сессию:

**JavaScript Core:**
- [ ] js/telegram.js - Telegram SDK обёртка
- [ ] js/api.js - API клиент для backend
- [ ] js/router.js - простой роутер
- [ ] js/app.js - главный файл приложения

**Pages:**
- [ ] js/pages/home.js - главная страница с курсами
- [ ] js/pages/course.js - страница детали курса

**Styles:**
- [ ] css/variables.css - цветовая схема beauty-индустрии
- [ ] css/main.css - основные стили

---

## 📦 BACKEND API - ✅ ГОТОВО 100%

### Types (JSDoc) ✅
- [x] server/types/catalog.js - все typedef для проекта

### Database ✅
- [x] server/config/database.js - подключение MongoDB

### Models (MongoDB + Mongoose) ✅
- [x] Course.js - основная модель курса
- [x] CourseCategory.js - категории курсов
- [x] CourseAnalytics.js - аналитика событий

### API Routes ✅
- [x] GET /api/courses - список курсов
- [x] GET /api/courses/:slug - детали курса
- [x] POST /api/courses - создать курс (admin)
- [x] PUT /api/courses/:id - обновить курс (admin)
- [x] DELETE /api/courses/:id - удалить курс (admin)
- [x] POST /api/courses/:slug/click - трекинг кликов
- [x] GET /api/categories - список категорий
- [x] GET /api/categories/:slug - детали категории
- [x] POST /api/categories - создать категорию (admin)
- [x] PUT /api/categories/:id - обновить категорию (admin)
- [x] DELETE /api/categories/:id - деактивировать категорию (admin)
- [x] POST /api/analytics/track - трекинг события
- [x] GET /api/analytics/stats - статистика (admin)
- [x] GET /api/analytics/events - список событий (admin)

### Дополнительно ✅
- [x] Seed script с тестовыми данными (4 курса, 3 категории)
- [x] .env.example
- [x] npm scripts (start, dev, seed)

### Middleware ⏸️ НЕ НАЧАТО (опционально)
- [ ] auth.js - Telegram authentication
- [ ] validation.js - input validation
- [ ] errorHandler.js - error handling
- [ ] rateLimit.js - rate limiting

**Примечание:** Middleware опциональны и будут добавлены по мере необходимости.

---

## 📱 MINI APP (ШАГ 2 - В РАБОТЕ)

### Structure
- [x] index.html - main HTML
- [ ] manifest.json - PWA manifest (опционально)

### JavaScript Core
- [ ] js/telegram.js - Telegram SDK wrapper
  - [ ] Инициализация WebApp
  - [ ] BackButton handler
  - [ ] MainButton handler
  - [ ] Theme integration
  - [ ] HapticFeedback

- [ ] js/api.js - API client
  - [ ] getCourses()
  - [ ] getCourse(slug)
  - [ ] getCategories()
  - [ ] trackEvent()

- [ ] js/router.js - simple router
  - [ ] navigate(path)
  - [ ] addRoute()
  - [ ] Back button integration

- [ ] js/app.js - main application
  - [ ] Init Telegram SDK
  - [ ] Setup router
  - [ ] Load initial page

### Pages
- [ ] js/pages/home.js - главная страница
  - [ ] Блок "О Поле" (фото, био)
  - [ ] Список курсов (карточки)
  - [ ] Соцсети
  - [ ] Track app_open event

- [ ] js/pages/course.js - детали курса
  - [ ] Загрузка данных по slug
  - [ ] Отображение всех полей
  - [ ] BackButton
  - [ ] MainButton ("Купить")
  - [ ] Track course_view event
  - [ ] Track course_click event

### CSS
- [ ] css/variables.css - CSS переменные
  - [ ] Цвета beauty-индустрии
  - [ ] Telegram theme colors
  - [ ] Typography

- [ ] css/main.css - основные стили
  - [ ] Reset
  - [ ] Layout
  - [ ] Components (cards, buttons)
  - [ ] Animations
  - [ ] Адаптивность

---

## 🚀 DEPLOYMENT (ШАГ 4)

### VPS Setup (Contabo)
- [ ] SSH доступ
- [ ] Node.js 18+ установлен ✅ (уже есть)
- [ ] MongoDB установлен ✅ (уже есть через Docker)
- [ ] PM2 установлен глобально ✅ (уже есть)

### Project Setup
- [ ] Clone repo в /var/www/catalog-app
- [ ] npm install
- [ ] Настроить .env файл
- [ ] Создать MongoDB базу: catalog_app
- [ ] Запустить seed script

### PM2 Configuration
- [ ] ecosystem.config.js
- [ ] pm2 start catalog-app (порт 3003)
- [ ] pm2 save
- [ ] Проверить независимость от reader-bot

### Nginx
- [ ] Конфиг для API (api.catalog.domain.com → 3003)
- [ ] Конфиг для Mini App (catalog.domain.com)
- [ ] SSL сертификаты

### Telegram Bot
- [ ] Создать бота через @BotFather
- [ ] Зарегистрировать Mini App
- [ ] Настроить Menu Button
- [ ] Настроить команды

---

## 📝 CONTENT (ШАГ 3)

### Информация о Поле
- [ ] Фото (профессиональное)
- [ ] Био (2-3 предложения)
- [ ] Факты с цифрами (опционально)

### 4 Курса (реальные данные от клиента)
- [ ] Курс 1: данные
- [ ] Курс 2: данные
- [ ] Курс 3: данные
- [ ] Курс 4: данные

**Примечание:** Пока используем тестовые данные из seed script.

---

## 📊 PROGRESS TRACKER

```
ОБЩИЙ ПРОГРЕСС: ██████████░░░░░░░░░░ 50%

✅ Подготовка:      ██████████ 100%
✅ Backend Setup:   ██████████ 100%
✅ Types/Models:    ██████████ 100%
✅ API Routes:      ██████████ 100%
✅ Seed Data:       ██████████ 100%
🔄 Mini App:        ███░░░░░░░ 30%
⏸️ Deployment:      ░░░░░░░░░░ 0%
⏸️ Content:         ░░░░░░░░░░ 0%
```

**Легенда:**
- ✅ Готово
- 🔄 В работе
- ⏸️ Не начато

---

## 🎯 ПРИОРИТЕТЫ НА СЛЕДУЮЩУЮ СЕССИЮ

**ШАГ 2: Frontend Mini App**

1. 🔴 js/telegram.js - Telegram SDK обёртка
2. 🔴 js/api.js - API клиент
3. 🔴 js/pages/home.js - главная страница
4. 🟡 js/pages/course.js - страница курса
5. 🟡 css/variables.css - цветовая схема
6. 🟡 css/main.css - стили

**Оценка времени:** 4-6 часов

---

## 📈 ДОСТИЖЕНИЯ

- ✅ Backend API полностью готов (14 endpoints)
- ✅ 3 Mongoose модели с полной валидацией
- ✅ Seed script с 4 курсами
- ✅ JSDoc типизация (11 типов)
- ✅ Независимая архитектура от Reader Bot
- ✅ Готово к deployment

**Следующая цель:** Завершить Frontend Mini App! 🚀

---

**Обновляется:** В конце каждой сессии