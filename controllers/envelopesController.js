const {Envelope, User} = require('../sequelize/models');

const getEnvelopeByUserId = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        const envelopeId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const envelope = await Envelope.findOne({ where: { id: envelopeId, user_id: userId } });
        if (!envelope) {
            return res.status(404).json({ error: 'Envelope not found' });
        }

        return res.status(200).json({ envelope });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const getAllEnvelopesByUserId = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ envelopes: await Envelope.findAll({ where: { user_id: userId } }) });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const createEnvelope = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { category_id, title, budget } = req.body;
        if (!category_id || !title || !budget) {
            return res.status(400).json({ error: 'category_id, title, and budget are required' });
        }

        const newEnvelope = await Envelope.create({
            user_id: userId,
            category_id,
            title,
            budget
        });

        return res.status(201).json({ envelope: newEnvelope });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const updateEnvelope = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const envelope_id = req.params.id;
        const envelope = await Envelope.findOne({ where: { id: envelope_id, user_id: userId } });
        if (!envelope) {
            return res.status(404).json({ error: 'Envelope not found' });
        }

        const { category_id, title, budget } = req.body;
        if (category_id !== undefined) envelope.category_id = category_id;
        if (title !== undefined) envelope.title = title;
        if (budget !== undefined) envelope.budget = budget;
        await envelope.save();

        return res.status(200).json({ envelope });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

const deleteEnvelope = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const envelope_id = req.params.id;
        const envelope = await Envelope.findOne({ where: { id: envelope_id, user_id: userId } });
        if (!envelope) {
            return res.status(404).json({ error: 'Envelope not found' });
        }

        await envelope.destroy();
        return res.status(200).json({ message: 'Envelope deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message});
        console.error(err);
    }
};

module.exports = {
    getEnvelopeByUserId,
    getAllEnvelopesByUserId,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope
};