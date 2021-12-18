const express = require("express");
const {
  getSubjects,getSubject,addSubject,updateSubject,deleteSubject} = require('../controllers/subjects');

  const router = express.Router({mergeParams: true});

  const {protect, authorize } = require('../middleware/auth');

  router.route('/').get(getSubjects).post( protect, authorize('superadmin', 'admin'),addSubject);
  router.route('/:id').get(getSubject).put( protect, updateSubject).delete( protect, authorize('superadmin', 'admin'), deleteSubject);

  module.exports = router; 