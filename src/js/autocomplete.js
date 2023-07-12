window.addEventListener("load", function () {
  /* Initialize Algolia client */
  var client = algoliasearch(algolia.application_id, algolia.search_api_key);

  /**
   * Algolia hits source method.
   *
   * This method defines a custom source to use with autocomplete.js.
   *
   * @param object $index Algolia index object.
   * @param object $params Options object to use in search.
   */
  var algoliaHitsSource = function (index, params) {
    return function (query, callback) {
      index
        .search(query, params)
        .then(function (response) {
          callback(response.hits, response);
        })
        .catch(function (error) {
          callback([]);
        });
    };
  };

  /* Setup autocomplete.js sources */
  var sources = [];
  algolia.autocomplete.sources.forEach(function (config, i) {
    var suggestion_template = wp.template(config["tmpl_suggestion"]);
    sources.push({
      source: algoliaHitsSource(client.initIndex(config["index_name"]), {
        hitsPerPage: config["max_suggestions"],
        attributesToSnippet: ["content:10"],
        highlightPreTag: "__ais-highlight__",
        highlightPostTag: "__/ais-highlight__",
      }),
      templates: {
        header: false,
        suggestion: function (hit) {
          if (hit.escaped === true) {
            return suggestion_template(hit);
          }
          hit.escaped = true;

          for (var key in hit._highlightResult) {
            /* We do not deal with arrays. */
            if (typeof hit._highlightResult[key].value !== "string") {
              continue;
            }
            hit._highlightResult[key].value = _.escape(
              hit._highlightResult[key].value,
            );
            hit._highlightResult[key].value = hit._highlightResult[key].value
              .replace(/__ais-highlight__/g, "<em>")
              .replace(/__\/ais-highlight__/g, "</em>");
          }

          for (var key in hit._snippetResult) {
            /* We do not deal with arrays. */
            if (typeof hit._snippetResult[key].value !== "string") {
              continue;
            }

            hit._snippetResult[key].value = _.escape(
              hit._snippetResult[key].value,
            );
            hit._snippetResult[key].value = hit._snippetResult[key].value
              .replace(/__ais-highlight__/g, "<em>")
              .replace(/__\/ais-highlight__/g, "</em>");
          }

          return suggestion_template(hit);
        },
      },
    });
  });

  /* Setup dropdown menus */
  document
    .querySelectorAll(algolia.autocomplete.input_selector)
    .forEach(function (element) {
      var config = {
        debug: true,
        hint: false,
        openOnFocus: true,
        appendTo: ".modal--search .wp-block-search",
        templates: {
          empty: wp.template("autocomplete-empty"),
        },
      };

      if (algolia.powered_by_enabled) {
        config.templates.footer = wp.template("autocomplete-footer");
      }

      /* Instantiate autocomplete.js */
      var autocomplete = algoliaAutocomplete(element, config, sources).on(
        "autocomplete:selected",
        function (e, suggestion) {
          /* Redirect the user when we detect a suggestion selection. */
          window.location.href = suggestion.permalink ?? suggestion.posts_url;
        },
      );

      /* Force the dropdown to be re-drawn on scroll to handle fixed containers. */
      window.addEventListener("scroll", function () {
        if (autocomplete.autocomplete.getWrapper().style.display === "block") {
          autocomplete.autocomplete.close();
          autocomplete.autocomplete.open();
        }
      });
    });

  var algoliaPoweredLink = document.querySelector(".algolia-powered-by-link");
  if (algoliaPoweredLink) {
    algoliaPoweredLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location =
        "https://www.algolia.com/?utm_source=WordPress&utm_medium=extension&utm_content=" +
        window.location.hostname +
        "&utm_campaign=poweredby";
    });
  }
});
