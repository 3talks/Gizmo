export function fmt(n: number): string {
  return "Rs " + Number(n).toLocaleString("en-IN");
}
