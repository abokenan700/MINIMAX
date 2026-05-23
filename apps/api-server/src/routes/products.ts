import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db/schema";
import { eq, and, gte, lte, ilike, or, sql } from "drizzle-orm";

const router: IRouter = Router();

function normalizeArabic(term: string): string {
  return term
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآا]/g, "ا")
    .replace(/^ال/, "")
    .trim();
}

router.get("/products/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const rows = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (rows.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.get("/products", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      q, brand, category, minPrice, maxPrice,
      minDiscount, minRating, color, size, inStock, isNew, sort,
      page, limit: limitQ,
    } = req.query as Record<string, string | undefined>;

    const pageNum  = Math.max(1, Number(page  ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(limitQ ?? 20)));

    let all = await db.select().from(productsTable);

    if (q && q.trim()) {
      const raw        = q.trim().toLowerCase();
      const normalized = normalizeArabic(raw);
      all = all.filter((p) => {
        const name   = p.name.toLowerCase();
        const br     = p.brand.toLowerCase();
        const cat    = p.category.toLowerCase();
        const normN  = normalizeArabic(name);
        const normC  = normalizeArabic(cat);
        return name.includes(raw) || br.includes(raw) || normN.includes(normalized) ||
               cat.includes(raw) || normC.includes(normalized);
      });
    }

    if (category && category.trim()) {
      if (category === "جديدنا" || category === "new") {
        all = all.filter((p) => p.is_new);
      } else if (category === "عروض" || category === "offers") {
        all = all.filter((p) => p.discount > 0);
      } else {
        const normCat = normalizeArabic(category.trim().toLowerCase());
        all = all.filter((p) => {
          const pCat = normalizeArabic(p.category.toLowerCase());
          return pCat === normCat || p.category.toLowerCase() === category.trim().toLowerCase();
        });
      }
    }

    if (brand && brand.trim()) {
      const brands = brand.split(",").map(b => b.trim().toUpperCase());
      all = all.filter((p) => brands.includes(p.brand.toUpperCase()));
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      all = all.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      all = all.filter((p) => p.price <= Number(maxPrice));
    }
    if (minDiscount && !isNaN(Number(minDiscount))) {
      all = all.filter((p) => p.discount >= Number(minDiscount));
    }
    if (minRating && !isNaN(Number(minRating))) {
      all = all.filter((p) => p.rating >= Number(minRating));
    }
    if (color && color.trim()) {
      const c = color.trim().toLowerCase();
      all = all.filter((p) => p.colors.some(pc => pc.toLowerCase().includes(c)));
    }
    if (size && size.trim()) {
      const sizes = size.split(",").map(s => s.trim());
      all = all.filter((p) => p.sizes.some(ps => sizes.includes(ps)));
    }
    if (inStock === "1") {
      all = all.filter((p) => p.stock > 0);
    }
    if (isNew === "1") {
      all = all.filter((p) => p.is_new);
    }

    if (sort) {
      switch (sort) {
        case "price_asc":  all.sort((a, b) => a.price - b.price); break;
        case "price_desc": all.sort((a, b) => b.price - a.price); break;
        case "rating":     all.sort((a, b) => b.rating - a.rating); break;
        case "discount":   all.sort((a, b) => b.discount - a.discount); break;
        case "newest":     all.sort((a, b) => b.id - a.id); break;
        case "sales":      all.sort((a, b) => b.sales - a.sales); break;
      }
    }

    const total     = all.length;
    const offset    = (pageNum - 1) * pageSize;
    const paginated = all.slice(offset, offset + pageSize);

    res.setHeader("X-Total-Count", String(total));
    res.setHeader("X-Page",        String(pageNum));
    res.setHeader("X-Page-Size",   String(pageSize));
    res.setHeader("X-Pages",       String(Math.ceil(total / pageSize)));
    res.json(paginated);
  } catch (err) { next(err); }
});

router.get("/brands-list", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db.select({ brand: productsTable.brand }).from(productsTable);
    const brands = [...new Set(rows.map(r => r.brand))].sort();
    res.json(brands);
  } catch (err) { next(err); }
});

export default router;
