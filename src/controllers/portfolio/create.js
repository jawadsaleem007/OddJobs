const Portfolio = require('../../models/Portfolio');
const { handleError } = require('../../utils/errorHandler');

const createPortfolio = async (req, res) => {
  try {
    const { title, description, category, tags, projectUrl, completionDate } = req.body;
    const images = req.files.map(file => file.path);

    const portfolio = new Portfolio({
      gigWorker: req.user.id,
      title,
      description,
      images,
      category,
      tags: tags.split(','),
      projectUrl,
      completionDate
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = createPortfolio;