const SELECTORS = {
  mastheadToggleButton: ".pf-c-masthead .pf-c-masthead__toggle button",
  pageSidebar: ".pf-c-page__sidebar",
  navItemExpandable: "li.pf-c-nav__item.pf-m-expandable",
  navLinkButton: "button.pf-c-nav__link",
  subNavSection: "section.pf-c-nav__subnav",
  cardGallery: ".pf-l-gallery",
  drawer: ".pf-c-drawer",
  drawerToggleButton: "button.drawer-toggle-button",
  drawerCloseButton: ".pf-c-drawer__close button",
  drawerTabContainer: ".pf-c-drawer .pf-c-drawer__head",
  tabListItem: "li.pf-c-tabs__item",
  tabButton: "button[data-tab-panel-id]",
};

document.addEventListener("DOMContentLoaded", () => {
  // Masthead toggle
  document
    .querySelector(SELECTORS.mastheadToggleButton)
    .addEventListener("click", () => {
      // TODO does this need to also mess with aria-hidden attributes on stuff? Compare with https://www.patternfly.org/v4/demos/card-view/react-demos/card-view/
      const pageSidebar = document.querySelector(SELECTORS.pageSidebar);
      if (pageSidebar.classList.contains("pf-m-expanded")) {
        pageSidebar.classList.remove("pf-m-expanded");
      } else {
        pageSidebar.classList.add("pf-m-expanded");
      }
    });

  // Expandable nav items
  document.querySelectorAll(SELECTORS.navItemExpandable).forEach((li) => {
    const button = li.querySelector(SELECTORS.navLinkButton);
    const section = li.querySelector(SELECTORS.subNavSection);
    button.addEventListener("click", () => {
      if (li.classList.contains("pf-m-expanded")) {
        li.classList.remove("pf-m-expanded");
        button.removeAttribute("aria-expanded");
        section.setAttribute("hidden", "");
      } else {
        li.classList.add("pf-m-expanded");
        button.setAttribute("aria-expanded", "true");
        section.removeAttribute("hidden");
      }
    });
  });

  // Clickable card navigation
  // Note: In addition to click events on the cards, for a11y we need to
  //       emulate the native behavior of keyboard interactions on real links.
  // Note: bindLinkRoleEvents is reusable for other places where we may introduce clickable elements with role="link"
  const bindLinkRoleEvents = (container) => {
    const handleEvent = (event) => {
      const { type, key, target, metaKey, ctrlKey, which } = event;
      const isMiddleMouseButton = type === "auxclick" && which === 2;
      // Ignore keys other than the Enter key
      if (["keyup", "keyup"].includes(type) && key !== "Enter") return;
      // Use keydown only for Cmd+Enter which doesn't trigger keyup on mac
      if (type === "keydown" && !metaKey) return;
      // Ignore auxclick events other than middle mouse button
      if (type === "auxclick" && !isMiddleMouseButton) return;
      const href = target.closest(`[data-href]`)?.getAttribute("data-href");
      if (href) {
        const shouldUseNewTab = metaKey || ctrlKey || isMiddleMouseButton;
        if (shouldUseNewTab) {
          window.open(href, "_blank");
        } else {
          document.location = href;
        }
      }
    };
    if (container) {
      container.addEventListener("click", handleEvent);
      container.addEventListener("auxclick", handleEvent);
      container.addEventListener("keyup", handleEvent);
      container.addEventListener("keydown", handleEvent);
    }
  };
  bindLinkRoleEvents(document.querySelector(SELECTORS.cardGallery));

  // Drawer desktop/mobile responsiveness
  const minWidthQuery = window.matchMedia("(min-width: 768px)");
  const initializeDrawer = (isDesktopMode) => {
    const drawer = document.querySelector(SELECTORS.drawer);
    if (isDesktopMode) {
      drawer.classList.add("pf-m-expanded");
    } else {
      drawer.classList.remove("pf-m-expanded");
    }
  };
  initializeDrawer(minWidthQuery.matches);
  minWidthQuery.addEventListener("change", (event) => {
    initializeDrawer(event.matches);
  });

  // Drawer toggle buttons
  [
    document.querySelector(SELECTORS.drawerToggleButton),
    document.querySelector(SELECTORS.drawerCloseButton),
  ].forEach((button) => {
    button.addEventListener("click", (event) => {
      const drawer = event.target.closest(SELECTORS.drawer);
      if (drawer.classList.contains("pf-m-expanded")) {
        drawer.classList.remove("pf-m-expanded");
      } else {
        drawer.classList.add("pf-m-expanded");
      }
    });
  });

  // Tabs in the drawer
  // Note: bindTabEvents is reusable for other places where we may introduce tabs
  const bindTabEvents = (container) => {
    container.addEventListener("click", (event) => {
      const thisTabLink = event.target.closest(SELECTORS.tabButton);
      const thisTabPanelId = thisTabLink?.getAttribute("data-tab-panel-id");
      const thisTabPanel =
        thisTabPanelId && document.getElementById(thisTabPanelId);
      if (thisTabPanel && thisTabPanel.hasAttribute("hidden")) {
        // Hide all tab panels before showing this one
        container
          .querySelectorAll(SELECTORS.tabButton)
          .forEach((otherTabLink) => {
            otherTabLink
              .closest(SELECTORS.tabListItem)
              ?.classList.remove("pf-m-current");
            const otherTabPanel = document.getElementById(
              otherTabLink.getAttribute("data-tab-panel-id")
            );
            otherTabPanel.setAttribute("hidden", "");
          });
        thisTabLink
          .closest(SELECTORS.tabListItem)
          .classList.add("pf-m-current");
        thisTabPanel.removeAttribute("hidden");
      }
    });
  };
  bindTabEvents(document.querySelector(SELECTORS.drawerTabContainer));
});

function changeTab(event, tabId) {
  // Hide all tabs
  const tabs = document.getElementsByClassName('ux-c-tab');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = 'none';
  }
  
  // Remove 'active' class from all tab links
  const tabLinks = document.getElementsByClassName('ux-c-tab__link');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('pf-m-primary');
  }
  
  // Show the selected tab
  document.getElementById(tabId).style.display = 'block';
  
  // Add 'active' class to the clicked tab link
  event.currentTarget.classList.add('pf-m-primary');
}

// Set the first tab as active by default
document.getElementsByClassName('ux-c-tab__link')[0].click();

// Set the first tab as active by default
document.getElementsByClassName('ux-c-tab__link')[0].click();
// Add active class to the current button (highlight it)
var header = document.getElementById("pf-c-jump-links__list");
var btns = header.getElementsByClassName("pf-c-jump-links__item");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
	var current = document.querySelector(".pf-c-jump-links__item.pf-m-current");
    current.classList.remove("pf-m-current");
	this.classList.add("pf-m-current");
  });
}
