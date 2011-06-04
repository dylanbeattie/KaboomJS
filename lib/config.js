var fs = require('fs');

try {
  var configJSON = fs.readFileSync(__dirname + '/../config/app.json');
} catch(e) {
  console.error('app.json not found');
}

exports.config = JSON.parse(configJSON.toString());
