exports.index = function(req, res) {
  res.redirect('/index.html');
};
exports.level = function(req, res) {
  fs.readFile("data/level.txt", "binary", function(err, file) {
    res.send({
      "level": file
    });
  });
};
