'use strict';

const fs = require('fs');
const path = require('path');

const removeDir = (directory, level = 0) => {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const currentPath = path.join(directory, item);
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory(currentPath)) {
      return removeDir(currentPath, level + 1);
    } else {
      fs.unlinkSync(currentPath);
    }
  }

  fs.rmdirSync(directory);

  if (!level) return;

  const pathSplited = directory.split(path.sep);
  const prevPath = path.join(...pathSplited.slice(0, pathSplited.length - 1));

  removeDir(prevPath, level - 1);
};

module.exports = removeDir;
