import Freecurrencyapi from '@everapi/freecurrencyapi-js';

const freecurrencyapi = new Freecurrencyapi('fca_live_BpQTWNLwR9y6JFL1Lf7elAsjKfQpZPDODaZK7Cqu');

export const currencies = async (fromCurrency, toCurrency, unite) => {
    const res = await freecurrencyapi.latest({
        base_currency: fromCurrency,
        currencies: toCurrency
    })
    return res?.data[toCurrency] * unite;
}


