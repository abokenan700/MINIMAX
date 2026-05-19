import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const mockBrands = [
  { id: "chanel",   label: "CHANEL",        icon: "/brands/chanel.svg" },
  { id: "dior",     label: "DIOR",           icon: "/brands/dior.svg" },
  { id: "gucci",    label: "GUCCI",          icon: "/brands/gucci.svg" },
  { id: "lv",       label: "LOUIS VUITTON",  icon: "/brands/lv.svg" },
  { id: "versace",  label: "VERSACE",        icon: "/brands/versace.svg" },
];

router.get("/brands", (_req: Request, res: Response) => {
  res.json(mockBrands);
});

export default router;
