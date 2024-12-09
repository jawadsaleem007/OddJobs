const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');
const transactionController = require('../controllers/transactionController');
const analyticsController = require('../controllers/analyticsController');
const platformSettingsController = require('../controllers/platformSettingsController');
const feedbackController = require('../controllers/feedbackController');
const supportController = require('../controllers/supportController');
const { categoryValidators, transactionValidators } = require('../utils/validators');
const userController = require("../controllers/usersController");
// Category Management Routes
router.post('/categories', adminAuth, categoryValidators.create, categoryController.addCategory);
router.put('/categories/:id', adminAuth, categoryValidators.update, categoryController.updateCategory);
router.delete('/categories/:id', adminAuth, categoryController.deleteCategory);
router.get('/categories', categoryController.getAllCategories);

// Transaction Management Routes
router.get('/transactions', adminAuth, transactionController.getAllTransactions);
router.put('/transactions/:id/withdrawal', adminAuth, transactionValidators.withdrawal, transactionController.handleWithdrawalRequest);
router.post('/transactions', adminAuth, transactionValidators.create, transactionController.createTransaction);
router.delete('/transactions/:id', adminAuth, transactionValidators.delete, transactionController.deleteTransaction);



// Analytics Routes
router.get('/analytics/platform-stats', adminAuth, analyticsController.getPlatformStats);
router.get('/analytics/export', adminAuth, analyticsController.exportReportCSV);

// Platform Settings Routes
router.get('/settings', adminAuth, platformSettingsController.getSettings);
router.put('/settings', adminAuth, platformSettingsController.updateSettings);

// Feedback Management Routes
router.get('/reviews/flagged', adminAuth, feedbackController.getFlaggedReviews);
router.put('/reviews/:id', adminAuth, feedbackController.handleFlaggedReview);

// Support Ticket Routes
router.get('/support/tickets', adminAuth, supportController.getAllTickets);
router.put('/support/tickets/:id/assign', adminAuth, supportController.assignTicket);
router.put('/support/tickets/:id/status', adminAuth, supportController.updateTicketStatus);
router.post('/support/tickets', adminAuth, supportController.addTicket);
 


router.get('/users',adminAuth,userController.getAllUsers);

module.exports = router;