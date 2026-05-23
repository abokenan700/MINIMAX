import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/* proxy عبر الـ backend — يتجنب مشاكل CORS وإعادة التوجيه */
const img = (id, w = 600, h = 750) =>
  `/api/v1/img/${id}?w=${w}&h=${h}`;

const CATEGORIES = [
  { slug: "new",      name: "جديدنا",  image_url: img(10,  300, 300) },
  { slug: "clothes",  name: "ملابس",   image_url: img(26,  300, 300) },
  { slug: "shoes",    name: "أحذية",   image_url: img(28,  300, 300) },
  { slug: "perfumes", name: "عطور",    image_url: img(30,  300, 300) },
  { slug: "jewelry",  name: "مجوهرات", image_url: img(37,  300, 300) },
  { slug: "bags",     name: "شنط",     image_url: img(39,  300, 300) },
  { slug: "watches",  name: "ساعات",   image_url: img(48,  300, 300) },
  { slug: "offers",   name: "عروض",    image_url: img(57,  300, 300) },
];

const BRANDS = [
  { id: "chanel",    label: "CHANEL" },
  { id: "dior",      label: "DIOR" },
  { id: "gucci",     label: "GUCCI" },
  { id: "lv",        label: "LOUIS VUITTON" },
  { id: "versace",   label: "VERSACE" },
  { id: "burberry",  label: "BURBERRY" },
  { id: "prada",     label: "PRADA" },
  { id: "valentino", label: "VALENTINO" },
  { id: "hermes",    label: "HERMÈS" },
  { id: "rolex",     label: "ROLEX" },
];

const PRODUCTS = [
  /* ══ عطور ══════════════════════════════════════════════════════════ */
  {
    name: "عطر شانيل No.5", brand: "CHANEL", category: "عطور",
    price: 385, original_price: 550, discount: 30,
    image: img(60), images: [img(60), img(64), img(65)],
    description: "عطر فاخر من بيت شانيل بمزيج من الزهور الخلابة والمسك الراقي. استلهام دائم للأناقة والرقي.",
    is_new: false, rating: 4.9, sales: 1420, stock: 18,
    colors: ["#F5F0E8","#E8D5B7","#C0A882"], sizes: [],
  },
  {
    name: "عطر ديور ساباج", brand: "DIOR", category: "عطور",
    price: 420, original_price: 420, discount: 0,
    image: img(67), images: [img(67), img(74), img(76)],
    description: "عطر رجالي بمزيج البرغموت الطازج والعود الفاخر. انعكاس للبراري الواسعة والحرية المطلقة.",
    is_new: true, rating: 4.8, sales: 980, stock: 25,
    colors: ["#1A1410","#4A443B"], sizes: [],
  },
  {
    name: "عطر غوتشي بلوم", brand: "GUCCI", category: "عطور",
    price: 310, original_price: 400, discount: 22,
    image: img(83), images: [img(83), img(91), img(96)],
    description: "عطر نسائي بمزيج من الياسمين والزنبق وخشب الصندل. تجسيد للأنوثة في أبهى صورها.",
    is_new: false, rating: 4.7, sales: 760, stock: 30,
    colors: ["#FEF2EE","#F3B29D","#E8674A"], sizes: [],
  },

  /* ══ ملابس ══════════════════════════════════════════════════════════ */
  {
    name: "عباءة فاخرة مطرزة", brand: "VALENTINO", category: "ملابس",
    price: 1250, original_price: 1800, discount: 30,
    image: img(103), images: [img(103), img(106), img(119)],
    description: "عباءة حرير فاخرة بتطريز يدوي دقيق على الأكمام والأطراف. قماش إيطالي أصيل من أجود الأنواع.",
    is_new: true, rating: 4.9, sales: 340, stock: 8,
    colors: ["#1A1410","#2E2A24","#4A443B"], sizes: ["S","M","L","XL"],
  },
  {
    name: "فستان سهرة راقٍ", brand: "VALENTINO", category: "ملابس",
    price: 2100, original_price: 2100, discount: 0,
    image: img(120), images: [img(120), img(130), img(137)],
    description: "فستان سهرة من الحرير الإيطالي بتصميم راقٍ ولمسات ذهبية. مثالي للمناسبات الفاخرة.",
    is_new: true, rating: 4.8, sales: 120, stock: 5,
    colors: ["#DC2626","#1A1410"], sizes: ["XS","S","M"],
  },
  {
    name: "بلوفر كشمير برباري", brand: "BURBERRY", category: "ملابس",
    price: 680, original_price: 850, discount: 20,
    image: img(146), images: [img(146), img(152), img(160)],
    description: "بلوفر من الكشمير الاسكتلندي النقي. دفء استثنائي بلمسة فاخرة كلاسيكية.",
    is_new: false, rating: 4.6, sales: 450, stock: 15,
    colors: ["#C0A882","#F7F3EE","#1A1410"], sizes: ["S","M","L","XL"],
  },
  {
    name: "جاكيت تويد كلاسيكي", brand: "DIOR", category: "ملابس",
    price: 3200, original_price: 3200, discount: 0,
    image: img(163), images: [img(163), img(167), img(169)],
    description: "جاكيت من قماش التويد الفرنسي بقصة مستوحاة من أرشيف كريستيان ديور الكلاسيكي.",
    is_new: false, rating: 4.9, sales: 85, stock: 3,
    colors: ["#C0BCB1","#C49E5C"], sizes: ["S","M","L"],
  },

  /* ══ أحذية ══════════════════════════════════════════════════════════ */
  {
    name: "حذاء كعب عالٍ فاخر", brand: "VALENTINO", category: "أحذية",
    price: 1450, original_price: 1450, discount: 0,
    image: img(174), images: [img(174), img(175), img(180)],
    description: "حذاء كعب عالٍ بالنعل الأيقوني. جلد عجل إيطالي ناعم وكعب 10 سم. أناقة لا تُضاهى.",
    is_new: false, rating: 4.9, sales: 220, stock: 10,
    colors: ["#1A1410","#F7F3EE","#DC2626"], sizes: ["36","37","38","39","40"],
  },
  {
    name: "لوفر جلدي غوتشي", brand: "GUCCI", category: "أحذية",
    price: 950, original_price: 1200, discount: 20,
    image: img(181), images: [img(181), img(182), img(10)],
    description: "لوفر جلدي بإبزيم الحصان الأيقوني. جلد عجل إيطالي مصقول يدوياً بحرفية عالية.",
    is_new: false, rating: 4.8, sales: 380, stock: 12,
    colors: ["#1A1410","#B8763E","#C0A882"], sizes: ["40","41","42","43","44"],
  },
  {
    name: "حذاء رياضي برادا", brand: "PRADA", category: "أحذية",
    price: 780, original_price: 1050, discount: 25,
    image: img(20), images: [img(20), img(26), img(28)],
    description: "حذاء رياضي فاخر بجلد سافيانو المميز. راحة استثنائية مع أناقة لا تُضاهى.",
    is_new: true, rating: 4.7, sales: 510, stock: 20,
    colors: ["#F7F3EE","#1A1410"], sizes: ["38","39","40","41","42","43"],
  },

  /* ══ شنط ════════════════════════════════════════════════════════════ */
  {
    name: "حقيبة بيركين هيرميس", brand: "HERMÈS", category: "شنط",
    price: 28000, original_price: 28000, discount: 0,
    image: img(30), images: [img(30), img(37), img(39)],
    description: "حقيبة بيركين الأيقونية من هيرميس. جلد توغو الفرنسي مع إبزيم ذهبي 18 قيراط.",
    is_new: false, rating: 5.0, sales: 12, stock: 2,
    colors: ["#B8763E","#1A1410","#DC2626"], sizes: ["25cm","30cm","35cm"],
  },
  {
    name: "حقيبة شانيل كلاسيك فلاب", brand: "CHANEL", category: "شنط",
    price: 14500, original_price: 14500, discount: 0,
    image: img(48), images: [img(48), img(57), img(60)],
    description: "الحقيبة الأيقونية من كوكو شانيل. جلد حمل مبطن مع إبزيم CC ذهبي خالد الذكر.",
    is_new: false, rating: 4.9, sales: 45, stock: 4,
    colors: ["#1A1410","#F7F3EE","#B8763E"], sizes: ["Mini","Small","Medium"],
  },
  {
    name: "حقيبة لويس فيتون نيفرفول", brand: "LOUIS VUITTON", category: "شنط",
    price: 5200, original_price: 6000, discount: 13,
    image: img(64), images: [img(64), img(65), img(67)],
    description: "حقيبة نيفرفول الأيقونية بنقشة المونوغرام الشهيرة. واسعة وعملية مع لمسة فاخرة.",
    is_new: false, rating: 4.8, sales: 620, stock: 9,
    colors: ["#B8763E","#C0A882"], sizes: ["PM","MM","GM"],
  },

  /* ══ مجوهرات ════════════════════════════════════════════════════════ */
  {
    name: "خاتم ذهبي كلاسيكي", brand: "VERSACE", category: "مجوهرات",
    price: 3800, original_price: 3800, discount: 0,
    image: img(74), images: [img(74), img(76), img(83)],
    description: "خاتم من الذهب الأبيض 18 قيراط. رمز للأناقة الخالدة يُزخرف بتفاصيل بارزة.",
    is_new: false, rating: 4.9, sales: 180, stock: 6,
    colors: ["#C49E5C","#C0BCB1"], sizes: ["48","50","52","54","56"],
  },
  {
    name: "سوار ذهبي مرصع", brand: "VERSACE", category: "مجوهرات",
    price: 2600, original_price: 3200, discount: 18,
    image: img(91), images: [img(91), img(96), img(103)],
    description: "سوار مرصع بالألماس والعقيق. ذهب وردي 18 قيراط بتصميم ملتوٍّ مستوحى من الطبيعة.",
    is_new: true, rating: 4.8, sales: 95, stock: 7,
    colors: ["#C49E5C","#DC2626"], sizes: [],
  },

  /* ══ ساعات ══════════════════════════════════════════════════════════ */
  {
    name: "ساعة رولكس ديتونا", brand: "ROLEX", category: "ساعات",
    price: 85000, original_price: 85000, discount: 0,
    image: img(106), images: [img(106), img(119), img(120)],
    description: "ساعة رولكس ديتونا بقرص أوروبوكور الأيقوني. حركة كرونوغراف تلقائية بدقة استثنائية.",
    is_new: false, rating: 5.0, sales: 28, stock: 1,
    colors: ["#C49E5C","#C0BCB1","#1A1410"], sizes: ["40mm"],
  },
  {
    name: "ساعة فاخرة سويسرية", brand: "HERMÈS", category: "ساعات",
    price: 45000, original_price: 52000, discount: 13,
    image: img(130), images: [img(130), img(137), img(146)],
    description: "ساعة سويسرية بحركة ميكانيكية عالية الدقة. علبة من الفولاذ والذهب عيار 18 قيراط.",
    is_new: false, rating: 4.9, sales: 18, stock: 3,
    colors: ["#1A1410","#C49E5C"], sizes: ["40mm","42mm"],
  },

  /* ══ إكسسوارات ══════════════════════════════════════════════════════ */
  {
    name: "وشاح حرير فاخر", brand: "HERMÈS", category: "إكسسوارات",
    price: 1800, original_price: 2200, discount: 18,
    image: img(152), images: [img(152), img(160), img(163)],
    description: "وشاح حرير 90×90 بطباعة يدوية فريدة. حرير طبيعي من أجود الأنواع مع ألوان نابضة بالحياة.",
    is_new: true, rating: 4.7, sales: 210, stock: 14,
    colors: ["#E8674A","#C49E5C","#1D4ED8"], sizes: [],
  },
  {
    name: "نظارة شمسية فاخرة", brand: "DIOR", category: "إكسسوارات",
    price: 650, original_price: 850, discount: 23,
    image: img(167), images: [img(167), img(169), img(174)],
    description: "نظارة شمسية بإطار أسيتات مع شعار مميز. عدسات UV400 ومعالجة مضادة للانعكاس.",
    is_new: true, rating: 4.6, sales: 430, stock: 22,
    colors: ["#1A1410","#B8763E"], sizes: [],
  },
  {
    name: "حزام جلدي فيرساتشي", brand: "VERSACE", category: "إكسسوارات",
    price: 420, original_price: 550, discount: 23,
    image: img(175), images: [img(175), img(180), img(181)],
    description: "حزام جلدي فاخر بإبزيم ذهبي أيقوني. جلد عجل إيطالي ناعم بأبعاد 3.5سم.",
    is_new: false, rating: 4.5, sales: 680, stock: 35,
    colors: ["#1A1410","#B8763E"], sizes: ["80cm","85cm","90cm","95cm","100cm"],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("🌱 بدء عملية الـ Seed...\n");

    await client.query("BEGIN");

    console.log("🧹 تنظيف الجداول...");
    await client.query("TRUNCATE products RESTART IDENTITY");
    await client.query("TRUNCATE categories RESTART IDENTITY");
    await client.query("TRUNCATE brands RESTART IDENTITY");

    console.log("📂 التصنيفات...");
    for (const c of CATEGORIES) {
      await client.query(
        "INSERT INTO categories (slug, name, image_url) VALUES ($1, $2, $3)",
        [c.slug, c.name, c.image_url]
      );
    }
    console.log(`   ✅ ${CATEGORIES.length} تصنيف\n`);

    console.log("🏷️  الماركات...");
    for (const b of BRANDS) {
      await client.query(
        "INSERT INTO brands (id, label) VALUES ($1, $2)",
        [b.id, b.label]
      );
    }
    console.log(`   ✅ ${BRANDS.length} ماركة\n`);

    console.log("📦 المنتجات...");
    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products
          (name, brand, category, price, original_price, discount, image, images,
           description, is_new, rating, sales, stock, colors, sizes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [
          p.name, p.brand, p.category, p.price, p.original_price, p.discount,
          p.image,
          `{${p.images.map(s => `"${s}"`).join(",")}}`,
          p.description, p.is_new, p.rating, p.sales, p.stock,
          `{${p.colors.map(s => `"${s}"`).join(",")}}`,
          `{${p.sizes.map(s => `"${s}"`).join(",")}}`,
        ]
      );
    }
    console.log(`   ✅ ${PRODUCTS.length} منتج\n`);

    await client.query("COMMIT");
    console.log("✨ اكتمل الـ Seed بنجاح!");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("❌ خطأ:", err.message);
  process.exit(1);
});
