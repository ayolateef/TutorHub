const express = require('express');
const {getAdmins,getAdmin, createAdmin,getAllAdmins} = require('../controllers/admin');


const router = express.Router();

router.route('/').get(getAdmins).post(createAdmin).get(getAllAdmins)
router.route('/:id').get(getAdmin)

module.exports = router;