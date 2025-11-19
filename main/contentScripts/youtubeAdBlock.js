// YouTube Ad Blocker Content Script
// Injected into YouTube pages to provide ad-free video playback

(function() {
  'use strict';

  // Check if already injected
  if (window.__floatYouTubeAdBlockerInjected) {
    return;
  }
  window.__floatYouTubeAdBlockerInjected = true;

  console.log('Float Browser: YouTube ad blocker initialized');

  // CSS to hide ad containers and overlays
  const adBlockStyles = `
    /* Hide video ads */
    .video-ads.ytp-ad-module,
    .ytp-ad-overlay-container,
    .ytp-ad-text-overlay,
    .ytp-ad-player-overlay,
    .ytp-ad-image-overlay,
    .ytp-ad-skip-button-container,
    .ytp-ad-duration-remaining,
    .ytp-ad-text,
    .ytp-ad-preview-container,

    /* Hide banner ads */
    ytd-display-ad-renderer,
    ytd-promoted-sparkles-web-renderer,
    ytd-promoted-video-renderer,
    ytd-compact-promoted-video-renderer,
    ytd-promoted-sparkles-text-search-renderer,

    /* Hide masthead ads */
    #masthead-ad,
    ytd-banner-promo-renderer,
    ytd-statement-banner-renderer,

    /* Hide in-feed ads */
    ytd-ad-slot-renderer,
    yt-mealbar-promo-renderer,
    ytd-popup-container,
    tp-yt-paper-dialog:has(ytd-ad-slot-renderer),

    /* Hide overlay ads */
    .ytp-ce-element-show,
    .ytp-cards-teaser,

    /* Hide ad placeholders */
    #player-ads,
    #panels-ads,
    .ytd-merch-shelf-renderer,

    /* Hide sponsor segments in search/suggestions */
    ytd-ad-slot-renderer[is-video-end-screen],

    /* Additional ad containers */
    .ytd-ad-slot-renderer,
    ytd-in-feed-ad-layout-renderer,
    ytd-banner-promo-renderer-background,

    /* Hide "ads by" text */
    .ytp-ad-button-icon,
    .ytp-flyout-cta,
    .ytp-ad-survey,

    /* Product placement overlays */
    .ytp-paid-content-overlay,

    /* Engagement panels with ads */
    ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]
    {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      position: absolute !important;
      z-index: -1 !important;
    }
  `;

  // Inject the CSS styles
  function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'float-youtube-adblocker-styles';
    styleElement.textContent = adBlockStyles;
    (document.head || document.documentElement).appendChild(styleElement);
  }

  // Skip video ads by manipulating the player
  function skipAd(video) {
    if (!video) return false;

    // Check if ad is playing
    const adModule = document.querySelector('.ad-showing');
    const adContainer = document.querySelector('.ytp-ad-player-overlay');

    if (adModule || adContainer) {
      // Try to skip to the end of the ad
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        video.currentTime = video.duration;
      }

      // Click skip button if available
      const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
      if (skipButton) {
        skipButton.click();
      }

      return true;
    }

    return false;
  }

  // Remove ad elements from the DOM
  function removeAdElements() {
    const adSelectors = [
      '.video-ads.ytp-ad-module',
      '.ytp-ad-overlay-container',
      'ytd-display-ad-renderer',
      'ytd-promoted-sparkles-web-renderer',
      'ytd-ad-slot-renderer',
      '#player-ads',
      'ytd-banner-promo-renderer',
      'ytd-popup-container:has(ytd-ad-slot-renderer)'
    ];

    adSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el && el.parentNode) {
            el.remove();
          }
        });
      } catch (e) {
        // Selector might not be valid in all contexts
      }
    });
  }

  // Monitor video element for ads
  function monitorVideo() {
    const video = document.querySelector('video.html5-main-video');

    if (video) {
      // Check for ads periodically
      const adCheckInterval = setInterval(() => {
        if (skipAd(video)) {
          console.log('Float Browser: Skipped ad');
        }
      }, 500);

      // Listen for ad-related events
      video.addEventListener('timeupdate', function() {
        skipAd(video);
      });

      // Clean up interval on navigation
      document.addEventListener('yt-navigate-finish', () => {
        clearInterval(adCheckInterval);
      });
    }
  }

  // Use MutationObserver to detect and remove ads as they're added to the DOM
  function observeAdInjection() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if the added node is an ad
            if (node.matches && (
              node.matches('ytd-display-ad-renderer') ||
              node.matches('ytd-ad-slot-renderer') ||
              node.matches('.video-ads.ytp-ad-module') ||
              node.matches('ytd-promoted-sparkles-web-renderer')
            )) {
              node.remove();
              console.log('Float Browser: Removed dynamically inserted ad');
            }

            // Check if added node contains ads
            if (node.querySelectorAll) {
              const adElements = node.querySelectorAll('ytd-display-ad-renderer, ytd-ad-slot-renderer, .video-ads.ytp-ad-module');
              adElements.forEach(ad => {
                if (ad.parentNode) {
                  ad.remove();
                }
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  // Block ad-related network requests (runs in page context)
  function blockAdRequests() {
    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      // Block known ad endpoints
      if (typeof url === 'string' && (
        url.includes('/api/stats/ads') ||
        url.includes('/pagead/') ||
        url.includes('/api/stats/watchtime') ||
        url.includes('doubleclick.net') ||
        url.includes('googlesyndication.com')
      )) {
        console.log('Float Browser: Blocked ad request:', url);
        return;
      }
      return originalXHROpen.call(this, method, url, ...rest);
    };

    // Intercept Fetch API
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string' && (
        url.includes('/api/stats/ads') ||
        url.includes('/pagead/') ||
        url.includes('doubleclick.net') ||
        url.includes('googlesyndication.com')
      )) {
        console.log('Float Browser: Blocked ad request:', url);
        return Promise.reject(new Error('Ad request blocked'));
      }
      return originalFetch.apply(this, args);
    };
  }

  // Initialize when DOM is ready
  function initialize() {
    // Inject CSS immediately
    injectStyles();

    // Remove existing ads
    removeAdElements();

    // Start monitoring video
    monitorVideo();

    // Observe for dynamically added ads
    observeAdInjection();

    // Block ad requests at the client level
    blockAdRequests();

    // Re-initialize on YouTube navigation (SPA navigation)
    document.addEventListener('yt-navigate-finish', function() {
      setTimeout(() => {
        removeAdElements();
        monitorVideo();
      }, 500);
    });

    // Also monitor when player becomes ready
    document.addEventListener('yt-player-updated', function() {
      setTimeout(() => {
        monitorVideo();
      }, 100);
    });
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Periodic cleanup every 2 seconds to catch any ads that slip through
  setInterval(() => {
    removeAdElements();
  }, 2000);

})();
