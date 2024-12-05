const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const { logger } = require('../utils/logger');

class ReportService {
  static async generatePDFReport(data, type) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Add content to PDF
        doc.fontSize(16).text(`${type} Report`, { align: 'center' });
        doc.moveDown();
        
        Object.entries(data).forEach(([key, value]) => {
          doc.fontSize(12).text(`${key}: ${value}`);
        });

        doc.end();
      } catch (error) {
        logger.error('PDF generation failed:', error);
        reject(error);
      }
    });
  }

  static async generateCSVReport(data, fields) {
    try {
      const parser = new Parser({ fields });
      return parser.parse(data);
    } catch (error) {
      logger.error('CSV generation failed:', error);
      throw error;
    }
  }
}

module.exports = ReportService;