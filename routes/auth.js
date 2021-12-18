const express = require('express');

const {
    superadminLogin,
      adminLogin,
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
            
           updateSuperadminDetails,
           updateAdminDetails,
           updateTutorDetails,
           updateStudentDetails,

           getMe
           
        } = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth')

//router.route("/").post(protect, authorize(superadmin),createSuperadmin).post('/login', authorize(superadmin),login);

router.post('/superadmin',superadminLogin);
router.post('/admin', adminLogin);
router.post('/tutor', tutorLogin);
router.post('/student', protect, studentLogin);

router.post('/forgotSuperadminPassword', forgotSuperadminPassword);
router.post('/forgotadminPassword', forgotadminPassword);
router.post('/forgotTutorPassword', forgotTutorPassword);
router.post('/forgotStudentPassword', forgotStudentPassword);

router.put('/resetSuperadminPassword/:resettoken', resetSuperadminPassword );
router.put('/resetAdminPassword/:resettoken', resetAdminPassword );
router.put('/resetTutorPassword/:resettoken', resetTutorPassword );
router.put('/resetStudentPassword/:resettoken', resetStudentPassword );

router.put('/updateSuperadminDetails', protect, updateSuperadminDetails);
router.put('/updateAdminDetails', protect, updateAdminDetails);
router.put('/updateTutorDetails',protect,  updateTutorDetails);
router.put('/updateStudentDetails',protect,  updateStudentDetails);

router.get('/me', protect, getMe);


module.exports = router;