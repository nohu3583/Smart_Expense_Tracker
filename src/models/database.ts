import { User } from "./user";
import {Account} from "./account";

export class Database {
    private static instance: Database;
    private users: User[] = [];
    private accounts: Account[] = [];
  
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
  
    addAccount(account: Account): void {
      this.accounts.push(account);
    }
  
    getAccounts(): Account[] {
      return this.accounts;
    }
  }
  
  