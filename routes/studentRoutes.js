// routes/studentRoutes.js
const express = require('express');
const Student = require('../models/student');
const Mentor = require('../models/mentor');

const router = express.Router();

// Create Student
router.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign or Change Mentor for a particular Student
router.put('/students/:studentId/mentor', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    const newMentor = await Mentor.findById(req.body.mentorId);

    if (student.mentor) {
      student.previousMentors.push(student.mentor);
    }

    student.mentor = newMentor._id;
    await student.save();

    newMentor.students.push(student._id);
    await newMentor.save();

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get previously assigned mentors for a Student
router.get('/students/:studentId/previous-mentors', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('previousMentors');
    res.status(200).json(student.previousMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
