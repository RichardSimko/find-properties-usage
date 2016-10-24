'use strict';
const readline = require('readline');
const fs = require('fs');
const recursiveReaddir = require('recursive-readdir');

recursiveReaddir('../connect-refinedtheme', ['gen', 'node_modules', '*.properties'], (error, files) => {
  if (!error) {
    for (let i = 0; i < files.length; i++) {
      const lineReader = readline.createInterface({
        input: fs.createReadStream(files[i])
      });

      lineReader.on('line', (line) => {
        if (line.indexOf('rw.license.invalid') > 0) {
          console.log(files[i]);
          console.log(line);
          console.log('found it!');
        }
      });
    }
  }
});
