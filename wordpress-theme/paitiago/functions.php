<?php
/**
 * Tema Pai Tiago de Zé Malandro
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PAITIAGO_VERSION', '1.0.0' );
define( 'PAITIAGO_DIR', get_template_directory() );
define( 'PAITIAGO_URI', get_template_directory_uri() );

require_once PAITIAGO_DIR . '/inc/helpers.php';
require_once PAITIAGO_DIR . '/inc/post-types.php';
require_once PAITIAGO_DIR . '/inc/meta.php';
require_once PAITIAGO_DIR . '/inc/customizer.php';
require_once PAITIAGO_DIR . '/inc/demo-import.php';

/**
 * Configurações básicas do tema.
 */
function paitiago_setup() {
	load_theme_textdomain( 'paitiago', PAITIAGO_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'custom-logo', array( 'height' => 80, 'width' => 240, 'flex-height' => true, 'flex-width' => true ) );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);

	register_nav_menus(
		array(
			'principal' => 'Menu principal',
			'rodape'    => 'Menu do rodapé',
		)
	);
}
add_action( 'after_setup_theme', 'paitiago_setup' );

/**
 * Fontes, CSS e JS.
 */
function paitiago_assets() {
	wp_enqueue_style(
		'paitiago-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap',
		array(),
		null
	);

	wp_enqueue_style( 'paitiago-style', get_stylesheet_uri(), array( 'paitiago-fonts' ), PAITIAGO_VERSION );

	wp_enqueue_script( 'paitiago-theme', PAITIAGO_URI . '/assets/theme.js', array(), PAITIAGO_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'paitiago_assets' );

/**
 * Classes extras no body.
 *
 * @param array $classes Classes atuais.
 * @return array
 */
function paitiago_body_classes( $classes ) {
	$classes[] = 'paitiago';
	return $classes;
}
add_filter( 'body_class', 'paitiago_body_classes' );

/**
 * Tamanho do resumo dos cards.
 *
 * @param int $length Tamanho atual.
 * @return int
 */
function paitiago_excerpt_length( $length ) {
	if ( is_post_type_archive( 'trabalho' ) || is_front_page() ) {
		return 26;
	}
	return $length;
}
add_filter( 'excerpt_length', 'paitiago_excerpt_length' );

/**
 * "Continuar lendo" em português.
 *
 * @param string $more Texto atual.
 * @return string
 */
function paitiago_excerpt_more( $more ) {
	return '…';
}
add_filter( 'excerpt_more', 'paitiago_excerpt_more' );

/**
 * Favicon e imagem de compartilhamento básicas, quando não houver logo.
 */
function paitiago_head_meta() {
	$imagem = paitiago_option( 'hero_imagem' );
	if ( ! $imagem ) {
		$imagem = PAITIAGO_URI . '/assets/images/hero-altar-art.jpg';
	}
	echo '<meta name="theme-color" content="#0c0908" />' . "\n";
	echo '<meta property="og:image" content="' . esc_url( $imagem ) . '" />' . "\n";
}
add_action( 'wp_head', 'paitiago_head_meta' );
