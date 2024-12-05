const SupportTicket = require('../models/SupportTicket');
const { AppError } = require('../utils/errorHandler');
const NotificationService = require('../services/notificationService');

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.assignTicket = async (req, res, next) => {
  try {
    const { adminId } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: adminId,
        status: 'in_progress'
      },
      { new: true }
    );
    
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    await NotificationService.sendAdminAlert(
      `Ticket ${ticket._id} assigned to admin`,
      'high'
    );
    
    res.json(ticket);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }
    
    res.json(ticket);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};