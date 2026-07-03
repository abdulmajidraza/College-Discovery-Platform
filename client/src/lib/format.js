export function formatFees(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLpa(value) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} LPA`;
}
