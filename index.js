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
    let openReaders = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      recursiveReaddir('../connect-refinedtheme', ['gen', 'node_modules', '*.properties'], (error, files) => {
        if (!error) {
          for (let i = 0; i < files.length; i++) {
            const lineReader = readline.createInterface({
              input: fs.createReadStream(files[i])
            });
            openReaders++;
            lineReader.on('line', (line) => {
              if (line.indexOf(key) > 0 && foundKeys.indexOf(key) < 0) {
                foundKeys.push(key);
                cli.info('Found ' + key);
                lineReader.close();
              }
            });
            lineReader.on('close', () => {
              openReaders--;
              if (openReaders === 0) {
                cli.info('Done!');
                console.log(foundKeys);
              }
            })
          }
        }
        else {
          cli.error(error);
        }
      });
    }
  }
});
