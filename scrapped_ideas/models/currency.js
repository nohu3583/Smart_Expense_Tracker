"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
class Currency {
    constructor(currencyCode, currencyname, exchangeRate) {
        this.currencycode = currencyCode;
        this.exchangerate = exchangeRate;
    }
    convert(amount, toCurrency) {
        return (amount / this.exchangerate) * toCurrency.exchangerate;
    }
}
exports.Currency = Currency;
