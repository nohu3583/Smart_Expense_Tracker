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
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const MONGO_URI = "mongodb+srv://noahhzr:QfgvtOQflRNLZx3F@noahh.vo7o6.mongodb.net/";
const client = new mongodb_1.MongoClient(MONGO_URI);
exports.client = client;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("✅ Connected to MongoDB Atlas");
            return client.db("expenseTracker"); // Use your database name
        }
        catch (error) {
            console.error("❌ MongoDB Atlas Connection Error:", error);
        }
    });
}
