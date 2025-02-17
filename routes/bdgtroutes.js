const express = require('express');
const router = express.Router();
const pool = require('./db');

// -- Users
router.get('/users/:id', async (req, res) => {
 
});

router.post('/users', async (req, res) => {

});


// -- Categories
router.get('/categories/user/:userId', async (req, res) => {

});

router.post('/categories', async (req, res) => {

});

// -- Envelopes 
router.get('/envelopes/user/:userId', async (req, res) => {

});

router.post('/envelopes', async (req, res) => {

});

// -- Transactions
router.get('/transactions/user/:userId', async (req, res) => {

});

router.get('/transactions', async (req, res) => {

});

// -- Transfers
router.get('/transfers', async (req, res) => {

});

// -- Updates
router.put('/envelopes/:id', async (req, res) => {

});

router.delete('/envelopes/:id', async (req, res) => {

});


module.exports = router;