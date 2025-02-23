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
        console.log(`Deposited ${amount} to ${this.account_number}`);
    }

    withdraw(amount: number) {
        if (this.balance < amount) {
            console.log(`Insufficient balance in ${this.account_number}`);
            return false;
        }
        this.balance -= amount;
        console.log(`Withdrawn ${amount} from ${this.account_number}`);
        return true
    }

}