import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/categories", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
