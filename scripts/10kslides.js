'use strict';

(function () {
  let presentButton = document.getElementById('presentButton');
  let editText = document.getElementById('edit');
  let presentSection = document.getElementById('present');

  /**
   * Determines if a line is a URL, which should be treated as an image.
   */
  let isLineUrl = function (line) {
    let testUrl = line.split(' (')[0];
    return testUrl.indexOf('://') >= 0 && testUrl.match(/\s/) === null;
  };

  /**
   * Builds a single slide from a set of lines, and returns the HTML.
   *
   * Here is the HTML structure:
   * <section class="[title--main] or [title]">
   *   <[h1] or [h2]>Title</[h*]>
   *
   *   [?title]
   *     <p>Subtitle</p>
   *   [/title]
   *
   *   [?lists]
   *     <ul>
   *       <li>Bullet point</li>
   *       ...
   *     </ul>
   *   [/lists]
   * </section>
   */
  let buildSlide = function (slideText, slideIndex) {
    let slideLines = slideText.split('\n');
    let slideHtml = document.createElement('section');
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
        slideHtml.appendChild(listHtml);
        listHtml = undefined;
      }

      // Galleries (set exception to 'gallery')
      if (galleryHtml && exception !== 'gallery') {
        slideHtml.appendChild(galleryHtml);
        galleryHtml = undefined;
      }

      // Code (set exception to 'code')
      if (codeHtml && exception !== 'code') {
        slideHtml.appendChild(codeHtml);
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
          let lineHtml = document.createElement('p');

          lineHtml.innerText = lineParts[1].slice(0, lineParts[1].length - 1);
          slideHtml.appendChild(lineHtml);

          // Add the image as a full bleed background
          let imageHtml = document.createElement('div');

          imageHtml.classList.add('full-bleed');
          imageHtml.style.backgroundImage = 'url(' + lineParts[0] + ')';

          slideHtml.appendChild(imageHtml);
        } else {
          // Case 2: The first line is a header. `h1` for title slide, `h2` otherwise
          let lineHtml = document.createElement(slideIndex === 0 ? 'h1' : 'h2');

          lineHtml.innerText = line;
          slideHtml.appendChild(lineHtml);
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
            listHtml = document.createElement('ul');
            centerSlide = false;
          }

          let lineHtml = document.createElement('li');

          lineHtml.innerText = line.slice(1).trim(); // Extra trim is necessary because the line may have been '- ...' or '-...'.
          listHtml.appendChild(lineHtml);
        } else if (isLineUrl(line)) {
          closeBlocks('gallery');

          // Instantiate the unordered list, if it's not there
          if (!galleryHtml) {
            galleryHtml = document.createElement('ul');
            galleryHtml.classList.add('gallery');
            centerSlide = false;
          }

          // Add the image as a full bleed background
          let lineParts = line.split(' (');
          let imageHtml = new Image();
          imageHtml.src = lineParts[0];
          imageHtml.alt = lineParts[1].slice(0, lineParts[1].length - 1);

          let lineHtml = document.createElement('li');
          lineHtml.appendChild(imageHtml);

          galleryHtml.appendChild(lineHtml);
        } else if (slideLines[i].indexOf('  ') === 0) {
          closeBlocks('code');

          if (!codeHtml) {
            codeHtml = document.createElement('pre');
            centerSlide = false;
          }

          codeHtml.innerText += slideLines[i].slice(2) + '\n';
        } else {
          closeBlocks();

          // Don't center slides with multiple subtitles
          if (i >= 2) {
            centerSlide = false;
          }

          let lineHtml = document.createElement('p');

          lineHtml.innerText = line;
          slideHtml.appendChild(lineHtml);
        }
      }
    }

    // Handle any open lists or blocks
    closeBlocks();

    // See if this is a main title or title slide
    if (centerSlide) {
      slideHtml.classList.add('slide--centered');
    }

    return slideHtml;
  };

  /**
   * Builds and displays the presentation based on editor text.
   */
  let buildPresentation = function () {
    let editorText = editText.value;
    let editorSlides = editorText.split('\n\n');
    let presentationHolder = document.createElement('main');

    // Build each slide
    for (let i = 0; i < editorSlides.length; i++) {
      presentationHolder.appendChild(buildSlide(editorSlides[i], i));
    }

    // Add a blank end slide
    let endSlideHtml = document.createElement('section');
    endSlideHtml.classList.add('slide--end');
    presentationHolder.appendChild(endSlideHtml);

    presentSection.innerHTML = presentationHolder.innerHTML;
    presentSection.classList.add('u-visible');

    presentSection.querySelector('section').classList.add('current');
  };

  /**
   * Move from one slide to the next.
   */
  let next = function () {
    let currentSlide = presentSection.querySelector('.current');

    if (currentSlide) {
      currentSlide.classList.remove('current');

      if (currentSlide.nextSibling) {
        currentSlide.nextSibling.classList.add('current');
      } else {
        leavePresentation();
      }
    }
  };

  /**
   * Move from one slide to the previous.
   */
  let previous = function () {
    let currentSlide = presentSection.querySelector('.current');

    if (currentSlide && currentSlide.previousSibling) {
      currentSlide.classList.remove('current');
      currentSlide.previousSibling.classList.add('current');
    }
  };

  /**
   * Escape out of the presentation.
   */
  let leavePresentation = function () {
    window.location.hash = '';  
  };

  // Build the slideshow by default, so you can go back into it
  buildPresentation();

  /**
   * Add handlers.
   */
  presentButton.addEventListener('click', buildPresentation);
  presentSection.addEventListener('click', next);

  let keyCodeMap = {
    27: leavePresentation,
    37: previous, // Left
    38: previous, // Up
    39: next, // Right
    40: next // Down
  };

  document.addEventListener('keydown', function (event) {
    if (keyCodeMap[event.keyCode]) {
      keyCodeMap[event.keyCode]();
    }
  });

  editText.addEventListener('input', function (event) {
    // Save the text to local storage
    window.localStorage.slideshow = editText.value;
  });
})();
