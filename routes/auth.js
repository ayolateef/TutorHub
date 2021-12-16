const express = require('express');

const {
    adminLogin,
     superadminLogin,
      tutorLogin,
       studentLogin,
        forgotSuperadminPassword,
         forgotadminPassword,
          forgotTutorPassword,
           forgotStudentPassword,
           resetSuperadminPassword,
           resetAdminPassword,
           resetTutorPassword,
           resetStudentPassword,
        
        } = require('../controllers/auth');

const router = express.Router();

router.post('/admin', adminLogin);
router.post('/superadmin', superadminLogin);
router.post('/tutor', tutorLogin);
router.post('/student',studentLogin);
router.post('/forgotSuperadminPassword', forgotSuperadminPassword);
router.post('/forgotadminPassword', forgotadminPassword);
router.post('/forgotTutorPassword', forgotTutorPassword);
router.post('/forgotStudentPassword', forgotStudentPassword);

router.put('/resetSuperadminPassword/:resettoken', resetSuperadminPassword );
router.put('/resetAdminPassword/:resettoken', resetAdminPassword );
router.put('/resetTutorPassword/:resettoken', resetTutorPassword );
router.put('/resetStudentPassword/:resettoken', resetStudentPassword );

module.exports = router;