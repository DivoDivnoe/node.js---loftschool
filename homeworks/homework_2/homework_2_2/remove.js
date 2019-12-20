'use strict';

const fs = require('fs');
const path = require('path');

const removeDir = async directory => {
  const items = await fs.promises.readdir(directory);

  for (const item of items) {
    const currentPath = path.join(directory, item);
    const stats = await fs.promises.stat(currentPath);

    if (stats.isDirectory(currentPath)) {
      await removeDir(currentPath);
    } else {
      await fs.promises.unlink(currentPath);
    }
  }

  await fs.promises.rmdir(directory);
};

module.exports = removeDir;
