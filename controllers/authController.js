const {User} = require('../sequelize/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message});
        console.log(err);
    }
};

module.exports = login;