const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['client', 'gig_worker', 'admin'], // Predefined roles
  },
  permissions: {
    type: Map,
    of: Boolean,
    default: {
      'create_gig': false, // default permission for 'client' role will be false
      'view_gig': true, // default permission for all roles can be true for 'view_gig'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Role', RoleSchema);
