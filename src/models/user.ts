export class User {
    username: string;
    password: string; // In a real app, store a hashed password
    account_id: string;
    logged_in: boolean;
  
    constructor(username: string, password: string, account_id: string, logged_in : boolean) {
      this.username = username;
      this.password = password;
      this.account_id = account_id;
      this.logged_in = logged_in;
    }
  
    authenticate(inputPassword: string): boolean {
      return this.password === inputPassword;
    }

    input_account_number(account_number : string) {
      this.account_id = account_number;
    }

    get_account_number() : string {
      return this.account_id;
    }
    
    get_account_status() : boolean {
      return this.logged_in;
    }
    change_account_status(status : boolean)  {
      if (status === true) {
        this.logged_in = false;
      }
      else {
        this.logged_in = true;
      }
    }
  }
  