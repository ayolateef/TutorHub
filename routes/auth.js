const express = require('express');

const {
    superAdminLogin,
    adminLogin,
    tutorLogin,
    studentLogin,

    logoutSuperadmin,
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

router.post('/super_admin', superAdminLogin);
router.post('/admin', adminLogin);
router.post('/tutor', tutorLogin);
router.post('/student', studentLogin);

router.get('/super_admin', logoutSuperadmin);
router.get('/admin', logoutAdmin);
router.get('/tutor', logoutTutor);
router.get('/student', protect, logoutStudent);

router.post('/forgotSuperadminPassword', forgotSuperadminPassword);
router.post('/forgotadminPassword', forgotadminPassword);
router.post('/forgotTutorPassword', forgotTutorPassword);
router.post('/forgotStudentPassword', forgotStudentPassword);

router.put('/resetSuperadminPassword/:resettoken', resetSuperadminPassword);
router.put('/resetAdminPassword/:resettoken', resetAdminPassword);
router.put('/resetTutorPassword/:resettoken', resetTutorPassword);
router.put('/resetStudentPassword/:resettoken', resetStudentPassword);

router.put('/updateSuperadminDetails', protect, updateSuperadminDetails);
router.put('/updateAdminDetails', protect, updateAdminDetails);
router.put('/updateTutorDetails', protect, updateTutorDetails);
router.put('/updateStudentDetails', protect, updateStudentDetails);

router.get('/super_admin/me', protect, getMeSuperadmin);
router.get('/admin/me', protect, getMeAdmin);
router.get('/tutor/me', protect, getMeTutor);
router.get('/student/me', protect, getMeStudent);


module.exports = router;