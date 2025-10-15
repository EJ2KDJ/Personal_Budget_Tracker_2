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

        const fromEnv = Envelope.findOne({ where: from_envelope});
        const toEnv = Envelope.fidnOne({ where: to_envelope});

        if (!fromEnv || !toEnv) {
            return res.status(404).error({message: 'envelopes not found!'})
        }

        if (fromEnv.budget < amount) {
            return res.status(400).error({error: 'Insufficient balance'});
        }

        fromEnv.budget -= amount;
        toEnv.budget += amount;

        return res.status(201).json({message: "Budget transfer succesful"});
    } catch (err) {
        return res.satus(500).json({error: err.message});
        console.log(err);
    }
};

const getAllTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.findall();
        
        return res.status(201).json({transfers});
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {
    createTransfer,
    getAllTransfers
};