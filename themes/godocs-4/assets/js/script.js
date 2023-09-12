// Preloader js
function preloader() {
  $(".preloader").delay(100).fadeOut(10);
}
$(preloader);

(function ($) {
  "use strict";

  // copy-to-clipboard
  let copyEl = document.querySelector(".copy-url");
  if (copyEl !== null) {
    let pageUrl = window.location.href;
    let latestDocVer = copyEl.getAttribute("data-latest-doc-ver");
    if (pageUrl.includes(latestDocVer)) {
      pageUrl = pageUrl.replace(latestDocVer, "latest");
    }
    
    copyEl.addEventListener("click", function () {
      this.classList.add("done");

      let textarea = document.createElement("textarea");
      textarea.value = pageUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

    });

    copyEl.addEventListener("mouseleave", function () {
      this.classList.remove("done");
    });
  }

  if ($('.search-wrapper').length > 0) {
    // searchToggler keyboard shortcut
    const searchToggler = document.querySelectorAll('[data-search-toggler]');
    searchToggler.forEach((item) => {
      let userAgentData = navigator?.userAgentData?.platform || navigator?.platform || 'unknown';
      if (userAgentData == 'macOS') {
        item.innerText = `⌘ + K`
      } else {
        item.innerText = `Ctrl + K`
      }
    });

    $('#searchModal').on('shown.bs.modal', function () {
      document.getElementById('searchInput').focus()
    });

    let modalOpen = false;
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") {
        searchModal.hide();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (!modalOpen) {
          e.preventDefault();
          $('#searchModal').modal('show');
          modalOpen = true;
        } else {
          e.preventDefault();
          $('#searchModal').modal('hide');
          modalOpen = false;
        }
      }
    });
    $('#searchModal').on('hidden.bs.modal', e => {
      modalOpen = false;
    });
  }
  
  // Code Copy
  // ----------------------------------------
  let blocks = document.querySelectorAll(".code-highlight");

  async function copyCode(block, button) {
    let code = block.querySelector("code");
    let text = code.innerText;
    await navigator.clipboard.writeText(text);
    button.innerText = "copied";
    setTimeout(() => {
      button.innerText = "copy";
    }, 700);
  }

  blocks.forEach((block) => {
    if (navigator.clipboard) {
      let button = document.createElement("span");
      button.innerText = "copy";
      button.className = "copy";
      block.appendChild(button);
      button?.addEventListener("click", async () => {
        await copyCode(block, button);
      });
    }
  });

  // scroll function
  $(window).scroll(function () {
    // navfixed
    if ($(".navigation").offset().top > 50) {
      $(".navigation").addClass("nav-bg");
    } else {
      $(".navigation").removeClass("nav-bg");
    }

    // search add for homepage
    var height = $("#banner").innerHeight();
    if ($(".navigation").offset().top > height) {
      $(".navigation").addClass("nav-bg-home");
    } else {
      $(".navigation").removeClass("nav-bg-home");
    }
  });

  // sidenav js
  const matches = document.querySelectorAll(
    `li[data-nav-id$="${window.location.pathname}"]`
  );
  if (matches.length > 0) {
    const menu = matches[0];
    menu.classList.add("active");

    let maxDepth = 10; // Avoid infinite loop !
    let nextAncestor = menu.closest("li[data-nav-id]");
    while (maxDepth-- >= 0 && nextAncestor !== null) {
      nextAncestor.classList.add("parent");
      let icon = nextAncestor.querySelector(".category-icon");
      if (icon !== null) {
        icon.classList.remove("icon-right");
        icon.classList.add("icon-down");
      }
      nextAncestor = nextAncestor.parentNode.closest("li[data-nav-id]");
    }
  }

  $(window).on("load", function () {
    $(".sidenav").removeClass("invisible");
  });

  $(".sidenav").on("click", ".sidenav-toggler", function () {
    $(".sidenav").toggleClass("sidenav-hidden");
    $("body").toggleClass("sidenav-invisible");
    localStorage.setItem("sidenav", "hidden");
    return false;
  });
  if (localStorage.getItem("sidenav") == "hidden") {
    $(".sidenav").addClass("sidenav-hidden");
    $("body").addClass("sidenav-invisible");
    $(".sidenav").on("click", ".sidenav-toggler", function () {
      localStorage.removeItem("sidenav");
    });
  }

  $(".sidenav .category-icon").on("click", function () {
    $(this).toggleClass("icon-down icon-right");
    $(this).parent().parent().children("ul").slideToggle(200);
    return false;
  });

  $('[data-toggle="sidebar"]').on("click", function () {
    $(".sidenav").toggleClass("show");
    $(this).children("svg").toggleClass("d-none");
  });

  // masonry
  if ($(".masonry-wrapper").length > 0) {
    setTimeout(function () {
      $(".masonry-wrapper").masonry({
        columnWidth: 1,
      });
    }, 1000);
  }

  // Get Parameters from some url
  var getUrlParameter = function getUrlParameter(sPageURL) {
    var url = sPageURL.split("?");
    var obj = {};
    if (url.length == 2) {
      var sURLVariables = url[1].split("&"),
        sParameterName,
        i;
      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");
        obj[sParameterName[0]] = sParameterName[1];
      }
      return obj;
    } else {
      return undefined;
    }
  };

  // Execute actions on images generated from Markdown pages
  var images = $(".content img").not(".inline");
  // Wrap image inside a featherlight (to get a full size view in a popup)
  images.wrap(function () {
    var image = $(this);
    if (!image.parent("a").length) {
      return "<a href='" + image[0].src + "' data-featherlight='image'></a>";
    }
  });

  // Change styles, depending on parameters set to the image
  images.each(function (index) {
    var image = $(this);
    var o = getUrlParameter(image[0].src);
    if (typeof o !== "undefined") {
      var h = o["height"];
      var w = o["width"];
      var c = o["classes"];
      image.css("width", function () {
        if (typeof w !== "undefined") {
          return w;
        } else {
          return "auto";
        }
      });
      image.css("height", function () {
        if (typeof h !== "undefined") {
          return h;
        } else {
          return "auto";
        }
      });
      if (typeof c !== "undefined") {
        var classes = c.split(",");
        for (i = 0; i < classes.length; i++) {
          image.addClass(classes[i]);
        }
      }
    }
  });

  // tab
  $(".tab-content")
    .find(".tab-pane")
    .each(function (idx, item) {
      var navTabs = $(this).closest(".code-tabs").find(".nav-tabs"),
        title = $(this).attr("title");
      navTabs.append(
        '<li class="nav-item"><a class="nav-link" href="#">' +
          title +
          "</a></li>"
      );
    });

  $(".code-tabs ul.nav-tabs").each(function () {
    $(this).find("li:first").addClass("active");
  });

  $(".code-tabs .tab-content").each(function () {
    $(this).find("div:first").addClass("active");
  });

  $(".nav-tabs a").click(function (e) {
    e.preventDefault();
    var tab = $(this).parent(),
      tabIndex = tab.index(),
      tabPanel = $(this).closest(".code-tabs"),
      tabPane = tabPanel.find(".tab-pane").eq(tabIndex);
    tabPanel.find(".active").removeClass("active");
    tab.addClass("active");
    tabPane.addClass("active");
  });

  // clipboard
  var clipInit = false;
  $("code").each(function () {
    var code = $(this),
      text = code.text();
    if (text.length > 2) {
      if (!clipInit) {
        var text,
          clip = new ClipboardJS(".copy-to-clipboard", {
            text: function (trigger) {
              text = $(trigger).prev("code").text();
              return text.replace(/^\$\s/gm, "");
            },
          });
        clipInit = true;
      }
      code.after('<span class="copy-to-clipboard">copy</span>');
    }
  });
  $(".copy-to-clipboard").click(function () {
    $(this).html("copied");
  });

  // search
  $("#search-by").keyup(function () {
    if (this.value) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });

  // featherlight
  $(function () {
    $('a[rel="lightbox"]').featherlight({
      root: "body.content",
    });
  });

  // table of content
  if ($("#TableOfContents li").length > 0) {
    new ScrollMenu("#TableOfContents a", {
      duration: 400,
      activeOffset: 40,
      scrollOffset: 10,
    });
  }

})(jQuery);
