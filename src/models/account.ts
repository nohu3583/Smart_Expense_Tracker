export class Account {
    account_number : string;
    balance : number;
    currency : string;
    bank_name : string;

    constructor(account_number: string, balance: number, currency: string, bank_name: string) {
        this.account_number = account_number;
        this.balance = balance;
        this.currency = currency;
        this.bank_name = bank_name;

    }

    
    deposit(amount: number) {
        this.balance += amount;
    }

    withdraw(amount: number, account : string) {
        if (this.balance > amount) {
            this.balance -= amount;
        }
        if(this.balance < amount){
        console.log(`Insufficient balance in ${this.account_number}`);
        return;
        }
        console.log(this.balance);
    }

    get_account_currency(): string {
        return this.currency;
      }

    get_account_number() : string {
        return this.account_number;
    }
}