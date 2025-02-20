const express = require('express');
const router = express.Router();
const pool = require('./db');

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

    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// -- Transfers
router.get('/transfers', async (req, res) => {
    try {

    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// -- Updates
router.put('/envelopes/:id', async (req, res) => {
    try {

    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

router.delete('/envelopes/:id', async (req, res) => {
    try {

    } catch(err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = router;