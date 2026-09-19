export function ask(question: string): string {
  const answer = prompt(question);
  return (answer ?? "").trim();
}

export function pause(): void {
  prompt("\nPresione Enter para continuar...");
}
