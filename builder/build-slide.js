let isLineUrl = function (line) {
  let testUrl = line.split(' (')[0];
  return testUrl.indexOf('://') >= 0 && testUrl.match(/\s/) === null;
};

let buildSlide = function (slideText, slideIndex) {
  let slideLines = slideText.split('\n');
  let slideHtml = '';
  let galleryHtml;
  let listHtml;
  let codeHtml;
  let centerSlide = true;

  /**
   * Closes lists and blocks, optionally excepting the type passed in.
   */
  let closeBlocks = function (exception) {
    // Lists (set exception to 'list')
    if (listHtml && exception !== 'list') {
      slideHtml += listHtml + '</ul>';
      listHtml = undefined;
    }

    // Galleries (set exception to 'gallery')
    if (galleryHtml && exception !== 'gallery') {
      slideHtml += galleryHtml + '</ul>';
      galleryHtml = undefined;
    }

    // Code (set exception to 'code')
    if (codeHtml && exception !== 'code') {
      slideHtml += codeHtml + '</pre>';
      codeHtml = undefined;
    }
  };

  for (let i = 0; i < slideLines.length; i++) {
    let line = slideLines[i].trim();

    // The first line becomes a header
    if (i === 0) {
      // The first line is a special case.
      if (isLineUrl(line)) {
        // Case 1: The first line is a URL. If so, make this slide a full bleed image
        // Add the URL as text to support cases where the image doesn't load
        let lineParts = line.split(' (');
        slideHtml += '<p>' + lineParts[1].slice(0, lineParts[1].length - 1) + '</p>';

        // Add the image as a full bleed background
        slideHtml += '<div class="full-bleed" style="background-image:url(' + lineParts[0] + '"></div>';
      } else {
        // Case 2: The first line is a header. `h1` for title slide, `h2` otherwise
        if (slideIndex === 0) {
          slideHtml += '<h1>' + line + '</h1>';
        } else {
          slideHtml += '<h2>' + line + '</h2>';
        }
      }
    } else {
      // For all other lines, there are several options:
      // 1. The text is a bullet: '-', '*', '- ', etc.
      // 2. The text is an image: and should be placed into a gallery
      // 3. The text is code: '   var foobar;'
      // 4. The text is a paragraph: and should be displayed unadorned
      if (line[0] === '-' || line[0] === '*') {
        closeBlocks('list');

        // Instantiate the unordered list, if it's not there
        if (!listHtml) {
          listHtml = '<ul>';
          centerSlide = false;
        }

        listHtml += '<li>' + line.slice(1).trim() + '</li>';
      } else if (isLineUrl(line)) {
        closeBlocks('gallery');

        // Instantiate the unordered list, if it's not there
        if (!galleryHtml) {
          galleryHtml = '<ul class="gallery">';
          centerSlide = false;
        }

        // Add the image to the gallery
        let lineParts = line.split(' (');
        galleryHtml += '<li><img src="' + lineParts[0] + '" alt="' + lineParts[1].slice(0, lineParts[1].length - 1) + '"></li>'
      } else if (slideLines[i].indexOf('  ') === 0) {
        closeBlocks('code');

        if (!codeHtml) {
          codeHtml = '<pre>';
          centerSlide = false;
        }

        codeHtml += slideLines[i].slice(2) + '\n';
      } else {
        closeBlocks();

        // Don't center slides with multiple subtitles
        if (i >= 2) {
          centerSlide = false;
        }

        slideHtml += '<p>' + line + '</p>';
      }
    }
  }

  // Handle any open lists or blocks
  closeBlocks();

  // Build beginning tag
  let anchorTag = '<a href="#s' + (slideIndex + 1) + '">';
  let beginningTag = '<section id="s' + slideIndex + '">';

  if (centerSlide) {
    beginningTag = '<section class="slide--centered" id="s' + slideIndex + '">';
  }

  slideHtml = anchorTag + beginningTag + slideHtml + '</section></a>';

  return slideHtml;
};

module.exports = buildSlide;
