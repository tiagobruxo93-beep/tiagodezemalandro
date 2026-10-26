<?php
/**
 * Vídeos do site (tipo de conteúdo "Vídeo").
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra o tipo de conteúdo dos vídeos.
 */
function paitiago_registrar_videos() {
	register_post_type(
		'video',
		array(
			'labels'        => array(
				'name'          => 'Vídeos',
				'singular_name' => 'Vídeo',
				'menu_name'     => 'Vídeos',
				'add_new'       => 'Adicionar vídeo',
				'add_new_item'  => 'Adicionar vídeo',
				'edit_item'     => 'Editar vídeo',
				'all_items'     => 'Todos os vídeos',
				'search_items'  => 'Buscar vídeos',
				'not_found'     => 'Nenhum vídeo cadastrado',
			),
			'public'        => true,
			'has_archive'   => true,
			'rewrite'       => array(
				'slug'       => 'videos',
				'with_front' => false,
			),
			'menu_icon'     => 'dashicons-format-video',
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
			'show_in_rest'  => true,
			'menu_position' => 6,
		)
	);
}
add_action( 'init', 'paitiago_registrar_videos' );

/**
 * Campo com o endereço do vídeo.
 */
function paitiago_video_meta_box() {
	add_meta_box(
		'paitiago_video_url',
		'Vídeo',
		'paitiago_video_meta_render',
		'video',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'paitiago_video_meta_box' );

/**
 * Desenha o campo do vídeo.
 *
 * @param WP_Post $post Post atual.
 */
function paitiago_video_meta_render( $post ) {
	wp_nonce_field( 'paitiago_salvar_video', 'paitiago_video_nonce' );
	$url = get_post_meta( $post->ID, '_video_url', true );
	?>
	<p>
		<label for="paitiago_video_url_campo"><strong>Endereço do vídeo</strong></label><br />
		<input type="url" id="paitiago_video_url_campo" name="paitiago_video_url" value="<?php echo esc_attr( $url ); ?>" class="widefat" placeholder="https://www.youtube.com/watch?v=..." />
	</p>
	<p class="description">
		Aceita YouTube, Vimeo ou arquivo direto (.mp4). A capa do vídeo é a <strong>imagem destacada</strong>; a descrição é o campo "Resumo".
	</p>
	<?php
}

/**
 * Salva o endereço do vídeo.
 *
 * @param int $post_id ID do post.
 */
function paitiago_video_meta_salvar( $post_id ) {
	if ( ! isset( $_POST['paitiago_video_nonce'] ) ) {
		return;
	}

	$nonce = sanitize_text_field( wp_unslash( $_POST['paitiago_video_nonce'] ) );

	if ( ! wp_verify_nonce( $nonce, 'paitiago_salvar_video' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$url = isset( $_POST['paitiago_video_url'] ) ? esc_url_raw( wp_unslash( $_POST['paitiago_video_url'] ) ) : '';

	if ( $url ) {
		update_post_meta( $post_id, '_video_url', $url );
	} else {
		delete_post_meta( $post_id, '_video_url' );
	}
}
add_action( 'save_post_video', 'paitiago_video_meta_salvar' );

/**
 * Endereço do vídeo de um post.
 *
 * @param int $post_id ID do vídeo.
 * @return string
 */
function paitiago_video_url( $post_id = 0 ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	return (string) get_post_meta( $post_id, '_video_url', true );
}

/**
 * Converte o endereço em um link pronto para incorporar.
 *
 * @param string $url Endereço informado.
 * @return string
 */
function paitiago_video_embed( $url ) {
	$url = trim( (string) $url );

	if ( '' === $url ) {
		return '';
	}

	if ( preg_match( '#(?:youtube\.com/(?:watch\?v=|embed/|shorts/|live/)|youtu\.be/)([A-Za-z0-9_-]{6,})#i', $url, $achou ) ) {
		return 'https://www.youtube.com/embed/' . $achou[1] . '?autoplay=1&rel=0';
	}

	if ( preg_match( '#vimeo\.com/(?:video/)?(\d+)#i', $url, $achou ) ) {
		return 'https://player.vimeo.com/video/' . $achou[1] . '?autoplay=1';
	}

	if ( preg_match( '#\.(mp4|webm|ogv|ogg|m4v)$#i', $url ) ) {
		return $url;
	}

	return '';
}

/**
 * Colunas da lista de vídeos.
 *
 * @param array $columns Colunas atuais.
 * @return array
 */
function paitiago_video_colunas( $columns ) {
	$novas = array();

	foreach ( $columns as $chave => $titulo ) {
		$novas[ $chave ] = $titulo;

		if ( 'title' === $chave ) {
			$novas['endereco'] = 'Vídeo';
			$novas['capa']     = 'Capa';
		}
	}

	return $novas;
}
add_filter( 'manage_video_posts_columns', 'paitiago_video_colunas' );

/**
 * Conteúdo das colunas dos vídeos.
 *
 * @param string $column  Coluna.
 * @param int    $post_id ID.
 */
function paitiago_video_coluna_conteudo( $column, $post_id ) {
	if ( 'endereco' === $column ) {
		$url = paitiago_video_url( $post_id );
		echo $url ? '<code>' . esc_html( wp_parse_url( $url, PHP_URL_HOST ) ) . '</code>' : '—';
	}

	if ( 'capa' === $column ) {
		echo has_post_thumbnail( $post_id ) ? 'Sim' : '—';
	}
}
add_action( 'manage_video_posts_custom_column', 'paitiago_video_coluna_conteudo', 10, 2 );
