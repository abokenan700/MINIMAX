import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const mockBrands = [
  { id: "chanel",   label: "CHANEL",        icon: "/brands/chanel.png" },
  { id: "dior",     label: "DIOR",           icon: "/brands/dior.png" },
  { id: "gucci",    label: "GUCCI",          icon: "/brands/gucci.png" },
  { id: "lv",       label: "LOUIS VUITTON",  icon: "/brands/louis-vuitton.png" },
  { id: "versace",  label: "VERSACE",        icon: "/brands/versace.png" },
];

router.get("/brands", (_req: Request, res: Response) => {
  res.json(mockBrands);
});

export default router;
