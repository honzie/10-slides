let compression = require('compression');
let express = require('express');

let app = express();

// Compress all requests
app.use(compression());

// Set up static (index/help)
app.use(express.static('./'));

// Listen for present route
app.get('/present', function (req, res) {
  console.log('here')
});

// Start the server
let server = app.listen((process.env.PORT || 8080), function () {
  console.log('Express running.');
});
