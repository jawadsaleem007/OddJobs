const Message = require('../../models/Message');
const User = require('../../models/User');
const { handleError } = require('../../utils/errorHandler');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    handleError(res, error);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getMessages, sendMessage };