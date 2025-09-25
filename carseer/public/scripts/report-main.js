$(document).ready(function(){
//////////////////Burger Menu SCRIPT///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

var reportMenuWrapper = document.getElementById("js-reportenu-wrapper"); 
var reportMenuContentBlock = document.getElementById("js-report-menu-content");
var reportMneuTrigger = document.getElementById("js-reportMenu-trigger");
var reportMneuClose = document.getElementById("js-reportMenu-close");

function onReportBurgerMenuClick() {
  reportMenuWrapper.classList.add("is-open");
}  

function onReportCloseMenuClick() {   
  reportMenuWrapper.classList.remove("is-open");
}

function onReportMenuModalClick(event) {
 var target = event.currentTarget;  
 if(event.target != reportMenuContentBlock) {
   reportMenuWrapper.classList.remove('is-open');
 }
} 

reportMneuTrigger.addEventListener('click', onReportBurgerMenuClick);
reportMneuClose.addEventListener('click', onReportCloseMenuClick);  
reportMenuWrapper.addEventListener('click', onReportMenuModalClick);


  
  

//////////////////STICKY HEADER///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
  
  var reportHeader = document.querySelector(".report-main-header");
  var sticky = reportHeader.offsetTop;

  function onPageScroll() { 
    if (window.pageYOffset > sticky) { 
      reportHeader.classList.add("js-sticky"); 
    } else {
      reportHeader.classList.remove("js-sticky");
    }
  }  

  window.addEventListener('scroll', onPageScroll);
  
  
  
  
  
//////////////////Smooth scrolling///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
  
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
  
  
  
  
/////////////////Ablum///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
  
  var album = $('.venobox').venobox({
    numeratio: true,
    titleattr  : 'data-title',
    spinColor: '#FF9933',
    spinner: 'three-bounce'
  });

  // close current item clicking on .closeme
  $(document).on('click', '.closeme', function(e) {
    album.VBclose();
  });

  // go to next item in gallery clicking on .next
  $(document).on('click', '.next', function(e) {
    album.VBnext();
  });

  // go to previous item in gallery clicking on .previous
  $(document).on('click', '.previous', function(e) {
    album.VBprev();
  });
  
});