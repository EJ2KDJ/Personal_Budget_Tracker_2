const express = require('express');
const router = express.Router();
const envelopeController = require('../controllers/envelopesController');
const authentication = require('../middleware');

router.use(authentication);

router.post('/', envelopeController.createEnvelope);
router.get('/users/:id', envelopeController.getAllEnvelopesByUserId);
router.get('/users/:id', envelopeController.getEnvelopeByUserId);
router.put('/:id', envelopeController.updateEnvelope);
router.delete('/:id', envelopeController.deleteEnvelope);

module.exports = router;