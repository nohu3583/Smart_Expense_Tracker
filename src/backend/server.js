"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use((0, cors_1.default)()); // Allows requests from your HTML page
app.use(express_1.default.json()); // Parses incoming JSON requests
// Example API Route
app.post('/api/expense', (req, res) => {
    console.log('Received expense:', req.body);
    res.json({ message: 'Expense received!' });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
