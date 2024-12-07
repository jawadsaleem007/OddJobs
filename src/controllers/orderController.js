const Order = require('../models/Order');
const Gig = require('../models/Gig');
const { AppError } = require('../utils/errorHandler');

// Create an order for a gig
exports.createOrder = async (req, res, next) => {
  try {
    const { gigId, title, description, amount, deliveryDate, milestones } = req.body;

    // Check if the gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return next(new AppError('Gig not found', 404));
    }

    // Check if the client is the one placing the order
    const client = req.user._id;

    // Create a new order
    const order = new Order({
      client,
      gig: gigId,
      title,
      description,
      amount,
      deliveryDate,
      milestones,
      status: 'pending'
    });

    // Save the order
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get all orders for the logged-in client
exports.getClientOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ client: req.user._id }).populate('gig');
    res.status(200).json(orders);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get order details by order ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('gig');
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    res.status(200).json(order);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
