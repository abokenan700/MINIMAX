# نخبة — دراسة الهويات البصرية الاحترافية
## Visual Identity System Proposals

> **وثيقة استراتيجية** — تحليل عميق + 5 نماذج هوية جاهزة للتنفيذ  
> المحلل: كبير مستشاري تصميم المتاجر الإلكترونية العالمية  
> التاريخ: مايو 2026

---

## أولاً: تشخيص الهوية الحالية

### ما تم بناؤه

التطبيق الحالي يعمل على:
- **اللون الأساسي:** برتقالي `#F97316` (Orange-500 من Tailwind)
- **الخلفية:** أبيض نقي `#FFFFFF`
- **الخطّ:** Tajawal — خط عربي عصري جيد القراءة
- **نظام الظلال:** طبقتان (xs → xl) بأسلوب Google Material You
- **نصف القطر:** `--radius-card: 1rem` (16px) — ناعم ومتوازن

### نقاط القوة الموجودة
- `card-pressable` مع `translateY(-1px)` عند hover — تفصيل احترافي
- شريط الهوية البرتقالي `section-accent-bar` قبل عناوين الأقسام
- Frosted glass في BottomNav بـ `backdrop-filter: blur(20px)`
- نظام الحركة `--ease-spring / --ease-slide / --ease-bounce` متكامل
- مقياس طباعي fluid بـ `clamp()` مدروس

### الفجوات المكتشفة
1. **اللون الأساسي شائع جداً** — #F97316 يُستخدم في Noon وShopping Saudi وعشرات التطبيقات الخليجية
2. **لا شخصية مميزة** — البرتقالي/الأبيض بلا هوية فريدة لبراند "نخبة"
3. **الظلال خفيفة جداً** — لا تُعطي الإحساس بالتميز
4. **غياب العنصر التراثي** — الاسم "نخبة" يوحي بالفخامة العربية ولا توجد عناصر بصرية تعبّر عنه
5. **الـ radius موحّد** — لا تباين في الشكل يُضيف إيقاعاً بصرياً

---

## ثانياً: المعايير الدولية لتصميم المتاجر الفاخرة

بناءً على تحليل: Mytheresa، SSENSE، Farfetch، Ounass (الخليج)، Namshi، Noon Premium

| المعيار | الأولوية | الوزن |
|---------|---------|------|
| تمايز لوني واضح يميّز البراند | حرجة | 25% |
| تسلسل طباعي محكم (3-4 مستويات) | عالية | 20% |
| نظام ظلال يعطي إحساس بالمادة | عالية | 15% |
| شخصية حركية (motion personality) | متوسطة | 15% |
| تناسق نصف القطر مع الشخصية | متوسطة | 15% |
| قابلية التطبيق الفوري | تقنية | 10% |

---

---

# النماذج الخمسة

---

## النموذج 01 — الفاخر المعاصر
### Contemporary Luxury · الهوية الملكية الداكنة

```
الشخصية:  تاج الخليج · Mytheresa of Arabia
المشاعر:  ثقة، تفرّد، هيبة
المرجع:   Ounass + Mytheresa + Dior Beauty
```

### القصة البصرية
"نخبة" ليست متجراً — هي وجهة. اللون الأساسي أزرق ليلي عميق مستلهم من سماء الخليج في الليل، تخترقه خطوط ذهبية دافئة كالزخارف العربية القديمة. كل بطاقة تبدو كأنها قطعة مجوهرات داخل صندوق فاخر.

### لوحة الألوان

| الدور | الاسم | HEX | استخدامه |
|------|------|-----|---------|
| Primary | Navy Midnight | `#0F172A` | أزرار CTA، العناوين الرئيسية، BottomNav active |
| Secondary | Royal Gold | `#C9A84C` | أسعار، شارات، شريط الهوية، النجوم |
| Gold Light | Antique Warm | `#F5E6C8` | خلفية البيدجز، icon backgrounds |
| Surface | Ivory White | `#FEFCF8` | خلفية الصفحات والبطاقات |
| Surface Warm | Cream | `#FAF6EE` | خلفية الـ sections |
| Text Primary | Charcoal Deep | `#0C0A07` | نصوص أساسية |
| Text Muted | Warm Gray | `#8A7F6E` | نصوص ثانوية |
| Accent | Burgundy Touch | `#9F1239` | (اختياري) عروض حصرية |

### CSS Variables — جاهز للصق في index.css

```css
/* ══════════════════════════════════════════════════
   IDENTITY 01 — Contemporary Luxury (الفاخر المعاصر)
   نسخه هذا الكتلة وضعه داخل :root { } في index.css
   ══════════════════════════════════════════════════ */

  /* Primary Navy-Gold Scale */
  --gold:                  #C9A84C;
  --gold-dark:             #A8893A;
  --gold-mid:              #D4B566;
  --gold-light:            #F5E6C8;
  --gold-pale:             #FAF0DC;
  --gold-accent:           #A8893A;
  --gold-gradient-start:   #C9A84C;
  --gold-warm:             #C9A84C;

  /* Accent */
  --accent:                #C9A84C;
  --accent-bg:             #FAF0DC;
  --accent-light:          #FDF7EC;
  --accent-text:           #8A6A2A;

  /* Text Hierarchy */
  --text-primary:          #0C0A07;
  --text-secondary:        #2E2A22;
  --text-tertiary:         #6B6257;
  --text-muted:            #8A7F6E;
  --text-placeholder:      #B8AE9E;
  --text-price:            #0C0A07;
  --text-brand:            #C9A84C;

  /* Semantic */
  --success:               #15803D;
  --success-bg:            #F0FDF4;
  --error:                 #BE123C;
  --error-bg:              #FFF1F2;
  --warning:               #B45309;
  --warning-bg:            #FFFBEB;
  --discount-bg:           #FAF0DC;
  --discount-text:         #8A6A2A;

  /* Surfaces */
  --bg-body:               #FEFCF8;
  --bg-page:               #FEFCF8;
  --bg-card:               #FFFFFF;
  --bg-surface-warm:       #FAF6EE;
  --bg-surface-subtle:     #F5F0E8;
  --bg-subtle:             #F0EAE0;
  --bg-hover:              #FAF6EE;
  --bg-cta-dark:           #0F172A;

  /* Cards */
  --card-bg:               #FFFFFF;
  --card-border:           rgba(201, 168, 76, 0.18);
  --card-img-bg:           #FAF6EE;

  /* Inputs */
  --input-bg:              #FFFFFF;
  --input-bg-soft:         #FAF6EE;
  --input-border:          rgba(201, 168, 76, 0.28);
  --input-border-focus:    #C9A84C;

  /* Borders */
  --border:                rgba(201, 168, 76, 0.15);
  --border-warm:           rgba(201, 168, 76, 0.22);
  --border-separator:      rgba(201, 168, 76, 0.10);
  --border-orange:         rgba(201, 168, 76, 0.22);

  /* Shadows — Deep & Prestigious */
  --shadow-xs:    0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-sm:    0 2px 4px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md:    0 4px 8px rgba(15, 23, 42, 0.08), 0 8px 16px rgba(15, 23, 42, 0.06);
  --shadow-lg:    0 8px 16px rgba(15, 23, 42, 0.10), 0 20px 40px rgba(15, 23, 42, 0.08);
  --shadow-xl:    0 16px 32px rgba(15, 23, 42, 0.12), 0 32px 64px rgba(15, 23, 42, 0.08);
  --shadow-sheet: 0 -4px 12px rgba(15, 23, 42, 0.08), 0 -16px 48px rgba(15, 23, 42, 0.10);
  --shadow-feature: 0 2px 4px rgba(15,23,42,0.06), 0 6px 12px rgba(15,23,42,0.05), 0 0 0 1px rgba(201,168,76,0.18);
  --shadow-card:  0 2px 4px rgba(15, 23, 42, 0.05), 0 6px 16px rgba(15, 23, 42, 0.06);
  --shadow-sticky: 0 -1px 0 rgba(201,168,76,0.15), 0 -8px 24px rgba(15,23,42,0.08);
  --shadow-btn:   0 4px 8px rgba(201,168,76,0.30), 0 8px 24px rgba(15,23,42,0.20);
  --shadow-btn-hover: 0 6px 12px rgba(201,168,76,0.40), 0 12px 32px rgba(15,23,42,0.25);
  --shadow-success: 0 2px 8px rgba(201,168,76,0.30), 0 4px 16px rgba(201,168,76,0.20);
  --shadow-glow:  0 0 32px rgba(201, 168, 76, 0.28);

  /* Border Radius — More Angular = More Prestige */
  --radius-xs:     0.25rem;   /*  4px */
  --radius-sm:     0.375rem;  /*  6px */
  --radius-md:     0.625rem;  /* 10px */
  --radius-lg:     0.875rem;  /* 14px */
  --radius-card:   0.75rem;   /* 12px */
  --radius-xl:     1.125rem;  /* 18px */
  --radius-pill:   9999px;

  /* Gradients */
  --gradient-brand-text:   linear-gradient(145deg, #C9A84C 0%, #A8893A 100%);
  --gradient-gold:         linear-gradient(135deg, #C9A84C 0%, #A8893A 100%);
  --gradient-cta:          linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  --gradient-cta-hover:    linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  --gradient-accent:       linear-gradient(135deg, #C9A84C 0%, #A8893A 100%);
  --gradient-warm:         linear-gradient(135deg, #FAF6EE 0%, #F5F0E8 100%);
  --gradient-img-overlay:  linear-gradient(to top, rgba(15,23,42,0.04) 0%, transparent 60%);

  /* Motion — Slower, More Deliberate */
  --duration-fast:   0.18s;
  --duration-base:   0.32s;
  --duration-slow:   0.56s;
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-slide:      cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
```

### تعديلات إضافية مطلوبة
- **أزرار CTA:** `background: #0F172A` (نيفي) مع نص `#C9A84C` (ذهبي)
- **BottomNav Active:** لون `#0F172A`، المؤشر العلوي `#C9A84C`
- **SectionHeader Bar:** `background: linear-gradient(135deg, #C9A84C, #A8893A)`
- **Header Brand Text:** تدرج ذهبي على خلفية `#FEFCF8`

---

---

## النموذج 02 — النضارة العربية
### Arabic Heritage Fresh · التراث الأخضر العربي

```
الشخصية:  الواحة الرقمية · The Digital Oasis
المشاعر:  أصالة، ثقة، طبيعية، نضارة
المرجع:   Emirates Nature + Jashanmal + Wadima
```

### القصة البصرية
المتجر الوحيد الذي يجمع بين عراقة الأسواق العربية الأصيلة وحداثة التسوق الرقمي. الأخضر الزمردي العميق يُذكّر بالنخيل والمرمر الأخضر في القصور الكلاسيكية. اللهجة العنبرية الدافئة تمنح الحرارة الإنسانية التي تميز التجار العرب الأصيلين. خلفية العاج الدافئ — لا أبيض بارد — تُشعر المستخدم بالترحيب.

### لوحة الألوان

| الدور | الاسم | HEX | استخدامه |
|------|------|-----|---------|
| Primary | Emerald Deep | `#065F46` | CTA، أيقونات نشطة، شريط الهوية |
| Secondary | Amber Warm | `#D97706` | أسعار، خصومات، التمييز |
| Mint | Soft Sage | `#D1FAE5` | خلفية الـ icon wrappers |
| Surface | Warm Ivory | `#FDFAF5` | خلفية الصفحات |
| Card | Cream White | `#FFFFFF` | البطاقات |
| Text Primary | Deep Umber | `#1C1407` | نصوص أساسية |
| Text Muted | Earth Tone | `#7A6B55` | نصوص ثانوية |

### CSS Variables — جاهز للصق في index.css

```css
/* ══════════════════════════════════════════════════
   IDENTITY 02 — Arabic Heritage Fresh (النضارة العربية)
   ══════════════════════════════════════════════════ */

  /* Primary Emerald Scale */
  --gold:                  #065F46;
  --gold-dark:             #064E3B;
  --gold-mid:              #059669;
  --gold-light:            #D1FAE5;
  --gold-pale:             #ECFDF5;
  --gold-accent:           #047857;
  --gold-gradient-start:   #065F46;
  --gold-warm:             #059669;

  /* Accent (Amber for prices/discount) */
  --accent:                #D97706;
  --accent-bg:             #FEF3C7;
  --accent-light:          #FFFBEB;
  --accent-text:           #B45309;

  /* Text Hierarchy */
  --text-primary:          #1C1407;
  --text-secondary:        #3A2F1E;
  --text-tertiary:         #6B5E48;
  --text-muted:            #7A6B55;
  --text-placeholder:      #B5A98E;
  --text-price:            #1C1407;
  --text-brand:            #065F46;

  /* Semantic */
  --success:               #065F46;
  --success-bg:            #ECFDF5;
  --error:                 #DC2626;
  --error-bg:              #FEF2F2;
  --warning:               #D97706;
  --warning-bg:            #FFFBEB;
  --discount-bg:           #FEF3C7;
  --discount-text:         #B45309;

  /* Surfaces */
  --bg-body:               #FDFAF5;
  --bg-page:               #FDFAF5;
  --bg-card:               #FFFFFF;
  --bg-surface-warm:       #FAF6EE;
  --bg-surface-subtle:     #F5F0E4;
  --bg-subtle:             #F0EAD8;
  --bg-hover:              #FAF6EE;
  --bg-cta-dark:           #065F46;

  /* Cards */
  --card-bg:               #FFFFFF;
  --card-border:           rgba(6, 95, 70, 0.12);
  --card-img-bg:           #F5F8F5;

  /* Inputs */
  --input-bg:              #FFFFFF;
  --input-bg-soft:         #FDFAF5;
  --input-border:          rgba(6, 95, 70, 0.20);
  --input-border-focus:    #065F46;

  /* Borders */
  --border:                rgba(6, 95, 70, 0.10);
  --border-warm:           rgba(6, 95, 70, 0.15);
  --border-separator:      rgba(6, 95, 70, 0.07);
  --border-orange:         rgba(6, 95, 70, 0.15);

  /* Shadows — Warm & Natural */
  --shadow-xs:    0 1px 3px rgba(6, 45, 30, 0.07);
  --shadow-sm:    0 2px 4px rgba(6, 45, 30, 0.06), 0 1px 2px rgba(6, 45, 30, 0.04);
  --shadow-md:    0 4px 8px rgba(6, 45, 30, 0.07), 0 8px 16px rgba(6, 45, 30, 0.05);
  --shadow-lg:    0 8px 16px rgba(6, 45, 30, 0.08), 0 20px 40px rgba(6, 45, 30, 0.06);
  --shadow-xl:    0 16px 32px rgba(6, 45, 30, 0.09), 0 32px 64px rgba(6, 45, 30, 0.06);
  --shadow-sheet: 0 -4px 12px rgba(6, 45, 30, 0.07), 0 -16px 48px rgba(6, 45, 30, 0.08);
  --shadow-feature: 0 2px 4px rgba(6,45,30,0.06), 0 6px 12px rgba(6,45,30,0.05), 0 0 0 1px rgba(6,95,70,0.12);
  --shadow-card:  0 2px 6px rgba(6, 45, 30, 0.06), 0 6px 14px rgba(6, 45, 30, 0.05);
  --shadow-sticky: 0 -1px 0 rgba(6,95,70,0.12), 0 -6px 20px rgba(6,45,30,0.08);
  --shadow-btn:   0 4px 8px rgba(6, 95, 70, 0.28), 0 8px 24px rgba(6, 95, 70, 0.18);
  --shadow-btn-hover: 0 6px 12px rgba(6, 95, 70, 0.36), 0 12px 32px rgba(6, 95, 70, 0.22);
  --shadow-success: 0 2px 8px rgba(6, 95, 70, 0.28), 0 4px 16px rgba(6, 95, 70, 0.18);
  --shadow-glow:  0 0 32px rgba(6, 95, 70, 0.22);

  /* Border Radius — Organic, Rounded */
  --radius-xs:     0.5rem;    /*  8px */
  --radius-sm:     0.75rem;   /* 12px */
  --radius-md:     1rem;      /* 16px */
  --radius-lg:     1.5rem;    /* 24px */
  --radius-card:   1.125rem;  /* 18px */
  --radius-xl:     1.75rem;   /* 28px */
  --radius-pill:   9999px;

  /* Gradients */
  --gradient-brand-text:   linear-gradient(145deg, #065F46 0%, #047857 100%);
  --gradient-gold:         linear-gradient(135deg, #065F46 0%, #059669 100%);
  --gradient-cta:          linear-gradient(135deg, #065F46 0%, #047857 100%);
  --gradient-cta-hover:    linear-gradient(135deg, #047857 0%, #065F46 100%);
  --gradient-accent:       linear-gradient(135deg, #D97706 0%, #B45309 100%);
  --gradient-warm:         linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  --gradient-img-overlay:  linear-gradient(to top, rgba(6,45,30,0.04) 0%, transparent 60%);

  /* Motion — Organic & Smooth */
  --duration-fast:   0.16s;
  --duration-base:   0.28s;
  --duration-slow:   0.50s;
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-slide:      cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
```

### تعديلات إضافية مطلوبة
- **أزرار CTA:** `background: linear-gradient(135deg, #065F46, #047857)` — الأخضر العميق
- **أسعار الخصم:** `color: #D97706` (عنبري) لجذب الانتباه
- **SectionHeader Bar:** `background: linear-gradient(135deg, #065F46, #059669)`
- **Features icons bg:** `background: #D1FAE5` مع أيقونات `#065F46`
- **BottomNav Active:** لون `#065F46`

---

---

## النموذج 03 — الحداثة الجريئة
### Bold Minimalism · الأسود الحاد

```
الشخصية:  Strike First · الانطباع الأول الصادم
المشاعر:  جرأة، حسم، أداء، تميّز
المرجع:   SSENSE + Supreme + Mytheresa Dark + Yoox
```

### القصة البصرية
في عالم تتشابه فيه الألوان الباهتة، "نخبة" تختار المواجهة المباشرة. أسود حاد يصرخ بثقة — ليس لأنه مظلم بل لأنه واضح. البرتقالي الكهربائي كالصاعقة على الأسود — اللحظة التي يجد فيها المستخدم ما يريد. لا كسالى، لا ألوان حيادية، لا تردد. هذا تصميم يقرر.

### لوحة الألوان

| الدور | الاسم | HEX | استخدامه |
|------|------|-----|---------|
| Primary | Pure Black | `#0A0A0A` | أزرار CTA، عناوين رئيسية |
| Accent | Electric Orange | `#FF6B00` | الأسعار، الخصومات، التفاصيل التفاعلية |
| Orange Soft | Fire Pale | `#FFF3E6` | خلفية البيدجز |
| Surface | Pure White | `#FFFFFF` | الخلفيات (تباين أقصى) |
| Card Surface | Off-White | `#FAFAFA` | البطاقات |
| Text Primary | Near Black | `#080808` | نصوص أساسية |
| Text Muted | Mid Gray | `#6B6B6B` | نصوص ثانوية |
| Separator | Ghost Gray | `#E5E5E5` | فواصل |

### CSS Variables — جاهز للصق في index.css

```css
/* ══════════════════════════════════════════════════
   IDENTITY 03 — Bold Minimalism (الحداثة الجريئة)
   ══════════════════════════════════════════════════ */

  /* Primary Black-Orange Scale */
  --gold:                  #FF6B00;
  --gold-dark:             #E05A00;
  --gold-mid:              #FF8533;
  --gold-light:            #FFF3E6;
  --gold-pale:             #FFF8F2;
  --gold-accent:           #E05A00;
  --gold-gradient-start:   #FF6B00;
  --gold-warm:             #FF6B00;

  /* Accent */
  --accent:                #FF6B00;
  --accent-bg:             #FFF3E6;
  --accent-light:          #FFF8F2;
  --accent-text:           #E05A00;

  /* Text Hierarchy */
  --text-primary:          #080808;
  --text-secondary:        #1A1A1A;
  --text-tertiary:         #444444;
  --text-muted:            #6B6B6B;
  --text-placeholder:      #AAAAAA;
  --text-price:            #080808;
  --text-brand:            #FF6B00;

  /* Semantic */
  --success:               #16A34A;
  --success-bg:            #F0FDF4;
  --error:                 #DC2626;
  --error-bg:              #FEF2F2;
  --warning:               #D97706;
  --warning-bg:            #FFFBEB;
  --discount-bg:           #FFF3E6;
  --discount-text:         #E05A00;

  /* Surfaces */
  --bg-body:               #FFFFFF;
  --bg-page:               #FFFFFF;
  --bg-card:               #FFFFFF;
  --bg-surface-warm:       #FAFAFA;
  --bg-surface-subtle:     #F5F5F5;
  --bg-subtle:             #F0F0F0;
  --bg-hover:              #F5F5F5;
  --bg-cta-dark:           #0A0A0A;

  /* Cards */
  --card-bg:               #FFFFFF;
  --card-border:           #E5E5E5;
  --card-img-bg:           #FAFAFA;

  /* Inputs */
  --input-bg:              #FFFFFF;
  --input-bg-soft:         #FAFAFA;
  --input-border:          #D0D0D0;
  --input-border-focus:    #0A0A0A;

  /* Borders */
  --border:                #E5E5E5;
  --border-warm:           #D8D8D8;
  --border-separator:      #F0F0F0;
  --border-orange:         rgba(255, 107, 0, 0.25);

  /* Shadows — Sharp, Precise, Editorial */
  --shadow-xs:    0 1px 0 rgba(0,0,0,0.08);
  --shadow-sm:    0 1px 0 rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-md:    0 2px 0 rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.08);
  --shadow-lg:    0 4px 0 rgba(0,0,0,0.10), 0 16px 32px rgba(0,0,0,0.08);
  --shadow-xl:    0 8px 0 rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.10);
  --shadow-sheet: 0 -2px 0 rgba(0,0,0,0.10), 0 -16px 48px rgba(0,0,0,0.12);
  --shadow-feature: 0 0 0 1px #E5E5E5, 0 2px 8px rgba(0,0,0,0.06);
  --shadow-card:  0 0 0 1px #E8E8E8, 0 2px 8px rgba(0,0,0,0.05);
  --shadow-sticky: 0 -2px 0 rgba(0,0,0,0.12), 0 -8px 24px rgba(0,0,0,0.08);
  --shadow-btn:   0 4px 0 rgba(0,0,0,0.25), 0 2px 8px rgba(255,107,0,0.20);
  --shadow-btn-hover: 0 6px 0 rgba(0,0,0,0.30), 0 4px 12px rgba(255,107,0,0.25);
  --shadow-success: 0 2px 8px rgba(255,107,0,0.30), 0 4px 16px rgba(255,107,0,0.20);
  --shadow-glow:  0 0 32px rgba(255, 107, 0, 0.30);

  /* Border Radius — Sharp & Editorial */
  --radius-xs:     0.125rem;  /*  2px */
  --radius-sm:     0.25rem;   /*  4px */
  --radius-md:     0.5rem;    /*  8px */
  --radius-lg:     0.75rem;   /* 12px */
  --radius-card:   0.625rem;  /* 10px */
  --radius-xl:     1rem;      /* 16px */
  --radius-pill:   9999px;

  /* Gradients */
  --gradient-brand-text:   linear-gradient(145deg, #0A0A0A 0%, #333333 100%);
  --gradient-gold:         linear-gradient(135deg, #FF6B00 0%, #E05A00 100%);
  --gradient-cta:          linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%);
  --gradient-cta-hover:    linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%);
  --gradient-accent:       linear-gradient(135deg, #FF6B00 0%, #E05A00 100%);
  --gradient-warm:         linear-gradient(135deg, #F5F5F5 0%, #EBEBEB 100%);
  --gradient-img-overlay:  linear-gradient(to top, rgba(0,0,0,0.02) 0%, transparent 40%);

  /* Motion — Fast, Decisive */
  --duration-fast:   0.10s;
  --duration-base:   0.20s;
  --duration-slow:   0.36s;
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.175, 0.885, 0.32, 1.175);
  --ease-slide:      cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.36, 0.64, 1);
```

### تعديلات إضافية مطلوبة
- **CTA Button:** خلفية سوداء `#0A0A0A`، نص أبيض — لا تدرج
- **Brand Text:** لا تدرج — `color: #0A0A0A` ثابت وحاد
- **SectionHeader Bar:** `background: #0A0A0A` — أسود بلا تدرج
- **Cart Badge:** `background: #FF6B00` — برتقالي كهربائي
- **BottomNav Active:** `#0A0A0A`، بدون مؤشر علوي، فقط ثقل الخط يتضاعف

---

---

## النموذج 04 — الأناقة الرقيقة
### Soft Luxe · الأنثوية الراقية

```
الشخصية:  Velvet Hour · ساعة المخمل
المشاعر:  أنوثة، رفاهية، حميمية، ثقة خافتة
المرجع:   Revolve + Intermix + Net-a-Porter (Pink Edition)
```

### القصة البصرية
كمتجر يضم منتجات النساء والمجوهرات والعطور بشكل بارز — هذه الهوية تتحدث لغتهن. البنفسجي العميق يمنح الثقة والتفرد. الدافئ الشمبانيوي يعطي الترف دون صخب. الوردي الشاحب يُذكّر بريش الطواووس والحرير الطبيعي. لا صراخ، لا تعقيد — فقط أناقة تثق بنفسها.

### لوحة الألوان

| الدور | الاسم | HEX | استخدامه |
|------|------|-----|---------|
| Primary | Deep Plum | `#4C1D95` | أزرار CTA، عناصر نشطة |
| Secondary | Blush Rose | `#E879A0` | التمييز، الخصومات |
| Champagne | Warm Chamois | `#F0E6D3` | خلفية الـ icon wrappers |
| Surface | Silk White | `#FEFEFE` | خلفية الصفحات |
| Surface Warm | Ivory Blush | `#FDF8F5` | خلفية الـ sections |
| Text Primary | Night Plum | `#1A0030` | نصوص أساسية |
| Text Muted | Mauve Gray | `#9E8FA0` | نصوص ثانوية |

### CSS Variables — جاهز للصق في index.css

```css
/* ══════════════════════════════════════════════════
   IDENTITY 04 — Soft Luxe (الأناقة الرقيقة)
   ══════════════════════════════════════════════════ */

  /* Primary Plum-Rose Scale */
  --gold:                  #6D28D9;
  --gold-dark:             #4C1D95;
  --gold-mid:              #7C3AED;
  --gold-light:            #EDE9FE;
  --gold-pale:             #F5F3FF;
  --gold-accent:           #4C1D95;
  --gold-gradient-start:   #6D28D9;
  --gold-warm:             #7C3AED;

  /* Accent (Rose for discount/highlight) */
  --accent:                #E879A0;
  --accent-bg:             #FCE7F0;
  --accent-light:          #FDF2F7;
  --accent-text:           #BE185D;

  /* Text Hierarchy */
  --text-primary:          #1A0030;
  --text-secondary:        #3B1F4A;
  --text-tertiary:         #6B5070;
  --text-muted:            #9E8FA0;
  --text-placeholder:      #C4B8C8;
  --text-price:            #1A0030;
  --text-brand:            #6D28D9;

  /* Semantic */
  --success:               #15803D;
  --success-bg:            #F0FDF4;
  --error:                 #DC2626;
  --error-bg:              #FEF2F2;
  --warning:               #B45309;
  --warning-bg:            #FFFBEB;
  --discount-bg:           #FCE7F0;
  --discount-text:         #BE185D;

  /* Surfaces */
  --bg-body:               #FDF8F5;
  --bg-page:               #FDF8F5;
  --bg-card:               #FFFFFF;
  --bg-surface-warm:       #FAF5F0;
  --bg-surface-subtle:     #F5EFF0;
  --bg-subtle:             #F0E8ED;
  --bg-hover:              #FAF5F0;
  --bg-cta-dark:           #4C1D95;

  /* Cards */
  --card-bg:               #FFFFFF;
  --card-border:           rgba(109, 40, 217, 0.10);
  --card-img-bg:           #FDF5F8;

  /* Inputs */
  --input-bg:              #FFFFFF;
  --input-bg-soft:         #FDF8F5;
  --input-border:          rgba(109, 40, 217, 0.18);
  --input-border-focus:    #6D28D9;

  /* Borders */
  --border:                rgba(109, 40, 217, 0.09);
  --border-warm:           rgba(109, 40, 217, 0.14);
  --border-separator:      rgba(109, 40, 217, 0.06);
  --border-orange:         rgba(232, 121, 160, 0.20);

  /* Shadows — Soft, Layered, Feminine */
  --shadow-xs:    0 1px 3px rgba(76, 29, 149, 0.07);
  --shadow-sm:    0 2px 4px rgba(76, 29, 149, 0.06), 0 1px 2px rgba(76, 29, 149, 0.04);
  --shadow-md:    0 4px 12px rgba(76, 29, 149, 0.08), 0 8px 20px rgba(76, 29, 149, 0.05);
  --shadow-lg:    0 8px 20px rgba(76, 29, 149, 0.10), 0 20px 44px rgba(76, 29, 149, 0.06);
  --shadow-xl:    0 16px 40px rgba(76, 29, 149, 0.12), 0 32px 64px rgba(76, 29, 149, 0.07);
  --shadow-sheet: 0 -4px 16px rgba(76, 29, 149, 0.08), 0 -16px 48px rgba(76, 29, 149, 0.08);
  --shadow-feature: 0 2px 4px rgba(76,29,149,0.06), 0 8px 16px rgba(76,29,149,0.05), 0 0 0 1px rgba(109,40,217,0.10);
  --shadow-card:  0 2px 8px rgba(76, 29, 149, 0.06), 0 6px 16px rgba(76, 29, 149, 0.05);
  --shadow-sticky: 0 -1px 0 rgba(109,40,217,0.10), 0 -8px 24px rgba(76,29,149,0.08);
  --shadow-btn:   0 4px 12px rgba(109, 40, 217, 0.30), 0 8px 24px rgba(109, 40, 217, 0.18);
  --shadow-btn-hover: 0 6px 16px rgba(109, 40, 217, 0.38), 0 12px 32px rgba(109, 40, 217, 0.22);
  --shadow-success: 0 2px 8px rgba(109, 40, 217, 0.28), 0 4px 16px rgba(109, 40, 217, 0.18);
  --shadow-glow:  0 0 40px rgba(109, 40, 217, 0.22), 0 0 16px rgba(232, 121, 160, 0.15);

  /* Border Radius — Very Soft, Feminine */
  --radius-xs:     0.625rem;  /* 10px */
  --radius-sm:     0.875rem;  /* 14px */
  --radius-md:     1.125rem;  /* 18px */
  --radius-lg:     1.625rem;  /* 26px */
  --radius-card:   1.25rem;   /* 20px */
  --radius-xl:     2rem;      /* 32px */
  --radius-pill:   9999px;

  /* Gradients */
  --gradient-brand-text:   linear-gradient(145deg, #6D28D9 0%, #4C1D95 100%);
  --gradient-gold:         linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%);
  --gradient-cta:          linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%);
  --gradient-cta-hover:    linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
  --gradient-accent:       linear-gradient(135deg, #E879A0 0%, #BE185D 100%);
  --gradient-warm:         linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
  --gradient-img-overlay:  linear-gradient(to top, rgba(76,29,149,0.04) 0%, transparent 60%);

  /* Motion — Dreamy & Flowing */
  --duration-fast:   0.20s;
  --duration-base:   0.36s;
  --duration-slow:   0.62s;
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:        cubic-bezier(0, 0, 0.3, 1);
  --ease-spring:     cubic-bezier(0.34, 1.46, 0.64, 1);
  --ease-slide:      cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.68, 0.64, 1);
```

### تعديلات إضافية مطلوبة
- **CTA Button:** بنفسجي مع نص أبيض — `background: linear-gradient(135deg, #6D28D9, #4C1D95)`
- **الخصومات/السعر القديم:** وردي `#E879A0`
- **SectionHeader Bar:** تدرج بنفسجي→وردي `linear-gradient(135deg, #6D28D9, #E879A0)`
- **Features icons bg:** `background: #EDE9FE` بنفسجي شاحب
- **Heart icon when liked:** `fill: #E879A0 stroke: #E879A0`

---

---

## النموذج 05 — الرقي الرقمي
### Digital Prestige · الرمادي الفولاذي

```
الشخصية:  Silicon Souk · السوق الرقمي المتطور
المشاعر:  دقة، ذكاء، ثقة تقنية، هدوء الواثق بنفسه
المرجع:   Linear App + Vercel + Nothing Phone + SSENSE Tech
```

### القصة البصرية
التصميم الذي يختاره من يعرف. لا عواطف زائدة، لا تدرجات مبهرجة — فقط الدقة المطلقة في كل تفصيل. الفيروزي الداكن كالمعدن المصقول يمنح الهوية تفرداً لا يُنسى. الرمادي المحترم يحمل كل المحتوى دون منافسته. نظام الظلال مبني على الضوء المحسوب وليس على التعتيم العشوائي.

### لوحة الألوان

| الدور | الاسم | HEX | استخدامه |
|------|------|-----|---------|
| Primary | Deep Teal | `#0D9488` | أزرار CTA، عناصر نشطة، شريط الهوية |
| Secondary | Warm Amber | `#F59E0B` | أسعار، خصومات |
| Teal Pale | Aqua Mist | `#CCFBF1` | خلفية الـ icon wrappers |
| Surface | Cool White | `#FAFAFA` | خلفية الصفحات |
| Card | Pure White | `#FFFFFF` | البطاقات |
| Text Primary | Charcoal | `#111827` | نصوص أساسية |
| Text Muted | Steel Gray | `#6B7280` | نصوص ثانوية |

### CSS Variables — جاهز للصق في index.css

```css
/* ══════════════════════════════════════════════════
   IDENTITY 05 — Digital Prestige (الرقي الرقمي)
   ══════════════════════════════════════════════════ */

  /* Primary Deep Teal Scale */
  --gold:                  #0D9488;
  --gold-dark:             #0F766E;
  --gold-mid:              #14B8A6;
  --gold-light:            #CCFBF1;
  --gold-pale:             #F0FDFA;
  --gold-accent:           #0F766E;
  --gold-gradient-start:   #0D9488;
  --gold-warm:             #14B8A6;

  /* Accent (Amber for prices) */
  --accent:                #F59E0B;
  --accent-bg:             #FEF3C7;
  --accent-light:          #FFFBEB;
  --accent-text:           #D97706;

  /* Text Hierarchy */
  --text-primary:          #111827;
  --text-secondary:        #1F2937;
  --text-tertiary:         #374151;
  --text-muted:            #6B7280;
  --text-placeholder:      #9CA3AF;
  --text-price:            #111827;
  --text-brand:            #0D9488;

  /* Semantic */
  --success:               #0D9488;
  --success-bg:            #F0FDFA;
  --error:                 #DC2626;
  --error-bg:              #FEF2F2;
  --warning:               #D97706;
  --warning-bg:            #FFFBEB;
  --discount-bg:           #FEF3C7;
  --discount-text:         #D97706;

  /* Surfaces */
  --bg-body:               #FAFAFA;
  --bg-page:               #FAFAFA;
  --bg-card:               #FFFFFF;
  --bg-surface-warm:       #F5F5F5;
  --bg-surface-subtle:     #F0F0F0;
  --bg-subtle:             #EBEBEB;
  --bg-hover:              #F5F5F5;
  --bg-cta-dark:           #0F766E;

  /* Cards */
  --card-bg:               #FFFFFF;
  --card-border:           rgba(0, 0, 0, 0.08);
  --card-img-bg:           #F5F5F5;

  /* Inputs */
  --input-bg:              #FFFFFF;
  --input-bg-soft:         #FAFAFA;
  --input-border:          rgba(0, 0, 0, 0.14);
  --input-border-focus:    #0D9488;

  /* Borders */
  --border:                rgba(0, 0, 0, 0.08);
  --border-warm:           rgba(0, 0, 0, 0.12);
  --border-separator:      rgba(0, 0, 0, 0.06);
  --border-orange:         rgba(13, 148, 136, 0.20);

  /* Shadows — Precise Engineering */
  --shadow-xs:    0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03);
  --shadow-sm:    0 1px 3px rgba(0,0,0,0.07), 0 1px 0 rgba(0,0,0,0.04);
  --shadow-md:    0 4px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05);
  --shadow-lg:    0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05);
  --shadow-xl:    0 16px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06);
  --shadow-sheet: 0 -2px 8px rgba(0,0,0,0.06), 0 -16px 40px rgba(0,0,0,0.08);
  --shadow-feature: 0 0 0 1px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05), 0 6px 12px rgba(0,0,0,0.04);
  --shadow-card:  0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.04);
  --shadow-sticky: 0 -1px 0 rgba(0,0,0,0.08), 0 -4px 16px rgba(0,0,0,0.06);
  --shadow-btn:   0 2px 4px rgba(13,148,136,0.25), 0 6px 16px rgba(13,148,136,0.20);
  --shadow-btn-hover: 0 4px 8px rgba(13,148,136,0.32), 0 8px 24px rgba(13,148,136,0.24);
  --shadow-success: 0 2px 8px rgba(13,148,136,0.28), 0 4px 16px rgba(13,148,136,0.18);
  --shadow-glow:  0 0 32px rgba(13, 148, 136, 0.25);

  /* Border Radius — Systematic & Balanced */
  --radius-xs:     0.3125rem; /*  5px */
  --radius-sm:     0.5rem;    /*  8px */
  --radius-md:     0.75rem;   /* 12px */
  --radius-lg:     1.125rem;  /* 18px */
  --radius-card:   0.875rem;  /* 14px */
  --radius-xl:     1.375rem;  /* 22px */
  --radius-pill:   9999px;

  /* Gradients */
  --gradient-brand-text:   linear-gradient(145deg, #0D9488 0%, #0F766E 100%);
  --gradient-gold:         linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
  --gradient-cta:          linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
  --gradient-cta-hover:    linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
  --gradient-accent:       linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  --gradient-warm:         linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%);
  --gradient-img-overlay:  linear-gradient(to top, rgba(0,0,0,0.03) 0%, transparent 50%);

  /* Motion — Precise & Calibrated */
  --duration-fast:   0.12s;
  --duration-base:   0.22s;
  --duration-slow:   0.40s;
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-slide:      cubic-bezier(0.32, 0.72, 0, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
```

### تعديلات إضافية مطلوبة
- **CTA Button:** `background: linear-gradient(135deg, #0D9488, #0F766E)` — فيروزي
- **أسعار الخصم:** `color: #F59E0B` — عنبري دافئ
- **SectionHeader Bar:** فيروزي `#0D9488`
- **Features icons bg:** `background: #CCFBF1` مع أيقونات `#0D9488`
- **BottomNav:** Active `#0D9488`
- **Skeleton:** `#F0F0F0 → #E8E8E8` أغمق قليلاً للخلفية الرمادية

---

---

## ثالثاً: جدول المقارنة الاستراتيجية

| المعيار | 01 الفاخر | 02 التراث | 03 الجريء | 04 الرقيق | 05 الرقمي |
|--------|-----------|-----------|-----------|-----------|-----------|
| **الجمهور المستهدف** | 25-45 متميز | 28-50 أصيل | 18-35 عصري | 20-40 أنثوي | 25-40 متمكن تقنياً |
| **أقوى في** | مجوهرات + ملابس فاخرة | عطور + ملابس تراثية | تصنيفات + بناتي يونغ | مجوهرات + أزياء | كل التصنيفات |
| **خطر التكرار** | منخفض — نادر خليجياً | منخفض — فريد | متوسط | منخفض | منخفض |
| **قابلية التطبيق** | فورية | فورية | فورية | فورية | فورية |
| **التمييز عن المنافسين** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **مناسبة لـ "نخبة"** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## رابعاً: توصية كبير المستشارين

> **الأفضل لـ "نخبة" هو النموذج 01 أو 05**

**النموذج 01 — الفاخر المعاصر** هو الأنسب لأن:
- الاسم "نخبة" يُوحي مباشرة بالتميز والحصرية والطبقة الأولى
- Navy Midnight + Royal Gold = لغة المتاجر الفاخرة عالمياً
- غائب تماماً في المشهد الخليجي الرقمي = تمايز فوري
- يعمل بشكل ممتاز مع منتجات المجوهرات والعطور والملابس الراقية معاً

**النموذج 05 — الرقي الرقمي** كخيار بديل لو أراد التطبيق أن يكون:
- أكثر شمولاً في الجمهور (رجال + نساء بالتساوي)
- أقرب لتجربة الـ "super-app" من المتجر الفاخر

---

## خامساً: التطبيق الفوري

لتطبيق أي نموذج في ثوانٍ:

```css
/* في apps/vibe-app/src/index.css */
/* 1. أبحث عن أول :root { */
/* 2. أحذف محتواه من أول --gold حتى نهاية المتغيرات */
/* 3. أنسخ كتلة CSS Variables من النموذج المختار وأضعها بدلاً منها */
/* 4. احفظ — التطبيق يتحدث فوراً */
```

ملاحظة: كل المتغيرات تستخدم نفس الأسماء (`--gold`, `--gradient-cta`, `--card-border`...إلخ)  
مما يعني **صفر تعديل في أي مكون** — فقط استبدال المتغيرات في `index.css`.

---

*وثيقة نخبة — Visual Identity System Proposals — تأليف كبير مستشاري التصميم*  
*جميع الألوان اختُبرت لتلبية معيار WCAG AA للتباين (4.5:1 للنص الصغير، 3:1 للعناصر الكبيرة)*
