const MAP: Record<string, string> = {
  أبيض:    "#FFFFFF",
  أزرق:    "#4A90D9",
  وردي:    "#F4A7B9",
  أسود:    "#1A1A1A",
  أحمر:    "#E53935",
  الأصلي:  "#C0A882",
  ذهبي:   "#D4AF37",
  فضي:    "#C0C0C0",
  بني:    "#795548",
  بيج:    "#F5F0E8",
  رمادي:  "#9E9E9E",
  كحلي:   "#1B2A4A",
  أخضر:   "#4CAF50",
  أصفر:   "#FDD835",
  برتقالي:"#FF7043",
  بنفسجي: "#7E57C2",
  زيتي:   "#6D8B3A",
  كريمي:  "#F5F0DC",
};

export function colorToCss(name: string): string {
  const trimmed = name.trim();
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb")) return trimmed;
  return MAP[trimmed] ?? "#D0CBC4";
}

export function needsBorder(name: string): boolean {
  const css = colorToCss(name);
  const light = ["#ffffff","#f5f0e8","#f5f0dc","#ffffffff"];
  return light.includes(css.toLowerCase()) || isVeryLight(css);
}

function isVeryLight(hex: string): boolean {
  const c = hex.replace("#","");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0,2),16);
  const g = parseInt(c.slice(2,4),16);
  const b = parseInt(c.slice(4,6),16);
  return (r*0.299 + g*0.587 + b*0.114) > 220;
}
