export function vnd(price) {
  if (typeof price !== "number" || isNaN(price)) return "0 ₫";
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
