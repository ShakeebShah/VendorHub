const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/quotation.controller');

router.get('/compare', ctrl.compareQuotations);
router.get('/recent', ctrl.getRecentQuotations);
router.get('/', ctrl.getQuotations);
router.get('/:id', ctrl.getQuotation);
router.post('/', ctrl.createQuotation);
router.put('/:id', ctrl.updateQuotation);
router.patch('/:id/status', ctrl.updateStatus);
router.delete('/:id', ctrl.deleteQuotation);

module.exports = router;