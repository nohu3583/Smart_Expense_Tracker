export class Expense {
    description: string;
    amount: number;
    date: Date;
    category: string;
    currency : string;

  
    constructor(description: string, amount: number, category: string, currency: string) {
      this.description = description;
      this.amount = amount;
      this.date = new Date();
      this.category = category;
      this.currency = currency;
    }
}
  