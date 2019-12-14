'use strict';

const fs = require('fs');
const path = require('path');
const removeDir = require('./remove');

const NEW_FOLDER = './artists_by_name';
const INITIAL_FOLDER = './artists_by_genre';

let numberOfFiles = 0;

const createFolder = newPath => {
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath);
  }
};

const startCopy = (oldPath, newPath, callback) => {
  const readStream = fs.createReadStream(oldPath, 'utf8');
  const writeStream = fs.createWriteStream(newPath, 'utf8');

  [readStream, writeStream].forEach(stream => {
    stream.on('error', err => {
      throw err;
    });
  });

  readStream.on('data', chunk => {
    writeStream.write(chunk);
  });

  readStream.on('end', callback);
};

const copyRecursive = directory => {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const currentPath = path.join(directory, item);

    fs.stat(currentPath, (error, stats) => {
      if (error) throw error;

      if (stats.isDirectory(currentPath)) {
        copyRecursive(currentPath);
      } else {
        numberOfFiles++;

        const firstLetter = item[0].toUpperCase();
        const newFolder = path.join(NEW_FOLDER, firstLetter);

        createFolder(newFolder);

        const newDir = path.join(newFolder, item);
        startCopy(currentPath, newDir, () => {
          numberOfFiles--;

          if (!numberOfFiles) {
            removeDir(INITIAL_FOLDER);
          }
        });
      }
    });
  }
};

createFolder(NEW_FOLDER);
copyRecursive(INITIAL_FOLDER);
