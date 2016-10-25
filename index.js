'use strict';
const readline = require('readline');
const fs = require('fs');
const recursiveReaddir = require('recursive-readdir');
//const program = require('commander');
const cli = require('cli');
const properties = require('properties');
const options = cli.parse({
  file: ['F', 'Path to the properties file', 'file'],
  baseDir: ['D', 'The base directory to search', 'file']
});

const foundKeys = [];


properties.parse(options.file, {path: true}, (error, obj) => {
  if (error) {
    cli.error(error);
  }
  else {
    const keys = Object.keys(obj);
    const done = function() {
      if (keys.length === 0) {
        console.info('All keys are in use!');
      }
      else {
        console.log(keys.length + ' unused keys:');
        console.info(keys);
      }
    };
    recursiveReaddir('../connect-refinedtheme', ['.git', 'gen', 'node_modules', '*.properties'], (error, files) => {
      if (!error) {
        for (let i = 0; i < files.length; i++) {
          if (keys.length === 0) {
            done();
          }
          const lineReader = readline.createInterface({
            input: fs.createReadStream(files[i])
          });
          lineReader.on('line', (line) => {
            for (let j = keys.length - 1; j >= 0; j--) {
              const key = keys[j];
              if (key && line.match(new RegExp('[\'"]' + key + '[\'"]'))) {
                keys.splice(j, 1);
              }
            }
          });
          lineReader.on('close', () => {
            if (i === files.length - 1) {
              done();
            }
          })
        }
      }
      else {
        cli.error(error);
      }
    });
  }
});
