<?php
/**
 * Tipo de conteúdo "Trabalho" e taxonomia "Frente".
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra o tipo de conteúdo e a taxonomia.
 */
function paitiago_registrar_tipos() {
	register_post_type(
		'trabalho',
		array(
			'labels'       => array(
				'name'               => 'Trabalhos',
				'singular_name'      => 'Trabalho',
				'menu_name'          => 'Trabalhos',
				'add_new'            => 'Adicionar novo',
				'add_new_item'       => 'Adicionar trabalho',
				'edit_item'          => 'Editar trabalho',
				'new_item'           => 'Novo trabalho',
				'view_item'          => 'Ver trabalho',
				'search_items'       => 'Buscar trabalhos',
				'not_found'          => 'Nenhum trabalho encontrado',
				'not_found_in_trash' => 'Nenhum trabalho na lixeira',
				'all_items'          => 'Todos os trabalhos',
			),
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array(
				'slug'       => 'trabalhos',
				'with_front' => false,
			),
			'menu_icon'    => 'dashicons-star-filled',
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
			'show_in_rest' => true,
			'menu_position' => 5,
		)
	);

	register_taxonomy(
		'frente',
		'trabalho',
		array(
			'labels'            => array(
				'name'          => 'Frentes',
				'singular_name' => 'Frente',
				'menu_name'     => 'Frentes',
				'all_items'     => 'Todas as frentes',
				'edit_item'     => 'Editar frente',
				'add_new_item'  => 'Nova frente',
				'search_items'  => 'Buscar frentes',
			),
			'public'            => true,
			'hierarchical'      => false,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'rewrite'           => array( 'slug' => 'frente' ),
		)
	);
}
add_action( 'init', 'paitiago_registrar_tipos' );

/**
 * Cria as três frentes e atualiza as URLs ao ativar o tema.
 */
function paitiago_ativar_tema() {
	paitiago_registrar_tipos();

	$frentes = array(
		'coletivo'   => 'Coletivos',
		'individual' => 'Individuais',
		'consulta'   => 'Consultas',
	);

	foreach ( $frentes as $slug => $nome ) {
		if ( ! term_exists( $slug, 'frente' ) ) {
			wp_insert_term( $nome, 'frente', array( 'slug' => $slug ) );
		}
	}

	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'paitiago_ativar_tema' );

/**
 * Garante que as frentes existam mesmo em sites que já usavam o tema.
 */
function paitiago_garantir_frentes() {
	if ( ! taxonomy_exists( 'frente' ) ) {
		return;
	}

	if ( get_option( 'paitiago_frentes_ok' ) ) {
		return;
	}

	paitiago_ativar_tema();
	update_option( 'paitiago_frentes_ok', '1' );
}
add_action( 'admin_init', 'paitiago_garantir_frentes' );
