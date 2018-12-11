/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import gaze from 'gaze';
import replace from 'replace';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy({ watch } = {}) {
  const ncp = (source ,des) => {
    return new Promise((resolve, reject) => {
      const innerNcp = require('ncp');
      innerNcp(source, des, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    });
  };

  await Promise.all([
    ncp('src/static', 'dist/static'),
    ncp('src/views', 'dist/views'),
    ncp('package.json', 'dist/package.json'),
    ncp('config.js', 'dist/config.js'),
    ncp('config.js', 'src/config.js'),
  ]);

  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js",',
    paths: ['dist/package.json'],
    recursive: false,
    silent: false,
  });

  if (watch) {
    const viewsWatcher = await new Promise((resolve, reject) => {
      gaze('src/views/**/*.*', (err, val) => err ? reject(err) : resolve(val));
    });
    viewsWatcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../src/views/').length);
      await ncp(`src/views/${relPath}`, `dist/views/${relPath}`);
    });
    const configWatcher = await new Promise((resolve, reject) => {
      gaze('config.js', (err, val) => err ? reject(err) : resolve(val));
    });
    configWatcher.on('changed', () => {
      ncp('config.js', 'dist/config.js');
      ncp('config.js', 'src/config.js');
    });
  }
}

export default copy;
