const euro = Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
});
export function formatCurrency(currency) {
    return euro.format(currency);
}
export function formatEurocentToCurrency(eurocent) {
    return formatCurrency(eurocent / 100);
}
