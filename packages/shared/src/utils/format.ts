export function fmt(n: number): string {
  return n.toLocaleString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
