import { Router } from "express";
import https from "https";
import http from "http";

const router = Router();

router.get("/img/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1 || id > 1084) {
    res.status(400).json({ error: "معرّف صورة غير صالح" });
    return;
  }

  const w = Math.min(parseInt((req.query.w as string) || "600", 10), 1200);
  const h = Math.min(parseInt((req.query.h as string) || "750", 10), 1500);
  const url = `https://picsum.photos/id/${id}/${w}/${h}`;

  const protocol = url.startsWith("https") ? https : http;

  const proxyReq = protocol.get(url, (proxyRes) => {
    if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      const redirectUrl = proxyRes.headers.location;
      const redirectProtocol = redirectUrl.startsWith("https") ? https : http;
      const redirectReq = redirectProtocol.get(redirectUrl, (redirectRes) => {
        res.setHeader("Content-Type", redirectRes.headers["content-type"] || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        redirectRes.pipe(res);
      });
      redirectReq.on("error", () => {
        if (!res.headersSent) res.status(502).end();
      });
      return;
    }
    res.setHeader("Content-Type", proxyRes.headers["content-type"] || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    proxyRes.pipe(res);
  });

  proxyReq.on("error", () => {
    if (!res.headersSent) res.status(502).end();
  });
});

export default router;
