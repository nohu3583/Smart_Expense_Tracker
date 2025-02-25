import { User } from "./user";
import {Account} from "./account";
import {Expense} from "./expense";
import { blob } from "stream/consumers";

export class Database {
    private static instance: Database;
    private users: User[] = [];
    private accounts: Account[] = [];
    private expenses: Expense[] = [];

  
    private constructor() {} // Singleton pattern
  
    static getInstance(): Database {
      if (!Database.instance) {
        Database.instance = new Database();
      }
      return Database.instance;
    }
  
    addUser(user: User): void {
      this.users.push(user);
    }
    
  
    findUser(username: string): User | undefined {
      return this.users.find(user => user.username === username);
    }

    get_users() : User[] {
      return this.users;
    }
  
    addAccount(account: Account): void {
      this.accounts.push(account);
    }
  
    getAccounts(): Account[] {
      return this.accounts;
    }

    addExpense(expense: Expense): void {
        this.expenses.push(expense);
    }

    filterExpensesByCategory(category: string): Expense[] {
        return this.expenses.filter(expense => expense.category === category);
    }

    filterExpensesByDate(date: Date): Expense[] {
        return this.expenses.filter(expense => expense.date === date);
    }

    filterExpensesByAmount(amount: number): Expense[] {
        return this.expenses.filter(expense => expense.amount === amount);
    }
    getExpenses(): Expense[] {
        return this.expenses;
    }
    
    get_currency_from_account(account_number: string): string {
      const account_correct = this.accounts.find(acc => acc.account_number === account_number);
      return account_correct ? account_correct.get_account_currency() : "";
    }

    get_active_account(): string {
      const active_account = this.users.find(user => user.logged_in === true);
      return active_account ? active_account.get_account_number() : "";
    }

    account_withdraw_after_expense(account_number : string , expense : number ) {
      const account_correct = this.accounts.find(acc => acc.account_number === account_number);
      account_correct?.withdraw(expense, account_correct.get_account_number());
    }

    display_user_names(): string[] {
      return this.users.map(user => user.username);
    }

    find_account_status(username : string) : boolean | string {
      const account = this.findUser(username);
      return account ? account.logged_in : "";
    }

  }

  
  