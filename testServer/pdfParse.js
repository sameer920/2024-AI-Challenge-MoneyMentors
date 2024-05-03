const fs = require('fs');
const pdfParse = require('pdf-parse');

async function parsePDFfile(filePath) {
    let dataBuffer = fs.readFileSync(filePath);

    try {
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = parsePDFfile;