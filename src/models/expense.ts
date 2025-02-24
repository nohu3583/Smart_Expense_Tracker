export class Expense {
    description: string;
    amount: number;
    date: Date;
    category: string;
    currency : string;
    account_id : string; 

  
    constructor(description: string, amount: number, date: Date,  category: string, currency: string, account_id : string) {
      this.description = description;
      this.amount = amount;
      this.date = date;
      this.category = category;
      this.currency = currency;
      this.account_id = account_id;
    }

    input_account_number(account_number : string) {
      this.account_id = account_number;
    }
}
  