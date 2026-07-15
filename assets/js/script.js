document.addEventListener("DOMContentLoaded", function() {
  toggleNavigation();
  initNavigationSearch();
  buildArticleToc();
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
  buildArticleToc();
  scrollToAnchor();
});

function toggleNavigation() {
  var currentItem = document.querySelector(".navigation__item--current");

  // navigation: toggle sidebar
  var navigationButton = document.querySelector(".navigation-button");
  navigationButton.addEventListener("click", function(e) {
    document.querySelector("html").classList.toggle("sidebar--open");
  });

  // navigation: fold and unfold
  var foldButton = document.querySelector(".fold-navigation");
  foldButton.addEventListener("click", function(e) {
    var items = document.querySelectorAll(".navigation__toggle");
    var foldButtonIsActive = foldButton.classList.contains("fold-navigation--active");
    if (foldButtonIsActive) {
      // unfold navigation except current path
      for (var item of items) {
        if (item.parentNode.querySelector(".navigation__item--current") == null) {
          item.parentNode.classList.remove("navigation__item--active");
        }
      }
      foldButton.classList.remove("fold-navigation--active");
    }
    else {
      // unfold entire navigation
      for (var item of items) {
        item.parentNode.classList.add("navigation__item--active");
      }
      foldButton.classList.add("fold-navigation--active");
    }
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

function initNavigationSearch() {
  var searchInput = document.querySelector("#navigation-search");
  var emptyState = document.querySelector(".navigation-search__empty");

  if (!searchInput || searchInput.dataset.initialized === "true") {
    return;
  }

  searchInput.dataset.initialized = "true";
  searchInput.addEventListener("input", function() {
    var query = this.value.trim().toLowerCase();
    var items = document.querySelectorAll(".navigation > .navigation__list > .navigation__item");
    var visibleCount = 0;

    for (var item of items) {
      if (filterNavigationItem(item, query)) {
        visibleCount++;
      }
    }

    emptyState.hidden = visibleCount > 0;
  });
}

function filterNavigationItem(item, query) {
  var label = getDirectNavigationLabel(item);
  var childItems = getDirectChildNavigationItems(item);
  var childMatch = false;
  var hasChildren = item.classList.contains("navigation__item--has-children");

  for (var childItem of childItems) {
    if (filterNavigationItem(childItem, query)) {
      childMatch = true;
    }
  }

  var selfMatch = query === "" || label.indexOf(query) !== -1;
  var visible = query === "" || selfMatch || childMatch;

  item.hidden = !visible;
  updateNavigationLabelHighlight(item, query, selfMatch);

  if (hasChildren) {
    if (query !== "") {
      item.classList.toggle("navigation__item--active", childMatch || selfMatch);
    }
    else if (item.querySelector(".navigation__item--current") == null) {
      item.classList.remove("navigation__item--active");
    }
  }

  return visible;
}

function getDirectNavigationLabel(item) {
  var labelElement = getDirectNavigationElement(item);
  return labelElement ? getOriginalNavigationLabel(labelElement).toLowerCase() : "";
}

function getDirectChildNavigationItems(item) {
  var subList = item.querySelector(":scope > .navigation__sub > .navigation__list");
  return subList ? subList.children : [];
}

function getDirectNavigationElement(item) {
  return item.querySelector(":scope > .navigation__link, :scope > .navigation__toggle");
}

function getOriginalNavigationLabel(labelElement) {
  if (!labelElement.dataset.originalLabel) {
    labelElement.dataset.originalLabel = labelElement.textContent.trim();
  }

  return labelElement.dataset.originalLabel;
}

function updateNavigationLabelHighlight(item, query, selfMatch) {
  var labelElement = getDirectNavigationElement(item);

  if (!labelElement) {
    return;
  }

  labelElement.classList.toggle("navigation__label--matched", query !== "" && selfMatch);
}

function buildArticleToc() {
  var article = document.querySelector('.doc-article[data-toc="true"]');

  if (!article) {
    return;
  }

  var oldToc = article.querySelector(".article-toc");
  if (oldToc) {
    oldToc.remove();
  }

  var title = article.querySelector("h1");
  if (!title) {
    return;
  }

  var headings = article.querySelectorAll("h2, h3");
  var tocItems = [];

  for (var heading of headings) {
    var label = heading.textContent.trim();
    if (label === "" || /^(toc|inhaltsverzeichnis)$/i.test(label)) {
      continue;
    }

    var anchor = ensureHeadingAnchor(heading);
    tocItems.push({
      anchor: anchor,
      label: label,
      level: heading.tagName.toLowerCase()
    });
  }

  if (tocItems.length === 0) {
    return;
  }

  var toc = document.createElement("nav");
  toc.className = "article-toc";
  toc.setAttribute("aria-label", "Inhaltsverzeichnis");

  var tocTitle = document.createElement("h2");
  tocTitle.className = "article-toc__title";
  tocTitle.textContent = "Inhaltsverzeichnis";
  toc.appendChild(tocTitle);

  var list = document.createElement("ul");
  list.className = "article-toc__list";

  for (var item of tocItems) {
    var listItem = document.createElement("li");
    listItem.className = "article-toc__item article-toc__item--" + item.level;

    var link = document.createElement("a");
    link.className = "article-toc__link";
    link.href = "#" + item.anchor;
    link.textContent = item.label;

    listItem.appendChild(link);
    list.appendChild(listItem);
  }

  toc.appendChild(list);
  title.insertAdjacentElement("afterend", toc);
}

function ensureHeadingAnchor(heading) {
  var previousElement = heading.previousElementSibling;
  if (!heading.id && previousElement && previousElement.tagName === "A" && previousElement.name) {
    heading.id = previousElement.name;
  }

  if (!heading.id) {
    heading.id = slugify(heading.textContent);
  }

  return heading.id;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
