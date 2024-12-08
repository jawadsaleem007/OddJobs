const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Gig = require('../models/Gig');
const Order = require('../models/Order');
// @desc Get all saved gigs for the client
// @route GET /api/clients/saved-gigs
// @access Private
const getSavedGigs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('savedGigs'); // populate to get gig details
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user.savedGigs);
});

// @desc Save a new gig to the client's wishlist
// @route POST /api/clients/saved-gigs
// @access Private
const saveGig = asyncHandler(async (req, res) => {
    const { gigId } = req.body;
    const gig = await Gig.findById(gigId);
    if (!gig) {
        res.status(404);
        throw new Error('Gig not found');
    }

    const user = await User.findById(req.user._id);
    if (user.savedGigs && user.savedGigs.includes(gig._id)) {
        res.status(400);
        throw new Error('Gig already saved');
    }

    // Add the gig to the saved list
    if (!user.savedGigs) {
        user.savedGigs = [];
    }
    user.savedGigs.push(gig._id);
    await user.save();
    res.status(201).json({ message: 'Gig saved successfully' });
});

// @desc Remove a gig from the client's wishlist
// @route DELETE /api/clients/saved-gigs/:id
// @access Private
const removeSavedGig = asyncHandler(async (req, res) => {
    const { id: gigId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user.savedGigs || !user.savedGigs.includes(gigId)) {
        res.status(404);
        throw new Error('Gig not found in saved list');
    }

    user.savedGigs = user.savedGigs.filter(
        (savedGigId) => savedGigId.toString() !== gigId
    );
    await user.save();
    res.status(200).json({ message: 'Gig removed from saved list' });
});


const getClientOrders = asyncHandler(async (req, res) => {
  const { status } = req.query; // Optional query parameter for filtering by status
  const query = { client: req.user.id };

  if (status) {
      query.status = status;
  }

  const orders = await Order.find(query)
      .populate('gig', 'title description') // Include specific fields from the Gig
      .select('status amount downloadLink createdAt updatedAt') // Include specific fields
      .sort({ createdAt: -1 });

  res.status(200).json(orders);
});

// @desc Place a custom order
// @route POST /api/orders/custom
// @access Private
const placeCustomOrder = asyncHandler(async (req, res) => {
  const { gigId, amount, paymentMethod } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) {
      res.status(404);
      throw new Error('Gig not found');
  }

  const order = new Order({
      gig: gigId,
      client: req.user.id,
      freelancer: gig.createdBy,
      amount,
      paymentMethod,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});


const createOrder = asyncHandler(async (req, res) => {
  const { gigId, title, description, amount, deliveryDate, milestones } = req.body;

  // Find the gig by ID
  const gig = await Gig.findById(gigId);
  if (!gig) {
      res.status(404);
      throw new Error('Gig not found');
  }

  // Find the client who is creating the order
  const client = await User.findById(req.user.id);
  if (!client) {
      res.status(404);
      throw new Error('Client not found');
  }

  // Create a new order
  const order = new Order({
      client: client._id,
      gig: gig._id,
      title,
      description,
      amount,
      deliveryDate,
      milestones
  });

  await order.save();
  res.status(201).json(order);
});

// @desc Get order by ID
// @route GET /api/clients/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;

  // Find the order by ID and populate gig and client
  const order = await Order.findById(orderId).populate('gig client');
  if (!order) {
      res.status(404);
      throw new Error('Order not found');
  }

  res.json(order);
});

// @desc Retrieve orders by status
// @route GET /api/clients/orders/status/:status
// @access Private
const retrieveOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  // Validate status
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'disputed'];
  if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
  }

  // Retrieve orders by status
  const orders = await Order.find({ client: req.user.id, status }).populate('gig client');
  res.json(orders);
});




module.exports = { getSavedGigs, saveGig, removeSavedGig,placeCustomOrder,getClientOrders };
