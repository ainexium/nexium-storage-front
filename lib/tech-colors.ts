export const TECH_COLORS: Record<string, string> = {
  "Node.js": "#3ECF8E", "Python": "#4B8BBE",  "Go":      "#00ACD7",
  "PHP":     "#8892BF", "Ruby":   "#CC342D",   "Java":    "#ED8B00",
  "Rust":    "#CE422B", "Swift":  "#F05138",   "Kotlin":  "#7F52FF",
  "Dart":    "#0175C2", ".NET":   "#512BD4",   "Elixir":  "#9B59B6",
  "Next.js": "#BBBBBB", "React":  "#61DAFB",   "Vue":     "#42B883",
  "Django":  "#44B78B", "Laravel":"#FF2D20",   "Express": "#AAAAAA",
  "FastAPI": "#009688", "Flutter":"#54C5F8",   "Spring":  "#6DB33F",
  "Nuxt":    "#00DC82", "NestJS": "#E0234E",   "Rails":   "#CC0000",
};

export function techStyle(name: string): { color: string; backgroundColor: string; borderColor: string } {
  const c = TECH_COLORS[name] ?? "#888888";
  return { color: c, backgroundColor: `${c}18`, borderColor: `${c}38` };
}
