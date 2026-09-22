# Кудайберген — ТЗ на бэкенд (Java / Spring Boot)

Версия 1.0 · Сентябрь 2026

---

## 1. Что строим

Бэкенд для маркетплейса автозапчастей. Ядро продукта — **веерный запрос**: покупатель
описывает нужную деталь один раз, запрос улетает всем магазинам, которые торгуют этой
категорией, магазины отвечают предложениями.

Бизнес-проблема, которую решаем: продавцы тонут в WhatsApp/Instagram и не успевают
отвечать. Поэтому в бэкенде критичны три вещи:

1. точный матчинг запроса на магазины (не спамить нерелевантных);
2. массовый ответ — один шаблон сразу на N запросов;
3. учёт «ответил / не ответил» по каждому запросу — на этом строится и аналитика,
   и рейтинг скорости ответа.

**Scope v1:** только запчасти. Продажа авто, услуги СТО и карта — не в этой версии.

---

## 2. Стек

| Что | Чем |
|---|---|
| Язык | Java 21 |
| Фреймворк | Spring Boot 3.3+ |
| БД | PostgreSQL 16 |
| Доступ к данным | Spring Data JPA (Hibernate) |
| Миграции | Flyway |
| Auth | Spring Security + JWT, вход по SMS-коду |
| Валидация | Jakarta Bean Validation |
| Асинхронщина | Spring `@Async` + таблица outbox (Kafka/Rabbit — позже, когда нагрузка появится) |
| Пуши | Firebase Cloud Messaging |
| SMS | локальный шлюз (nikita.kg / smsc.kg) за интерфейсом `SmsSender` |
| Документация API | springdoc-openapi (Swagger UI) |
| Тесты | JUnit 5 + Testcontainers (PostgreSQL) |

### Структура пакетов

```
kg.kudaibergen
├── auth          — SMS-вход, JWT, текущий пользователь
├── user          — профиль, автомобили покупателя
├── store         — магазины, филиалы, категории товаров, шаблоны ответов
├── request       — запросы покупателей + веерная рассылка
├── offer         — предложения продавцов, массовый ответ
├── chat          — чаты и сообщения
├── review        — отзывы
├── analytics     — статистика продавца
├── notification  — outbox, отправка пушей
└── common        — ошибки, идемпотентность, конфиги, утилиты
```

Каждый пакет: `Controller` → `Service` → `Repository` + `entity/`, `dto/`.
Слой `Controller` не ходит в `Repository` напрямую.

---

## 3. Схема базы данных

Flyway-миграция `V1__init.sql`.

```sql
-- ─────────────────────────── ПОЛЬЗОВАТЕЛИ ───────────────────────────
CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER');

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    phone         VARCHAR(20)  NOT NULL UNIQUE,   -- +996XXXXXXXXX
    name          VARCHAR(120),
    role          user_role    NOT NULL,
    city          VARCHAR(80)  NOT NULL DEFAULT 'Бишкек',
    is_blocked    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Одноразовые коды для входа
CREATE TABLE sms_codes (
    id          BIGSERIAL PRIMARY KEY,
    phone       VARCHAR(20) NOT NULL,
    code_hash   VARCHAR(80) NOT NULL,   -- хранить хэш, не сам код
    attempts    SMALLINT    NOT NULL DEFAULT 0,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sms_codes_phone ON sms_codes (phone, created_at DESC);

-- ─────────────────────────── АВТОМОБИЛИ ───────────────────────────
-- Смысл: подставлять в запрос автоматом и убирать уточняющие вопросы продавца.
CREATE TABLE vehicles (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand       VARCHAR(60) NOT NULL,          -- Toyota
    model       VARCHAR(60) NOT NULL,          -- Camry
    generation  VARCHAR(60),                   -- XV50
    year        SMALLINT,
    engine      VARCHAR(40),                   -- 2.5 бензин
    body_type   VARCHAR(40),
    vin         VARCHAR(17),
    is_default  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_vehicles_user ON vehicles (user_id);
-- у пользователя не больше одной машины по умолчанию
CREATE UNIQUE INDEX uq_vehicle_default ON vehicles (user_id) WHERE is_default;

-- ─────────────────────────── МАГАЗИНЫ ───────────────────────────
CREATE TYPE verification_status AS ENUM ('NEW', 'VERIFIED', 'TRUSTED', 'BLOCKED');

CREATE TABLE stores (
    id                  BIGSERIAL PRIMARY KEY,
    owner_user_id       BIGINT      NOT NULL REFERENCES users(id),
    name                VARCHAR(120) NOT NULL,
    business_type       VARCHAR(40)  NOT NULL,   -- parts / tires / oils / accessories
    description         TEXT,
    verification_status verification_status NOT NULL DEFAULT 'NEW',
    rating              NUMERIC(2,1) NOT NULL DEFAULT 0,
    review_count        INT          NOT NULL DEFAULT 0,
    total_deals         INT          NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_stores_owner ON stores (owner_user_id);

CREATE TABLE store_branches (
    id          BIGSERIAL PRIMARY KEY,
    store_id    BIGINT      NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    address     VARCHAR(200) NOT NULL,
    city        VARCHAR(80)  NOT NULL,
    phone       VARCHAR(20),
    latitude    NUMERIC(9,6),
    longitude   NUMERIC(9,6),
    work_hours  JSONB,       -- {"open":"09:00","close":"19:00","days":["Пн",...]}
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_branches_city ON store_branches (city);

-- ⚠️ Сердце матчинга: какими категориями торгует магазин.
CREATE TABLE store_categories (
    store_id  BIGINT      NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category  VARCHAR(40) NOT NULL,
    PRIMARY KEY (store_id, category)
);
CREATE INDEX idx_store_categories_category ON store_categories (category);

-- Шаблоны быстрых ответов продавца
CREATE TABLE reply_templates (
    id          BIGSERIAL PRIMARY KEY,
    store_id    BIGINT      NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title       VARCHAR(60) NOT NULL,       -- "Есть в наличии"
    body        TEXT        NOT NULL,
    sort_order  SMALLINT    NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────── ЗАПРОСЫ ───────────────────────────
CREATE TYPE request_status AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED');

CREATE TABLE requests (
    id           BIGSERIAL PRIMARY KEY,
    buyer_id     BIGINT      NOT NULL REFERENCES users(id),
    vehicle_id   BIGINT      REFERENCES vehicles(id) ON DELETE SET NULL,
    car_text     VARCHAR(160),               -- если машину указали текстом
    category     VARCHAR(40) NOT NULL,
    description  TEXT        NOT NULL,
    budget_min   INT,
    budget_max   INT,
    currency     CHAR(3)     NOT NULL DEFAULT 'KGS',
    city         VARCHAR(80) NOT NULL,
    is_urgent    BOOLEAN     NOT NULL DEFAULT FALSE,
    status       request_status NOT NULL DEFAULT 'ACTIVE',
    offer_count  INT         NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at   TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_requests_buyer  ON requests (buyer_id, created_at DESC);
CREATE INDEX idx_requests_expiry ON requests (status, expires_at);

-- ⚠️ Кому улетел запрос + состояние по каждому продавцу.
-- Отсюда считается вся аналитика и рейтинг скорости ответа.
CREATE TABLE request_recipients (
    request_id  BIGINT      NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    store_id    BIGINT      NOT NULL REFERENCES stores(id)   ON DELETE CASCADE,
    notified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    seen_at     TIMESTAMPTZ,
    replied_at  TIMESTAMPTZ,
    PRIMARY KEY (request_id, store_id)
);
CREATE INDEX idx_recipients_store ON request_recipients (store_id, notified_at DESC);

-- ─────────────────────────── ПРЕДЛОЖЕНИЯ ───────────────────────────
CREATE TYPE offer_status AS ENUM ('ACTIVE', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED');

CREATE TABLE offers (
    id             BIGSERIAL PRIMARY KEY,
    request_id     BIGINT      NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    store_id       BIGINT      NOT NULL REFERENCES stores(id),
    price          INT,                        -- в сомах; NULL для шаблона "нет в наличии"
    currency       CHAR(3)     NOT NULL DEFAULT 'KGS',
    comment        TEXT,
    delivery_days  SMALLINT,
    status         offer_status NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- один магазин — одно активное предложение на запрос
CREATE UNIQUE INDEX uq_offer_per_store ON offers (request_id, store_id)
    WHERE status IN ('ACTIVE', 'ACCEPTED');

-- ─────────────────────────── ЧАТЫ ───────────────────────────
CREATE TABLE chats (
    id              BIGSERIAL PRIMARY KEY,
    request_id      BIGINT REFERENCES requests(id) ON DELETE SET NULL,
    buyer_id        BIGINT NOT NULL REFERENCES users(id),
    store_id        BIGINT NOT NULL REFERENCES stores(id),
    last_message    TEXT,
    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (buyer_id, store_id, request_id)
);

CREATE TABLE messages (
    id         BIGSERIAL PRIMARY KEY,
    chat_id    BIGINT      NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id  BIGINT      NOT NULL REFERENCES users(id),
    body       TEXT        NOT NULL,
    type       VARCHAR(10) NOT NULL DEFAULT 'TEXT',   -- TEXT / PHOTO
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_chat ON messages (chat_id, created_at DESC);

-- ─────────────────────────── ОТЗЫВЫ ───────────────────────────
CREATE TABLE reviews (
    id         BIGSERIAL PRIMARY KEY,
    author_id  BIGINT      NOT NULL REFERENCES users(id),
    store_id   BIGINT      NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    offer_id   BIGINT      REFERENCES offers(id) ON DELETE SET NULL,
    rating     SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text       TEXT,
    status     VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_store ON reviews (store_id, created_at DESC);

-- ─────────────────────────── ТЕХНИЧЕСКОЕ ───────────────────────────
-- Защита от дублей при обрыве связи
CREATE TABLE idempotency_keys (
    key          VARCHAR(80) PRIMARY KEY,
    user_id      BIGINT      NOT NULL,
    response     JSONB       NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Исходящие уведомления: пуши не шлём в HTTP-потоке
CREATE TABLE notification_outbox (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT      NOT NULL REFERENCES users(id),
    title        VARCHAR(120) NOT NULL,
    body         VARCHAR(400) NOT NULL,
    payload      JSONB,
    sent_at      TIMESTAMPTZ,
    attempts     SMALLINT    NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_outbox_unsent ON notification_outbox (created_at) WHERE sent_at IS NULL;

CREATE TABLE device_tokens (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    platform   VARCHAR(10)  NOT NULL,   -- IOS / ANDROID
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

### Справочник категорий

Хранить в коде (enum), не в БД — их семь и они меняются вместе с UI:

```java
public enum PartCategory {
    BRAKES, SUSPENSION, ENGINE, WHEELS, LIGHTS, OILS, ACCESSORIES
}
```

---

## 4. API

База: `/api/v1`. Всё, кроме `/auth/**`, требует `Authorization: Bearer <JWT>`.

### 4.1 Авторизация

```http
POST /auth/request-code        { "phone": "+996700123456" }
→ 200 { "expiresInSeconds": 120 }

POST /auth/verify              { "phone": "+996700123456", "code": "1234" }
→ 200 { "accessToken": "...", "refreshToken": "...", "isNewUser": true }

POST /auth/refresh             { "refreshToken": "..." }
POST /auth/register-role       { "role": "SELLER", "name": "Азамат" }   // для нового юзера
```

Правила: код 4 цифры, живёт 2 минуты, 3 попытки ввода, не чаще 1 SMS в минуту на номер.

### 4.2 Профиль и автомобили

```http
GET    /me
PATCH  /me                     { "name": "...", "city": "Бишкек" }

GET    /me/vehicles
POST   /me/vehicles            { "brand":"Toyota","model":"Camry","year":2018,
                                 "engine":"2.5 бензин","isDefault":true }
PATCH  /me/vehicles/{id}
DELETE /me/vehicles/{id}
```

### 4.3 Магазины (покупатель)

```http
GET /stores?category=BRAKES&city=Бишкек&page=0&size=20
GET /stores/{id}               // профиль: филиалы, категории, рейтинг, отзывы
GET /stores/{id}/reviews
```

### 4.4 Магазин (продавец, свой)

```http
GET    /my-store
PATCH  /my-store               { "name":"...", "description":"..." }

GET    /my-store/categories
PUT    /my-store/categories    { "categories": ["BRAKES","ENGINE","OILS"] }

GET    /my-store/branches
POST   /my-store/branches
PATCH  /my-store/branches/{id}
DELETE /my-store/branches/{id}

GET    /my-store/templates
POST   /my-store/templates     { "title":"Есть в наличии", "body":"..." }
PATCH  /my-store/templates/{id}
DELETE /my-store/templates/{id}
```

### 4.5 Запросы (покупатель)

```http
POST /requests
Headers: Idempotency-Key: <uuid>
{
  "category": "BRAKES",
  "description": "Передние колодки, оригинал или хорошая копия",
  "vehicleId": 12,             // либо carText
  "carText": null,
  "budgetMin": 2000,
  "budgetMax": 4000,
  "isUrgent": false
}
→ 201 {
  "id": 501,
  "sellersMatched": 5,         // приложение показывает "отправлено 5 продавцам"
  "expiresAt": "2026-09-19T14:00:00Z"
}

GET    /requests/my                     // свои запросы
GET    /requests/{id}                   // + список предложений
POST   /requests/{id}/extend            // продлить на 24ч
POST   /requests/{id}/cancel
```

### 4.6 Запросы (продавец)

```http
GET /my-store/requests?filter=ALL|URGENT|UNANSWERED&page=0&size=20
→ {
  "content": [{
    "requestId": 501,
    "category": "BRAKES",
    "description": "...",
    "car": "Toyota Camry 2018, 2.5 бензин",
    "budgetMin": 2000, "budgetMax": 4000,
    "city": "Бишкек",
    "isUrgent": false,
    "offerCount": 3,
    "createdAt": "...", "expiresAt": "...",
    "repliedAt": null
  }],
  "totalElements": 42
}

POST /my-store/requests/{id}/seen       // отметить просмотр
```

Группировка по категориям (23 запроса на колодки → одна карточка) делается
**на клиенте** — бэкенд отдаёт плоский список с полем `category`.

### 4.7 Предложения

```http
POST /offers
Headers: Idempotency-Key: <uuid>
{ "requestId": 501, "price": 3200, "comment": "...", "deliveryDays": 1 }

# ⚠️ Массовый ответ — ключевая фича
POST /offers/bulk
Headers: Idempotency-Key: <uuid>
{
  "requestIds": [501, 502, 503],
  "templateId": 7,             // либо text
  "text": null,
  "price": null
}
→ 200 { "created": 3, "skipped": 0 }

POST /offers/{id}/accept       // покупатель принимает → создаётся чат
POST /offers/{id}/reject
POST /offers/{id}/cancel       // продавец отзывает, только пока ACTIVE
```

### 4.8 Чаты

```http
GET  /chats
GET  /chats/{id}/messages?page=0&size=50
POST /chats/{id}/messages      { "body": "..." }
POST /chats/{id}/read
```

### 4.9 Аналитика продавца

```http
GET /my-store/analytics?period=WEEK|MONTH
→ {
  "requestsReceived": 84,
  "requestsAnswered": 61,
  "responseRate": 0.73,
  "requestsMissed": 23,              // не ответил и запрос истёк
  "missedBudgetSum": 71000,          // упущенная сумма в сомах
  "avgResponseMinutes": 18,
  "dealsClosed": 12,
  "topDemandedCategories": [         // ← что закупать на склад
    { "category": "BRAKES", "requests": 23, "answered": 9 },
    { "category": "OILS",   "requests": 17, "answered": 15 }
  ]
}
```

### 4.10 Устройства

```http
POST   /devices    { "token": "...", "platform": "IOS" }
DELETE /devices/{token}
```

### Формат ошибок

```json
{ "code": "REQUEST_EXPIRED", "message": "Срок ответа на запрос истёк", "field": null }
```

HTTP: 400 валидация, 401 нет токена, 403 чужой ресурс, 404, 409 конфликт
(например, оффер уже принят), 429 превышен лимит.

---

## 5. Ключевая бизнес-логика

### 5.1 Веерная рассылка запроса

Главный алгоритм всего продукта.

```java
@Transactional
public CreateRequestResponse create(Long buyerId, CreateRequestCommand cmd) {
    User buyer = users.getById(buyerId);

    Request request = new Request();
    request.setBuyer(buyer);
    request.setCategory(cmd.category());
    request.setDescription(cmd.description());
    request.setCity(buyer.getCity());
    request.setUrgent(cmd.isUrgent());
    // срочный живёт 2 часа, обычный — сутки
    request.setExpiresAt(Instant.now().plus(cmd.isUrgent() ? 2 : 24, HOURS));

    // машина: из профиля или текстом
    if (cmd.vehicleId() != null) {
        Vehicle v = vehicles.getOwned(cmd.vehicleId(), buyerId);
        request.setVehicle(v);
        request.setCarText(v.describe());   // "Toyota Camry 2018, 2.5 бензин"
    } else {
        request.setCarText(cmd.carText());
    }
    requests.save(request);

    // Кому отправлять: магазины с этой категорией в этом городе
    List<Long> storeIds = storeRepository.findMatchingStoreIds(
            cmd.category(), buyer.getCity());

    recipients.insertBatch(request.getId(), storeIds);

    // Пуши — НЕ в этом потоке. Кладём в outbox, разгребает шедулер.
    outbox.enqueueNewRequest(request, storeIds);

    return new CreateRequestResponse(request.getId(), storeIds.size(),
                                     request.getExpiresAt());
}
```

```sql
-- findMatchingStoreIds
SELECT DISTINCT sc.store_id
FROM store_categories sc
JOIN stores s          ON s.id = sc.store_id
JOIN store_branches b  ON b.store_id = s.id
WHERE sc.category = :category
  AND b.city = :city
  AND s.verification_status <> 'BLOCKED';
```

**Почему пуши через outbox:** если категория популярная и совпало 200 магазинов,
пользователь не должен ждать 200 обращений к FCM. Транзакция пишет строки в
`notification_outbox`, отдельный `@Scheduled` каждые 5 секунд их разгребает.

### 5.2 Массовый ответ шаблоном

```java
@Transactional
public BulkReplyResult bulkReply(Long storeId, BulkReplyCommand cmd) {
    String body = cmd.templateId() != null
            ? templates.getOwned(cmd.templateId(), storeId).getBody()
            : cmd.text();

    List<Request> targets = requests.findActiveByIds(cmd.requestIds());
    int created = 0, skipped = 0;

    for (Request r : targets) {
        // магазин действительно получал этот запрос?
        if (!recipients.exists(r.getId(), storeId)) { skipped++; continue; }
        // уже отвечал?
        if (offers.existsActive(r.getId(), storeId)) { skipped++; continue; }

        offers.save(Offer.of(r, storeId, cmd.price(), body));
        recipients.markReplied(r.getId(), storeId, Instant.now());
        requests.incrementOfferCount(r.getId());
        outbox.enqueueNewOffer(r.getBuyer().getId(), storeId);
        created++;
    }
    return new BulkReplyResult(created, skipped);
}
```

Всё в одной транзакции: либо все ответы прошли, либо ни одного.

### 5.3 Принятие предложения

```java
@Transactional
public void accept(Long offerId, Long buyerId) {
    Offer offer = offers.getForBuyer(offerId, buyerId);
    if (offer.getStatus() != ACTIVE) throw new ConflictException("OFFER_NOT_ACTIVE");

    offer.setStatus(ACCEPTED);
    // остальные предложения по этому запросу отклоняются автоматически
    offers.rejectOthers(offer.getRequestId(), offerId);
    requests.markCompleted(offer.getRequestId());

    Chat chat = chats.getOrCreate(buyerId, offer.getStoreId(), offer.getRequestId());
    outbox.enqueueOfferAccepted(offer.getStoreId(), chat.getId());
}
```

### 5.4 Протухание запросов

```java
@Scheduled(fixedDelay = 60_000)
@Transactional
public void expireOldRequests() {
    int n = requests.expireWhereExpiresAtBefore(Instant.now());
    if (n > 0) offers.expireForExpiredRequests();
}
```

### 5.5 Идемпотентность

`POST /requests`, `POST /offers`, `POST /offers/bulk` принимают заголовок
`Idempotency-Key`. Если ключ уже есть в `idempotency_keys` — вернуть сохранённый
ответ, ничего не создавая. Без этого при обрыве связи покупатель получит два
одинаковых предложения, а продавец создаст дубль запроса.

Реализовать как `@Around`-аспект или интерцептор, не копипастить в каждый сервис.

---

## 6. Аналитика продавца — запросы

Все метрики считаются из `request_recipients` + `offers`, отдельный трекинг не нужен.

```sql
-- Основные цифры за период
SELECT
    COUNT(*)                                            AS requests_received,
    COUNT(*) FILTER (WHERE rr.replied_at IS NOT NULL)   AS requests_answered,
    COUNT(*) FILTER (WHERE rr.replied_at IS NULL
                       AND r.status = 'EXPIRED')        AS requests_missed,
    COALESCE(SUM(r.budget_max) FILTER (WHERE rr.replied_at IS NULL
                       AND r.status = 'EXPIRED'), 0)    AS missed_budget_sum,
    AVG(EXTRACT(EPOCH FROM (rr.replied_at - rr.notified_at)) / 60)
        FILTER (WHERE rr.replied_at IS NOT NULL)        AS avg_response_minutes
FROM request_recipients rr
JOIN requests r ON r.id = rr.request_id
WHERE rr.store_id = :storeId
  AND rr.notified_at >= :from;

-- Что чаще всего спрашивают (что закупить на склад)
SELECT r.category,
       COUNT(*)                                          AS requests,
       COUNT(*) FILTER (WHERE rr.replied_at IS NOT NULL) AS answered
FROM request_recipients rr
JOIN requests r ON r.id = rr.request_id
WHERE rr.store_id = :storeId
  AND rr.notified_at >= :from
GROUP BY r.category
ORDER BY requests DESC;
```

Пока строк немного — считать на лету по индексу `idx_recipients_store`.
Когда начнёт тормозить — ночной джоб в агрегатную таблицу `store_daily_stats`.

---

## 7. Уведомления

| Событие | Кому | Текст |
|---|---|---|
| Новый запрос | подходящим магазинам | «Новый запрос: тормозная система» |
| Новый срочный запрос | подходящим магазинам | «СРОЧНО: тормозная система» (со звуком) |
| Новое предложение | покупателю | «АвтоПрофи ответил на ваш запрос» |
| Предложение принято | магазину | «Ваше предложение принято» |
| Новое сообщение | собеседнику | текст сообщения |

**Батчинг:** если магазину за 15 минут прилетело больше 3 запросов — слать одно
уведомление «8 новых запросов, 3 срочных» вместо восьми отдельных. Иначе продавец
получает тот же завал, от которого мы его спасаем.

---

## 8. Безопасность

- JWT: access 15 минут, refresh 30 дней.
- Роль проверяем на каждом `/my-store/**` — это только `SELLER`.
- Владение ресурсом проверяем всегда: запрос принадлежит покупателю, магазин —
  продавцу. Нельзя полагаться на то, что клиент пришлёт правильный id.
- Rate limit: SMS — 1/мин на номер, создание запросов — 10/сутки на покупателя
  (иначе спамеры завалят продавцов).
- Телефоны в ответах чужим пользователям не отдавать до принятия предложения.

---

## 9. Порядок разработки

| Шаг | Что | Зачем |
|---|---|---|
| 1 | Скелет проекта, Flyway, Docker Compose с Postgres | фундамент |
| 2 | `users`, SMS-вход, JWT | без входа ничего не работает |
| 3 | `stores`, `store_branches`, `store_categories` | без категорий нет матчинга |
| 4 | `vehicles` | подстановка машины в запрос |
| 5 | **`requests` + веерная рассылка** | ядро продукта |
| 6 | `offers` + массовый ответ + шаблоны | главная фича для продавца |
| 7 | `notification_outbox` + FCM | без пушей продавец не узнает о запросе |
| 8 | `chats`, `messages` | договориться о сделке |
| 9 | Аналитика | аргумент для продажи подписки |
| 10 | Отзывы, рейтинг | доверие |

Шаги 1–6 — это уже работающий продукт, который можно дать живому магазину.

---

## 10. Что НЕ делаем в v1

- Продажу автомобилей (только запчасти)
- Карту и геопоиск
- Услуги СТО
- Онлайн-оплату и эскроу
- Тёмную тему в приложении (оно светлое)

Схема БД под это заложена (`latitude`/`longitude` в филиалах, `business_type` в
магазинах), но эндпоинтов и логики в v1 нет.
