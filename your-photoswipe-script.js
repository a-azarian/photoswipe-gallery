import PhotoSwipeLightbox from './photoswipe-lightbox.js';

const fullscreenAPI = getFullscreenAPI();

const pswpContainer = getContainer();

function getFullscreenPromise() {
  return new Promise((resolve) => {
    if (!fullscreenAPI || fullscreenAPI.isFullscreen()) {
      resolve();
      return;
    }

    document.addEventListener(fullscreenAPI.change, () => {
      pswpContainer.style.display = 'block';
      setTimeout(() => resolve(), 300);
    }, { once: true });

    fullscreenAPI.request(pswpContainer);
  });
}

const lightbox = new PhotoSwipeLightbox({
  gallery: '#gallery--native-fs',
  children: 'a',
  pswpModule: () => import('./photoswipe.esm.js'),
  openPromise: getFullscreenPromise,
  appendToEl: fullscreenAPI ? pswpContainer : document.body,
  showAnimationDuration: 0,
  hideAnimationDuration: 0,
  preloadFirstSlide: false
});

lightbox.on('close', () => {
  pswpContainer.style.display = 'none';
  if (fullscreenAPI && fullscreenAPI.isFullscreen()) {
    fullscreenAPI.exit();
  }
});

lightbox.init();

function getFullscreenAPI() {
  let enterFS, exitFS, elementFS, changeEvent, errorEvent;

  if (document.documentElement.requestFullscreen) {
    enterFS = 'requestFullscreen';
    exitFS = 'exitFullscreen';
    elementFS = 'fullscreenElement';
    changeEvent = 'fullscreenchange';
    errorEvent = 'fullscreenerror';
  } else if (document.documentElement.webkitRequestFullscreen) {
    enterFS = 'webkitRequestFullscreen';
    exitFS = 'webkitExitFullscreen';
    elementFS = 'webkitFullscreenElement';
    changeEvent = 'webkitfullscreenchange';
    errorEvent = 'webkitfullscreenerror';
  }

  if (enterFS) {
    return {
      request(el) {
        if (enterFS === 'webkitRequestFullscreen') {
          el[enterFS](Element.ALLOW_KEYBOARD_INPUT);
        } else {
          el[enterFS]();
        }
      },
      exit() {
        return document[exitFS]();
      },
      isFullscreen() {
        return document[elementFS];
      },
      change: changeEvent,
      error: errorEvent
    };
  }

  return null;
}

function getContainer() {
  const container = document.createElement('div');
  container.style.background = '#000';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.display = 'none';
  document.body.appendChild(container);
  return container;
}
function openFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function handleOrientationChange() {
  // اگر حالت گوشی افقی شد (landscape)
  if(window.matchMedia("(orientation: landscape)").matches) {
    openFullscreen();
  } else {
    // اگر حالت عمودی شد و فول‌اسکرین بود، خارج شو
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
}

// هنگام بارگذاری صفحه
window.addEventListener('load', handleOrientationChange);
// هنگام تغییر جهت صفحه
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);
