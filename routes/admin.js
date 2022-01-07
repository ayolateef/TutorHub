const express = require('express');
const {getAdmins,getAdmin, createAdmin,getAllAdmins,updateAdmin} = require('../controllers/admin');

const router = express.Router();


const {protect, authorize} = require('../middleware/auth');

router.use (protect);
router.use(authorize('superadmin'));

router 
.route('/')
    .get(getAdmins)
        .post( createAdmin)
            .get(getAllAdmins)
            
router.route('/:id').get(getAdmin).put(updateAdmin)

module.exports = router;