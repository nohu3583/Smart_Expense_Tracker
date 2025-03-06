import * as readline from 'readline';
import { createAccount as createMongoAccount, getAccount, updateBalance, getAccountBalance, getAccountCurrency, Account} from '../mongodb/account';
import { addExpense as addMongoExpense, getExpenses, Expense } from '../mongodb/expense';
import { connectDB } from '../mongodb/database';
import {expense_categories} from  '../app/functions';
const apiURL = 'http://localhost:3000/api/expense';

const sendExpense = async () => {
    const amountInput = document.getElementById('amount') as HTMLInputElement;
    const amount = amountInput.value;

    if (!amount) {
        alert('Please enter an amount.');
        return;
    }

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error sending expense:', error);
    }
};

document.getElementById('submit')?.addEventListener('click', sendExpense);


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
  const password = await askQuestion("Enter password: ");

  const existingAccount = await getAccount(username);
  if (existingAccount) {
    console.log("Username already exists!");
    return;
  }

  const account: Account = {
    accountOwner: username,
    balance: 0,
    currency: 'USD',
    username: username,
    password: password,
    loggedIn: false
  };

  await createMongoAccount(account);
  console.log(`User ${username} registered successfully!`);
  await createAccount(username);
}

async function loginUser(): Promise<string | null> {
  console.log("User Login");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: ");

  const account = await getAccount(username);
  if (account && account.password === password) {
    console.log(`Login successful! Welcome, ${username}`);
    return username;
  } else {
    console.log("Invalid username or password.");
    return null;
  }
}

async function logoutUser(username: string) {
  console.log("Logout successful!");
}

async function createAccount(username: string) {
  console.log("Create Bank Account");
  const accountNumber: string = await askQuestion("Enter account number: ");
  const currency: string = await askQuestion("Enter currency (e.g., USD, EUR): ");
  let balanceInput: string = await askQuestion("Enter initial balance: ");
  const balance: number = parseFloat(balanceInput);

  while (isNaN(balance)) {
    console.log("Invalid balance amount. Please enter a number.");
    balanceInput = await askQuestion("Enter initial balance: ");
  }

  const bankName: string = await askQuestion("Enter bank name: ");

  const account: Account = {
    accountOwner: username,
    balance: balance,
    currency: currency,
    username: username,
    password: '', // Password is not needed here
    loggedIn: false
  };

  await createMongoAccount(account);
  console.log(`Account created for ${username} with ${balance} ${currency} at ${bankName}`);
}

async function addExpense(username: string) {
  console.log("Add expense");
  const description: string = await askQuestion("Describe your purchase: ");
  const amount_input: string = await askQuestion("How much was it? ");
  let amount: number = parseFloat(amount_input);
  let currency: string = await askQuestion("In what currency? ");
  const date_input: string = await askQuestion("When was the purchase made?(format: YYYY-MM-DD) ");
  const date: Date = new Date(Date.parse(date_input));
  let category: string = await askQuestion("What category does this fall under? \n" + expense_categories + ":  ");

  while (1 > parseFloat(category) || parseFloat(category) > 7) {
    category = await askQuestion("Invalid category. Please enter a number between 1-7.");
  }

  if (isNaN(amount)) {
    console.log("Invalid amount. Please enter a number.");
    return;
  }

  const accountCurrency = await getAccountCurrency(username);
  if (currency !== accountCurrency) {
    const currency_api_data = await fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`);
    const exchangeRate = 1; // Placeholder
    amount = amount * exchangeRate;
    currency = accountCurrency;
  }

  const expense: Expense = {
    amount: amount,
    category: category,
    date: date,
    accountOwner: username,
    description: description
  };

  await addMongoExpense(expense);
  await updateBalance(username, -amount);
  console.log(`Expense added for ${amount} ${currency} on ${date} in ${category}`);

  const answer = await askQuestion("Do you want to add another expense? (yes/no) ");
  if (answer.toLowerCase() === "yes") {
    await wait(200);
    console.clear();
    await addExpense(username);
  }
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  await connectDB();
  while (true) {
    console.log("\n Smart Expense Tracker");
    console.log("1. Register");
    console.log("2. Login");
    console.log("3. Add Expense");
    console.log("4. Logout");
    console.log("5. Exit");
    const choice = await askQuestion("Choose an option: ");
    switch (choice) {
      case "1":
        await registerUser();
        break;
      case "2":
        const username = await loginUser();
        if (username) {
          // User is logged in, show additional options
          console.log("1. Add Expense");
          console.log("2. Logout");
          const userChoice = await askQuestion("Choose an option: ");
          switch (userChoice) {
            case "1":
              await addExpense(username);
              break;
            case "2":
              await logoutUser(username);
              break;
            default:
              console.log("Invalid option. Try again.");
          }
        }
        break;
      case "3":
        console.log("Please login first.");
        break;
      case "4":
        console.log("No user is logged in.");
        break;
      case "5":
        console.log("Goodbye!");
        rl.close();
        return;
      default:
        console.log("Invalid option. Try again.");
    }
    await wait(2000);
    console.clear();
  }
}

main();