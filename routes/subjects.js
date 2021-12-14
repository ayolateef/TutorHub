const express = require("express");
const {
  getSubjects,getSubject,addSubject,updateSubject,deleteSubject} = require('../controllers/subjects');

  const router = express.Router({mergeParams: true});

  router.route('/').get(getSubjects).post(addSubject);
  router.route('/:id').get(getSubject).put(updateSubject).delete(deleteSubject);

  module.exports = router; 