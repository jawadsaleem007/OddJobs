const express = require('express');
const router = express.Router();
const { addDefaultRoles } = require('../controllers/roleController'); // Import the function

// Route to add default roles
router.post('/add-default-roles', async (req, res) => {
  try {
    await addDefaultRoles(); // Call the function to add roles
    res.status(200).json({ message: 'Roles have been added or already exist.' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding roles', error: error.message });
  }
});

module.exports = router;
