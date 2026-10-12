export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
}

export function capitalizeSentences(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/(^\w|[.!?]\s+\w)/g, (letter) => letter.toUpperCase());
}

