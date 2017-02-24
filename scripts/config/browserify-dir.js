'use strict';

var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

fs.readdir('./scripts/client_src/', (err, files) => {
  if (err) throw err;
  files.forEach((fileName) => {
    if (fileName.split('.')[1] === 'js') {
      browserify('./scripts/client_src/' + fileName)
        .transform('babelify', {
          presets: ["es2015", "react"]
        })
        // .transform({'global': true}, 'uglifyify')
        .bundle().pipe(fs.createWriteStream('./scripts/client/' + fileName));
    }
  });
});