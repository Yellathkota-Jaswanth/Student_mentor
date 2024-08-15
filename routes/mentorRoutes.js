// routes/mentorRoutes.js
const express = require('express');
const Mentor = require('../models/mentor');
const Student = require('../models/student');

const router = express.Router();

// Create Mentor
router.post('/mentors', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign students to a Mentor
router.post('/mentors/:mentorId/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);
    const students = await Student.find({ _id: { $in: req.body.studentIds }, mentor: null });

    mentor.students.push(...students.map(student => student._id));
    students.forEach(student => student.mentor = mentor._id);

    await mentor.save();
    await Promise.all(students.map(student => student.save()));

    res.status(200).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students for a particular Mentor
router.get('/mentors/:mentorId/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate('students');
    res.status(200).json(mentor.students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
