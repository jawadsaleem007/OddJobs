const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  gigWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  tags: [{ type: String }],
  projectUrl: { type: String },
  completionDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);