document.addEventListener("DOMContentLoaded", function() {
  toggleNavigation();
});

window.addEventListener("load", function() {
  scrollToCurrentNavigationItem();
  scrollToAnchor();
});

// pjax
// https://github.com/MoOx/pjax
var pjax = new Pjax({
  selectors: ["title", ".body"],
  cacheBust: false
});

document.addEventListener("pjax:success", function() {
  Prism.highlightAll(); // Rerun Prism syntax highlighting on the current page
  document.querySelector("html").classList.remove("sidebar--open");
});

function toggleNavigation() {
  var currentItem = document.querySelector(".navigation__item--current");

  // navigation: toggle sidebar
  var navigationButton = document.querySelector(".navigation-button");
  navigationButton.addEventListener("click", function(e) {
    document.querySelector("html").classList.toggle("sidebar--open");
  });

  // navigation: open current path on initial load
  for (
    ;
    currentItem && currentItem !== document;
    currentItem = currentItem.parentNode
  ) {
    if (currentItem.classList.contains("navigation")) break;

    if (currentItem.classList.contains("navigation__item--has-children")) {
      currentItem.classList.add("navigation__item--active");
    }
  }

  // navigation: toggle submenus
  var items = document.querySelectorAll(".navigation__toggle");
  for (var item of items) {
    item.addEventListener("click", function(e) {
      this.parentNode.classList.toggle("navigation__item--active");
    });
  }

  // navigation: toggle current items
  var items = document.querySelectorAll(".navigation__link");
  for (var item of items) {
    item.addEventListener("click", function(e) {
      var current = document.querySelector(".navigation__item--current");
      if (current) {
        current.classList.remove("navigation__item--current");
      }
      this.parentNode.classList.add("navigation__item--current");
    });
  }
}

function scrollToCurrentNavigationItem() {
  var currentItem = document.querySelector(".navigation__item--current");
  var scrollItem = document.querySelector(".sidebar__body");
  var currentTopPosition = currentItem
    ? currentItem.getBoundingClientRect().top -
      (window.innerHeight - currentItem.offsetHeight) / 2
    : 0;
  scrollItem.scrollTop = currentTopPosition;
}

function scrollToAnchor() {
  var hash = window.location.hash.substr(1);
  if (hash) {
    var anchor = document.querySelectorAll(
      "#" + hash + ", [name=" + hash + "]"
    )[0];
  }
  if (anchor) {
    anchor.scrollIntoView({
      behavior: "instant",
      block: "start"
    });
  }
}
