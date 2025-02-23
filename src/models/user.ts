export class User {
    username: string;
    password: string; // In a real app, store a hashed password
  
    constructor(username: string, password: string) {
      this.username = username;
      this.password = password;
    }
  
    authenticate(inputPassword: string): boolean {
      return this.password === inputPassword;
    }
  }
  