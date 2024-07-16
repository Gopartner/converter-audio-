const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, 'aac'); // Folder aac
const outputFolder = path.join(__dirname, 'output'); // Folder output

function convertAacToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', () => {
        console.log(`Conversion finished: ${inputPath} -> ${outputPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error during conversion: ${inputPath}`, err);
        reject(err);
      })
      .save(outputPath);
  });
}

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading input folder:', err);
    return;
  }

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    console.log(`Output folder created: ${outputFolder}`);
  }

  files.forEach(file => {
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, path.parse(file).name + '.mp3');

    if (path.extname(file).toLowerCase() === '.aac') {
      console.log(`Found AAC file: ${inputPath}`);
      convertAacToMp3(inputPath, outputPath)
        .catch(err => console.error('Conversion failed:', err));
    }
  });
});

