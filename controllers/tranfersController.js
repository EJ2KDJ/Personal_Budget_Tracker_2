const {Transfer, User, Envelope} = require('../sequelize/models');

const createTransfer = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({error: 'Unauthorized'});
        }

        const {from_envelope, to_envelope, amount, date} = req.body;
        if (!from_envelope, !to_envelope, !amount) {
            return res.status(400).json({message: 'All fields are required'})
        }

        const newTransfer = await Transfer.create({
            user_id: userId,
            from_envelope,
            to_envelope,
            amount
        });

        return res.status(201).json({ transfer: newTransfer});
    } catch (err) {
        return res.satus(500).json({error: err.message});
        console.log(err);
    }
};