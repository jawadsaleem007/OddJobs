const PlatformSettings = require('../models/PlatformSettings');
const { AppError } = require('../utils/errorHandler');

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.findOne();
    res.json(settings || {});
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};