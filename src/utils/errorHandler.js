const handleError = (res, error) => {
  console.error(error);
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(409).json({ error: 'Duplicate entry found' });
  }
  return res.status(500).json({ error: 'Server error' });
};

module.exports = { handleError };