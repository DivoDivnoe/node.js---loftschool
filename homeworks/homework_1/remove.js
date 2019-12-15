'use strict';

const fs = require('fs');
const path = require('path');

const removeDir = (directory, callback = () => {}) => {
  fs.readdir(directory, (error, items) => {
    if (error) throw error;

    // эту переменную завел, чтобы понять, когда полностью очистил папку
    // так как всё асинхронно, то пока не вижу другого решения
    let itemsAmount = items.length;

    for (const item of items) {
      const currentPath = path.join(directory, item);

      fs.stat(currentPath, (error, stats) => {
        if (error) throw error;

        if (stats.isDirectory(currentPath)) {
          removeDir(currentPath, () => {
            itemsAmount--;

            if (!itemsAmount) {
              fs.rmdir(directory, error => {
                if (error) throw error;

                callback();
              });
            }
          });
        } else {
          fs.unlink(currentPath, error => {
            if (error) throw error;

            itemsAmount--;

            if (!itemsAmount) {
              fs.rmdir(directory, error => {
                if (error) throw error;

                callback();
              });
            }
          });
        }
      });
    }
  });
};

module.exports = removeDir;
