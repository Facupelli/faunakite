export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-AR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
