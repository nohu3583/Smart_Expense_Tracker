import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows requests from your HTML page
app.use(express.json()); // Parses incoming JSON requests

// Example API Route
app.post('/api/expense', (req, res) => {
    console.log('Received expense:', req.body);
    res.json({ message: 'Expense received!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
