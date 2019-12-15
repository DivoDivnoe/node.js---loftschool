'use strict';

const fs = require('fs');
const path = require('path');

const ENCODING = 'utf8';

const createFolder = (newPath, callback) => {
  // асинхронная версия exists is deprecated
  if (!fs.existsSync(newPath)) {
    fs.mkdir(newPath, error => {
      if (error) throw error;

      callback();
    });
  } else {
    callback();
  }
};

const copy = (oldPath, newPath, callback) => {
  fs.readFile(oldPath, ENCODING, (error, data) => {
    if (error) throw error;

    fs.writeFile(newPath, data, ENCODING, error => {
      if (error) throw error;

      callback();
    });
  });
};

// Завел эту переменную для того, чтобы понять, когда заканчивается копирование всех файлов
// Мне это решение не очень нравится, но умнее пока ничего не придумал
let numberOfFiles = 0;

const sort = (directory, destFolder, callback) => {
  fs.readdir(directory, (error, items) => {
    if (error) throw error;

    for (const item of items) {
      const currentPath = path.join(directory, item);

      fs.stat(currentPath, (error, stats) => {
        if (error) throw error;

        if (stats.isDirectory(currentPath)) {
          sort(currentPath, destFolder, callback);
        } else {
          numberOfFiles++;

          const firstLetter = item[0].toUpperCase();
          const newFolder = path.join(destFolder, firstLetter);

          createFolder(newFolder, () => {
            const newDir = path.join(newFolder, item);
            copy(currentPath, newDir, () => {
              numberOfFiles--;

              if (!numberOfFiles) callback();
            });
          });
        }
      });
    }
  });
};

module.exports = {
  sort,
  createFolder
};
