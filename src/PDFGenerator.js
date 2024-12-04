const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument();

// Pipe the PDF document to a file
doc.pipe(fs.createWriteStream('output.pdf'));

// Add content to the PDF
doc.fontSize(25)
   .text('Hello, PDFKit!', 100, 100);

doc.fontSize(12)
   .text('This is a simple PDF generated using PDFKit.', 100, 150);

// Finalize the PDF and end the stream
doc.end();