jQuery(function () {
	if (jQuery('#algolia-search-box').length > 0) {

		/* Instantiate instantsearch.js */
		const search = instantsearch({
			indexName: algolia.indices.searchable_posts.name,
			searchClient: algoliasearch(
				algolia.application_id,
				algolia.search_api_key
			),
			routing: {
				router: instantsearch.routers.history({ writeDelay: 1000 }),
				stateMapping: {
					stateToRoute(indexUiState) {
						return {
							s: indexUiState[
								algolia.indices.searchable_posts.name
							].query,
							page: indexUiState[
								algolia.indices.searchable_posts.name
							].page,
						};
					},
					routeToState(routeState) {
						const indexUiState = {};
						indexUiState[algolia.indices.searchable_posts.name] = {
							query: routeState.s,
							page: routeState.page,
						};
						return indexUiState;
					},
				},
			},
		});

		search.addWidgets([
			/* Search box widget */
			instantsearch.widgets.searchBox({
				container: '#algolia-search-box',
				placeholder: 'Search...',
				showReset: false,
				showSubmit: false,
				showLoadingIndicator: false,
			}),

			/* Stats widget */
			instantsearch.widgets.stats({
				container: '#algolia-stats',
			}),

			/* Hits widget */
			instantsearch.widgets.hits({
				container: '#algolia-hits',
				hitsPerPage: 10,
				templates: {
					empty: 'No results were found for "<strong>{{query}}</strong>".',
					item: wp.template('instantsearch-hit'),
				},
				transformData: {
					item(hit) {
						function replaceHighlightsRecursive(item) {
							if (
								item instanceof Object &&
								item.hasOwnProperty('value')
							) {
								item.value = _.escape(item.value);
								item.value = item.value
									.replace(/__ais-highlight__/g, '<em>')
									.replace(/__\/ais-highlight__/g, '</em>');
							} else {
								for (const key in item) {
									item[key] = replaceHighlightsRecursive(
										item[key]
									);
								}
							}
							return item;
						}

						hit._highlightResult = replaceHighlightsRecursive(
							hit._highlightResult
						);
						hit._snippetResult = replaceHighlightsRecursive(
							hit._snippetResult
						);

						return hit;
					},
				},
			}),

			/* Pagination widget */
			instantsearch.widgets.pagination({
				container: '#algolia-pagination',
			}),

			/* Post types refinement widget */
			instantsearch.widgets.menu({
				container: '#facet-post-types',
				attribute: 'post_type_label',
				sortBy: ['isRefined:desc', 'count:desc', 'name:asc'],
				limit: 10,
			}),

			/* Categories refinement widget */
			instantsearch.widgets.hierarchicalMenu({
				container: '#facet-categories',
				separator: ' > ',
				sortBy: ['count'],
				attributes: [
					'taxonomies_hierarchical.category.lvl0',
					'taxonomies_hierarchical.category.lvl1',
					'taxonomies_hierarchical.category.lvl2',
				],
			}),

			/* Tags refinement widget */
			instantsearch.widgets.refinementList({
				container: '#facet-tags',
				attribute: 'taxonomies.post_tag',
				operator: 'and',
				limit: 15,
				sortBy: ['isRefined:desc', 'count:desc', 'name:asc'],
			}),

			/* Users refinement widget */
			instantsearch.widgets.menu({
				container: '#facet-users',
				attribute: 'post_author.display_name',
				sortBy: ['isRefined:desc', 'count:desc', 'name:asc'],
				limit: 10,
			}),

			/* Search powered-by widget */
			instantsearch.widgets.poweredBy({
				container: '#algolia-powered-by',
			}),
		]);

		/* Start */
		search.start();

		jQuery('#algolia-search-box input')
			.attr('type', 'search')
			.trigger('select');
	}
});
