import * as readline from 'readline';
import {Database} from './models/database';
import {User} from './models/user';
import {Account} from './models/account';

// Create readline interface for CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const db = Database.getInstance();

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function registerUser() {
  console.log("📝 Register New User");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: ");
  
  if (db.findUser(username)) {
    console.log("❌ Username already exists!");
    return;
  }

  const user = new User(username, password);
  db.addUser(user);
  console.log(`✅ User ${username} registered successfully!`);
}

async function loginUser(): Promise<User | null> {
  console.log("🔑 User Login");
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: ");

  const user = db.findUser(username);
  if (user && user.authenticate(password)) {
    console.log(`✅ Login successful! Welcome, ${username}`);
    return user;
  } else {
    console.log("❌ Invalid username or password.");
    return null;
  }
}

async function createAccount(user: User) {
    console.log("🏦 Create Bank Account");
    const accountNumber: string = await askQuestion("Enter account number: ");
    const currency: string = await askQuestion("Enter currency (e.g., USD, EUR): ");
    const balanceInput: string = await askQuestion("Enter initial balance: ");
    const balance: number = parseFloat(balanceInput);
    const bankName: string = await askQuestion("Enter bank name: "); // Get bank name
  
    if (isNaN(balance)) {
      console.log("❌ Invalid balance amount. Please enter a number.");
      return;
    }
  
    const account = new Account(accountNumber, balance, currency, bankName); // Correct parameter order
    db.addAccount(account);
  
    console.log(`✅ Account created for ${user.username} with ${balance} ${currency} at ${bankName}`);
  }
  


async function main() {
  console.log("\n💰 Smart Expense Tracker 💰");
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
      console.log("👋 Goodbye!");
      rl.close();
      return;
    default:
      console.log("❌ Invalid option. Try again.");
  }
  main(); // Restart CLI
}

main();
