<?php
/**
 * Funções auxiliares e valores padrão do tema.
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * URL de um arquivo de imagem do tema.
 *
 * @param string $file Nome do arquivo.
 * @return string
 */
function paitiago_asset( $file ) {
	return PAITIAGO_URI . '/assets/images/' . rawurlencode( $file );
}

/**
 * Lista das artes que acompanham o tema.
 *
 * @return array
 */
function paitiago_artes() {
	return array(
		'arte-caixao-inimigos.jpg'      => 'Caixão dos Inimigos',
		'arte-cova-inimigos.jpg'        => 'Cova dos Inimigos',
		'arte-cruz-desespero.jpg'       => 'Cruz do Desespero',
		'arte-caldeirao-mulambo.jpg'    => 'Caldeirão de Maria Mulambo',
		'arte-broxamento.jpg'           => 'Broxamento',
		'arte-exu-do-ouro.jpg'          => 'Exu do Ouro',
		'arte-alianca-riqueza.jpg'      => 'Aliança de Riqueza',
		'arte-cartas-buzios.jpg'        => 'Consulta de Cartas e Búzios',
		'hero-altar-art.jpg'            => 'Altar sob a lua vermelha',
		'trabalho-caminhos.jpg'         => 'Abertura de caminhos',
		'trabalho-demanda.jpg'          => 'Quebra de demanda',
		'pai-tiago.jpg'                 => 'Pai Tiago',
		'galeria-terreiro.jpg'          => 'Gira no terreiro',
		'galeria-nomes.jpg'             => 'Nomes na corrente',
	);
}

/**
 * Termos da taxonomia "frente" na ordem do site.
 *
 * @return array Lista de WP_Term.
 */
function paitiago_frentes() {
	$ordem  = array( 'coletivo', 'individual', 'consulta' );
	$frentes = array();

	foreach ( $ordem as $slug ) {
		$term = get_term_by( 'slug', $slug, 'frente' );
		if ( $term && ! is_wp_error( $term ) ) {
			$frentes[] = $term;
		}
	}

	return $frentes;
}

/**
 * Rótulos das frentes.
 *
 * @param string $slug Slug da frente.
 * @return array
 */
function paitiago_frente_labels( $slug ) {
	$map = array(
		'coletivo'   => array(
			'singular' => 'Coletivo',
			'plural'   => 'Trabalhos coletivos',
			'botao'    => 'Quero participar',
		),
		'individual' => array(
			'singular' => 'Individual',
			'plural'   => 'Trabalhos individuais',
			'botao'    => 'Falar no WhatsApp',
		),
		'consulta'   => array(
			'singular' => 'Consulta',
			'plural'   => 'Consultas',
			'botao'    => 'Agendar consulta',
		),
	);

	if ( isset( $map[ $slug ] ) ) {
		return $map[ $slug ];
	}

	return $map['coletivo'];
}

/**
 * Slug da frente do trabalho.
 *
 * @param int $post_id ID do trabalho.
 * @return string
 */
function paitiago_frente_slug( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$terms   = get_the_terms( $post_id, 'frente' );

	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		return 'coletivo';
	}

	return $terms[0]->slug;
}

/**
 * Nome visual da frente.
 *
 * @param int $post_id ID do trabalho.
 * @return string
 */
function paitiago_frente_nome( $post_id = 0 ) {
	$labels = paitiago_frente_labels( paitiago_frente_slug( $post_id ) );
	return $labels['singular'];
}

/**
 * Valor de um campo do trabalho.
 *
 * @param int    $post_id ID do trabalho.
 * @param string $key     Nome do campo.
 * @param string $default Valor padrão.
 * @return string
 */
function paitiago_meta( $post_id, $key, $default = '' ) {
	$value = get_post_meta( $post_id, '_trabalho_' . $key, true );

	if ( is_string( $value ) ) {
		$value = trim( $value );
	}

	if ( '' === $value || null === $value || false === $value ) {
		return $default;
	}

	return $value;
}

/**
 * Imagem do trabalho: destaque do WordPress ou arte do tema.
 *
 * @param int    $post_id ID do trabalho.
 * @param string $size    Tamanho da imagem.
 * @return string
 */
function paitiago_image_url( $post_id, $size = 'large' ) {
	if ( has_post_thumbnail( $post_id ) ) {
		$url = get_the_post_thumbnail_url( $post_id, $size );
		if ( $url ) {
			return $url;
		}
	}

	$arte = paitiago_meta( $post_id, 'arte' );
	if ( $arte ) {
		return paitiago_asset( $arte );
	}

	return '';
}

/**
 * URL de WhatsApp da casa.
 *
 * @param string $mensagem Mensagem inicial.
 * @return string
 */
function paitiago_whatsapp( $mensagem = '' ) {
	$numero = preg_replace( '/\D/', '', paitiago_option( 'whatsapp' ) );

	if ( '' === $numero ) {
		return '#';
	}

	if ( '' === $mensagem ) {
		$mensagem = 'Olá, Pai Tiago! Vim pelo site e quero saber mais sobre os trabalhos.';
	}

	return 'https://wa.me/' . $numero . '?text=' . rawurlencode( $mensagem );
}

/**
 * Link de encaminhamento do trabalho (pagamento ou WhatsApp).
 *
 * @param int $post_id ID do trabalho.
 * @return string
 */
function paitiago_forward_url( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$link    = paitiago_meta( $post_id, 'link' );

	if ( $link ) {
		return $link;
	}

	$titulo = get_the_title( $post_id );
	return paitiago_whatsapp( 'Olá, Pai Tiago! Quero saber mais sobre "' . $titulo . '".' );
}

/**
 * Verifica se o encaminhamento é externo (checkout).
 *
 * @param int $post_id ID do trabalho.
 * @return bool
 */
function paitiago_is_external( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$link    = paitiago_meta( $post_id, 'link' );

	return (bool) preg_match( '#^https?://#i', $link );
}

/**
 * Texto do botão principal do trabalho.
 *
 * @param int $post_id ID do trabalho.
 * @return string
 */
function paitiago_button_label( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$label   = paitiago_meta( $post_id, 'botao' );

	if ( $label ) {
		return $label;
	}

	$labels = paitiago_frente_labels( paitiago_frente_slug( $post_id ) );
	return $labels['botao'];
}

/**
 * Lista de itens inclusos.
 *
 * @param int $post_id ID do trabalho.
 * @return array
 */
function paitiago_includes( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$texto   = paitiago_meta( $post_id, 'inclusos' );

	if ( ! $texto ) {
		return array();
	}

	$linhas = preg_split( '/\r\n|\r|\n/', $texto );

	if ( ! is_array( $linhas ) ) {
		return array();
	}

	$itens = array();

	foreach ( $linhas as $linha ) {
		$linha = trim( $linha );
		if ( '' !== $linha ) {
			$itens[] = $linha;
		}
	}

	return $itens;
}

/**
 * Consulta de trabalhos.
 *
 * @param string $frente         Slug da frente (vazio para todos).
 * @param int    $posts_per_page Quantidade.
 * @param bool   $apenas_destaque Somente destaques.
 * @return WP_Query
 */
function paitiago_query_trabalhos( $frente = '', $posts_per_page = -1, $apenas_destaque = false ) {
	$args = array(
		'post_type'      => 'trabalho',
		'posts_per_page' => $posts_per_page,
		'orderby'        => array(
			'menu_order' => 'ASC',
			'date'       => 'DESC',
		),
	);

	if ( $frente ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'frente',
				'field'    => 'slug',
				'terms'    => $frente,
			),
		);
	}

	if ( $apenas_destaque ) {
		$args['meta_query'] = array(
			array(
				'key'     => '_trabalho_destaque',
				'value'   => '1',
				'compare' => '=',
			),
		);
	}

	return new WP_Query( $args );
}

/**
 * Total de trabalhos publicados.
 *
 * @return int
 */
function paitiago_total_trabalhos() {
	$count = wp_count_posts( 'trabalho' );
	return isset( $count->publish ) ? (int) $count->publish : 0;
}
