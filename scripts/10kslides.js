'use strict';

let presentButton = document.querySelector('#presentButton');
let editText = document.querySelector('#edit');
let presentSection = document.querySelector('#present');

/**
 * Builds a single slide from a set of lines, and returns the HTML.
 */
let buildSlide = function (slideText) {
  let slideLines = slideText.split('\n');
  let slideHtml = document.createElement('section');
  let unorderdList;
  let containsOrderdList = false;

  for (let i = 0; i < slideLines.length; i++) {
    let line = slideLines[i].trim();

    // The first line becomes a header
    if (i === 0) {
      let lineHtml = document.createElement('h1');

      lineHtml.innerHTML = line;
      slideHtml.appendChild(lineHtml);
    } else {
      // There are two options here:
      // 1. The text is a bullet list: '-', '*', '- ', etc.
      // 2. The text is a paragraph
      if (line[0] === '-' || line[0] === '*') {
        // Instantiate the unordered list, if it's not there
        if (!unorderdList) {
          unorderdList = document.createElement('ul');
          containsOrderdList = true;
        }

        let lineHtml = document.createElement('li');

        lineHtml.innerHTML = line.slice(1).trim();
        slideHtml.appendChild(lineHtml);
      } else {
        // If we're in an unordered list, close it and add a paragraph
        if (unorderdList) {
          slideHtml.appendChild(unorderdList);
          unorderdList = undefined;
        }

        let lineHtml = document.createElement('p');

        lineHtml.innerHTML = line;
        slideHtml.appendChild(lineHtml);
      }
    }
  }

  // If there's a hanging unordered list, append it
  if (unorderdList) {
    slideHtml.appendChild(unorderdList);
  }

  // See if this is a title slide
  if (!containsOrderdList && slideLines.length <= 2) {
    slideHtml.classList.add('title');
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
    presentationHolder.appendChild(buildSlide(editorSlides[i]));
  }

  presentSection.innerHTML = presentationHolder.innerHTML;
  presentSection.classList.add('u-visible');
};

presentButton.addEventListener('click', buildPresentation);