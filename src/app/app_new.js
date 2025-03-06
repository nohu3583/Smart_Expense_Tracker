"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const account_1 = require("../mongodb/account");
const expense_1 = require("../mongodb/expense");
const database_1 = require("../mongodb/database");
const functions_1 = require("../app/functions");
const apiURL = 'http://localhost:3000/api/expense';
const sendExpense = () => __awaiter(void 0, void 0, void 0, function* () {
    const amountInput = document.getElementById('amount');
    const amount = amountInput.value;
    if (!amount) {
        alert('Please enter an amount.');
        return;
    }
    try {
        const response = yield fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        const data = yield response.json();
        alert(data.message);
    }
    catch (error) {
        console.error('Error sending expense:', error);
    }
});
(_a = document.getElementById('submit')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', sendExpense);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
function registerUser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Register New User");
        const username = yield askQuestion("Enter username: ");
        const password = yield askQuestion("Enter password: ");
        const existingAccount = yield (0, account_1.getAccount)(username);
        if (existingAccount) {
            console.log("Username already exists!");
            return;
        }
        const account = {
            accountOwner: username,
            balance: 0,
            currency: 'USD',
            username: username,
            password: password,
            loggedIn: false
        };
        yield (0, account_1.createAccount)(account);
        console.log(`User ${username} registered successfully!`);
        yield createAccount(username);
    });
}
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("User Login");
        const username = yield askQuestion("Enter username: ");
        const password = yield askQuestion("Enter password: ");
        const account = yield (0, account_1.getAccount)(username);
        if (account && account.password === password) {
            console.log(`Login successful! Welcome, ${username}`);
            return username;
        }
        else {
            console.log("Invalid username or password.");
            return null;
        }
    });
}
function logoutUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Logout successful!");
    });
}
function createAccount(username) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Create Bank Account");
        const accountNumber = yield askQuestion("Enter account number: ");
        const currency = yield askQuestion("Enter currency (e.g., USD, EUR): ");
        let balanceInput = yield askQuestion("Enter initial balance: ");
        const balance = parseFloat(balanceInput);
        while (isNaN(balance)) {
            console.log("Invalid balance amount. Please enter a number.");
            balanceInput = yield askQuestion("Enter initial balance: ");
        }
        const bankName = yield askQuestion("Enter bank name: ");
        const account = {
            accountOwner: username,
            balance: balance,
            currency: currency,
            username: username,
            password: '', // Password is not needed here
            loggedIn: false
        };
        yield (0, account_1.createAccount)(account);
        console.log(`Account created for ${username} with ${balance} ${currency} at ${bankName}`);
    });
}
function addExpense(username) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Add expense");
        const description = yield askQuestion("Describe your purchase: ");
        const amount_input = yield askQuestion("How much was it? ");
        let amount = parseFloat(amount_input);
        let currency = yield askQuestion("In what currency? ");
        const date_input = yield askQuestion("When was the purchase made?(format: YYYY-MM-DD) ");
        const date = new Date(Date.parse(date_input));
        let category = yield askQuestion("What category does this fall under? \n" + functions_1.expense_categories + ":  ");
        while (1 > parseFloat(category) || parseFloat(category) > 7) {
            category = yield askQuestion("Invalid category. Please enter a number between 1-7.");
        }
        if (isNaN(amount)) {
            console.log("Invalid amount. Please enter a number.");
            return;
        }
        const accountCurrency = yield (0, account_1.getAccountCurrency)(username);
        if (currency !== accountCurrency) {
            const currency_api_data = yield fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`);
            const exchangeRate = 1; // Placeholder
            amount = amount * exchangeRate;
            currency = accountCurrency;
        }
        const expense = {
            amount: amount,
            category: category,
            date: date,
            accountOwner: username,
            description: description
        };
        yield (0, expense_1.addExpense)(expense);
        yield (0, account_1.updateBalance)(username, -amount);
        console.log(`Expense added for ${amount} ${currency} on ${date} in ${category}`);
        const answer = yield askQuestion("Do you want to add another expense? (yes/no) ");
        if (answer.toLowerCase() === "yes") {
            yield wait(200);
            console.clear();
            yield addExpense(username);
        }
    });
}
function wait(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.connectDB)();
        while (true) {
            console.log("\n Smart Expense Tracker");
            console.log("1. Register");
            console.log("2. Login");
            console.log("3. Add Expense");
            console.log("4. Logout");
            console.log("5. Exit");
            const choice = yield askQuestion("Choose an option: ");
            switch (choice) {
                case "1":
                    yield registerUser();
                    break;
                case "2":
                    const username = yield loginUser();
                    if (username) {
                        // User is logged in, show additional options
                        console.log("1. Add Expense");
                        console.log("2. Logout");
                        const userChoice = yield askQuestion("Choose an option: ");
                        switch (userChoice) {
                            case "1":
                                yield addExpense(username);
                                break;
                            case "2":
                                yield logoutUser(username);
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
            yield wait(2000);
            console.clear();
        }
    });
}
main();
