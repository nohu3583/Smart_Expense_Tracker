export class Currency {
    currencycode: string;
    exchangerate: number; // Relative to base currency
  
    constructor(currencyCode: string, currencyname : string, exchangeRate: number) {
      this.currencycode = currencyCode;
      this.exchangerate = exchangeRate;
    }
  
    convert(amount: number, toCurrency: Currency): number {
      return (amount / this.exchangerate) * toCurrency.exchangerate;
    }
  }
  