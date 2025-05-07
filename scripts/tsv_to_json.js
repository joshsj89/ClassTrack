// TSV to JSON Converter

const fs = require('fs');
const path = require('path');

// For each TSV file in the directory
const directoryPath = path.join(__dirname, '../json/tsv_files');

// Ensure the output directory exists
if (!fs.existsSync(directoryPath)) {
    console.error(`Directory ${directoryPath} does not exist.`);
    process.exit(1);
}
const outputDirectoryPath = path.join(__dirname, '../json/courses');

// Create the directory if it doesn't exist
if (!fs.existsSync(outputDirectoryPath)) {
    
    fs.mkdirSync(outputDirectoryPath, { recursive: true });
    console.log(`Created directory: ${outputDirectoryPath}`);
}

const tsvFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.tsv'));

tsvFiles.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const outputFilePath = path.join(outputDirectoryPath, file.replace('.tsv', '.json'));

    // Read the TSV file
    const data = fs.readFileSync(filePath, 'utf8');

    // Split the data into lines and then into columns
    const lines = data.trim().split('\n');
    const headers = lines[0].split('\t');

    const jsonData = lines.slice(1).map(line => { // For each line after the header
        if (!line.trim()) return null; // Skip empty lines

        // Split the line into columns and create an object
        const values = line.split('\t');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });

    // Write the JSON data to a new file
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 4), 'utf8');
    console.log(`Converted ${file} to JSON format and saved as ${path.basename(outputFilePath)}`);
});