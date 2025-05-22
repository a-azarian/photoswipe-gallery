// photoswipe-lightbox.js - اسکریپت ساده راه‌اندازی PhotoSwipe Lightbox

import PhotoSwipe from './photoswipe.esm.js';

export default class PhotoSwipeLightbox {
  constructor(options) {
    this.gallerySelector = options.gallery;
    this.childrenSelector = options.children || 'a';
    this.pswpModule = options.pswpModule;
    this.appendToEl = options.appendToEl || document.body;
    this.openPromise = options.openPromise;
    this.showAnimationDuration = options.showAnimationDuration || 0;
    this.hideAnimationDuration = options.hideAnimationDuration || 0;
    this.lightbox = null;
    this.init();
  }

  async init() {
    this.pswp = await this.pswpModule();
    this.bindEvents();
  }

  bindEvents() {
    const gallery = document.querySelector(this.gallerySelector);
    if (!gallery) return;

    gallery.addEventListener('click', async (e) => {
      const target = e.target.closest(this.childrenSelector);
      if (!target) return;

      e.preventDefault();
      await this.open(target.href);
    });
  }

  async open(url) {
    if (this.openPromise) {
      await this.openPromise();
    }

    this.lightbox = new this.pswp({
      gallery: document.querySelector(this.gallerySelector),
      children: this.childrenSelector,
      pswpModule: () => import('./photoswipe.esm.js'),
      index: Array.from(document.querySelectorAll(this.gallerySelector + ' ' + this.childrenSelector)).findIndex(el => el.href === url),
      showAnimationDuration: this.showAnimationDuration,
      hideAnimationDuration: this.hideAnimationDuration,
      appendToEl: this.appendToEl,
    });

    this.lightbox.init();
    this.lightbox.loadAndOpen();
  }
}
