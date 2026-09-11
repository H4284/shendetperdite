export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatEuroAmount(amount: number) {
  return `${roundMoney(amount).toFixed(2)} €`;
}
