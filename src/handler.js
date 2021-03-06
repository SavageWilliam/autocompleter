var fs = require('fs');
var path = require('path');
var autocomplete = require('./autocomplete');

var handler = {};

var htmlHeaders = {
  'content-type': 'text/html'
};

handler.home = function (req, res) {
  res.writeHead(200, htmlHeaders);
  var filepath = path.join(__dirname, '..', 'public', 'index.html');
  fs.readFile(filepath, function (err, data) {
    if (err) console.log(err);
    res.end(data);
  });
};

handler.default = function (req, res) {
  var extension = path.extname(req.url).slice(1);
  var headers = {'content-type': 'text/' + extension};
  res.writeHead(200, headers);
  var filepath = path.join(__dirname, '..', 'public', req.url);
  fs.readFile(filepath, function (err, data) {
    if (err) throw err;
    res.end(data);
  });
};

handler.getSuggestions = function (req, res) {
  res.writeHead(200, htmlHeaders);
  var str = '';
  req.on('data', data => str += data);
  req.on('end', function () {
    res.end(JSON.stringify(autocomplete(str)));
  });
};

handler.notFound = function (req, res) {
  res.writeHead(200, htmlHeaders);
  res.end('404: page not found');
};

module.exports = handler;
