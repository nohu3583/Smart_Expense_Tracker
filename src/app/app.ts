import * as readline from 'readline';
import {Database} from '../models/database';
import {User} from '../models/user';
import {Account} from '../models/account';
import {Expense} from '../models/expense';
import { get } from 'http';
import { clear } from 'console';

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
    console.log("Username already exists!");
    return;
  }
  let status = false;
  
  console.log(`User ${username} registered successfully!`);
  // if (db.get_active_account() === "") {
  // console.log(`User ${username} is now logged in!`);
  // status = true;
  // }
  // else{}
  const user = new User(username, password, "", status);
  db.addUser(user);
}

async function loginUser(): Promise<User | null> {
  console.log("User Login");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: ");

  const user = db.findUser(username);
  const status = 
  if (user && user.authenticate(password)) {
    user.change_account_status(user.logged_in);
    console.log(`Login successful! Welcome, ${username}`);
    return user;
  } else {
    console.log(" Invalid username or password.");
    return null;
  }
}

async function logoutUser()  {
  const user_id = db.get_active_account();
  const user = db.findUser(user_id);

  if (user) {
    user.change_account_status(user.logged_in);
    console.log("Logout successful!");
    rl.close();
  } else {
    console.log("No user logged in");
    return;
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

async function addExpense() {
  if (!db.get_active_account()) {
    console.log("No user logged in. Please login first.");
    return;
  }
  else {
  const account_id = db.get_active_account();
  console.log("Add expense");
  const description: string = await askQuestion("Describe your purchase: ");
  const amount_input: string = await askQuestion("How much was it? ");
  let amount: number = parseFloat(amount_input);
  let currency: string = await askQuestion("In what currency? ");
  const date_input: string = await askQuestion("When was the purchase made?(format: ÅÅÅÅ-MM-DD) ");
  const date: Date = new Date(Date.parse(date_input));
  const category: string = await askQuestion("What category does this fall under? ");

  if (isNaN(amount)) {
    console.log("Invalid amount. Please enter a number.");
    return;
  }
  if (currency !== db.get_currency_from_account(account_id)) {
    const currency_api_data = await fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`);
    const exchangeRate = 1; //placeholder
    amount = amount * exchangeRate;
    currency = db.get_currency_from_account(account_id);   
  }
  const expense = new Expense(description, amount, date, category, currency, account_id);
  db.addExpense(expense);
  console.log(`Expense added for ${amount} ${currency} on ${date} in ${category}`);
  db.account_withdraw_after_expense(account_id, amount);
  

  const answer = await askQuestion("Do you want to add another expense? (yes/no) ");
  if (answer.toLowerCase() === "yes") {
    addExpense();
  }
  else {
    main();
  }
  }
}
async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  while (true) {
    if (db.get_users().length === 0) {
      console.log("\n Smart Expense Tracker");
      console.log("1. Register");
      console.log("2. Exit");
      const choice = await askQuestion("Choose an option: ");
      switch (choice) {
        case "1":
          await registerUser();
          break;
        case "2":
          console.log("Goodbye!");
          rl.close();
          return;
        default:
          console.log("Invalid option. Try again.");
      }
    } else {
      console.log("\n Smart Expense Tracker");
      console.log("1. Register");
      console.log("2. Login");
      console.log("3. Display Users")
      console.log("4. Add Expense");
      console.log("5. Logout");
      console.log("6. Exit");
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
          const usernames = db.display_user_names();
          console.log(`Created user are: ${usernames}`);
          break;
        case "4":
          await addExpense();
          break;
        case "5":
          await logoutUser();
          break;
        case "6":
          console.log("Goodbye!");
          rl.close();
          return;
        default:
          console.log("Invalid option. Try again.");

      }
    }
  await wait(2000);
  console.clear();
  }
}

main();
