const Certification = require('../../models/Certification');
const { handleError } = require('../../utils/errorHandler');

const uploadCertification = async (req, res) => {
  try {
    const { name, issuingOrganization, issueDate, expiryDate, credentialUrl } = req.body;

    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Certificate file is required' });
    }

    const certification = new Certification({
      gigWorker: req.user.id,
      name,
      issuingOrganization,
      issueDate,
      expiryDate,
      credentialUrl,
      documentUrl: req.file.path
    });

    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { uploadCertification };