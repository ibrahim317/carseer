"use strict";

var accordionHeader = document.querySelector('.js-payment-accordion-header');
var accordionBody = document.querySelector('.js-payment-accordion-body');

function onAccrodionHeaderrClick() {
  if(accordionHeader.classList.contains("js-isExpanded")) {
    accordionBody.classList.remove("js-isExpanded");
    accordionHeader.classList.remove("js-isExpanded");
  } else {
    accordionBody.classList.add("js-isExpanded");
    accordionHeader.classList.add("js-isExpanded");
  }
}

if (accordionHeader != null) {
    accordionHeader.addEventListener('click', onAccrodionHeaderrClick());
}
