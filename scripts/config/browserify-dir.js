'use strict';

var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

fs.readdir('./scripts/client_src/', (err, files) => {
  if (err) throw err;
  files.forEach((fileName) => {
    if (fileName !== '.jshintrc') {
      browserify('./scripts/client_src/' + fileName)
        .transform({'global': true}, 'uglifyify')
        .transform('babelify', {presets: ['es2015']})
        .bundle().pipe(fs.createWriteStream('./scripts/client/' + fileName));
    }
  })
})