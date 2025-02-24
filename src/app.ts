import * as readline from 'readline';
import {Database} from './models/database';
import {User} from './models/user';
import {Account} from './models/account';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const db = Database.getInstance();

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function registerUser() {
  console.log("Register New User");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: "); // check for hidden input, so that password is not shown when registering
  
  if (db.findUser(username)) {
    console.log(" Username already exists!");
    return;
  }

  const user = new User(username, password, "", false);
  db.addUser(user);
  console.log(`User ${username} registered successfully!`);
}

async function loginUser(): Promise<User | null> {
  console.log("User Login");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: ");

  const user = db.findUser(username);
  if (user && user.authenticate(password)) {
    user.change_account_status(user.logged_in);
    console.log(`Login successful! Welcome, ${username}`);
    return user;
  } else {
    console.log(" Invalid username or password.");
    return null;
  }
}

async function createAccount(user: User) {
    console.log(" Create Bank Account");
    const accountNumber: string = await askQuestion("Enter account number: ");
    const currency: string = await askQuestion("Enter currency (e.g., USD, EUR): ");
    const balanceInput: string = await askQuestion("Enter initial balance: ");
    const balance: number = parseFloat(balanceInput);
    const bankName: string = await askQuestion("Enter bank name: "); 
  
    if (isNaN(balance)) {
      console.log("Invalid balance amount. Please enter a number.");
      return;
    }
  
    const account = new Account(accountNumber, balance, currency, bankName); 
    db.addAccount(account);
    user.input_account_number(accountNumber);
    console.log(`Account created for ${user.username} with ${balance} ${currency} at ${bankName}`);
}

async function addExpense(expense:number) {
  const account_id = 
  console.log("")
  const description: string = await askQuestion("Describe your purchase: ");
  const amount_input: string = await askQuestion("How much was it? ");
  const amount: number = parseFloat(amount_input);
  const currency: string = await askQuestion("In what currency? ");
  const date_input: string = await askQuestion("When was the purchase made?(format: ÅÅÅÅ-MM-DD) ");
  const date: Date = Date.parse(date_input);
  const account_currency = db.get_currency_from_account();
  if (currency !== ) {

  }

  
}


async function main() {
  console.log("\n Smart Expense Tracker");
  console.log("1. Register");
  console.log("2. Login");
  console.log("3. Exit");
  
  const choice = await askQuestion("Choose an option: ");
  switch (choice) {
    case "1":
      await registerUser();
      break;
    case "2":
      const user = await loginUser();
      if (user) {
        await createAccount(user);
      }
      break;
    case "3":
      console.log("Goodbye!");
      rl.close();
      return;
    default:
      console.log("Invalid option. Try again.");
  }
  main();
}

main();
