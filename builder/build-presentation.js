let buildSlide = require('./build-slide');

let buildPresentation = function (editorText) {
  let editorSlides = editorText.split('\n\n');
  let builtHtml = '';

  // Build each slide
  for (let i = 0; i < editorSlides.length; i++) {
    builtHtml += buildSlide(editorSlides[i], i);
  }

  // Add a blank end slide
  builtHtml += '<a href="/"><section class="slide--end"></section></a>';

  return builtHtml;
};

module.exports = buildPresentation;
