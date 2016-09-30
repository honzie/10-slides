'use strict';

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
  let centerSlide = true;

  /**
   * Closes and appends a gallery.
   */
  let closeGallery = function () {
    if (galleryHtml) {
      slideHtml.appendChild(galleryHtml);
      galleryHtml = undefined;
    }
  };

  /**
   * Closes and appends a list.
   */
  let closeList = function () {
    if (listHtml) {
      slideHtml.appendChild(listHtml);
      listHtml = undefined;
    }
  };

  for (let i = 0; i < slideLines.length; i++) {
    let line = slideLines[i].trim();

    // The first line becomes a header
    if (i === 0) {
      // The first line is a special case.
      if (isLineUrl(line)) {
        let lineParts = line.split(' (');
        let url = lineParts[0];
        let text = lineParts[1].slice(0, lineParts[1].length - 1);

        // Case 1: The first line is a URL. If so, make this slide a full bleed image
        // Add the URL as text to support cases where the image doesn't load
        let lineHtml = document.createElement('p');

        lineHtml.innerText = 'Image: ' + text;
        slideHtml.appendChild(lineHtml);

        // Add the image as a full bleed background
        let imageHtml = document.createElement('div');

        imageHtml.classList.add('full-bleed');
        imageHtml.style.backgroundImage = 'url(' + url + ')';

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
      // 3. The text is a paragraph: and should be displayed unadorned
      if (line[0] === '-' || line[0] === '*') {
        // Handle any lists galleries
        closeGallery();

        // Instantiate the unordered list, if it's not there
        if (!listHtml) {
          listHtml = document.createElement('ul');
          centerSlide = false;
        }

        let lineHtml = document.createElement('li');

        lineHtml.innerText = line.slice(1).trim(); // Extra trim is necessary because the line may have been '- ...' or '-...'.
        listHtml.appendChild(lineHtml);
      } else if (isLineUrl(line)) {
        // Handle any lists
        closeList();

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
      } else {
        // Handle any lists and galleries
        closeList();
        closeGallery();

        let lineHtml = document.createElement('p');

        lineHtml.innerText = line;
        slideHtml.appendChild(lineHtml);
      }
    }
  }

  // Handle any lists and galleries
  closeList();
  closeGallery();

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

  for (let i = 0; i < editorSlides.length; i++) {
    presentationHolder.appendChild(buildSlide(editorSlides[i], i));
  }

  presentSection.innerHTML = presentationHolder.innerHTML;
  presentSection.classList.add('u-visible');

  presentSection.querySelector('section').classList.add('current');
};

/**
 * Move from one slide to the next.
 */
let next = function () {
  let currentSlide = presentSection.querySelector('.current');

  if (currentSlide.nextSibling) {
    currentSlide.classList.add('previous');
    currentSlide.classList.remove('current');

    currentSlide.nextSibling.classList.add('current');
  }
};

/**
 * Move from one slide to the previous.
 */
let previous = function () {
  let currentSlide = presentSection.querySelector('.current');

  if (currentSlide.previousSibling) {
    currentSlide.classList.remove('current');

    currentSlide.previousSibling.classList.add('current');

    if (currentSlide.previousSibling.previousSibling) {
      currentSlide.previousSibling.previousSibling.classList.add('previous');
    } 
  }
};

/**
 * Escape out of the presentation.
 */
let leavePresentation = function () {
  presentSection.innerHTML = '';
  presentSection.classList.remove('u-visible');
};

/**
 * Add handlers.
 */
presentButton.addEventListener('click', buildPresentation);
presentSection.addEventListener('click', next);


document.addEventListener('onkeypress', function (event) {
  console.log('event', event)
  // TODO
})
