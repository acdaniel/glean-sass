var glean = require('glean');
var sass = require('node-sass');
var sqwish = require('sqwish');

module.exports = function (srcFile, options, callback) {
  sass.render({
    file: srcFile.replace(/\.css$/, '.scss'),
    sourceComments: options.sourceComments,
    success: function (content) {
      var assetRegex = /url\((['"])(\/[^\/].+?)\1\)/g;
      content = content.replace(assetRegex, function (matches, p1, p2) {
        var path = glean.assets(p2);
        var url = (glean.get('https') ? 'https' : 'http') +
          '://' + glean.get('host') +
          glean.get('prefix') + path;
        return 'url("' + url + '")';
      });
      if (options.compress) {
        return callback(null, sqwish.minify(content));
      } else {
        return callback(null, content);
      }
    },
    error: function (err) {
      return callback(err);
    }
  });
};