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
    const data = await AnalyticsService.generateReport(type, startDate, endDate);
    
    const csv = json2csv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}-report.csv`);
    res.send(csv);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};