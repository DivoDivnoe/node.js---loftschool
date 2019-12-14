'use strict';

const fs = require('fs');
const path = require('path');

const NEW_FOLDER = './artists_by_name';
const INITIAL_FOLDER = './artists_by_genre';

const createFolder = newPath => {
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath);
  }
};

const startCopy = (oldPath, newPath) => {
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
};

const copyToFolder = (filename, currentPath) => {
  const firstLetter = filename[0].toUpperCase();
  const newFolder = path.join(NEW_FOLDER, firstLetter);

  createFolder(newFolder);

  const newDir = path.join(newFolder, filename);
  startCopy(currentPath, newDir);
};

const copyRecursive = directory => {
  fs.readdir(directory, (error, items) => {
    if (error) {
      throw error;
    }

    for (const item of items) {
      const currentPath = path.join(directory, item);

      fs.stat(currentPath, (error, stats) => {
        if (error) throw error;

        if (stats.isDirectory(currentPath)) {
          copyRecursive(currentPath);
        } else {
          copyToFolder(item, currentPath);
        }
      });
    }
  });
};

createFolder(NEW_FOLDER);
copyRecursive(INITIAL_FOLDER);
