exports.index = function(res, req) {
  res.redirect('/index.html');
}
exports.level = function(req, res) {
  fs.readFile("data/level.txt", "binary", function(err, file) {
    res.send({
      "level": file
    });
  });
}
