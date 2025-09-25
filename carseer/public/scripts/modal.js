"use strict";

//////////////////MODAL SCRIPT///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
var modalTrigger = document.querySelectorAll(".js-modal-trigger"); 
var closeModal = document.querySelectorAll(".js-modal-close");
var modalWrapper = document.querySelectorAll(".js-modal-wrapper");

function onModalClick(event) {
  var target = event.currentTarget;  
  if(event.target.className == "modal-wrapper__container") {
   target.classList.remove('is-active');
    
    if (target.querySelector(".media-block__video iframe") !== null) {
     target.querySelector(".media-block__video iframe").src = target.querySelector(".media-block__video iframe").src; 
   }
  }
}  

function closeModalBlock(modalContent) { 
  modalContent.classList.remove('is-active');
  if (modalContent.querySelector(".media-block__video iframe") !== null) {
     modalContent.querySelector(".media-block__video iframe").src = modalContent.querySelector(".media-block__video iframe").src; 
  }
}  
  
function onCloseModalClick(event) {
  var target = event.currentTarget;  
  var id = target.dataset.target;
  var modalContent = document.getElementById("js-modal-" + id);
  closeModalBlock(modalContent); 
}

function openModal(modalContent) { 
  modalContent.classList.add('is-active');   
}

function onOpenModalClick(event) { 
  var target = event.currentTarget;  
  var id = target.dataset.target;
  var modalContent = document.getElementById("js-modal-" + id);
  openModal(modalContent);
}

for (var m = 0; m < modalTrigger.length; m++) {
  modalTrigger[m].addEventListener('click', onOpenModalClick);
}

for (var c = 0; c < closeModal.length; c++) {
  closeModal[c].addEventListener('click', onCloseModalClick);
}

for (var s = 0; s < modalWrapper.length; s++) {
  modalWrapper[s].addEventListener('click', onModalClick);
}

