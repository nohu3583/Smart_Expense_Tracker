export class Expense {
    id: number;
    description: string;
    amount: number;
    date: Date;
    category: string;
  
    constructor(id: number, description: string, amount: number, category: string) {
      this.id = id;
      this.description = description;
      this.amount = amount;
      this.date = new Date();
      this.category = category;
    }
  }
  