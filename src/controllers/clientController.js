const User = require('../models/User');
const Gig = require('../models/Gig');
const Order = require('../models/Order');
const Review = require('../models/Review');
const PaymentMethod = require('../models/PaymentMethod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class ClientController {
  // Profile Controllers
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .select('-password')
        .populate('savedGigs');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, bio } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, bio },
        { new: true }
      ).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Saved Gigs Controllers
  async getSavedGigs(req, res) {
    try {
      const user = await User.findById(req.user._id).populate('savedGigs');
      res.json(user.savedGigs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async saveGig(req, res) {
    try {
      const { gigId } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { savedGigs: gigId } },
        { new: true }
      );
      res.json(user.savedGigs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async removeSavedGig(req, res) {
    try {
      const { gigId } = req.params;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { savedGigs: gigId } },
        { new: true }
      );
      res.json(user.savedGigs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Order Controllers
  async createOrder(req, res) {
    try {
      const { gigId, description, paymentMethod } = req.body;
      const gig = await Gig.findById(gigId);
      
      if (!gig) {
        return res.status(404).json({ message: 'Gig not found' });
      }

      const order = new Order({
        client: req.user._id,
        gig: gigId,
        title: gig.title,
        description,
        amount: gig.amount,
        paymentMethod
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await Order.find({ client: req.user._id })
        .populate('gig')
        .sort('-createdAt');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        client: req.user._id
      }).populate('gig');
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const { status } = req.body;
      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, client: req.user._id },
        { status },
        { new: true }
      );
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Review Controllers
  async createReview(req, res) {
    try {
      const { gigId, rating, comment } = req.body;
      
      // Check if client has ordered and completed this gig
      const order = await Order.findOne({
        client: req.user._id,
        gig: gigId,
        status: 'completed'
      });

      if (!order) {
        return res.status(400).json({ message: 'You must complete an order before reviewing' });
      }

      const review = new Review({
        gig: gigId,
        client: req.user._id,
        rating,
        comment
      });

      await review.save();
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async updateReview(req, res) {
    try {
      const { rating, comment } = req.body;
      const review = await Review.findOneAndUpdate(
        { _id: req.params.id, client: req.user._id },
        { rating, comment },
        { new: true }
      );
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Payment Method Controllers
  async addPaymentMethod(req, res) {
    try {
      const { type, details } = req.body;
      const paymentMethod = new PaymentMethod({
        user: req.user._id,
        type,
        details
      });
      
      await paymentMethod.save();
      res.status(201).json(paymentMethod);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getPaymentMethods(req, res) {
    try {
      const paymentMethods = await PaymentMethod.find({ user: req.user._id });
      res.json(paymentMethods);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new ClientController();