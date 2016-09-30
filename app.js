let buildPresentation = require('./builder/build-presentation');
let compression = require('compression');
let express = require('express');
let app = express();

// Compress all requests
app.use(compression());

// Set up static (index/help)
app.use(express.static('./'));

// Listen for present route
app.get('/present', function (req, res) {


let testData = 'foo\nbar\n\nBar\n- foo!';

  let renderedSlideshow = '';

  // Building HTML site
  renderedSlideshow += '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>10k Slides</title><link rel="stylesheet" href="styles/10kslides.css"/><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, user-scalable=yes"/></head><body><header><h1>10k Slides</h1></header><nav><ul class="controls"><li><a class="control control--primary" href="#present" id="presentButton">Present</a></li><li><a class="control" href="/unminified-help.html">Help</a></li></ul></nav><textarea id="edit">';

  // Add the slideshow text
  renderedSlideshow += testData;

  // Building HTML site
  renderedSlideshow += '</textarea><main id="present">';

  // Add the rendered HTML
  renderedSlideshow += buildPresentation(testData);

  // Building HTML site
  renderedSlideshow += '</main><div class="drop" id="modal"><aside><h1>Found Saved Slideshow</h1><p>Would you like to load the slideshow from memory?</p><ul class="controls"><li><button class="control control--primary" id="load">Yes</button></li><li><button class="control" id="discard">No</button></li></ul></aside></div><script src="scripts/10kslides.js"></script></body></html>';

  res.status(200).send(renderedSlideshow);
});

// Start the server
let server = app.listen((process.env.PORT || 8080), function () {
  console.log('Express running.');
});
