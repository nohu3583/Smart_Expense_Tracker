"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var account_1 = require("../mongodb/account");
var functions_1 = require("../app/functions");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a, account, active_account, choice, _b, active_account_1, what_do_do;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!true) return [3 /*break*/, 35];
                    return [4 /*yield*/, (0, account_1.amount_of_accounts)()];
                case 1:
                    if (!((_c.sent()) === 0)) return [3 /*break*/, 10];
                    console.log("\n Smart Expense Tracker");
                    console.log("1. Register");
                    console.log("2. Exit");
                    console.log("3. For testing only, an account to test with is created");
                    return [4 /*yield*/, (0, functions_1.askQuestion)("Choose an option: ")];
                case 2:
                    choice = _c.sent();
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 3];
                        case "2": return [3 /*break*/, 5];
                        case "3": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, (0, functions_1.registerUser)()];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 5:
                    console.log("Goodbye!");
                    functions_1.rl.close();
                    return [2 /*return*/];
                case 6:
                    account = {
                        accountOwner: "123456",
                        balance: 1000,
                        currency: "USD",
                        username: "noahhzr",
                        password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", //hashas från 123456
                        loggedIn: true
                    };
                    return [4 /*yield*/, (0, account_1.createAccount)(account)];
                case 7:
                    _c.sent();
                    console.log("Testing account created successfully!");
                    return [3 /*break*/, 9];
                case 8:
                    console.log("Invalid option. Try again.");
                    _c.label = 9;
                case 9: return [3 /*break*/, 33];
                case 10: return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 11:
                    active_account = _c.sent();
                    if (active_account !== "") {
                        console.log("User ".concat(active_account, " is logged in."));
                    }
                    else {
                        console.log("No user is logged in.");
                    }
                    console.log("\n Smart Expense Tracker");
                    console.log("1. Register");
                    console.log("2. Login");
                    console.log("3. Display Users");
                    console.log("4. Add Expense");
                    console.log("5. Logout");
                    console.log("6. Exit");
                    console.log("7. More options for expenses, change or delete as well as filtering by multiple options");
                    console.log("8. Account options");
                    return [4 /*yield*/, (0, functions_1.askQuestion)("Choose an option: ")];
                case 12:
                    choice = _c.sent();
                    _b = choice;
                    switch (_b) {
                        case "1": return [3 /*break*/, 13];
                        case "2": return [3 /*break*/, 15];
                        case "3": return [3 /*break*/, 17];
                        case "4": return [3 /*break*/, 18];
                        case "5": return [3 /*break*/, 20];
                        case "6": return [3 /*break*/, 22];
                        case "7": return [3 /*break*/, 24];
                        case "8": return [3 /*break*/, 30];
                    }
                    return [3 /*break*/, 32];
                case 13:
                    console.clear();
                    return [4 /*yield*/, (0, functions_1.registerUser)()];
                case 14:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 15:
                    console.clear();
                    return [4 /*yield*/, (0, functions_1.loginUser)()];
                case 16:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 17:
                    (0, account_1.getAllUsernames)().then(function (usernames) {
                        console.log("Created users are: ".concat(usernames.join(", ")));
                    });
                    return [3 /*break*/, 33];
                case 18:
                    console.clear();
                    return [4 /*yield*/, (0, functions_1.addExpense)()];
                case 19:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 20: return [4 /*yield*/, (0, functions_1.logoutUser)()];
                case 21:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 22:
                    console.log("Goodbye!");
                    return [4 /*yield*/, (0, account_1.find_active_account)()];
                case 23:
                    active_account_1 = _c.sent();
                    if (active_account_1 !== "") {
                        (0, account_1.switch_logged_in_status)(active_account_1);
                    }
                    functions_1.rl.close();
                    return [2 /*return*/];
                case 24: return [4 /*yield*/, (0, functions_1.askQuestion)("Do you want to change or delete an expense, or view expense? (change/delete/view): ")];
                case 25:
                    what_do_do = _c.sent();
                    if (!(what_do_do === "change" || what_do_do === "delete")) return [3 /*break*/, 27];
                    return [4 /*yield*/, (0, functions_1.change_or_delete_expense)()];
                case 26:
                    _c.sent();
                    return [3 /*break*/, 30];
                case 27:
                    if (!(what_do_do === "view")) return [3 /*break*/, 29];
                    return [4 /*yield*/, (0, functions_1.getExpensesForUser)()];
                case 28:
                    _c.sent();
                    return [3 /*break*/, 30];
                case 29:
                    console.log("Invalid option. Try again.");
                    _c.label = 30;
                case 30:
                    console.clear();
                    return [4 /*yield*/, (0, functions_1.account_options)()];
                case 31:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 32:
                    console.log("Invalid option. Try again.");
                    _c.label = 33;
                case 33: return [4 /*yield*/, (0, functions_1.wait)(2000)];
                case 34:
                    _c.sent();
                    console.clear();
                    return [3 /*break*/, 0];
                case 35: return [2 /*return*/];
            }
        });
    });
}
main();
