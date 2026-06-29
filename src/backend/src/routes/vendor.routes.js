const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vendor.controller');

router.get('/list', ctrl.getAllVendorsList);
router.get('/', ctrl.getVendors);
router.get('/:id', ctrl.getVendor);
router.post('/', ctrl.createVendor);
router.put('/:id', ctrl.updateVendor);
router.delete('/:id', ctrl.deleteVendor);

module.exports = router;