<?php

add_action( 'wp_enqueue_scripts', function() {
    // Enqueue theme stylesheet.
	wp_enqueue_style(
		'ankur-eichefam-style',
		get_stylesheet_directory_uri() . '/assets/css/theme.css',
		array(),
		filemtime( get_stylesheet_directory() . '/assets/css/theme.css' )
	);

	// Enqueue CodyFrame Util helper script.
	wp_enqueue_script(
		'ankur-eichefam-util',
		get_stylesheet_directory_uri() . '/assets/js/util.js',
		array(),
		filemtime( get_stylesheet_directory() . '/assets/js/util.js' ),
		true
	);	

	// Enqueue theme script.
	wp_enqueue_script(
		'ankur-eichefam-script',
		get_stylesheet_directory_uri() . '/assets/js/theme.js',
		array( 'ankur-eichefam-util' ),
		filemtime( get_stylesheet_directory() . '/assets/js/theme.js' ),
		true
	);

	// Enqueue Algolia autocomplete script.
	wp_enqueue_script(
		'ankur-eichefam-autocomplete',
		get_stylesheet_directory_uri() . '/assets/js/autocomplete.js',
		array(),
		filemtime( get_stylesheet_directory() . '/assets/js/autocomplete.js' ),
		true
	);

} );

/**
 * Additional editor styles. 
 * Using `add_editor_style` doesn't allow the styles to be inherited by child themes.
 * 
 * @since 1.0.0
 */
add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_style(
		'ankur-eichefam-editor-style',
		get_template_directory_uri() . '/assets/css/editor.css',
		array(),
		wp_get_theme()->get( 'Version' )
	);
} );

// Algolia custom template path, including trailing slash.
// @link https://community.algolia.com/wordpress/customize-templates.html#customize-templates-folder-name
add_filter( 'algolia_templates_path', function() {
	return 'templates/algolia/';
} );

add_filter( 'algolia_post_images_sizes', function( $sizes ) {
	$sizes[] = 'large';

	return $sizes;
} );

add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_script(
		'ankur-eichefam-custom-icons',
		get_theme_file_uri( '/assets/js/register-custom-icons.js' ),
		array( 'wp-i18n', 'wp-hooks', 'wp-dom' ),
		true
	);
} );