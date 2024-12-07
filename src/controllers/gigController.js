const Gig = require('../models/Gig');
const Order = require('../models/Order');
const Category = require('../models/Category'); // Category model
const Review = require('../models/Review');  // Ensure Review model is imported
const GigAnalytics = require('../models/GigAnalytics');
// Create a new gig
exports.createGig = async (req, res) => {
  try {
    const { title, description, category, amount, skills, deliveryTime, images } = req.body;
    const freelancer = req.user._id;  // Assuming the user is authenticated and their id is available

    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(400).json({ message: 'Invalid category' });

    const newGig = new Gig({
      title,
      description,
      category,
      amount,
      freelancer,
      skills,
      deliveryTime,
      images,
    });

    await newGig.save();
    res.status(201).json(newGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all gigs for the logged-in Gig Worker
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ freelancer: req.user._id });
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific gig by ID
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing gig
exports.updateGig = async (req, res) => {
  try {
    const { title, description, category, amount, skills, deliveryTime, images } = req.body;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.category = category || gig.category;
    gig.amount = amount || gig.amount;
    gig.skills = skills || gig.skills;
    gig.deliveryTime = deliveryTime || gig.deliveryTime;
    gig.images = images || gig.images;

    await gig.save();
    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a gig
exports.deleteGig = async (req, res) => {
    try {
      const result = await Gig.findByIdAndRemove(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Gig not found' });
      }
  
      res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) {
      console.error('Error deleting gig:', error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Get all orders assigned to the logged-in Gig Worker
exports.getAllOrdersForWorker = async (req, res) => {
    try {
      // Find all orders where the freelancer is associated with the gig
      const orders = await Order.find()
        .populate('client')  // Populate the client (user who placed the order)
        .populate({
          path: 'gig',  // Populate the gig associated with the order
          match: { freelancer: req.user._id },  // Only include gigs for the logged-in freelancer
          select: 'title freelancer'  // You can select specific fields to return
        });
  
      // Filter out orders that don't belong to the logged-in freelancer (since populate doesn't auto-filter)
      const filteredOrders = orders.filter(order => order.gig);
  
      res.status(200).json(filteredOrders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Update the status of an order (e.g., "in_progress", "completed")
exports.updateOrderStatus = async (req, res) => {
    try {
      console.log("Request Params:", req.params);  // Debugging: check the params
      console.log("Request Body:", req.body);      // Debugging: check the body
  
      const { status } = req.body;
      const orderId = req.params.id;
  
      if (!orderId || !status) {
        return res.status(400).json({ message: 'Order ID and Status are required' });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Update the order status
      order.status = status;
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get all reviews for the Gig Worker
exports.getReviewsForGigWorker = async (req, res) => {
  try {
    const orders = await Order.find({ freelancer: req.user._id }).populate('client');
    const reviews = orders.map(order => order.reviews.clientReview);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a specific gig
exports.getAllReviewsForGig = async (req, res) => {
    try {
      const gigId = req.params.id;  // Get the gig ID from the request parameters
      
      // Find all reviews associated with the gig
      const reviews = await Review.find({ gig: gigId }).populate('client', 'name email');  // Populate client info
  
      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this gig' });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get all reviews for all gigs (for Gig Worker)
  exports.getAllReviewsForAllGigs = async (req, res) => {
    try {
      // Get all gigs that belong to the logged-in gig worker
      const gigs = await Gig.find({ freelancer: req.user._id });
  
      if (!gigs || gigs.length === 0) {
        return res.status(404).json({ message: 'No gigs found for this freelancer' });
      }
  
      // Get all reviews for the gigs
      const reviews = await Review.find({ gig: { $in: gigs.map(gig => gig._id) } })
        .populate('client', 'name email')  // Populate client info
        .populate('gig', 'title description');  // Populate gig info
  
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get analytics for a specific gig
    exports.getGigAnalytics = async (req, res) => {
        try {
        const gigId = req.params.id;
    
        // Get the gig analytics data
        const analytics = await GigAnalytics.findOne({ gig: gigId });
        if (!analytics) {
            return res.status(404).json({ message: 'No analytics data found for this gig' });
        }
    
        res.status(200).json(analytics);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    };
    
  // Get all analytics for the logged-in Gig Worker

  exports.getAllGigAnalytics = async (req, res) => {
    try {
      // Step 1: Get all gigs for the logged-in user (Gig Worker)
      const gigs = await Gig.find({ freelancer: req.user._id });
  
      // Step 2: Fetch analytics for each gig directly from GigAnalytics
      const gigsWithAnalytics = await Promise.all(
        gigs.map(async (gig) => {
          // Query GigAnalytics using the gig._id
          const analytics = await GigAnalytics.findOne({ gig: gig._id });
  
          // Return the gig along with its analytics data (if exists)
          return { gig, analytics };
        })
      );
  
      // Step 3: Send the combined response back to the client
      res.status(200).json(gigsWithAnalytics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  
  // Increment the order count when an order is placed for a gig
  exports.incrementOrderCount = async (orderId) => {
    try {
      const order = await Order.findById(orderId).populate('gig');
      if (!order) return;
  
      // Find or create the gig analytics entry
      let analytics = await GigAnalytics.findOne({ gig: order.gig._id });
      if (!analytics) {
        analytics = new GigAnalytics({ gig: order.gig._id });
      }
  
      // Increment the order count
      analytics.orders += 1;
      await analytics.save();
    } catch (error) {
      console.log('Error incrementing order count:', error.message);
    }
  };