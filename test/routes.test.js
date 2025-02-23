const request = require('supertest');
const app = require('../index'); // Import your Express app

describe('API Routes Testing', () => {

    // ✅ Test GET /users (Fetch all users)
    it('should return all users', async () => {
        const res = await request(app).get('/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ Test POST /users (Create a new user)
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/users')
            .send({ username: 'test_user', email: 'test@example.com', password_hash: 'secure123' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toBe('test_user');
    });

    // ✅ Test GET /users/:id
    it('should return a user by ID', async () => {
        const res = await request(app).get('/users/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
    });

    // ✅ Test GET /categories/user/:userId
    it('should return categories for a user', async () => {
        const res = await request(app).get('/categories/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ Test POST /categories (Create a new category)
    it('should create a new category', async () => {
        const res = await request(app)
            .post('/categories')
            .send({ user_id: 1, name: 'Utilities', type: 'Expense' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Utilities');
    });

    // ✅ Test GET /envelopes/user/:userId
    it('should return envelopes for a user', async () => {
        const res = await request(app).get('/envelopes/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ Test POST /envelopes
    it('should create an envelope', async () => {
        const res = await request(app)
            .post('/envelopes')
            .send({ user_id: 1, category_id: 1, title: 'Shopping', budget: 3000 });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Shopping');
    });

    // ✅ Test GET /transactions
    it('should return all transactions', async () => {
        const res = await request(app).get('/transactions');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ Test POST /transactions
    it('should create a transaction', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({ user_id: 1, envelope_id: 1, amount: 500, type: 'Expense', description: 'Bought groceries' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.amount).toBe(500);
    });

    // ✅ Test GET /transfers
    it('should return all transfers', async () => {
        const res = await request(app).get('/transfers');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // ✅ Test POST /transfers
    it('should create a transfer', async () => {
        const res = await request(app)
            .post('/transfers')
            .send({ user_id: 1, from_envelope_id: 1, to_envelope_id: 2, amount: 1000 });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.amount).toBe(1000);
    });

});
