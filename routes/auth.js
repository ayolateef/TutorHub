const express = require('express');

const {
    superadminLogin,
      adminLogin,
      tutorLogin,
       studentLogin,

    logoutSuperadmin ,
      logoutAdmin,
        logoutTutor,
          logoutStudent,

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

           getMeSuperadmin,
           getMeAdmin,
           getMeTutor,
           getMeStudent
           
        } = require('../controllers/auth');

const router = express.Router();

const {protect} = require('../middleware/auth')

//router.route("/").post(protect, authorize(superadmin),createSuperadmin).post('/login', authorize(superadmin),login);

router.post('/superadmin',superadminLogin);
router.post('/admin', adminLogin);
router.post('/tutor', tutorLogin);
 router.post('/student', studentLogin);

router.get('/superadmin',logoutSuperadmin);
router.get('/admin', logoutAdmin);
router.get('/tutor', logoutTutor);
 router.get('/student', protect, logoutStudent);

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

router.get('/superadminme', protect, getMeSuperadmin);
router.get('/adminme', protect, getMeAdmin);
router.get('/tutorme', protect, getMeTutor);
router.get('/studentme', protect, getMeStudent);


module.exports = router;