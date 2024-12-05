module.exports = {
  withdrawalApproved: (userName, amount) => ({
    subject: 'Withdrawal Request Approved',
    html: `
      <h2>Hello ${userName},</h2>
      <p>Your withdrawal request for $${amount} has been approved and processed.</p>
      <p>The funds should appear in your account within 1-3 business days.</p>
      <p>Thank you for using our platform!</p>
    `
  }),

  withdrawalRejected: (userName, amount, reason) => ({
    subject: 'Withdrawal Request Rejected',
    html: `
      <h2>Hello ${userName},</h2>
      <p>Your withdrawal request for $${amount} has been rejected.</p>
      <p>Reason: ${reason}</p>
      <p>If you have any questions, please contact our support team.</p>
    `
  }),

  ticketAssigned: (adminName, ticketId) => ({
    subject: 'Support Ticket Assigned',
    html: `
      <h2>Hello ${adminName},</h2>
      <p>A new support ticket (#${ticketId}) has been assigned to you.</p>
      <p>Please review and handle it at your earliest convenience.</p>
    `
  })
};