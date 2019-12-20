'use strict';

const fs = require('fs');
const path = require('path');

const ENCODING = 'utf8';

const createFolder = async newPath => {
  if (!fs.existsSync(newPath)) {
    await fs.promises.mkdir(newPath);
  }
};

const copy = async (oldPath, newPath) => {
  const data = await fs.promises.readFile(oldPath, ENCODING);
  await fs.promises.writeFile(newPath, data, ENCODING);
};

const sort = async (directory, destFolder) => {
  const items = await fs.promises.readdir(directory);

  for (const item of items) {
    const currentPath = path.join(directory, item);
    const stats = await fs.promises.stat(currentPath);

    if (stats.isDirectory(currentPath)) {
      await sort(currentPath, destFolder);
    } else {
      const firstLetter = item[0].toUpperCase();
      const newFolder = path.join(destFolder, firstLetter);

      await createFolder(newFolder);

      const newDir = path.join(newFolder, item);
      await copy(currentPath, newDir);
    }
  }
};

module.exports = {
  sort,
  createFolder
};
