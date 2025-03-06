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
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const database_1 = require("../models/database");
const user_1 = require("../models/user");
const account_1 = require("../models/account");
const expense_1 = require("../models/expense");
const functions_1 = require("./functions");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const db = database_1.Database.getInstance();
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
function registerUser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Register New User");
        const username = yield askQuestion("Enter username: ");
        const password = yield askQuestion("Enter password: "); // check for hidden input, so that password is not shown when registering
        if (db.findUser(username)) {
            console.log("Username already exists!");
            return;
        }
        let status = false;
        console.log(`User ${username} registered successfully!`);
        const user = new user_1.User(username, password, "", status);
        db.addUser(user);
        user.change_account_status(user.logged_in);
        yield createAccount(user);
    });
}
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("User Login");
        const username = yield askQuestion("Enter username: ");
        const password = yield askQuestion("Enter password: ");
        const user = db.findUser(username);
        const status = db.find_account_status(username);
        if (status) {
            console.log("User is alredy logged in");
            return null;
        }
        else {
            if (user && user.authenticate(password)) {
                user.change_account_status(user.logged_in);
                console.log(`Login successful! Welcome, ${username}`);
                return user;
            }
            else {
                console.log(" Invalid username or password.");
                return null;
            }
        }
    });
}
function logoutUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = db.get_active_account();
        const user = db.find_account_id(user_id);
        if (user) {
            user.change_account_status(user.logged_in);
            console.log("Logout successful!");
            return;
        }
        else {
            console.log("No user logged in");
            return;
        }
    });
}
function createAccount(user) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(" Create Bank Account");
        const accountNumber = yield askQuestion("Enter account number: ");
        const currency = yield askQuestion("Enter currency (e.g., USD, EUR): ");
        let balanceInput = yield askQuestion("Enter initial balance: ");
        const balance = parseFloat(balanceInput);
        while (isNaN(balance)) {
            console.log("Invalid balance amount. Please enter a number.");
            balanceInput = yield askQuestion("Enter initial balance: ");
        }
        const bankName = yield askQuestion("Enter bank name: ");
        const account = new account_1.Account(accountNumber, balance, currency, bankName);
        db.addAccount(account);
        user.input_account_number(accountNumber);
        console.log(`Account created for ${user.username} with ${balance} ${currency} at ${bankName}`);
    });
}
function addExpense() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db.get_active_account()) {
            console.log("No user logged in. Please login first.");
            return;
        }
        else {
            const account_id = db.get_active_account();
            console.log("Add expense");
            const description = yield askQuestion("Describe your purchase: ");
            const amount_input = yield askQuestion("How much was it? ");
            let amount = parseFloat(amount_input);
            let currency = yield askQuestion("In what currency? ");
            const date_input = yield askQuestion("When was the purchase made?(format: ÅÅÅÅ-MM-DD) ");
            const date = new Date(Date.parse(date_input));
            let category = yield askQuestion("What category does this fall under? \n" + functions_1.expense_categories + ":  ");
            while (1 > parseFloat(category) || parseFloat(category) > 7) {
                category = yield askQuestion("Invalid category. Please enter a number between 1-7.");
            }
            if (isNaN(amount)) {
                console.log("Invalid amount. Please enter a number.");
                return;
            }
            if (currency !== db.get_currency_from_account(account_id)) {
                const currency_api_data = yield fetch(`https://api.exchangeratesapi.io/latest?base=${currency}`);
                const exchangeRate = 1; //placeholder
                amount = amount * exchangeRate;
                currency = db.get_currency_from_account(account_id);
            }
            const expense = new expense_1.Expense(description, amount, date, category, currency, account_id);
            db.addExpense(expense);
            console.log(`Expense added for ${amount} ${currency} on ${date} in ${category}`);
            db.account_withdraw_after_expense(account_id, amount);
            const answer = yield askQuestion("Do you want to add another expense? (yes/no) ");
            if (answer.toLowerCase() === "yes") {
                yield wait(200);
                console.clear();
                yield addExpense();
            }
            else {
                main();
            }
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
        while (true) {
            if (db.get_users().length === 0) {
                console.log("\n Smart Expense Tracker");
                console.log("1. Register");
                console.log("2. Exit");
                console.log("3. For testing only");
                const choice = yield askQuestion("Choose an option: ");
                switch (choice) {
                    case "1":
                        yield registerUser();
                        break;
                    case "2":
                        console.log("Goodbye!");
                        rl.close();
                        return;
                    case "3":
                        const user = new user_1.User("Test", "testa", "20020", true);
                        db.addUser(user);
                        const account = new account_1.Account("20020", 10000, "SEK", "Skandia");
                        db.addAccount(account);
                        break;
                    default:
                        console.log("Invalid option. Try again.");
                }
            }
            else {
                console.log("\n Smart Expense Tracker");
                console.log("1. Register");
                console.log("2. Login");
                console.log("3. Display Users");
                console.log("4. Add Expense");
                console.log("5. Logout");
                console.log("6. Exit");
                const choice = yield askQuestion("Choose an option: ");
                switch (choice) {
                    case "1":
                        yield registerUser();
                        break;
                    case "2":
                        const user = yield loginUser();
                        break;
                    case "3":
                        const usernames = db.display_user_names();
                        console.log(`Created user are: ${usernames}`);
                        break;
                    case "4":
                        yield addExpense();
                        break;
                    case "5":
                        yield logoutUser();
                        rl.close();
                    case "6":
                        console.log("Goodbye!");
                        rl.close();
                        return;
                    default:
                        console.log("Invalid option. Try again.");
                }
            }
            yield wait(2000);
            console.clear();
        }
    });
}
main();
