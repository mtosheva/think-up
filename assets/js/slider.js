var slideshowDuration = 4000;
var slideshow = $(".main-content .slideshow");

function slideshowSwitch(slideshow, index, auto) {
  if (slideshow.data("wait")) return;

  var slides = slideshow.find(".slide");
  var activeSlide = slides.filter(".is-active");
  var newSlide = slides.eq(index);

  if (newSlide.is(activeSlide)) return;

  // Remove animation and directly switch slides
  activeSlide.removeClass("is-active");
  newSlide.addClass("is-active");

  // Optionally, trigger pagination update
  slideshow.find(".pagination").trigger("check");

  // Optionally, restart the slideshow timer
  if (auto) {
    var timeout = slideshow.data("timeout");
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      slideshowNext(slideshow, false, true);
    }, slideshowDuration);
    slideshow.data("timeout", timeout);
  }
}

function slideshowNext(slideshow, previous, auto) {
  var slides = slideshow.find(".slide");
  var activeSlide = slides.filter(".is-active");
  var newSlide = null;
  if (previous) {
    newSlide = activeSlide.prev(".slide");
    if (newSlide.length === 0) {
      newSlide = slides.last();
    }
  } else {
    newSlide = activeSlide.next(".slide");
    if (newSlide.length == 0) newSlide = slides.filter(".slide").first();
  }

  slideshowSwitch(slideshow, newSlide.index(), auto);
}

function homeSlideshowParallax() {
  var scrollTop = $(window).scrollTop();
  if (scrollTop > windowHeight) return;
  var inner = slideshow.find(".slideshow-inner");
  var newHeight = windowHeight - scrollTop / 2;
  var newTop = scrollTop * 0.8;

  inner.css({
    transform: "translateY(" + newTop + "px)",
    height: newHeight,
  });
}

$(document).ready(function () {
  $(".slide").addClass("is-loaded");

  $(".slideshow .arrows .arrow").on("click", function () {
    slideshowNext($(this).closest(".slideshow"), $(this).hasClass("prev"));
  });

  $(".slideshow .pagination .item").on("click", function () {
    slideshowSwitch($(this).closest(".slideshow"), $(this).index());
  });

  $(".slideshow .pagination").on("check", function () {
    var slideshow = $(this).closest(".slideshow");
    var pages = $(this).find(".item");
    var index = slideshow.find(".slides .is-active").index();
    pages.removeClass("is-active");
    pages.eq(index).addClass("is-active");
  });

  /* Lazyloading
$('.slideshow').each(function(){
  var slideshow=$(this);
  var images=slideshow.find('.image').not('.is-loaded');
  images.on('loaded',function(){
    var image=$(this);
    var slide=image.closest('.slide');
    slide.addClass('is-loaded');
  });
*/

  var timeout = setTimeout(function () {
    slideshowNext(slideshow, false, true);
  }, slideshowDuration);

  slideshow.data("timeout", timeout);
});

if ($(".main-content .slideshow").length > 1) {
  $(window).on("scroll", homeSlideshowParallax);
}
