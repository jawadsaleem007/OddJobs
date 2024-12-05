const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  gigWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  credentialUrl: { type: String },
  verified: { type: Boolean, default: false },
  documentUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certification', CertificationSchema);