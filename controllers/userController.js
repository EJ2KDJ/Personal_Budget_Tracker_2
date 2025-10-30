const {User} = require('../sequelize/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// (admin only) ------------------------------------

//Get all users 
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'email', 'createdAt'] });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};

//Update user
const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const authUserId = req.user.id; // from JWT middleware

    if (userId !== authUserId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { username, email, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password_hash = await bcrypt.hash(password, 10);

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user = await User.findByPk(user_id);
        if (parseInt(req.params.id) !== user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Categories.destroy({ where: { user_id } });
        await Envelopes.destroy({ where: { user_id } });
        await Transactions.destroy({ where: { user_id } });
        await Transfers.destroy({ where: { user_id } });
        await RecurringTransactions.destroy({ where: { user_id } });

        if (!user_id) {
            return res.status(404).json({ error: 'User not found or does not exist'});
        }
        await User.destroy({ where: { id: user_id } });        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};


// (public) ------------------------------------

// Get user by ID 
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email', 'createdAt'] });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const{ username, email, password } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        
        if (await User.findOne({ where: { email } })) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newUser = await User.create({ username, email, password_hash });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user: newUser, token });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    createUser,
    deleteUser
};