/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
window.addEventListener("load", function () {
  if (document.getElementById("algolia-search-box")) {
    if (algolia.indices.searchable_posts === undefined && document.getElementsByClassName("admin-bar").length > 0) {
      alert("It looks like you haven't indexed the searchable posts index. Please head to the Indexing page of the Algolia Search plugin and index it.");
    }
    /* Instantiate instantsearch.js */


    var search = instantsearch({
      indexName: algolia.indices.searchable_posts.name,
      searchClient: algoliasearch(algolia.application_id, algolia.search_api_key),
      routing: {
        router: instantsearch.routers.history({
          writeDelay: 1000
        }),
        stateMapping: {
          stateToRoute: function stateToRoute(indexUiState) {
            return {
              s: indexUiState[algolia.indices.searchable_posts.name].query,
              page: indexUiState[algolia.indices.searchable_posts.name].page
            };
          },
          routeToState: function routeToState(routeState) {
            var indexUiState = {};
            indexUiState[algolia.indices.searchable_posts.name] = {
              query: routeState.s,
              page: routeState.page
            };
            return indexUiState;
          }
        }
      }
    });
    search.addWidgets([
    /* Search box widget */
    instantsearch.widgets.searchBox({
      container: "#algolia-search-box",
      placeholder: "Search for...",
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false
    }),
    /* Stats widget */
    instantsearch.widgets.stats({
      container: "#algolia-stats"
    }), instantsearch.widgets.configure({
      hitsPerPage: 10
    }),
    /* Hits widget */
    instantsearch.widgets.hits({
      container: "#algolia-hits",
      templates: {
        empty: 'No results were found for "<strong>{{query}}</strong>".',
        item: wp.template("instantsearch-hit")
      },
      transformData: {
        item: function item(hit) {
          function replace_highlights_recursive(item) {
            if (item instanceof Object && item.hasOwnProperty("value")) {
              item.value = _.escape(item.value);
              item.value = item.value.replace(/__ais-highlight__/g, "<em>").replace(/__\/ais-highlight__/g, "</em>");
            } else {
              for (var key in item) {
                item[key] = replace_highlights_recursive(item[key]);
              }
            }

            return item;
          }

          hit._highlightResult = replace_highlights_recursive(hit._highlightResult);
          hit._snippetResult = replace_highlights_recursive(hit._snippetResult);
          return hit;
        }
      }
    }),
    /* Pagination widget */
    instantsearch.widgets.pagination({
      container: "#algolia-pagination"
    }),
    /* Post types refinement widget */
    instantsearch.widgets.menu({
      container: "#facet-post-types",
      attribute: "post_type_label",
      sortBy: ["isRefined:desc", "count:desc", "name:asc"],
      limit: 10
    }),
    /* Categories refinement widget */
    instantsearch.widgets.hierarchicalMenu({
      container: "#facet-categories",
      separator: " > ",
      sortBy: ["count"],
      attributes: ["taxonomies_hierarchical.category.lvl0", "taxonomies_hierarchical.category.lvl1", "taxonomies_hierarchical.category.lvl2"]
    }),
    /* Tags refinement widget */
    instantsearch.widgets.refinementList({
      container: "#facet-tags",
      attribute: "taxonomies.post_tag",
      operator: "and",
      limit: 15,
      sortBy: ["isRefined:desc", "count:desc", "name:asc"]
    }),
    /* Users refinement widget */
    instantsearch.widgets.menu({
      container: "#facet-users",
      attribute: "post_author.display_name",
      sortBy: ["isRefined:desc", "count:desc", "name:asc"],
      limit: 10
    })]);
    /* Start */

    search.start(); // This needs work

    document.querySelector("#algolia-search-box input[type='search']").select();
  }
});
/******/ })()
;