const Analytics = require('../../models/Analytics');
const Gig = require('../../models/Gig');
const { handleError } = require('../../utils/errorHandler');

const getAnalytics = async (req, res) => {
  try {
    // First get all gigs created by the user
    const gigs = await Gig.find({ createdBy: req.user.id }).select('_id');
    
    // Then get analytics for those gigs
    const analytics = await Analytics.find({
      gig: { $in: gigs }
    }).populate({
      path: 'gig',
      select: 'title description price views clicks averageRating'
    });

    // Format the response
    const formattedAnalytics = analytics.map(analytic => ({
      gigId: analytic.gig._id,
      gigTitle: analytic.gig.title,
      views: analytic.views,
      clicks: analytic.clicks,
      conversions: analytic.conversions,
      revenue: analytic.revenue,
      periodStart: analytic.periodStart,
      periodEnd: analytic.periodEnd
    }));

    res.json(formattedAnalytics);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = getAnalytics;