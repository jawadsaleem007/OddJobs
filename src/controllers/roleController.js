const Role = require('../models/Role');

async function addDefaultRoles() {
    const roles = ['client', 'gig_worker', 'admin'];
  
    for (const roleName of roles) {
      const existingRole = await Role.findOne({ name: roleName });
      if (!existingRole) {
        await Role.create({ name: roleName });
      }
    }
  
    console.log('Roles have been added or already exist');
  }

  module.exports = {
    addDefaultRoles
  };