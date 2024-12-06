const AnalyticsService = require('../services/analyticsService');
const { AppError } = require('../utils/errorHandler');
const json2csv = require('json2csv').parse;

exports.getPlatformStats = async (req, res, next) => {
  try {
    const [activeUsers, topFreelancers, totalProfits] = await Promise.all([
      AnalyticsService.getActiveUsers(),
      AnalyticsService.getTopFreelancers(),
      AnalyticsService.getPlatformProfits()
    ]);

    res.json({
      activeUsers,
      topFreelancers,
      totalProfits
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.exportReportCSV = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
        // Validate the type
    if (!['transactions', 'orders'].includes(type)) {
      return next(new AppError('Invalid report type. Supported types: transactions, orders.', 400));
    }
    const data = await AnalyticsService.generateReport(type, startDate, endDate);
    
        // Handle empty data
        if (!data || data.length === 0) {
          return next(new AppError('No data available for the selected report type and date range.', 404));
        }
        
    const csv = json2csv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}-report.csv`);
    res.send(csv);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};