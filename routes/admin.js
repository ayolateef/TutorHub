const express = require('express');
const {getAdmins,getAdmin, createAdmin} = require('../controllers/admin');


const router = express.Router();

router.route('/').get(getAdmins).post(createAdmin)
router.route('/:id').get(getAdmin)

module.exports = router;