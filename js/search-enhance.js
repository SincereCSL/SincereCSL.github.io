(function () {
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
})();
