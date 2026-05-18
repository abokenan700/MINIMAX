const RV_KEY = "nakhba_recently_viewed";
const MAX_RV = 10;

export function addToRecentlyViewed(productId: number): void {
  try {
    const stored = localStorage.getItem(RV_KEY);
    const ids: number[] = stored ? JSON.parse(stored) : [];
    const filtered = ids.filter((id) => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem(RV_KEY, JSON.stringify(filtered.slice(0, MAX_RV)));
  } catch { }
}

export function getRecentlyViewed(): number[] {
  try {
    const stored = localStorage.getItem(RV_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}
