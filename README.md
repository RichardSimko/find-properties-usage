# Find Properties Usage

[![Build Status](https://travis-ci.org/richardsimko/find-properties-usage.svg?branch=master)](https://travis-ci.org/richardsimko/find-properties-usage)

Finds which i18n strings in a .properties file which are unused in the specified directory.

## Installation ##

    npm install -g find-properties-usage

## Usage ##

    fpu -F [path to the .properties file] -D [base dir of the project]
    
Additionally you can specify `-p` which is a comma-separated list of extra properties files to look in. You can also specify `-i` to ignore properties which are referenced in code but do not exist in the .propeties files.
