const sidebar = document.getElementById("sidebar");
let touchStartX = 0;
let touchEndX = 0;
let lastScrollY = window.scrollY;

// navbar scrolling
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");

  if (lastScrollY < window.scrollY) {
    // scrolling down
    navbar.style.top = "-60px";
  } else {
    // scrolling up
    navbar.style.top = "0";
  }

  lastScrollY = window.scrollY;
});

// sidebar swiping
function checkSwipeDirection() {
  // determine the swipe direction
  if (touchEndX < touchStartX && Math.abs(touchStartX - touchEndX) > 50) {
    // swipe left - close the sidebar
    closeSidebar();
  }
  if (
    touchEndX > touchStartX &&
    touchStartX < 50 &&
    Math.abs(touchStartX - touchEndX > 50)
  ) {
    // swipe right - open the sidebar
    openSidebar();
  }
}

function openSidebar() {
  document.getElementById("sidebar").style.width = "20vw";
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
}

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  checkSwipeDirection();
});

function toggleSidebar() {
  if (sidebar.style.width === "20vw") {
    closeSidebar();
  } else {
    openSidebar();
  }
}
