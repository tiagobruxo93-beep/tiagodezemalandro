<?php
/**
 * Campos personalizados do trabalho.
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra a caixa de detalhes.
 */
function paitiago_registrar_meta_box() {
	add_meta_box(
		'paitiago_detalhes',
		'Detalhes do trabalho (preço, arte e encaminhamento)',
		'paitiago_render_meta_box',
		'trabalho',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'paitiago_registrar_meta_box' );

/**
 * Desenha os campos.
 *
 * @param WP_Post $post Post atual.
 */
function paitiago_render_meta_box( $post ) {
	wp_nonce_field( 'paitiago_salvar_trabalho', 'paitiago_nonce' );

	$apoio    = paitiago_meta( $post->ID, 'apoio' );
	$valor    = paitiago_meta( $post->ID, 'valor' );
	$link     = paitiago_meta( $post->ID, 'link' );
	$botao    = paitiago_meta( $post->ID, 'botao' );
	$selo     = paitiago_meta( $post->ID, 'selo' );
	$inclusos = paitiago_meta( $post->ID, 'inclusos' );
	$arte     = paitiago_meta( $post->ID, 'arte' );
	$destaque = paitiago_meta( $post->ID, 'destaque' );
	$artes    = paitiago_artes();
	?>
	<style>
		.paitiago-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.paitiago-grid .full { grid-column: 1 / -1; }
		.paitiago-grid label { display: block; font-weight: 600; margin-bottom: 5px; }
		.paitiago-grid input[type="text"],
		.paitiago-grid input[type="url"],
		.paitiago-grid select,
		.paitiago-grid textarea { width: 100%; }
		.paitiago-grid p.help { margin: 4px 0 0; color: #646970; font-size: 12px; }
		.paitiago-preview { margin-top: 8px; }
		.paitiago-preview img { max-height: 120px; border: 1px solid #dcdcde; background: #000; padding: 4px; }
	</style>

	<div class="paitiago-grid">
		<div>
			<label for="paitiago_apoio">Linha de apoio</label>
			<input type="text" id="paitiago_apoio" name="paitiago_apoio" value="<?php echo esc_attr( $apoio ); ?>" placeholder="Ritual de cemitério" />
		</div>

		<div>
			<label for="paitiago_valor">Valor exibido</label>
			<input type="text" id="paitiago_valor" name="paitiago_valor" value="<?php echo esc_attr( $valor ); ?>" placeholder="R$ 37,99 ou Sob consulta" />
		</div>

		<div class="full">
			<label for="paitiago_link">Link de encaminhamento</label>
			<input type="url" id="paitiago_link" name="paitiago_link" value="<?php echo esc_attr( $link ); ?>" placeholder="https://pay.cakto.com.br/..." />
			<p class="help">Deixe vazio para encaminhar ao WhatsApp configurado no Personalizador.</p>
		</div>

		<div>
			<label for="paitiago_botao">Texto do botão</label>
			<input type="text" id="paitiago_botao" name="paitiago_botao" value="<?php echo esc_attr( $botao ); ?>" placeholder="Quero participar" />
		</div>

		<div>
			<label for="paitiago_selo">Selo (opcional)</label>
			<input type="text" id="paitiago_selo" name="paitiago_selo" value="<?php echo esc_attr( $selo ); ?>" placeholder="Poucas vagas" />
		</div>

		<div class="full">
			<label for="paitiago_inclusos">O que está incluso (um item por linha)</label>
			<textarea id="paitiago_inclusos" name="paitiago_inclusos" rows="4" placeholder="Firmeza em corrente&#10;Aviso da data no WhatsApp"><?php echo esc_textarea( $inclusos ); ?></textarea>
		</div>

		<div>
			<label for="paitiago_arte">Arte do trabalho</label>
			<select id="paitiago_arte" name="paitiago_arte">
				<option value="">— Usar imagem destacada —</option>
				<?php foreach ( $artes as $arquivo => $nome ) : ?>
					<option value="<?php echo esc_attr( $arquivo ); ?>" <?php selected( $arte, $arquivo ); ?>><?php echo esc_html( $nome ); ?></option>
				<?php endforeach; ?>
			</select>
			<p class="help">Se você definir uma imagem destacada, ela tem prioridade sobre a arte.</p>
			<?php if ( $arte && isset( $artes[ $arte ] ) ) : ?>
				<div class="paitiago-preview"><img src="<?php echo esc_url( paitiago_asset( $arte ) ); ?>" alt="" /></div>
			<?php endif; ?>
		</div>

		<div>
			<label for="paitiago_destaque">
				<input type="checkbox" id="paitiago_destaque" name="paitiago_destaque" value="1" <?php checked( $destaque, '1' ); ?> />
				Destacar na primeira dobra
			</label>
			<p class="help">O trabalho em destaque aparece na faixa "corrente aberta" da página inicial.</p>
		</div>
	</div>
	<?php
}

/**
 * Salva os campos.
 *
 * @param int $post_id ID do post.
 */
function paitiago_salvar_meta( $post_id ) {
	if ( ! isset( $_POST['paitiago_nonce'] ) ) {
		return;
	}

	$nonce = sanitize_text_field( wp_unslash( $_POST['paitiago_nonce'] ) );
	if ( ! wp_verify_nonce( $nonce, 'paitiago_salvar_trabalho' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$textos = array( 'apoio', 'valor', 'botao', 'selo' );

	foreach ( $textos as $campo ) {
		$nome  = 'paitiago_' . $campo;
		$valor = isset( $_POST[ $nome ] ) ? sanitize_text_field( wp_unslash( $_POST[ $nome ] ) ) : '';

		if ( '' === $valor ) {
			delete_post_meta( $post_id, '_trabalho_' . $campo );
		} else {
			update_post_meta( $post_id, '_trabalho_' . $campo, $valor );
		}
	}

	$link = isset( $_POST['paitiago_link'] ) ? esc_url_raw( wp_unslash( $_POST['paitiago_link'] ) ) : '';
	if ( $link ) {
		update_post_meta( $post_id, '_trabalho_link', $link );
	} else {
		delete_post_meta( $post_id, '_trabalho_link' );
	}

	$inclusos = isset( $_POST['paitiago_inclusos'] ) ? sanitize_textarea_field( wp_unslash( $_POST['paitiago_inclusos'] ) ) : '';
	if ( $inclusos ) {
		update_post_meta( $post_id, '_trabalho_inclusos', $inclusos );
	} else {
		delete_post_meta( $post_id, '_trabalho_inclusos' );
	}

	$arte  = isset( $_POST['paitiago_arte'] ) ? sanitize_file_name( wp_unslash( $_POST['paitiago_arte'] ) ) : '';
	$artes = paitiago_artes();
	if ( $arte && isset( $artes[ $arte ] ) ) {
		update_post_meta( $post_id, '_trabalho_arte', $arte );
	} else {
		delete_post_meta( $post_id, '_trabalho_arte' );
	}

	if ( isset( $_POST['paitiago_destaque'] ) ) {
		update_post_meta( $post_id, '_trabalho_destaque', '1' );
	} else {
		delete_post_meta( $post_id, '_trabalho_destaque' );
	}
}
add_action( 'save_post_trabalho', 'paitiago_salvar_meta' );

/**
 * Colunas extras na lista do admin.
 *
 * @param array $columns Colunas atuais.
 * @return array
 */
function paitiago_colunas( $columns ) {
	$novas = array();

	foreach ( $columns as $chave => $titulo ) {
		$novas[ $chave ] = $titulo;

		if ( 'title' === $chave ) {
			$novas['valor']  = 'Valor';
			$novas['link']   = 'Encaminhamento';
			$novas['artes']  = 'Arte';
		}
	}

	return $novas;
}
add_filter( 'manage_trabalho_posts_columns', 'paitiago_colunas' );

/**
 * Conteúdo das colunas extras.
 *
 * @param string $column  Coluna atual.
 * @param int    $post_id ID do post.
 */
function paitiago_colunas_conteudo( $column, $post_id ) {
	if ( 'valor' === $column ) {
		echo esc_html( paitiago_meta( $post_id, 'valor', '—' ) );
	}

	if ( 'link' === $column ) {
		$link = paitiago_meta( $post_id, 'link' );
		echo $link ? 'Checkout' : 'WhatsApp';
	}

	if ( 'artes' === $column ) {
		$arte = paitiago_meta( $post_id, 'arte' );
		echo $arte ? 'Sim' : ( has_post_thumbnail( $post_id ) ? 'Destaque' : '—' );
	}
}
add_action( 'manage_trabalho_posts_custom_column', 'paitiago_colunas_conteudo', 10, 2 );
