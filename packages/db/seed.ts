import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { productsTable, categoriesTable, brandsTable } from "./src/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

/* ─── Picsum: موثوق 100%، لا يحتاج مصادقة ─────────────────────────
   https://picsum.photos/seed/<keyword>/<w>/<h>
   نفس الكلمة = نفس الصورة دائماً (deterministic)
──────────────────────────────────────────────────────────────────── */
const img = (seed: string, w = 600, h = 750) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ─── التصنيفات ──────────────────────────────────────────────────── */
const CATEGORIES = [
  { slug: "new",      name: "جديدنا",    image_url: img("fashion-new", 300, 300) },
  { slug: "clothes",  name: "ملابس",     image_url: img("clothes-lux", 300, 300) },
  { slug: "shoes",    name: "أحذية",     image_url: img("luxury-shoes", 300, 300) },
  { slug: "perfumes", name: "عطور",      image_url: img("perfume-bottle", 300, 300) },
  { slug: "jewelry",  name: "مجوهرات",   image_url: img("jewelry-gold", 300, 300) },
  { slug: "bags",     name: "شنط",       image_url: img("handbag-luxury", 300, 300) },
  { slug: "watches",  name: "ساعات",     image_url: img("luxury-watch", 300, 300) },
  { slug: "offers",   name: "عروض",      image_url: img("sale-fashion", 300, 300) },
];

/* ─── الماركات ───────────────────────────────────────────────────── */
const BRANDS = [
  { id: "chanel",      label: "CHANEL",        icon: null },
  { id: "dior",        label: "DIOR",          icon: null },
  { id: "gucci",       label: "GUCCI",         icon: null },
  { id: "lv",          label: "LOUIS VUITTON", icon: null },
  { id: "versace",     label: "VERSACE",       icon: null },
  { id: "burberry",    label: "BURBERRY",      icon: null },
  { id: "prada",       label: "PRADA",         icon: null },
  { id: "valentino",   label: "VALENTINO",     icon: null },
  { id: "hermes",      label: "HERMÈS",        icon: null },
  { id: "rolex",       label: "ROLEX",         icon: null },
];

/* ─── المنتجات ───────────────────────────────────────────────────── */
const PRODUCTS = [
  /* ══ عطور ══════════════════════════════════════════════════════ */
  {
    name: "عطر شانيل No.5",
    brand: "CHANEL",
    price: 385, original_price: 550, discount: 30,
    image: img("chanel-no5"),
    images: [img("chanel-no5"), img("chanel-no5-2", 600, 750), img("perfume-shelf", 600, 750)],
    description: "عطر فاخر من بيت شانيل بمزيج من الزهور الخلابة والمسك الراقي. استلهام دائم للأناقة.",
    is_new: false, rating: 4.9, sales: 1420, stock: 18,
    colors: ["#F5F0E8", "#E8D5B7", "#C0A882"], sizes: [],
  },
  {
    name: "عطر ديور ساباج",
    brand: "DIOR",
    price: 420, original_price: 420, discount: 0,
    image: img("dior-sauvage"),
    images: [img("dior-sauvage"), img("dior-bottle", 600, 750), img("cologne-luxury", 600, 750)],
    description: "عطر رجالي بمزيج البرغموت الطازج والعود الفاخر. انعكاس للبراري الواسعة والحرية.",
    is_new: true, rating: 4.8, sales: 980, stock: 25,
    colors: ["#1A1410", "#4A443B"], sizes: [],
  },
  {
    name: "عطر غوتشي بلوم",
    brand: "GUCCI",
    price: 310, original_price: 400, discount: 22,
    image: img("gucci-bloom"),
    images: [img("gucci-bloom"), img("floral-perfume", 600, 750), img("rose-fragrance", 600, 750)],
    description: "عطر نسائي بمزيج من الياسمين والزنبق وخشب الصندل الراقي.",
    is_new: false, rating: 4.7, sales: 760, stock: 30,
    colors: ["#FEF2EE", "#F3B29D", "#E8674A"], sizes: [],
  },

  /* ══ ملابس ══════════════════════════════════════════════════════ */
  {
    name: "عباءة فاخرة مطرزة",
    brand: "VALENTINO",
    price: 1250, original_price: 1800, discount: 30,
    image: img("abaya-luxury"),
    images: [img("abaya-luxury"), img("abaya-detail", 600, 750), img("abaya-embroidery", 600, 750)],
    description: "عباءة حرير فاخرة بتطريز يدوي دقيق على الأكمام والأطراف. قماش إيطالي أصيل.",
    is_new: true, rating: 4.9, sales: 340, stock: 8,
    colors: ["#1A1410", "#2E2A24", "#4A443B"], sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "فستان سهرة بيرينا",
    brand: "VALENTINO",
    price: 2100, original_price: 2100, discount: 0,
    image: img("evening-gown"),
    images: [img("evening-gown"), img("gown-detail", 600, 750), img("red-dress", 600, 750)],
    description: "فستان سهرة من الحرير الإيطالي بتصميم راقٍ ولمسات ذهبية. مثالي للمناسبات الفاخرة.",
    is_new: true, rating: 4.8, sales: 120, stock: 5,
    colors: ["#DC2626", "#1A1410"], sizes: ["XS", "S", "M"],
  },
  {
    name: "بلوفر كشمير برباري",
    brand: "BURBERRY",
    price: 680, original_price: 850, discount: 20,
    image: img("burberry-sweater"),
    images: [img("burberry-sweater"), img("cashmere-close", 600, 750), img("knitwear-luxury", 600, 750)],
    description: "بلوفر من الكشمير الاسكتلندي النقي. دفء استثنائي بلمسة فاخرة كلاسيكية.",
    is_new: false, rating: 4.6, sales: 450, stock: 15,
    colors: ["#C0A882", "#F7F3EE", "#1A1410"], sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "جاكيت ديور تويد",
    brand: "DIOR",
    price: 3200, original_price: 3200, discount: 0,
    image: img("dior-jacket"),
    images: [img("dior-jacket"), img("tweed-detail", 600, 750), img("fashion-jacket", 600, 750)],
    description: "جاكيت من قماش التويد الفرنسي بقصة مستوحاة من أرشيف كريستيان ديور الكلاسيكي.",
    is_new: false, rating: 4.9, sales: 85, stock: 3,
    colors: ["#C0BCB1", "#C49E5C"], sizes: ["S", "M", "L"],
  },

  /* ══ أحذية ══════════════════════════════════════════════════════ */
  {
    name: "حذاء لوبوتان الكلاسيكي",
    brand: "VALENTINO",
    price: 1450, original_price: 1450, discount: 0,
    image: img("louboutin-heel"),
    images: [img("louboutin-heel"), img("red-sole-shoes", 600, 750), img("luxury-heels", 600, 750)],
    description: "حذاء كعب عالٍ بالنعل الأحمر الأيقوني. جلد عجل إيطالي ناعم وكعب 10 سم.",
    is_new: false, rating: 4.9, sales: 220, stock: 10,
    colors: ["#1A1410", "#F7F3EE", "#DC2626"], sizes: ["36", "37", "38", "39", "40"],
  },
  {
    name: "حذاء رجالي غوتشي لوفر",
    brand: "GUCCI",
    price: 950, original_price: 1200, discount: 20,
    image: img("gucci-loafer"),
    images: [img("gucci-loafer"), img("loafer-detail", 600, 750), img("mens-shoes-lux", 600, 750)],
    description: "لوفر جلدي بإبزيم الحصان الأيقوني من غوتشي. جلد عجل إيطالي مصقول يدوياً.",
    is_new: false, rating: 4.8, sales: 380, stock: 12,
    colors: ["#1A1410", "#B8763E", "#C0A882"], sizes: ["40", "41", "42", "43", "44"],
  },
  {
    name: "حذاء برادا سافيانو",
    brand: "PRADA",
    price: 780, original_price: 1050, discount: 25,
    image: img("prada-sneaker"),
    images: [img("prada-sneaker"), img("sneaker-luxury", 600, 750), img("prada-detail", 600, 750)],
    description: "حذاء رياضي فاخر بجلد سافيانو مميز. راحة استثنائية مع أناقة لا تُضاهى.",
    is_new: true, rating: 4.7, sales: 510, stock: 20,
    colors: ["#F7F3EE", "#1A1410"], sizes: ["38", "39", "40", "41", "42", "43"],
  },

  /* ══ شنط ══════════════════════════════════════════════════════ */
  {
    name: "حقيبة بيركين هيرميس",
    brand: "HERMES",
    price: 28000, original_price: 28000, discount: 0,
    image: img("hermes-birkin"),
    images: [img("hermes-birkin"), img("birkin-detail", 600, 750), img("luxury-bag-gold", 600, 750)],
    description: "حقيبة بيركين الأيقونية من هيرميس. جلد توغو الفرنسي مع إبزيم ذهبي 18 قيراط.",
    is_new: false, rating: 5.0, sales: 12, stock: 2,
    colors: ["#B8763E", "#1A1410", "#DC2626"], sizes: ["25cm", "30cm", "35cm"],
  },
  {
    name: "حقيبة شانيل كلاسيك فلاب",
    brand: "CHANEL",
    price: 14500, original_price: 14500, discount: 0,
    image: img("chanel-flap"),
    images: [img("chanel-flap"), img("chanel-bag-detail", 600, 750), img("quilted-bag", 600, 750)],
    description: "الحقيبة الأيقونية من كوكو شانيل. جلد حمل مبطن مع إبزيم CC ذهبي خالد.",
    is_new: false, rating: 4.9, sales: 45, stock: 4,
    colors: ["#1A1410", "#F7F3EE", "#B8763E"], sizes: ["Mini", "Small", "Medium"],
  },
  {
    name: "حقيبة لويس فيتون نيفرفول",
    brand: "LOUIS VUITTON",
    price: 5200, original_price: 6000, discount: 13,
    image: img("lv-neverfull"),
    images: [img("lv-neverfull"), img("lv-monogram", 600, 750), img("tote-bag-luxury", 600, 750)],
    description: "حقيبة نيفرفول الأيقونية بنقشة المونوغرام الشهيرة. واسعة وعملية مع لمسة فاخرة.",
    is_new: false, rating: 4.8, sales: 620, stock: 9,
    colors: ["#B8763E", "#C0A882"], sizes: ["PM", "MM", "GM"],
  },

  /* ══ مجوهرات ══════════════════════════════════════════════════════ */
  {
    name: "خاتم كارتير لوف",
    brand: "VALENTINO",
    price: 3800, original_price: 3800, discount: 0,
    image: img("cartier-love-ring"),
    images: [img("cartier-love-ring"), img("gold-ring-detail", 600, 750), img("jewelry-hand", 600, 750)],
    description: "خاتم لوف الأيقوني من الذهب الأبيض 18 قيراط. رمز للحب الخالد يُزخرف بمسامير بارزة.",
    is_new: false, rating: 4.9, sales: 180, stock: 6,
    colors: ["#C49E5C", "#C0BCB1"], sizes: ["48", "50", "52", "54", "56"],
  },
  {
    name: "سوار بولغاري سيرفيني",
    brand: "VERSACE",
    price: 2600, original_price: 3200, discount: 18,
    image: img("bvlgari-bracelet"),
    images: [img("bvlgari-bracelet"), img("gold-bracelet", 600, 750), img("serpenti-detail", 600, 750)],
    description: "سوار سيرفيني المستوحى من الأفعى، مرصع بالألماس والعقيق. ذهب وردي 18 قيراط.",
    is_new: true, rating: 4.8, sales: 95, stock: 7,
    colors: ["#C49E5C", "#DC2626"], sizes: [],
  },

  /* ══ ساعات ══════════════════════════════════════════════════════ */
  {
    name: "ساعة رولكس ديتونا",
    brand: "ROLEX",
    price: 85000, original_price: 85000, discount: 0,
    image: img("rolex-daytona"),
    images: [img("rolex-daytona"), img("watch-chronograph", 600, 750), img("luxury-watch-detail", 600, 750)],
    description: "ساعة رولكس ديتونا بقرص أوروبوكور الأيقوني. حركة كرونوغراف تلقائية بدقة استثنائية.",
    is_new: false, rating: 5.0, sales: 28, stock: 1,
    colors: ["#C49E5C", "#C0BCB1", "#1A1410"], sizes: ["40mm"],
  },
  {
    name: "ساعة باتيك فيليب أكواناوت",
    brand: "HERMES",
    price: 120000, original_price: 120000, discount: 0,
    image: img("patek-aquanaut"),
    images: [img("patek-aquanaut"), img("swiss-watch", 600, 750), img("watch-movement", 600, 750)],
    description: "ساعة باتيك فيليب أكواناوت بحركة سويسرية عالية الدقة. مقاومة للماء حتى 120م.",
    is_new: false, rating: 5.0, sales: 8, stock: 1,
    colors: ["#1A1410", "#C49E5C"], sizes: ["40mm"],
  },

  /* ══ جديد ══════════════════════════════════════════════════════ */
  {
    name: "وشاح هيرميس كارييه",
    brand: "HERMES",
    price: 1800, original_price: 2200, discount: 18,
    image: img("hermes-scarf"),
    images: [img("hermes-scarf"), img("silk-scarf", 600, 750), img("fashion-scarf", 600, 750)],
    description: "وشاح حرير 90×90 من هيرميس بطباعة يدوية فريدة. حرير ليوني فرنسي من 250 ألف خيط.",
    is_new: true, rating: 4.7, sales: 210, stock: 14,
    colors: ["#E8674A", "#C49E5C", "#1D4ED8"], sizes: [],
  },
  {
    name: "نظارة شمسية ديور أوبليك",
    brand: "DIOR",
    price: 650, original_price: 850, discount: 23,
    image: img("dior-sunglasses"),
    images: [img("dior-sunglasses"), img("sunglasses-luxury", 600, 750), img("fashion-eyewear", 600, 750)],
    description: "نظارة شمسية بإطار أسيتات مع شعار أوبليك المميز. عدسات UV400 ومعالجة مضادة للانعكاس.",
    is_new: true, rating: 4.6, sales: 430, stock: 22,
    colors: ["#1A1410", "#B8763E"], sizes: [],
  },
  {
    name: "حزام فيرساتشي ميدوسا",
    brand: "VERSACE",
    price: 420, original_price: 550, discount: 23,
    image: img("versace-belt"),
    images: [img("versace-belt"), img("medusa-buckle", 600, 750), img("leather-belt", 600, 750)],
    description: "حزام جلدي فاخر بإبزيم ميدوسا الذهبي الأيقوني. جلد عجل إيطالي ناعم بأبعاد 3.5سم.",
    is_new: false, rating: 4.5, sales: 680, stock: 35,
    colors: ["#1A1410", "#B8763E"], sizes: ["80cm", "85cm", "90cm", "95cm", "100cm"],
  },
];

async function seed() {
  console.log("🌱 بدء عملية الـ Seed...\n");

  /* ── التصنيفات ─────────────────────────────────────────────────── */
  console.log("📂 حذف التصنيفات القديمة...");
  await db.delete(categoriesTable);
  console.log("📂 إدراج التصنيفات الجديدة...");
  await db.insert(categoriesTable).values(CATEGORIES);
  console.log(`   ✅ ${CATEGORIES.length} تصنيف\n`);

  /* ── الماركات ──────────────────────────────────────────────────── */
  console.log("🏷️  حذف الماركات القديمة...");
  await db.delete(brandsTable);
  console.log("🏷️  إدراج الماركات الجديدة...");
  await db.insert(brandsTable).values(BRANDS);
  console.log(`   ✅ ${BRANDS.length} ماركة\n`);

  /* ── المنتجات ──────────────────────────────────────────────────── */
  console.log("📦 حذف المنتجات القديمة...");
  await db.delete(productsTable);
  console.log("📦 إدراج المنتجات الجديدة...");
  await db.insert(productsTable).values(PRODUCTS);
  console.log(`   ✅ ${PRODUCTS.length} منتج\n`);

  console.log("✨ اكتمل الـ Seed بنجاح!");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ خطأ في الـ Seed:", err);
  process.exit(1);
});
