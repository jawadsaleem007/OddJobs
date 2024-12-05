const Dispute = require('../../models/Dispute');
const Order = require('../../models/Order');
const { handleError } = require('../../utils/errorHandler');

const raiseDispute = async (req, res) => {
  try {
    const { orderId, reason, description } = req.body;
    
    // Verify order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ client: req.user.id }, { freelancer: req.user.id }]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    // Create evidence array from uploaded files
    const evidence = req.files ? req.files.map(file => file.path) : [];

    const dispute = new Dispute({
      order: orderId,
      raisedBy: req.user.id,
      reason,
      description,
      evidence,
      status: 'pending'
    });

    await dispute.save();
    res.status(201).json(dispute);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { raiseDispute };