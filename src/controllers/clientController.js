const Gig = require('../models/Gig');
const GigAnalytics = require('../models/GigAnalytics');  // Assuming you have an analytics model

// Track Gig View (Client)
exports.trackGigView = async (req, res) => {
  try {
    const { id } = req.params;  // Gig ID
    const clientId = req.user._id;  // Assuming the client is authenticated and their ID is available

    // Check if the gig exists
    const gig = await Gig.findById(id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Create or update the analytics for this gig
    const analytics = await GigAnalytics.findOneAndUpdate(
      { gig: id },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Gig view tracked', analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track Gig Click (Client)
exports.trackGigClick = async (req, res) => {
  try {
    const { id } = req.params;  // Gig ID
    const clientId = req.user._id;  // Assuming the client is authenticated and their ID is available

    // Check if the gig exists
    const gig = await Gig.findById(id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Create or update the analytics for this gig
    const analytics = await GigAnalytics.findOneAndUpdate(
      { gig: id },
      { $inc: { clicks: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Gig click tracked', analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
