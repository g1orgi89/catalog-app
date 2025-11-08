# ✅ TODO - CATALOG MINI APP

Актуальный список задач проекта. Обновляется в конце каждой сессии.

**Последнее обновление:** 8 ноября 2024

---

## 🔥 ТЕКУЩАЯ СЕССИЯ (приоритет)

- [x] Создать репозиторий catalog-app
- [x] Загрузить базовую структуру
- [x] Настроить package.json
- [x] Настроить jsconfig.json
- [ ] Создать server/types/catalog.js
- [ ] Создать модель Course.js

---

## 📦 BACKEND API

### Models (MongoDB + Mongoose)
- [ ] Course.js - основная модель курса
- [ ] CourseCategory.js - категории курсов
- [ ] CourseAnalytics.js - аналитика событий

### Types (JSDoc)
- [ ] server/types/catalog.js - все typedef для проекта

### API Routes
- [ ] GET /api/courses - список курсов
- [ ] GET /api/courses/:slug - детали курса
- [ ] POST /api/courses - создать курс (admin)
- [ ] PUT /api/courses/:id - обновить курс (admin)
- [ ] DELETE /api/courses/:id - удалить курс (admin)
- [ ] GET /api/categories - список категорий
- [ ] POST /api/analytics/track - трекинг события
- [ ] GET /api/analytics/stats - статистика (admin)

### Middleware
- [ ] auth.js - Telegram authentication
- [ ] validation.js - input validation
- [ ] errorHandler.js - error handling
- [ ] rateLimit.js - rate limiting

---

## 📱 MINI APP (Frontend)

### Structure
- [x] index.html - main HTML
- [ ] manifest.json - PWA manifest
- [ ] service-worker.js - offline support

### JavaScript
- [ ] js/app.js - main application
- [ ] js/telegram.js - Telegram SDK wrapper
- [ ] js/api.js - API client
- [ ] js/router.js - simple router

### Pages
- [ ] js/pages/home.js - главная страница
- [ ] js/pages/course.js - детали курса

### CSS
- [ ] css/main.css - основные стили
- [ ] css/variables.css - CSS переменные

---

## 🚀 DEPLOYMENT

### VPS Setup (Contabo)
- [ ] SSH доступ
- [ ] Node.js 18+ установлен
- [ ] MongoDB установлен и настроен
- [ ] PM2 установлен глобально

### Project Setup
- [ ] Clone repo в /var/www/catalog-app
- [ ] npm install
- [ ] Настроить .env файл
- [ ] Создать MongoDB базу: catalog_app

### PM2 Configuration
- [ ] ecosystem.config.js
- [ ] pm2 start catalog-app
- [ ] pm2 save

---

## 📝 CONTENT

### Информация о Поле
- [ ] Фото (профессиональное)
- [ ] Био (2-3 предложения)
- [ ] Факты с цифрами

### 4 Курса
- [ ] Курс 1: данные
- [ ] Курс 2: данные
- [ ] Курс 3: данные
- [ ] Курс 4: данные

---

## 📊 PROGRESS TRACKER

```
ОБЩИЙ ПРОГРЕСС: ███░░░░░░░░░░░░░░░░░ 15%

✅ Documentation:   ██████████ 100%
🔄 Backend:         ██░░░░░░░░ 20%
⏸️ Mini App:        █░░░░░░░░░ 10%
⏸️ Deployment:      ░░░░░░░░░░ 0%
```

**Легенда:**
- ✅ Готово
- 🔄 В работе
- ⏸️ Не начато

---

**Обновляется:** В конце каждой сессии