import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const mockProducts = [
  { id: 1,  category: "عطور",    name: "عطر شانيل No.5",           brand: "CHANEL",   price: 385,  original_price: 550,  discount: 30, image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400",  images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?w=400","https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400","https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400"], is_new: false, rating: 4.9, sales: 1420, stock: 18, colors: ["#F5F0E8","#E8D5B7","#C0A882"], sizes: [], description: "عطر فاخر من بيت شانيل بمزيج من الزهور الخلابة والمسك الراقي. استلهام دائم للأناقة والرقي الذي لا يُضاهى." },
  { id: 2,  category: "حقائب",   name: "حقيبة ديور سادل",           brand: "DIOR",     price: 890,  original_price: 1200, discount: 25, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",  images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400","https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"], is_new: true,  rating: 4.8, sales: 870,  stock: 4,  colors: ["#8B7355","#2E2C2A","#C0A882"], sizes: [], description: "حقيبة سادل الأيقونية من دار ديور، مصنوعة يدوياً من الجلد الإيطالي الفاخر. رمز خالد للأناقة الباريسية." },
  { id: 3,  category: "مجوهرات", name: "نظارة قوتشي شمسية",         brand: "GUCCI",    price: 295,  original_price: 420,  discount: 30, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",  images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400","https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400"], is_new: false, rating: 4.7, sales: 2100, stock: 22, colors: ["#2E2C2A","#8B7355"], sizes: ["One Size"], description: "نظارة شمسية من كولكشن قوتشي الحصري، بإطار مميز وعدسات UV400 للحماية الكاملة." },
  { id: 4,  category: "مجوهرات", name: "ساعة فيرساتشي",             brand: "VERSACE",  price: 1250, original_price: 1800, discount: 30, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",  images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400","https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=400"], is_new: false, rating: 4.8, sales: 540,  stock: 7,  colors: ["#C0A882","#2E2C2A"], sizes: ["One Size"], description: "ساعة فيرساتشي الذهبية — رمز الفخامة الإيطالية. حركة سويسرية دقيقة بتصميم جريء لا يُنسى." },
  { id: 5,  category: "حقائب",   name: "محفظة لويس فيتون",          brand: "LV",       price: 650,  original_price: 850,  discount: 23, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",  images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400","https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400"], is_new: false, rating: 4.9, sales: 3200, stock: 11, colors: ["#8B7355","#C0A882"], sizes: [], description: "محفظة لويس فيتون الكلاسيكية بالمونوغرام الشهير، من الجلد الكانفاس المطلي. قطعة خالدة لكل أناقة." },
  { id: 6,  category: "أحذية",   name: "حذاء قوتشي جلد",           brand: "GUCCI",    price: 780,  original_price: 1050, discount: 25, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",  images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400","https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"], is_new: true,  rating: 4.7, sales: 680,  stock: 3,  colors: ["#2E2C2A","#8B7355","#F5F0E8"], sizes: ["38","39","40","41","42","43"], description: "حذاء قوتشي الجلدي الأنيق بنعل مريح وتصميم كلاسيكي. مصنوع من أجود أنواع الجلد الإيطالي." },
  { id: 7,  category: "ملابس",   name: "وشاح باربيري كلاسيك",       brand: "BURBERRY", price: 420,  original_price: 600,  discount: 30, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400",  images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400"], is_new: false, rating: 4.6, sales: 1850, stock: 29, colors: ["#C0A882","#8B7355","#2E2C2A"], sizes: ["One Size"], description: "الوشاح الأيقوني من باربيري بنقشة الكاروهات الشهيرة. مصنوع من الكشمير الناعم الفاخر." },
  { id: 8,  category: "عطور",    name: "عطر ديور سوفاج",            brand: "DIOR",     price: 320,  original_price: 440,  discount: 27, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",  images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400","https://images.unsplash.com/photo-1541643600914-78b084683702?w=400"], is_new: true,  rating: 4.9, sales: 4100, stock: 0,  colors: ["#2E2C2A","#C0A882"], sizes: [], description: "سوفاج — التعبير الجامح والأصيل عن الرجولة. مزيج مميز من الفلفل الأسود والعنبر والخشب الصوفي." },
  { id: 9,  category: "حقائب",   name: "حقيبة شانيل كلاسيك",        brand: "CHANEL",   price: 2100, original_price: 2800, discount: 25, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",  images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"], is_new: false, rating: 5.0, sales: 290,  stock: 2,  colors: ["#2E2C2A","#F5F0E8","#C0A882"], sizes: [], description: "الحقيبة 2.55 من شانيل — أيقونة الموضة الفرنسية منذ عام 1955. تصميم تقليلي لا يتقادم بالجلد المبطن." },
  { id: 10, category: "مجوهرات", name: "بيلت لويس فيتون",           brand: "LV",       price: 380,  original_price: 520,  discount: 26, image: "https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400",  images: ["https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=400"], is_new: false, rating: 4.8, sales: 960,  stock: 16, colors: ["#8B7355","#2E2C2A"], sizes: ["85cm","90cm","95cm","100cm"], description: "حزام لويس فيتون الكلاسيكي بإبزيم مذهّب وجلد Monogram أصلي. لمسة فاخرة لكل إطلالة رجالية." },
  { id: 11, category: "مجوهرات", name: "نظارة فيرساتشي ذهبية",      brand: "VERSACE",  price: 340,  original_price: 480,  discount: 29, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",  images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400","https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"], is_new: true,  rating: 4.6, sales: 720,  stock: 12, colors: ["#C0A882","#2E2C2A"], sizes: ["One Size"], description: "نظارة فيرساتشي بإطار ذهبي جريء وشعار ميدوسا البارز. جرأة وأناقة في آن واحد." },
  { id: 12, category: "أحذية",   name: "حذاء ديور هيلز",            brand: "DIOR",     price: 960,  original_price: 1300, discount: 26, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",  images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], is_new: true,  rating: 4.7, sales: 430,  stock: 5,  colors: ["#F5F0E8","#C0A882","#2E2C2A"], sizes: ["36","37","38","39","40","41"], description: "حذاء هيلز ديور بكعب 9 سم وتصميم كلاسيكي متطور. جلد أصلي ناعم مع نعل مريح للارتداء اليومي." },
  { id: 13, category: "ملابس",   name: "قميص باربيري مربعات",        brand: "BURBERRY", price: 480,  original_price: 680,  discount: 29, image: "https://images.unsplash.com/photo-1602810319428-019690571b5b?w=400",  images: ["https://images.unsplash.com/photo-1602810319428-019690571b5b?w=400","https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400"], is_new: false, rating: 4.5, sales: 1120, stock: 20, colors: ["#8B7355","#C0A882"], sizes: ["XS","S","M","L","XL","XXL"], description: "القميص الكلاسيكي من باربيري بنقشة الكاروهات الأيقونية. قطن مصري عالي الجودة بقصة عصرية مريحة." },
  { id: 14, category: "مجوهرات", name: "خاتم قوتشي ذهبي",           brand: "GUCCI",    price: 185,  original_price: 260,  discount: 28, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",  images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"], is_new: false, rating: 4.6, sales: 2400, stock: 33, colors: ["#C0A882","#F5F0E8"], sizes: ["6","7","8","9","10"], description: "خاتم قوتشي الذهبي المزدوج GG — تحفة فنية بمعدن ذهبي مزدوج التأثير وشعار مرئي للماركة." },
  { id: 15, category: "عطور",    name: "عطر شانيل Coco Mademoiselle", brand: "CHANEL",  price: 410,  original_price: 570,  discount: 28, image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400",  images: ["https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400","https://images.unsplash.com/photo-1541643600914-78b084683702?w=400"], is_new: false, rating: 4.9, sales: 3800, stock: 25, colors: ["#F5F0E8","#C0A882"], sizes: [], description: "Coco Mademoiselle — أكثر عطور شانيل انتشاراً. مزيج منعش من البرغموت والوردة وخشب الزنجبيل." },
  { id: 16, category: "مجوهرات", name: "ساعة لويس فيتون تانبور",     brand: "LV",       price: 1850, original_price: 2500, discount: 26, image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=400",  images: ["https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=400","https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"], is_new: true,  rating: 4.9, sales: 190,  stock: 3,  colors: ["#C0A882","#2E2C2A"], sizes: ["One Size"], description: "ساعة تانبور الأيقونية من لويس فيتون بحركة سويسرية فاخرة وقرص مميز بالمونوغرام." },
];

function normalizeArabic(term: string): string {
  return term
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآا]/g, "ا")
    .replace(/^ال/, "")
    .trim();
}

router.get("/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const product = mockProducts.find((p) => p.id === id);
  if (!product) { res.status(404).json({ error: "Not found" }); return; }
  res.json(product);
});

router.get("/products", (req: Request, res: Response) => {
  const { q, brand, category, minPrice, maxPrice, minDiscount, minRating, color, size, inStock, isNew, sort, page, limit: limitQ } = req.query as Record<string, string | undefined>;

  const pageNum  = Math.max(1, Number(page  ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(limitQ ?? 20)));

  let filtered = [...mockProducts];

  if (q && q.trim()) {
    const raw        = q.trim().toLowerCase();
    const normalized = normalizeArabic(raw);
    filtered = filtered.filter((p) => {
      const name      = p.name.toLowerCase();
      const br        = p.brand.toLowerCase();
      const cat       = p.category.toLowerCase();
      const normName  = normalizeArabic(name);
      const normCat   = normalizeArabic(cat);
      return name.includes(raw) || br.includes(raw) || normName.includes(normalized) || cat.includes(raw) || normCat.includes(normalized);
    });
  }

  if (category && category.trim()) {
    if (category === "جديدنا") {
      filtered = filtered.filter((p) => p.is_new);
    } else if (category === "عروض") {
      filtered = filtered.filter((p) => p.discount > 0);
    } else {
      const normCat = normalizeArabic(category.trim());
      filtered = filtered.filter((p) => normalizeArabic(p.category) === normCat);
    }
  }

  if (brand && brand.trim()) {
    const brands = brand.split(",").map(b => b.trim().toUpperCase());
    filtered = filtered.filter((p) => brands.includes(p.brand.toUpperCase()));
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (minDiscount && !isNaN(Number(minDiscount))) {
    filtered = filtered.filter((p) => p.discount >= Number(minDiscount));
  }

  if (minRating && !isNaN(Number(minRating))) {
    filtered = filtered.filter((p) => p.rating >= Number(minRating));
  }

  if (color && color.trim()) {
    const c = color.trim().toLowerCase();
    filtered = filtered.filter((p) => p.colors.some(pc => pc.toLowerCase().includes(c)));
  }

  if (size && size.trim()) {
    const sizes = size.split(",").map(s => s.trim());
    filtered = filtered.filter((p) => p.sizes.some(ps => sizes.includes(ps)));
  }

  if (inStock === "1") {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  if (isNew === "1") {
    filtered = filtered.filter((p) => p.is_new);
  }

  if (sort) {
    switch (sort) {
      case "price_asc":  filtered.sort((a, b) => a.price - b.price); break;
      case "price_desc": filtered.sort((a, b) => b.price - a.price); break;
      case "rating":     filtered.sort((a, b) => b.rating - a.rating); break;
      case "discount":   filtered.sort((a, b) => b.discount - a.discount); break;
      case "newest":     filtered.sort((a, b) => b.id - a.id); break;
      case "sales":      filtered.sort((a, b) => b.sales - a.sales); break;
    }
  }

  const total     = filtered.length;
  const offset    = (pageNum - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);

  res.setHeader("X-Total-Count", String(total));
  res.setHeader("X-Page",        String(pageNum));
  res.setHeader("X-Page-Size",   String(pageSize));
  res.setHeader("X-Pages",       String(Math.ceil(total / pageSize)));
  res.json(paginated);
});

router.get("/brands-list", (_req: Request, res: Response) => {
  const brands = [...new Set(mockProducts.map(p => p.brand))].sort();
  res.json(brands);
});

export default router;
