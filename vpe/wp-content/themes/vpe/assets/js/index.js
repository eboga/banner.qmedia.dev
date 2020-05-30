// Header menu

let headerToggle   = document.querySelector(".js-HeaderToggle");
let headerMenu     = document.querySelector(".js-HeaderMenu");
let headerNavLinks = document.querySelectorAll(".js-HeaderNav-btn");

let headerNavLinkScrolling = false;

if (headerToggle && headerMenu) {
    headerToggle.addEventListener("click", (event) => {
        headerToggle.classList.toggle("isActive");
        headerMenu.classList.toggle("isActive");
        document.documentElement.classList.toggle("h-OvH");
    });

    if (headerNavLinks && headerNavLinks.length > 0) {
        headerNavLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();

                headerToggle.classList.remove("isActive");
                headerMenu.classList.remove("isActive");
                document.documentElement.classList.remove("h-OvH");

                let href = link.getAttribute("href");

                if (href.includes(":")) {
                    href = href.replace(":", "\\:");
                }

                if (href && href !== '#') {
                    let target = document.querySelector(href)
                    if (target) {
                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                        headerNavLinkScrolling = true;

                        let headerNavLinkAnimationInterval = setInterval(headerNavLinkAnimationCallback, 50, target);
                        setTimeout(() => { clearInterval(headerNavLinkAnimationInterval) }, 5000);
                    }
                }
            });
        });
    }
}

let headerNavLinkAnimationCallback = (target) => {
    let targetRectangle      = target.getBoundingClientRect();
    let targetViewportIndent = Math.round(targetRectangle.top);
    if (targetViewportIndent < 2) {
        headerNavLinkScrolling = false;
    }
}



// Accordion

let accordions = document.querySelectorAll(".js-Accordion");

if (accordions && accordions.length > 0) {
  accordions.forEach((accordion) => {
    var inits = accordion.querySelectorAll(".js-Accordion-init");

    inits.forEach((init) => {
      init.addEventListener("click", (event) => {
        var body = accordion.querySelector(
          "#" + init.getAttribute("aria-controls")
        );

        if (!body) return;

        if (init.classList.contains("isOpen")) {
          init.classList.remove("isOpen");
          init.setAttribute("aria-expanded", "false");
          body.classList.remove("isOpen");
        } else {
          init.classList.add("isOpen");
          init.setAttribute("aria-expanded", "true");
          body.classList.add("isOpen");
        }
      });
    });
  });
}



// Scroll stopping

let scrollSuspendSkip    = 0;
let scrollSuspended      = false;
let scrollSuspenders     = document.querySelectorAll(".js-ScrollSuspend");
let scrollPositionLast   = window.scrollY || window.pageYOffset;
let scrollSuspendHandler = () => {
    if (headerNavLinkScrolling === true) return;

    if (scrollSuspendSkip > 0) {
        scrollSuspendSkip--;
        return;
    }

    // Gets data about current and previous window scroll position.
    let scrollPositionCurrent = window.scrollY || window.pageYOffset;
    let scrollDirectionDown   = scrollPositionCurrent > scrollPositionLast ? true : false;
    scrollPositionLast        = scrollPositionCurrent;

    // Scroll suspending should work only for scrolling down.
    if (scrollDirectionDown === false ) return;

    // Terminates the function if scroll is suspended, which means that animation is still in progress.
    if (scrollSuspended === true) return;

    let scrollSuspendersData = [];

    scrollSuspenders.forEach(element => {
        // Gets position of the element in the viewport.
        let elementRectangle      = element.getBoundingClientRect();
        let elementViewportIndent = Math.round(elementRectangle.top);

        scrollSuspendersData.push({
            element: element,
            elementRectangle: elementRectangle,
            elementViewportIndent: elementViewportIndent,
        });
    });

    scrollSuspendersData.forEach(object => {
        let element = object.element;
        let elementRectangle = object.elementRectangle;
        let elementViewportIndent = object.elementViewportIndent;

        if (elementViewportIndent > 0) {
            if (
                elementViewportIndent < 1 ||
                elementViewportIndent < 2 ||
                elementViewportIndent < 3 ||
                elementViewportIndent < 4 ||
                elementViewportIndent < 5 ||
                elementViewportIndent < 10 ||
                elementViewportIndent < 20 ||
                elementViewportIndent < 30 ||
                elementViewportIndent < 40 ||
                elementViewportIndent < 50 ||
                elementViewportIndent < 60 ||
                elementViewportIndent < 70 ||
                elementViewportIndent < 80 ||
                elementViewportIndent < 90 ||
                elementViewportIndent < 200
            ) {
                scrollSuspended = true;

                document.body.classList.add("isScrollSuspended");

                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 200);

                let scrollAnimationCallbackInterval = setInterval(scrollAnimationCallback, 100, element);
                setTimeout(() => { clearInterval(scrollAnimationCallbackInterval) }, 3500);
            }
        }
    });
}

let scrollAnimationCallback = (element) => {
    let elementRectangle      = element.getBoundingClientRect();
    let elementViewportIndent = Math.round(elementRectangle.top);
    if (scrollSuspended === true && elementViewportIndent < 2) {
        scrollSuspendSkip = 1;
        scrollSuspended = false;
        document.body.classList.remove("isScrollSuspended");
    }
};

if (window.innerWidth < 992) {
    window.addEventListener("scroll", scrollSuspendHandler, { passive: true });
    window.addEventListener("resize", scrollSuspendHandler, { passive: true });
}
