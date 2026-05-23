import { Router, type IRouter, type NextFunction, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { brandsTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/brands", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await db.select().from(brandsTable).orderBy(brandsTable.label);
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
