<?php
/**
 * WP Search With Algolia instantsearch template file.
 *
 * @author  WebDevStudios <contact@webdevstudios.com>
 * @author  Paul Eiche <paul@boldoak.design>
 * @since   1.0.0
 *
 * @version 2.0.0
 * @package WebDevStudios\WPSWA
 */

// Enqueue instantsearch assets.
wp_enqueue_style(
	'ankur-eichefam-instantsearch-style',
	get_stylesheet_directory_uri() . '/assets/css/instantsearch.css',
	array(),
	filemtime( get_stylesheet_directory() . '/assets/css/instantsearch.css' )
);

wp_enqueue_script(
	'ankur-eichefam-instantsearch',
	get_stylesheet_directory_uri() . '/assets/js/instantsearch.js',
	array(),
	filemtime( get_stylesheet_directory() . '/assets/js/instantsearch.js' ),
	true
);

/*
 * There is currently a bug in Gutenberg preventing styles
 * from being included when do_blocks() is used to render a block.
 * The workaround is to define all do_blocks() calls to variables
 * before calling wp_head() and then print those variables when
 * you need them.
 *
 * @link https://github.com/WordPress/gutenberg/issues/40018
 */
$header = do_blocks( '<!-- wp:template-part {"slug":"header","theme":"ankur-eichefam","tagName":"header","className":"site-header"} /-->' );
$footer = do_blocks( '<!-- wp:template-part {"slug":"footer","theme":"ankur-eichefam","tagName":"footer","className":"site-footer"} /-->' );

wp_head();

?>

<style>
/**
 * The following styles are normally loaded via Gutenberg,
 * but are not generated because the template is not loading
 * blocks normally.
 */

.wp-block-post-featured-image {
	margin-left: 0;
	margin-right: 0;
}

.wp-block-post-featured-image img {
	height: auto;
	max-width: 100%;
	vertical-align: bottom;
	width: 100%;
	border-radius: var(--wp--custom--radius-md);
}

.wp-block-post-title a {
	color: var(--wp--preset--color--contrast-higher);
	text-decoration: none;
}

.wp-block-post-title a:where(:not(.wp-element-button)):hover {
	text-decoration: underline;
}

.wp-block-post-date {
	font-size: var(--wp--preset--font-size--sm);
}
</style>

<div class="wp-site-blocks ais-page">
	<?php echo $header; ?>
	
	<!-- <div class="padding-component rz4-hide@md">
		<button class="rz4-btn rz4-btn--primary" aria-controls="sidebar">Show sidebar</button>
	</div> -->

	<div id="ais-wrapper" class="rz4-flex@md has-global-padding">
		<aside class="sidebar sidebar--static@md js-sidebar" data-static-class="rz4-position-relative rz4-z-index-1 rz4-width-100% rz4-max-width-4xs" id="sidebar" aria-labelledby="sidebar-title">
			<div class="sidebar__panel">
				<!-- 👇 header visible only on mobile -->
				<header class="sidebar__header rz4-bg rz4-padding-y-sm rz4-padding-x-md rz4-border-bottom rz4-z-index-2">
					<h1 class="rz4-text-md rz4-text-truncate" id="sidebar-title">Filter</h1>
			
					<button class="sidebar__close-btn js-sidebar__close-btn js-tab-focus">
						<svg class="rz4-icon rz4-icon--xs" viewBox="0 0 16 16"><title>Close panel</title><g stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><line x1="13.5" y1="2.5" x2="2.5" y2="13.5"></line><line x1="2.5" y1="2.5" x2="13.5" y2="13.5"></line></g></svg>
					</button>
				</header>
				
				<div class="rz4-position-relative rz4-z-index-1 rz4-padding-x-md rz4-padding-x-0@md">
					<!-- start sidebar content -->
					<div class="rz4-text-component">
						<!-- <p>Sidebar content.</p> -->

						<div>
							<h3 class="widgettitle has-md-font-size"><?php esc_html_e( 'Post Types', 'wp-search-with-algolia' ); ?></h3>
							<section class="ais-facets" id="facet-post-types"></section>
						</div>
						<div>
							<h3 class="widgettitle has-md-font-size"><?php esc_html_e( 'Categories', 'wp-search-with-algolia' ); ?></h3>
							<section class="ais-facets" id="facet-categories"></section>
						</div>
						<div>
							<h3 class="widgettitle has-md-font-size"><?php esc_html_e( 'Tags', 'wp-search-with-algolia' ); ?></h3>
							<section class="ais-facets" id="facet-tags"></section>
						</div>
						<div>
							<h3 class="widgettitle has-md-font-size"><?php esc_html_e( 'Users', 'wp-search-with-algolia' ); ?></h3>
							<section class="ais-facets" id="facet-users"></section>
						</div>
					</div>
					<!-- end sidebar content -->
				</div>
			</div>
		</aside>
		
		<main id="ais-main" class="rz4-position-relative rz4-z-index-1 rz4-flex-grow sidebar-loaded:show">
			<!-- start main content -->
			<div class="rz4-text-component">
				<!-- <p>Main content.</p> -->

				<div class="algolia-search-box-wrapper">
					<div id="algolia-search-box"></div>
					<button type="button" class="rz4-hide@md ais-facets__filter" aria-controls="sidebar" aria-label="Toggle Filters">
						<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M14.5 13.8c-1.1 0-2.1.7-2.4 1.8H4V17h8.1c.3 1 1.3 1.8 2.4 1.8s2.1-.7 2.4-1.8H20v-1.5h-3.1c-.3-1-1.3-1.7-2.4-1.7zM11.9 7c-.3-1-1.3-1.8-2.4-1.8S7.4 6 7.1 7H4v1.5h3.1c.3 1 1.3 1.8 2.4 1.8s2.1-.7 2.4-1.8H20V7h-8.1z"></path>
						</svg>
					</button>
					
					<svg class="icon search-icon" viewBox="0 0 24 24" width="24" height="24">
						<path d="M13.5 6C10.5 6 8 8.5 8 11.5c0 1.1.3 2.1.9 3l-3.4 3 1 1.1 3.4-2.9c1 .9 2.2 1.4 3.6 1.4 3 0 5.5-2.5 5.5-5.5C19 8.5 16.5 6 13.5 6zm0 9.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"></path>
					</svg>

					<a href="https://www.algolia.com/?utm_source=instantsearch.js&utm_medium=website&utm_content=eichefam.net&utm_campaign=poweredby" target="_blank" class="algolia-powered-by-link" title="Algolia">
						<svg class="icon algolia-icon" viewBox="0 0 500 500.34" width="24" height="24">
							<path d="M250,0C113.38,0,2,110.16,.03,246.32c-2,138.29,110.19,252.87,248.49,253.67,42.71,.25,83.85-10.2,120.38-30.05,3.56-1.93,4.11-6.83,1.08-9.52l-23.39-20.74c-4.75-4.22-11.52-5.41-17.37-2.92-25.5,10.85-53.21,16.39-81.76,16.04-111.75-1.37-202.04-94.35-200.26-206.1,1.76-110.33,92.06-199.55,202.8-199.55h202.83V407.68l-115.08-102.25c-3.72-3.31-9.43-2.66-12.43,1.31-18.47,24.46-48.56,39.67-81.98,37.36-46.36-3.2-83.92-40.52-87.4-86.86-4.15-55.28,39.65-101.58,94.07-101.58,49.21,0,89.74,37.88,93.97,86.01,.38,4.28,2.31,8.28,5.53,11.13l29.97,26.57c3.4,3.01,8.8,1.17,9.63-3.3,2.16-11.55,2.92-23.6,2.07-35.95-4.83-70.39-61.84-127.01-132.26-131.35-80.73-4.98-148.23,58.18-150.37,137.35-2.09,77.15,61.12,143.66,138.28,145.36,32.21,.71,62.07-9.42,86.2-26.97l150.36,133.29c6.45,5.71,16.62,1.14,16.62-7.48V9.49C500,4.25,495.75,0,490.51,0H250Z"/>
						</svg>
					</a>

					<div id="algolia-stats"></div>
				</div>
				<div id="algolia-hits"></div>
				<div id="algolia-pagination"></div>
			</div>
			<!-- end main content -->
		</main>
	</div>
	
	<?php echo $footer; ?>
</div>

<script type="text/html" id="tmpl-instantsearch-hit">
	<#
		var img;
		if ( data.images.thumbnail ) {
			img = data.images.thumbnail.url;
		}
		if ( data.images && data.images.large && data.images.large.url ) {
			img = data.images.large.url;
		}
		if ( img && img.indexOf('i0.wp.com') === -1 ) {
			img = 'https://i0.wp.com/' + img.replace(/^https?\:\/\//i, '');
		}
	#>
	<div class="wp-block-post post type-post status-publish has-post-thumbnail hentry">
		<# if ( img ) { #>
			<figure class="wp-container-13 wp-block-post-featured-image">
				<a href="{{ data.permalink }}">
					<img class="attachment-post-thumbnail size-post-thumbnail wp-post-image" style="height:14rem;object-fit:cover;" 
						loading="eager"
						src="{{ img }}" 
						srcset="{{ img }}?w=1600&ssl=1 1600w, {{ img }}?resize=300%2C225&ssl=1 300w, {{ img }}?resize=1024%2C768&ssl=1 1024w, {{ img }}?resize=290%2C218&ssl=1 290w, {{ img }}?resize=768%2C576&ssl=1 768w, {{ img }}?resize=1536%2C1152&ssl=1 1536w, {{ img }}?resize=1250%2C938&ssl=1 1250w, {{ img }}?resize=400%2C300&ssl=1 400w"
						sizes="(max-width: 1600px) 100vw, 1600px"
						alt="{{ data.post_title }}" title="{{ data.post_title }}" itemprop="image" />
				</a>
			</figure>
		<# } #>

		<h2 class="wp-block-post-title has-lg-font-size">
			<a href="{{ data.permalink }}" target="_self" rel="">
				{{{ data._highlightResult.post_title.value }}}
			</a>
		</h2>
		<div class="wp-block-post-excerpt">
			<p class="wp-block-post-excerpt__excerpt">
				<# if ( data._snippetResult['content'] ) { #>
					<span class="suggestion-post-content ais-hits--content-snippet">{{{ data._snippetResult['content'].value }}}</span>
				<# } #>
			</p>
		</div>
		<div class="wp-block-post-date">
			<# var date = new Date( data.post_date * 1000 ); #>
			<time datetime="{{ date.getFullYear() }}-{{ date.getMonth().toString().padStart(2, 0) }}-{{ date.getDay().toString().padStart(2, 0) }}T{{ date.getHours().toString().padStart(2, 0) }}:{{ date.getMinutes().toString().padStart(2, 0) }}:{{ date.getSeconds().toString().padStart(2, 0) }}+00:00">
				<a href="{{ data.permalink }}">{{ data.post_date_formatted }}</a>
			</time>
		</div>
	</div>
</script>

<?php

wp_footer();
