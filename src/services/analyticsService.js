const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

class AnalyticsService {
  static async getActiveUsers(days = 30) {
    return User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    });
  }

  static async getTopFreelancers(limit = 10) {
    return Order.aggregate([
      {
        $group: {
          _id: '$freelancer',
          totalEarnings: { $sum: '$amount' },
          completedOrders: { $sum: 1 }
        }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'freelancerInfo'
        }
      }
    ]);
  }

  static async getPlatformProfits() {
    const result = await Transaction.aggregate([
      { $match: { type: 'deposit' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    return result[0]?.total || 0;
  }

  static async generateReport(type, startDate, endDate) {
    const query = {};

    // Add date range filter if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let data;
    switch (type) {
      case 'transactions':
        data = await Transaction.find(query).lean();
        break;
      case 'orders':
        data = await Order.find(query).lean();
        break;
      default:
        throw new Error('Invalid report type');
    }

    return data;
  }
}

module.exports = AnalyticsService;