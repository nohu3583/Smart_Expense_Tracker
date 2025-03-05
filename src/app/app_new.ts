import * as readline from 'readline';
import { createAccount as createMongoAccount, getAccount, updateBalance, getAccountBalance, getAccountCurrency, Account, amount_of_accounts, find_active_account, getAllUsernames} from '../mongodb/account';
import { addExpense as addMongoExpense, getExpenses, Expense } from '../mongodb/expense';
import { connectDB } from '../mongodb/database';
import {expense_categories} from  '../app/functions';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}


async function registerUser() {
  console.log("Register New User");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: "); // check for hidden input, so that password is not shown when registering
  
  if (await getAccount(username)) {
    console.log("Username already exists!");
    return;
  }
  else {
    console.log("User registered successfully, but no account has been registered yet.");
    const account_number = await askQuestion("Enter account number: ");
    const balance = await askQuestion("Enter balance: ");
    const currency = await askQuestion("Enter currency: ");
    const account : Account = {
      accountOwner: account_number,
      balance: parseInt(balance),
      currency: currency,
      username : username,
      password : password, 
      loggedIn : false
    }
    await createMongoAccount(account);
    console.log("Account created successfully!");
  }
}

async function loginUser() {
  const username = await askQuestion("Enter username: ");

  const account = await getAccount(username);
  if (account?.loggedIn === true) {
    console.log("User already logged in!");
    return;
  }
  const password = await askQuestion("Enter password: ");

  if (account?.password !== password) {
    console.log("Incorrect password!");
    return;
  }
  console.log("User logged in successfully!");

  const active_account = await find_active_account(); // if there is an active account, log out it and then log in new account.
  if (active_account !== "") { 
    const account_logged_in = await getAccount(active_account);
    account_logged_in!.loggedIn = false;
  }
  account.loggedIn = true;
}

async function logoutUser() {
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  const account = await getAccount(active_account);
  account!.loggedIn = false;
  console.log("User logged out successfully!");
}

async function addExpense() {
  const active_account = await find_active_account();
  if (active_account === "") {
    console.log("No user is logged in!");
    return;
  }
  const amount = await askQuestion("Enter amount: ");
  const category = await askQuestion("Enter category: ");
  const date = await askQuestion("Enter date: ");
  let date_parsed = new Date(date); // check if date is in correct format
  while (isNaN(date_parsed.getTime())) {
    console.log("Invalid date format. Try again.");
    const date = await askQuestion("Enter date: ");
    date_parsed = new Date(date);
  }
  const description = await askQuestion("Enter description: ");

  const expense : Expense = {
    amount: parseInt(amount),
    category: category,
    date: date_parsed,
    accountOwner: active_account,
    description : description
    }
  await addMongoExpense(expense);
  console.log("Expense added successfully!");
  
  //change balance for active account
  const account = await getAccount(active_account);
  if (account) { // check if account exists than update balance so that it is changed after each expense
    account.balance -= parseInt(amount);
    await updateBalance(account.accountOwner, account.balance);
  }
}
async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  while (true) {
    if (await amount_of_accounts() === 0) {
      console.log("\n Smart Expense Tracker");
      console.log("1. Register");
      console.log("2. Exit");
      console.log("3. For testing only")
      const choice = await askQuestion("Choose an option: ");
      switch (choice) {
        case "1":
          await registerUser();
          break;
        case "2":
          console.log("Goodbye!");
          rl.close();
          return;
        case "3": //used for testing purposes
          const account : Account = {
            accountOwner : "123456",
            balance : 1000,
            currency : "USD",
            username : "noahhzr",
            password : "123456",
            loggedIn : false
          }
          await createMongoAccount(account);
          console.log("Testing account created successfully!");
          break;
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
          break;
        case "3":
          const usernames = getAllUsernames();
          console.log(`Created user are: ${usernames}`);
          break;
        case "4":
          await addExpense();
          break;
        case "5":
          await logoutUser();
          rl.close()
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