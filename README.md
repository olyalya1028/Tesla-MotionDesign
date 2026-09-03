# Tesla — Motion Design Base

Figma дизайны дагуу угсарсан **static HTML/CSS website**. Энэ нь motion нэмэх суурь
давхарга бөгөөд одоогийн байдлаар ямар ч animation, transition, transform-over-time
болон JavaScript агуулаагүй.

**Дизайны эх сурвалж:**
[Olya-E3 → Home • Desktop](https://www.figma.com/design/VRSpfRVnxwmdctgaXL9jbY/Olya-E3?node-id=23-207)
(file `VRSpfRVnxwmdctgaXL9jbY`, node `23:207`, 1440 × 5717)

---

## 1. Файлын бүтэц

```
Tesla-MotionDesign/
├── assets/                 Figma-аас экспортолсон зураг, icon (15 файл)
│   ├── tesla-logo.png
│   ├── hero-model-3.png
│   ├── fsd-interior.png
│   ├── vehicle-model-y-l-premium.png
│   ├── vehicle-model-3.png
│   ├── vehicle-model-y.png
│   ├── offers-current.png
│   ├── offers-inventory.png
│   ├── charging-map.png
│   ├── energy-solar-panels.png
│   ├── energy-powerwall.png
│   ├── icon-supercharger.svg
│   ├── icon-destination-charger.svg
│   ├── icon-arrow-back.svg
│   └── icon-arrow-forward.svg
├── index.html              Бүх section-ий semantic markup
├── styles.css              Token → base → component → section → responsive → motion
└── README.md
```

**Ажиллуулах:** build step шаардлагагүй. `index.html`-ийг browser дээр нээхэд болно
(эсвэл дурын static server-ээр түгээнэ). Гадаад хамаарал нь зөвхөн Google Fonts-оос
татагдах **Manrope** фонт; интернэт байхгүй үед system sans-serif руу уначихна.

---

## 2. Section-ийн зураглал

`index.html` доторх section бүр Figma-ийн layer нэр, node ID-тай нэг мөр
comment-ээр тэмдэглэгдсэн байгаа.

| # | Figma layer | Node | HTML | `data-section` |
|---|---|---|---|---|
| 1 | Navbar / 2 / | `23:208` | `<header class="navbar">` | `navbar` |
| 2 | Header / 30 / | `23:225` | `<section class="hero">` | `hero` |
| 3 | Layout / 651 / | `23:234` | `<section class="section feature">` | `self-driving` |
| 4 | Product / 12 / | `23:256` | `<section class="section showcase">` | `vehicles` |
| 5 | Layout / 362 / | `23:301` | `<section class="section quicklinks">` | `shop` |
| 6 | Contact / 16 / | `23:326` | `<section class="section map">` | `map` |
| 7 | Stats / 14 / | `23:329` | `<section class="section stats">` | `charging` |
| 8 | Product / 12 / | `23:364` | `<section class="section showcase">` | `energy` |
| 9 | Footer / 7 / | `23:393` | `<footer class="site-footer">` | `footer` |

### Нарийвчлалын баталгаа

1440px өргөнтэй viewport дээр Chrome-оор хэмжихэд section бүрийн өндөр Figma-тай
яг таарч байна:

| Section | Хэмжсэн | Figma |
|---|---|---|
| Navbar | 72 | 72 |
| Hero | 900 | 900 |
| Layout / 651 | 704 | 704 |
| Product / 12 (vehicles) | 950 | 950 |
| Layout / 362 | 544 | 544 |
| Contact / 16 | 944 | 944 |
| Stats / 14 | 440 | 440 |
| Product / 12 (energy) | 950 | 950 |
| Footer | 214 | 213 |
| **Нийт** | **5718** | **5717** |

1px зөрүү нь footer-ийн divider-аас гарч байгаа: Figma-д уг зураас 0 өндөртэй frame
дээр зурагдсан бол энд бодит 1px hairline (`border-top`) байна.

---

## 3. Design token

Figma-ийн variable collection-ыг `styles.css` дэх `:root` рүү 1:1 буулгасан.
Өнгө, хэмжээ засах бол **зөвхөн тэндээс** засна.

| Figma variable | CSS custom property | Утга |
|---|---|---|
| Color / Royal Blue | `--color-royal-blue` | `#4e6cda` |
| Color / Neutral Darkest | `--color-neutral-darkest` | `#020809` |
| Color Scheme 1 / Background · Foreground · Border | `--scheme-1-background` · `--scheme-1-foreground` · `--scheme-1-border` | `#ffffff` · `#f2f2f2` · `rgba(2,8,9,.15)` |
| Color Scheme 3 / Background | `--scheme-3-background` | `#f2f2f2` |
| Text Sizes / Heading 1…6 | `--heading-1` … `--heading-6` | 72 · 52 · 44 · 36 · 28 · 22 |
| Text Sizes / Text Medium · Regular · Small | `--text-medium` · `--text-regular` · `--text-small` | 18 · 16 · 14 |
| Radius / Large | `--radius-large` | `8px` |
| Stroke / Divider Width | `--stroke-divider-width` | `1px` |
| Page Padding / padding-global | `--page-padding` | `64px` |
| Section Padding / large · medium | `--section-padding-large` · `--section-padding-medium` | `112px` · `80px` |
| Container / container-large | `--container-large` | `1280px` |
| Max Width / max-width-large | `--max-width-large` | `768px` |

**Fluid scale.** Type болон spacing token-ууд `clamp()`-аар 480px–1440px хооронд
шугаман өөрчлөгдөнө. Дээд хязгаар нь Figma-гийн яг утга, тиймээс **≥1440px дээр
дизайнтай пиксель нийцтэй**, доош нь жигд жижигрэнэ.

**Товчны өндөр.** Figma-ийн stroke дотогшоо зурагддаг тул `padding + 1px border`
нийлээд яг 44px (энгийн), 40px (navbar), 48px (slider arrow) болгосон.

---

## 4. Responsive шийдэл

Figma файлд **зөвхөн Desktop 1440 frame** байгаа — mobile frame байхгүй. Тиймээс
дараах зан төлөвийг би шийдсэн бөгөөд дизайнаас гаралгүй, **ямар ч content хасаагүй**:

| Breakpoint | Юу өөрчлөгдөх |
|---|---|
| `≤1100px` | Stats section босоо болно (гарчиг дээр, тоонууд доор) |
| `≤900px` | Full Self-Driving карт босоо болж, зураг `4/3` харьцаатай доор орно |
| `≤767px` | Navbar хоёр мөр болно — эхний мөрд лого + CTA, доор нь бүх 5 холбоос хэвтээ гүйлгэлттэй.<br>Offers/Inventory картууд босоо, slide 88% өргөн, metric-үүд босоо, stat-ын зүүн зураас дээд зураас болно |
| `≤480px` | Товчнууд мөр дүүргэж уртсана, spacing нягтарна |

Navbar-ын холбоосуудыг hamburger доор нуулгүй **гүйлгэлттэй мөр** болгосон шалтгаан:
дизайнд байгаа content-ийг алга болгохгүй байх. Hamburger руу шилжүүлэх бол
энэ мөрийг л сольж болно, бусад бүтэц хөндөгдөхгүй.

Бүх өргөнд **хэвтээ overflow байхгүй** (1440 / 1024 / 768 / 504 дээр
`scrollWidth === clientWidth` шалгасан).

---

## 5. Motion нэмэх

Энэ бол төслийн үндсэн зорилго: дараагийн AI agent ямар ч төрлийн motion-ийг
**бүтцийг эвдэлгүйгээр** нэмэх боломжтой байх. Доорх зүйлс аль хэдийн бэлэн байна.

### 5.1 Сонгох цэгүүд (hooks)

Бүх сонгох цэг `data-*` attribute дээр суурилсан тул CSS class-уудыг өөрчлөхөөс
хамаарахгүй.

**Section түвшин** — `[data-section]` ба `[data-motion-group]`:
`navbar` · `hero` · `self-driving` · `vehicles` · `shop` · `map` · `charging` ·
`energy` · `footer`

```js
document.querySelectorAll('[data-motion-group="hero"] [data-motion]')
```

**Элемент түвшин** — `[data-motion="…"]`:

| Section | Утгууд |
|---|---|
| Navbar | `navbar-logo`, `navbar-link`, `navbar-cta` |
| Hero | `hero-media`, `hero-title`, `hero-subtitle`, `hero-actions`, `hero-cta` |
| Self-driving | `feature-card`, `feature-title`, `feature-text`, `feature-metrics`, `metric`, `metric-value`, `feature-actions`, `feature-media` |
| Product slider | `product-card`, `product-media`, `product-tagline`, `product-title`, `product-meta`, `product-actions` |
| Shop | `split-card`, `split-title`, `split-text`, `split-actions`, `split-media` |
| Map | `map-media` |
| Charging | `stats-title`, `stats-text`, `stats-actions`, `stat`, `stat-value` |
| Footer | `footer-divider`, `footer-link` |

**Slider** — бүрэн API гадаргуу бэлэн, зөвхөн script дутуу:

```
[data-slider="vehicles"] / [data-slider="energy"]
  [data-slider-index]          → одоогийн slide (0)
  [data-slider-track]          → үүнийг translateX хийнэ
  [data-slider-slide]          → slide бүр, [data-slide-index]-тэй
  [data-slider-dots] / [data-slider-dot][data-slide-to]
  [data-slider-prev] / [data-slider-next]
```

Идэвхтэй цэг нь `aria-current="true"`-аар тодорхойлогддог (CSS аль хэдийн
`opacity: 1` болгож байна) — script зөвхөн энэ attribute-ыг сольж, track-даа
`transform` өгөхөд хангалттай.

### 5.2 Transform-д бэлэн бүтэц

Хөдөлгөх үед layout эвдрэхээс сэргийлж дараах давхаргууд урьдчилан тавигдсан:

- **Текст.** Гарчиг/дэд гарчиг бүрийн дотор `inline-block` span байгаа
  (`.hero__title-inner`, `.product-card__title-inner`, `.feature__title-inner`,
  `.split-card__title-inner`, `.stats__title-inner`, `.product-card__tagline-inner`).
  Эцэг элемент дээр `overflow: hidden`, дотоод span дээр `translateY` өгвөл
  сонгодог "line mask reveal" шууд гарна — блокийн байрлал огт хөдлөхгүй.

- **Зураг.** Зураг бүр `.media` хүрээн дотор `position: absolute; inset: 0`-той
  сууж байгаа. Тиймээс `<img>`-д `scale()` эсвэл `translate()` өгөхөд (Ken Burns,
  parallax) хүрээ болон түүний эргэн тойрны layout огт хөдлөхгүй, илүү хэсэг нь
  автоматаар тайрагдана.

- **Section.** Section бүр `position: relative` тул чимэглэлийн давхарга
  (`::before`, absolute div) чөлөөтэй нэмэгдэнэ.

- **Inline style байхгүй.** JS `element.style`-ыг чөлөөтэй бичиж болно.

### 5.3 Бэлэн motion token

`styles.css`-ийн 17-р бүлэгт (`MOTION LAYER`) байгаа. Эдгээрийг ашиглах нь
дараагийн motion-уудыг нэг ижил хэмнэлтэй байлгана:

```css
--motion-instant / --motion-fast / --motion-base / --motion-slow / --motion-slower
--ease-standard / --ease-out / --ease-in-out / --ease-overshoot
--motion-rise (24px) / --motion-slide (48px) / --motion-stagger (80ms)
```

### 5.4 Хүртээмжийн хамгаалалт

`prefers-reduced-motion: reduce` блок аль хэдийн бичигдсэн бөгөөд бүх
`animation` / `transition`-ыг унтраадаг. Дараа нэмэх motion бүр **автоматаар**
энэ хамгаалалт дор орно — тусад нь юу ч хийх шаардлагагүй.

### 5.5 Зөвлөмж

- Одоо байгаа layout property (`width`, `height`, `top`, `margin`) битгий
  animate хий — `transform` ба `opacity` ашигла.
- `will-change`-ийг глобалаар бүү тавь; зөвхөн идэвхтэй байх хугацаанд нь өг.
- Slider-ийн клип `.showcase { overflow: clip }` дээр байгаа. Section-оос гадагш
  цухуйх motion (жишээ нь scale-up) хийх бол энэ мөрийг тухайн үед нь өөрчил.
- Шинэ motion-ыг `styles.css`-ийн `MOTION LAYER` бүлэгт эсвэл тусад нь
  `motion.css` файл үүсгээд бич — section бүлгүүдийг бохирдуулахгүй.

---

## 6. Санамж

- **Figma-гийн бичвэрийн алдааг зориуд хэвээр үлдээсэн.** Дизайнд байгаа
  `Дэлгэнгүй үзэх` (hero, `Дэлгэрэнгүй` биш) болон
  `Power Your Home and Reduce Your Electricity Bil` (`Bill` биш) гэсэн үгс
  эх дизайнтай яг адилхан бичигдсэн. Засах бол Figma дээр эхэлж засах нь зөв.
- **`assets/` доторх PNG-үүд жинтэй** (нийт ~17MB, хамгийн том нь
  `energy-powerwall.png` 3.8MB / 4096×2320). Production-д гаргах бол WebP/AVIF
  болгож, дэлгэцийн бодит хэмжээгээр дахин экспортлох нь зүйтэй. Одоогийн байдлаар
  Figma-гийн эх нягтралыг хэвээр хадгалсан.
- **Hover state огт нэмээгүй** — дизайнд заагаагүй, мөн interaction-ыг энэ үе
  шатанд оруулахгүй гэсэн шаардлагын дагуу. `:focus-visible` outline л байгаа
  (гар түлхүүрээр удирдах хүртээмжийн доод хэмжээ).
- Slider-ууд одоогоор эхний slide дээр зогсож байгаа — Figma-гийн харагдацтай яг
  адилхан, хоёр дахь карт баруун ирмэгээс цухуйж тайрагдана.
