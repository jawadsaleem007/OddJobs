module.exports = {
  ROLES: {
    ADMIN: 'admin',
    CLIENT: 'client',
    GIG_WORKER: 'gig_worker'
  },
  
  ORDER_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed'
  },
  
  SUPPORT_TICKET_STATUS: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved'
  },
  
  NOTIFICATION_PRIORITY: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
  }
};