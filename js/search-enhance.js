(function () {
  function enhanceLunr() {
    if (!window.lunr || !window.lunr.Index || window.lunr.Index.prototype.__sincereSearchEnhanced) return;

    var originalSearch = window.lunr.Index.prototype.search;

    function shouldEnhance(query) {
      return typeof query === 'string' && /[A-Za-z0-9]/.test(query);
    }

    function buildWildcardQuery(query) {
      return query
        .trim()
        .split(/\s+/)
        .map(function (term) {
          return term.replace(/[^\w.-]/g, '');
        })
        .filter(Boolean)
        .map(function (term) {
          return /[*~^:+-]/.test(term) ? term : term + '*';
        })
        .join(' ');
    }

    window.lunr.Index.prototype.search = function (query) {
      var results = originalSearch.call(this, query);
      if (results.length || !shouldEnhance(query)) return results;

      var wildcardQuery = buildWildcardQuery(query);
      if (!wildcardQuery || wildcardQuery === query) return results;

      try {
        return originalSearch.call(this, wildcardQuery);
      } catch (err) {
        return results;
      }
    };

    window.lunr.Index.prototype.__sincereSearchEnhanced = true;
  }

  function initSearchControls() {
    ['desktop', 'mobile'].forEach(function (suffix) {
      var search = document.getElementById('search-' + suffix);
      var input = document.getElementById('search-input-' + suffix);
      var clear = document.getElementById('search-clear-' + suffix);
      if (!search || !input || !clear) return;

      function syncState() {
        search.classList.toggle('has-query', input.value.trim().length > 0);
      }

      input.addEventListener('input', syncState, false);
      clear.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        search.classList.remove('has-query');
        input.focus();
      }, true);

      var closeTarget = suffix === 'desktop'
        ? document.getElementById('mask')
        : document.getElementById('search-cancel-mobile');
      if (closeTarget) {
        closeTarget.addEventListener('click', function () {
          window.requestAnimationFrame(syncState);
        }, false);
      }

      syncState();
    });
  }

  enhanceLunr();
  initSearchControls();

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      Array.prototype.forEach.call(mutation.addedNodes, function (node) {
        if (node.nodeType === 1 && node.id === 'lunr-segmentit') {
          node.addEventListener('load', enhanceLunr, { once: true });
        }
      });
    });
  });

  observer.observe(document.body, { childList: true });
  window.addEventListener('load', enhanceLunr, false);
})();
