console.log('Routes file is loaded!');

const express = require('express');
const router = express.Router();
const pool = require('../db');

// -- Users
router.get('/users/:id', async (req, res) => {
    try {
        const{ id } = req.params;

        const result = await pool.query(
            'SELECT id, username, email, created_at FROM users WHERE id = $1', [id]
        );

        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/users', async (req, res) => {
    try {
        const{ username, email, password_hash } = req.body;
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, CURENT_TIMESTAMP) RETUrNING *',
            [username, email, password_hash]
        );
        res.status(201).json(result.rows[0]);
    } catch(err) {
        res.status(500).json({error: err.message});
    };
});

router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});


// -- Categories
router.get('/categories/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            'SELECT * FROM categories WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/categories', async (req, res) => {
    try {
        const {user_id, name, type} = req.body;
        const result = await pool.query(
            'INSERT INTO categories (user_id, name, type, created_at) VALUES($1, $2. $3, CURRENT_TIMESTAMP) RETURNING *',
            [user_id, name, type]
        )
        res.status(201).json(result.rows[0]);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// -- Envelopes 
router.get('/envelopes/user/:userId', async (req, res) => {
    try {
        const {userId } = req.query;
        const result = await pool.query(
            'SELECT * FROM envelopes WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/envelopes', async (req, res) => {
    try {
        const { user_id, category_id, title, budget } = req.body;
        const result = await pool.query(
            'INSERT INTO envelopes (user_id, category_id, title, budget) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, category_id, title, budget]
        )
        res.status(201).json(result.rows[0]);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// -- Transactions
router.get('/transactions/user/:userId', async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId]
        )
        res.json(result.rows);

        if (result.rows === 0 ){
            return res.status(404).json({error: "No transactions found for this user"});
        }
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.get('/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions');

        res.status(200).json(result.rows);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// -- Transfers

router.post('/transfer', async(req, res) => {
    try {
        const {user_id, from_envelope_id, to_envelope_id, amount} = req.body;

        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero."});
        }

        await pool.query("BEGIN");

        const fromEnvelope = await pool.query("SELECT budget FROM envelopes WHERE id = $1", [from_envelope_id]);
        if (fromEnvelope.rows.length === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ error: "Source envelope not found"});
        }
        if (fromEnvelope.rows[0].budget < amount) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: "Insufficient funds in the source envelope."});
            
        }

        await pool.query("UPDATE envelopes SET budget = budget - $1 WHERE id = $2", [amount, from_envelope_id]);

        await pool.query("UPDATE envelopes SET budget = budget - $1 WHERE id = $2", [amount, to_envelope_id]);

        const transferResult = await pool.query(
            'INSERT INTO transfer (user_id, from_envelope_id, to_envelope_id, amount, date) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
            [user_id, from_envelope_id, to_envelope_id, amount]
        );

        await pool.query("COMMIT");

        res.status(201).json(transferResult.rows[0]);
    } catch(err) { 
        await pool.query("ROLLBACK");
        res.status(500).json({error: err.message});
    }
});

router.get('/transfers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transfers ORDER BY date DESC');
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// -- Updates
router.put('/envelopes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, budget } = req.body;

        if (!title && budget === undefined) {
            return res.status(400).json({ error: "Must provid title or budget"});
        }

        const result = await pool.query(
            'UPDATE envelopes SET title = COALESCE($1, title), budget = COALESCE($2, budget) WHERE id = $3 RETURNING *',
            [title, budget, id]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({error: "Envelope not found"});
        }

        res.json(result.rows[0]);
        
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.delete('/envelopes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM envelopes WHERE id = $1', [id]);

        if(result.rows.length[0]) {
            return res.status(404).json({ error: "Envelope not found."});
        }
        
        res.status(200).json({ message: "Envelope deleted"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = router;