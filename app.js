let bodyParser = require('body-parser');
let buildPresentation = require('./builder/build-presentation');
let compression = require('compression');
let express = require('express');
let app = express();

// Compress all requests
app.use(compression());

// Set up static (index/help)
app.use(express.static('./'));

// Set up parsing
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json());

// Listen for present route
app.post('/present', function (req, res) {
  let editorText = req.body.editorText.replace(/\r/g, '');
  let renderedSlideshow = '';

  // Building HTML site
  renderedSlideshow += '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>10k Slides</title><link rel="stylesheet" href="styles/10kslides.css"/><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, user-scalable=yes"/></head><body><main id="present" class="u-visible built">';

  // Add the rendered HTML
  renderedSlideshow += buildPresentation(editorText);

  // Building HTML site
  renderedSlideshow += '</main></body></html>';

  res.status(200).send(renderedSlideshow);
});

// Start the server
let server = app.listen((process.env.PORT || 8080), function () {
  console.log('Express running.');
});
