#! /usr/bin/env node

'use strict';
const readline = require('readline');
const fs = require('fs');
const recursiveReaddir = require('recursive-readdir');
//const program = require('commander');
const cli = require('cli');
const properties = require('properties');
const options = cli.parse({
  file: ['F', 'The properties file', 'file'],
  baseDir: ['D', 'The base directory to search', 'file'],
  extraProps: ['p', 'Comma-separated list of any extra properties files used for finding undefined properties',
    'string'],
  ignoreUndefined: ['i', 'Ignore undefined properties']
});

const foundKeys = [];
const suspectedUndefinedKeys = [];

const propertiesPaths = options.extraProps && options.extraProps.split(',') || [];

let propertiesString = '';

for (let i = 0; i < propertiesPaths.length; i++) {
  propertiesString += fs.readFileSync(propertiesPaths[i], 'utf8');
  propertiesString += '\n';
}

properties.parse(options.file, {path: true}, (error, obj) => {
  properties.parse(propertiesString, (otherError, otherObj) => {
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
          console.log('Found ' + keys.length + ' unused keys:');
          console.info(keys);
        }
        if (suspectedUndefinedKeys.length > 0  && !options.ignoreUndefined) {
          console.log('Found ' + suspectedUndefinedKeys.length +
            ' suspected keys that aren\'t defined in the properties file');
          console.log(suspectedUndefinedKeys);
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
                let match;
                if (key && line.match(new RegExp('[\'"]' + key + '[\'"]'))) {
                  keys.splice(j, 1);
                }
                else if (match = line.match(/['"](rw\..+?)["']/)) {
                  const property = match[1];
                  if (suspectedUndefinedKeys.indexOf(property) < 0 && !obj[property] && !otherObj[property]) {
                    suspectedUndefinedKeys.push(property);
                  }
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
});
