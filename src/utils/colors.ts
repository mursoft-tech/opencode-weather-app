const RESET = "\x1b[0m";

const COLORS = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
} as const;

const USE_COLOR = Boolean(process.stdout.isTTY);

function color(code: string, text: string): string {
  return USE_COLOR ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return color(COLORS.cyan, text);
}

export function yellow(text: string): string {
  return color(COLORS.yellow, text);
}

export function green(text: string): string {
  return color(COLORS.green, text);
}

export function red(text: string): string {
  return color(COLORS.red, text);
}
