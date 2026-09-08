# 📤 Как загрузить документацию в Design Tools

## 1️⃣ Figma (самый популярный вариант)

### Способ A: Через Figma Tokens Plugin
1. Открыть Figma → Plugins → Browse all plugins
2. Поиск: "Tokens" (Set Studio или Figma Tokens)
3. Установить плагин
4. В плагине → Import → Paste из DESIGN_SPEC.md
5. Автоматически создадутся Color Tokens, Typography, Spacing

### Способ B: Вручную в Figma
1. Открыть Figma → New file
2. Assets panel (левый сайдбар) → Components
3. Создать компоненты вручную согласно DESIGN_SPEC.md:
   - Buttons (4 варианта × 3 размера)
   - Cards (4 варианта)
   - Inputs, Badges, Ratings
4. Использовать цвета из DESIGN_SPEC.md
5. Применить типографию из Typography section

### Способ C: Импорт из Figma Community
1. Найти шаблон "Design System"
2. Скопировать в свой файл
3. Заменить colors и typography на данные из DESIGN_SPEC.md

---

## 2️⃣ Design Cloud (если это отдельный инструмент)

### Загрузка JSON
```bash
# Экспортируем документацию в JSON
cat DESIGN_SPEC.md | # Парсим markdown
# Загружаем на design-cloud
```

### Загрузка через API
```bash
curl -X POST https://design-cloud.com/api/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @design-spec.json
```

---

## 3️⃣ Adobe XD / Sketch

### XD:
1. File → Open → Paste DESIGN_SPEC.md URL
2. Или скопировать компоненты из файла

### Sketch:
1. Plugins → Sketch Runner
2. Поиск дизайн систем
3. Импортировать tokens

---

## 4️⃣ Google Drive / Notion (для совместной работы)

### Загрузить документы:
```bash
# Копируем все документы в папку для дизайнера
DESIGN_DOCS=(
  "DESIGN_SPEC.md"
  "UPDATED_TZ.md"
  "BUSINESS_LOGIC.md"
)

for doc in "${DESIGN_DOCS[@]}"; do
  echo "📤 Загружаю $doc..."
  # Загрузить на Google Drive / Notion / GitHub
done
```

### Структура в Notion:
```
Кудайберген - Design System
├── Design Spec (DESIGN_SPEC.md)
│   ├── Color Palette
│   ├── Typography
│   ├── Spacing
│   ├── Components
│   └── Screens
├── Business Logic (BUSINESS_LOGIC.md)
├── Technical Spec (UPDATED_TZ.md)
├── Prototypes (Figma links)
└── Assets (icons, images)
```

---

## 5️⃣ GitHub Pages (публичный просмотр)

```bash
# 1. Инициализировать GitHub Pages
git remote add origin https://github.com/yourusername/kudaibergen.git
git branch -M main
git push -u origin main

# 2. Включить GitHub Pages
# Settings → Pages → Source: main branch

# 3. Документы станут доступны:
# https://yourusername.github.io/kudaibergen/

# 4. Конвертировать markdown в HTML
# (GitHub автоматически конвертирует)
```

---

## 6️⃣ Копировать в буфер обмена (самый быстрый способ)

```bash
# macOS
cat DESIGN_SPEC.md | pbcopy

# Linux
cat DESIGN_SPEC.md | xclip -selection clipboard

# Windows (PowerShell)
Get-Content DESIGN_SPEC.md | Set-Clipboard
```

Затем вставить в:
- Figma → File → Paste
- Notion → Paste content
- Google Doc → Paste
- Design Cloud → Import

---

## ✅ Для каждого дизайнера:

### Шаг 1: Передать документацию
```bash
# Отправить ссылку на GitHub или Google Drive
# Или скопировать текст документа
```

### Шаг 2: Дизайнер открывает в своём инструменте
- Figma: Запустить Figma → Create new design file
- XD: File → New
- Notion: Create new page

### Шаг 3: Создать компоненты согласно DESIGN_SPEC.md
- Buttons с 4 вариантами
- Cards с 4 вариантами
- Input fields
- Badges
- Rating stars
- Headers
- Lists

### Шаг 4: Применить цвета и типографию
- Использовать Color Palette из DESIGN_SPEC.md
- Применить Typography styles
- Соблюдать Spacing system

### Шаг 5: Создать экраны
- Следовать layouts из Screen Map
- Использовать компоненты
- Создать для обеих ролей (buyer/seller)

---

## 📊 Быстрый чек-лист для дизайнера

- [ ] Открыть DESIGN_SPEC.md
- [ ] Создать Color Palette (8 цветов для light, 8 для dark)
- [ ] Создать Typography styles (7 стилей)
- [ ] Создать Spacing tokens (8 значений)
- [ ] Создать 11 компонентов (Button, Card, Input, Badge, Rating, Header, Divider)
- [ ] Дизайн 5 экранов для покупателя
- [ ] Дизайн 5 экранов для продавца
- [ ] Dark mode версия всех экранов
- [ ] Interactive states (hover, active, disabled)
- [ ] Экспортировать как Figma/XD/Sketch файл

---

## 🔗 Полезные ссылки

**Документация в проекте:**
- DESIGN_SPEC.md (989 строк)
- UPDATED_TZ.md (Техническое задание)
- BUSINESS_LOGIC.md (Бизнес логика)

**Рекомендуемые инструменты:**
1. **Figma** (лучший вариант) → figma.com
2. **Adobe XD** → adobe.com/products/xd
3. **Sketch** → sketch.com
4. **Penpot** (open-source) → penpot.app

