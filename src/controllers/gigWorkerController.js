const Portfolio = require('../models/Portfolio');
const Analytics = require('../models/Analytics');
const Promotion = require('../models/Promotion');
const Certification = require('../models/Certification');
const Message = require('../models/Message');
const Dispute = require('../models/Dispute');
const User = require('../models/User');

exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, category, tags, projectUrl, completionDate } = req.body;
    const images = req.files.map(file => file.path);

    const portfolio = new Portfolio({
      gigWorker: req.user.id,
      title,
      description,
      images,
      category,
      tags: tags.split(','),
      projectUrl,
      completionDate
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.find({
      gig: { $in: await Gig.find({ createdBy: req.user.id }).select('_id') }
    }).populate('gig');
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const { gigId, discountPercentage, startDate, endDate, code, maxUses } = req.body;
    const promotion = new Promotion({
      gig: gigId,
      discountPercentage,
      startDate,
      endDate,
      code,
      maxUses
    });
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.uploadCertification = async (req, res) => {
  try {
    const { name, issuingOrganization, issueDate, expiryDate, credentialUrl } = req.body;
    const certification = new Certification({
      gigWorker: req.user.id,
      name,
      issuingOrganization,
      issueDate,
      expiryDate,
      credentialUrl,
      documentUrl: req.file.path
    });
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.profilePicture = req.file.path;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).populate('sender receiver');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.raiseDispute = async (req, res) => {
  try {
    const { orderId, reason, description } = req.body;
    const evidence = req.files.map(file => file.path);
    
    const dispute = new Dispute({
      order: orderId,
      raisedBy: req.user.id,
      reason,
      description,
      evidence
    });
    await dispute.save();
    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};