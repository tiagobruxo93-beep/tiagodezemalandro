<?php
/**
 * Painel do site: controle de textos, fotos, vídeos e anúncios.
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Menu principal do painel.
 */
function paitiago_menu_painel() {
	add_menu_page(
		'Painel do site',
		'Painel do site',
		'edit_theme_options',
		'paitiago-painel',
		'paitiago_render_visao_geral',
		'dashicons-star-filled',
		3
	);

	add_submenu_page(
		'paitiago-painel',
		'Visão geral',
		'Visão geral',
		'edit_theme_options',
		'paitiago-painel',
		'paitiago_render_visao_geral'
	);

	add_submenu_page(
		'paitiago-painel',
		'Textos e fotos',
		'Textos e fotos',
		'edit_theme_options',
		'paitiago-textos',
		'paitiago_render_conteudo'
	);

	add_submenu_page(
		'paitiago-painel',
		'Anúncios',
		'Anúncios',
		'edit_posts',
		'edit.php?post_type=trabalho'
	);

	add_submenu_page(
		'paitiago-painel',
		'Vídeos',
		'Vídeos',
		'edit_posts',
		'edit.php?post_type=video'
	);
}
add_action( 'admin_menu', 'paitiago_menu_painel' );

/**
 * Reordena o submenu para deixar "Anúncios" logo abaixo da visão geral.
 */
function paitiago_ordem_submenu() {
	global $submenu;

	if ( ! isset( $submenu['paitiago-painel'] ) ) {
		return;
	}

	$pesos = array(
		'paitiago-painel' => 1,
		'paitiago-textos' => 2,
		'trabalho'        => 3,
		'video'           => 4,
	);

	usort(
		$submenu['paitiago-painel'],
		function ( $a, $b ) use ( $pesos ) {
			$a_slug = $a[2];
			$b_slug = $b[2];

			foreach ( $pesos as $trecho => $peso ) {
				if ( false !== strpos( $a_slug, $trecho ) ) {
					$a_slug = $peso;
					break;
				}
			}

			foreach ( $pesos as $trecho => $peso ) {
				if ( false !== strpos( $b_slug, $trecho ) ) {
					$b_slug = $peso;
					break;
				}
			}

			return $a_slug <=> $b_slug;
		}
	);
}
add_action( 'admin_menu', 'paitiago_ordem_submenu', 20 );

/**
 * Estilos e scripts do painel.
 *
 * @param string $hook Página atual do admin.
 */
function paitiago_painel_assets( $hook ) {
	if ( false === strpos( $hook, 'paitiago' ) ) {
		return;
	}

	wp_enqueue_media();
	wp_enqueue_style( 'paitiago-painel', PAITIAGO_URI . '/assets/painel.css', array(), PAITIAGO_VERSION );
	wp_enqueue_script( 'paitiago-painel', PAITIAGO_URI . '/assets/painel.js', array( 'jquery' ), PAITIAGO_VERSION, true );
}
add_action( 'admin_enqueue_scripts', 'paitiago_painel_assets' );

/**
 * Campo de texto.
 *
 * @param string $chave    Nome da opção.
 * @param string $rotulo   Rótulo.
 * @param string $tipo     text|textarea|url.
 * @param string $ajuda    Texto de apoio.
 * @param bool   $negrito  Destacar campo importante.
 */
function paitiago_campo( $chave, $rotulo, $tipo = 'text', $ajuda = '', $negrito = false ) {
	$valor = paitiago_option( $chave );
	$id    = 'pt_' . $chave;
	?>
	<p class="pt-campo">
		<label for="<?php echo esc_attr( $id ); ?>">
			<?php echo esc_html( $rotulo ); ?>
			<?php if ( $negrito ) : ?>
				<span class="pt-aviso">importante</span>
			<?php endif; ?>
		</label>

		<?php if ( 'textarea' === $tipo ) : ?>
			<textarea id="<?php echo esc_attr( $id ); ?>" name="paitiago_conteudo[<?php echo esc_attr( $chave ); ?>]" rows="4" class="widefat"><?php echo esc_textarea( $valor ); ?></textarea>
		<?php else : ?>
			<input type="text" id="<?php echo esc_attr( $id ); ?>" name="paitiago_conteudo[<?php echo esc_attr( $chave ); ?>]" value="<?php echo esc_attr( $valor ); ?>" class="widefat" />
		<?php endif; ?>

		<?php if ( $ajuda ) : ?>
			<span class="pt-ajuda"><?php echo esc_html( $ajuda ); ?></span>
		<?php endif; ?>
	</p>
	<?php
}

/**
 * Campo de imagem (biblioteca de mídia).
 *
 * @param string $chave  Nome da opção.
 * @param string $rotulo Rótulo.
 * @param string $ajuda  Texto de apoio.
 */
function paitiago_campo_imagem( $chave, $rotulo, $ajuda = '' ) {
	$valor    = paitiago_option( $chave );
	$id       = 'pt_' . $chave;
	$previa   = paitiago_imagem_url( $valor );
	?>
	<div class="pt-campo pt-campo--imagem">
		<label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $rotulo ); ?></label>
		<div class="pt-midia">
			<div class="pt-midia__previa">
				<?php if ( $previa ) : ?>
					<img src="<?php echo esc_url( $previa ); ?>" alt="" />
				<?php else : ?>
					<span class="pt-midia__vazio">sem imagem</span>
				<?php endif; ?>
			</div>
			<div class="pt-midia__campos">
				<input type="text" id="<?php echo esc_attr( $id ); ?>" name="paitiago_conteudo[<?php echo esc_attr( $chave ); ?>]" value="<?php echo esc_attr( $valor ); ?>" class="widefat" />
				<p>
					<button type="button" class="button pt-escolher">Escolher da biblioteca</button>
					<button type="button" class="button-link pt-limpar">Remover</button>
				</p>
				<?php if ( $ajuda ) : ?>
					<span class="pt-ajuda"><?php echo esc_html( $ajuda ); ?></span>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<?php
}

/**
 * Campo de lista repetível.
 *
 * @param string $chave   Nome da opção.
 * @param array  $colunas Colunas (chave => rótulo/tipo).
 * @param array  $linhas  Linhas salvas.
 * @param string $ajuda   Texto de apoio.
 * @param string $botao   Texto do botão de adicionar.
 */
function paitiago_repeater( $chave, $colunas, $linhas, $ajuda = '', $botao = 'Adicionar item' ) {
	?>
	<div class="pt-repetidor" data-repetidor data-chave="<?php echo esc_attr( $chave ); ?>">
		<div class="pt-linhas">
			<?php foreach ( $linhas as $indice => $linha ) : ?>
				<?php paitiago_repeater_linha( $chave, $colunas, $indice, $linha ); ?>
			<?php endforeach; ?>
		</div>

		<template class="pt-modelo">
			<?php paitiago_repeater_linha( $chave, $colunas, '{{indice}}', array() ); ?>
		</template>

		<p>
			<button type="button" class="button button-secondary pt-adicionar"><?php echo esc_html( $botao ); ?></button>
			<?php if ( $ajuda ) : ?>
				<span class="pt-ajuda"><?php echo esc_html( $ajuda ); ?></span>
			<?php endif; ?>
		</p>
	</div>
	<?php
}

/**
 * Uma linha do repetidor.
 *
 * @param string     $chave   Nome da opção.
 * @param array      $colunas Colunas.
 * @param int|string $indice  Índice.
 * @param array      $linha   Valores.
 */
function paitiago_repeater_linha( $chave, $colunas, $indice, $linha ) {
	?>
	<div class="pt-linha" data-linha>
		<div class="pt-linha__grid">
			<?php
			foreach ( $colunas as $campo => $info ) :
				$tipo  = isset( $info['tipo'] ) ? $info['tipo'] : 'text';
				$valor = isset( $linha[ $campo ] ) ? $linha[ $campo ] : '';
				$nome  = 'paitiago_conteudo[' . $chave . '][' . $indice . '][' . $campo . ']';
				$id    = 'pt_' . $chave . '_' . $indice . '_' . $campo;
				?>
				<p class="pt-linha__campo pt-linha__campo--<?php echo esc_attr( $tipo ); ?>">
					<label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $info['rotulo'] ); ?></label>

					<?php if ( 'textarea' === $tipo ) : ?>
						<textarea id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $nome ); ?>" rows="2" class="widefat"><?php echo esc_textarea( $valor ); ?></textarea>
					<?php elseif ( 'imagem' === $tipo ) : ?>
						<span class="pt-linha__imagem">
							<input type="text" id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $nome ); ?>" value="<?php echo esc_attr( $valor ); ?>" class="widefat" placeholder="https://..." />
							<button type="button" class="button pt-escolher">Escolher</button>
						</span>
					<?php else : ?>
						<input type="text" id="<?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( $nome ); ?>" value="<?php echo esc_attr( $valor ); ?>" class="widefat" />
					<?php endif; ?>

					<?php if ( ! empty( $info['ajuda'] ) ) : ?>
						<span class="pt-ajuda"><?php echo esc_html( $info['ajuda'] ); ?></span>
					<?php endif; ?>
				</p>
			<?php endforeach; ?>
		</div>

		<p class="pt-linha__acoes">
			<button type="button" class="button-link pt-remover">Remover</button>
		</p>
	</div>
	<?php
}

/**
 * Visão geral do painel.
 */
function paitiago_render_visao_geral() {
	$trabalhos  = wp_count_posts( 'trabalho' );
	$videos     = wp_count_posts( 'video' );
	$ativos     = isset( $trabalhos->publish ) ? (int) $trabalhos->publish : 0;
	$total_vid  = isset( $videos->publish ) ? (int) $videos->publish : 0;
	$whatsapp   = paitiago_option( 'whatsapp' );
	$sem_link   = paitiago_contar_sem_link();
	?>
	<div class="wrap pt-painel">
		<h1>Painel do site</h1>
		<p class="pt-intro">Tudo do site em um só lugar: anúncios, vídeos, fotos, textos e contato.</p>

		<div class="pt-cartoes">
			<div class="pt-cartao">
				<p class="pt-cartao__numero"><?php echo esc_html( $ativos ); ?></p>
				<p class="pt-cartao__rotulo">Anúncios publicados</p>
				<p><a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=trabalho' ) ); ?>">Gerenciar anúncios</a></p>
			</div>

			<div class="pt-cartao">
				<p class="pt-cartao__numero"><?php echo esc_html( $total_vid ); ?></p>
				<p class="pt-cartao__rotulo">Vídeos cadastrados</p>
				<p><a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=video' ) ); ?>">Gerenciar vídeos</a></p>
			</div>

			<div class="pt-cartao">
				<p class="pt-cartao__numero"><?php echo esc_html( $sem_link ); ?></p>
				<p class="pt-cartao__rotulo">Anúncios sem link de pagamento</p>
				<p><a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=trabalho' ) ); ?>">Revisar</a></p>
			</div>

			<div class="pt-cartao">
				<p class="pt-cartao__numero"><?php echo esc_html( $whatsapp ); ?></p>
				<p class="pt-cartao__rotulo">WhatsApp de atendimento</p>
				<p><a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=paitiago-textos' ) ); ?>">Trocar número</a></p>
			</div>
		</div>

		<?php if ( '5511999999999' === $whatsapp || '' === $whatsapp ) : ?>
			<div class="notice notice-warning">
				<p><strong>Atenção:</strong> o WhatsApp ainda está com o número de exemplo. Troque em <a href="<?php echo esc_url( admin_url( 'admin.php?page=paitiago-textos' ) ); ?>">Textos e fotos</a> para os botões do site abrirem a conversa certa.</p>
			</div>
		<?php endif; ?>

		<div class="pt-colunas">
			<div class="pt-bloco">
				<h2>Começar rápido</h2>
				<ul class="pt-atalhos">
					<li><a class="button button-primary" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=trabalho' ) ); ?>">Novo anúncio</a></li>
					<li><a class="button" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=video' ) ); ?>">Novo vídeo</a></li>
					<li><a class="button" href="<?php echo esc_url( admin_url( 'admin.php?page=paitiago-textos' ) ); ?>">Textos e fotos</a></li>
					<li><a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noreferrer">Ver o site</a></li>
					<li><a class="button" href="<?php echo esc_url( admin_url( 'themes.php?page=paitiago-conteudo' ) ); ?>">Criar os 13 anúncios de exemplo</a></li>
				</ul>
			</div>

			<div class="pt-bloco">
				<h2>Últimos anúncios</h2>
				<?php
				$ultimos = new WP_Query(
					array(
						'post_type'      => 'trabalho',
						'posts_per_page' => 6,
						'post_status'    => array( 'publish', 'draft' ),
						'orderby'        => 'modified',
						'order'          => 'DESC',
					)
				);
				?>
				<?php if ( $ultimos->have_posts() ) : ?>
					<table class="widefat striped">
						<tbody>
							<?php
							while ( $ultimos->have_posts() ) :
								$ultimos->the_post();
								?>
								<tr>
									<td>
										<a href="<?php echo esc_url( get_edit_post_link( get_the_ID() ) ); ?>"><?php the_title(); ?></a>
									</td>
									<td><?php echo esc_html( paitiago_meta( get_the_ID(), 'valor', '—' ) ); ?></td>
									<td>
										<?php echo paitiago_meta( get_the_ID(), 'link' ) ? 'Checkout' : 'WhatsApp'; ?>
									</td>
								</tr>
							<?php endwhile; ?>
						</tbody>
					</table>
					<?php wp_reset_postdata(); ?>
				<?php else : ?>
					<p>Nenhum anúncio ainda. Use "Criar os 13 anúncios de exemplo" para começar.</p>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<?php
}

/**
 * Quantos anúncios estão sem link de pagamento.
 *
 * @return int
 */
function paitiago_contar_sem_link() {
	$query = new WP_Query(
		array(
			'post_type'      => 'trabalho',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'fields'         => 'ids',
			'meta_query'     => array(
				'relation' => 'OR',
				array(
					'key'     => '_trabalho_link',
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => '_trabalho_link',
					'value'   => '',
					'compare' => '=',
				),
			),
		)
	);

	return (int) $query->post_count;
}

/**
 * Página de textos e fotos.
 */
function paitiago_render_conteudo() {
	$passos  = paitiago_opcao_lista( 'passos' );
	$stats   = paitiago_opcao_lista( 'stats' );
	$galeria = paitiago_opcao_lista( 'galeria' );
	$faq     = paitiago_opcao_lista( 'faq' );
	?>
	<div class="wrap pt-painel">
		<h1>Textos e fotos</h1>
		<p class="pt-intro">Edite os textos e troque as imagens do site. As alterações aparecem na hora, sem mexer em código.</p>

		<?php settings_errors(); ?>

		<form method="post" action="options.php">
			<?php settings_fields( 'paitiago_conteudo_grupo' ); ?>

			<div class="pt-grupo">
				<h2>1. Topo do site</h2>
				<?php
				paitiago_campo( 'hero_eyebrow', 'Linha de apoio' );
				paitiago_campo( 'hero_titulo', 'Título principal' );
				paitiago_campo( 'hero_destaque', 'Destaque em vermelho' );
				paitiago_campo( 'hero_texto', 'Subtítulo', 'textarea' );
				paitiago_campo_imagem( 'hero_imagem', 'Imagem do topo', 'Se ficar vazia, o tema usa a arte que acompanha o pacote.' );
				?>
			</div>

			<div class="pt-grupo">
				<h2>2. Como funciona</h2>
				<?php
				paitiago_campo( 'passos_eyebrow', 'Linha de apoio' );
				paitiago_campo( 'passos_titulo', 'Título da seção' );
				paitiago_campo( 'passos_texto', 'Texto de abertura', 'textarea' );
				paitiago_repeater(
					'passos',
					array(
						'titulo' => array( 'rotulo' => 'Título do passo' ),
						'texto'  => array( 'rotulo' => 'Descrição do passo', 'tipo' => 'textarea' ),
					),
					$passos,
					'Cada linha é um passo numerado automaticamente.',
					'Adicionar passo'
				);
				?>
			</div>

			<div class="pt-grupo">
				<h2>3. Faixa "nessa corrente"</h2>
				<?php
				paitiago_campo( 'corrente_eyebrow', 'Linha de apoio' );
				paitiago_campo( 'corrente_titulo', 'Título' );
				paitiago_campo( 'corrente_destaque', 'Destaque em vermelho' );
				paitiago_campo( 'corrente_texto', 'Texto', 'textarea' );
				paitiago_campo( 'corrente_botao', 'Texto do botão' );
				paitiago_campo_imagem( 'corrente_imagem', 'Foto da faixa' );
				?>
			</div>

			<div class="pt-grupo">
				<h2>4. Seção dos anúncios</h2>
				<?php
				paitiago_campo( 'trabalhos_titulo', 'Título da seção' );
				paitiago_campo( 'trabalhos_texto', 'Texto de apoio', 'textarea' );
				?>
				<p class="pt-ajuda">
					Os anúncios em si ficam em
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=trabalho' ) ); ?>">Anúncios</a>:
					valor, link de pagamento, arte, itens inclusos, aba e ordem.
				</p>
			</div>

			<div class="pt-grupo">
				<h2>5. Sobre mim</h2>
				<?php
				paitiago_campo( 'sobre_eyebrow', 'Linha de apoio' );
				paitiago_campo( 'sobre_titulo', 'Título' );
				paitiago_campo( 'sobre_texto', 'Texto (aceita parágrafos em HTML)', 'textarea' );
				paitiago_campo( 'sobre_frase', 'Frase sobre a foto' );
				paitiago_campo( 'sobre_botao', 'Texto do botão' );
				paitiago_campo_imagem( 'sobre_imagem', 'Foto da seção' );
				paitiago_repeater(
					'stats',
					array(
						'valor' => array( 'rotulo' => 'Número' ),
						'label' => array( 'rotulo' => 'Legenda' ),
					),
					$stats,
					'Os três números que aparecem ao lado do texto.',
					'Adicionar número'
				);
				?>
			</div>

			<div class="pt-grupo">
				<h2>6. Galeria de fotos</h2>
				<?php
				paitiago_campo( 'galeria_titulo', 'Título da galeria' );
				paitiago_campo( 'galeria_texto', 'Texto de apoio', 'textarea' );
				paitiago_repeater(
					'galeria',
					array(
						'imagem' => array( 'rotulo' => 'Foto (biblioteca)', 'tipo' => 'imagem' ),
						'alt'    => array( 'rotulo' => 'Descrição da foto', 'ajuda' => 'Para acessibilidade e Google.' ),
					),
					$galeria,
					'Substitua as fotos pela sua biblioteca quando quiser.',
					'Adicionar foto'
				);
				?>
			</div>

			<div class="pt-grupo">
				<h2>7. Vídeos</h2>
				<?php
				paitiago_campo( 'videos_eyebrow', 'Linha de apoio' );
				paitiago_campo( 'videos_titulo', 'Título da seção' );
				paitiago_campo( 'videos_texto', 'Texto de apoio', 'textarea' );
				?>
				<p class="pt-campo">
					<label for="pt_videos_ativo">Mostrar a seção de vídeos</label>
					<label class="pt-switch">
						<input type="checkbox" id="pt_videos_ativo" name="paitiago_conteudo[videos_ativo]" value="1" <?php checked( paitiago_option( 'videos_ativo' ), '1' ); ?> />
						<span>Exibir a seção "Assista e entenda" no site</span>
					</label>
					<span class="pt-ajuda">Os vídeos (endereço, capa e descrição) ficam em <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=video' ) ); ?>">Vídeos</a>.</span>
				</p>
			</div>

			<div class="pt-grupo">
				<h2>8. Dúvidas frequentes</h2>
				<?php
				paitiago_campo( 'faq_eyebrow', 'Linha de apoio' );
				paitiago_campo( 'faq_titulo', 'Título' );
				paitiago_campo( 'faq_destaque', 'Destaque em dourado' );
				paitiago_campo( 'faq_intro', 'Texto de apoio', 'textarea' );
				paitiago_repeater(
					'faq',
					array(
						'pergunta' => array( 'rotulo' => 'Pergunta' ),
						'resposta' => array( 'rotulo' => 'Resposta', 'tipo' => 'textarea' ),
					),
					$faq,
					'Cada linha vira uma pergunta que abre e fecha.',
					'Adicionar pergunta'
				);
				?>
			</div>

			<div class="pt-grupo">
				<h2>9. Contato, pagamento e rodapé</h2>
				<?php
				paitiago_campo( 'whatsapp', 'WhatsApp (só números, com DDI e DDD)', 'text', 'Exemplo: 5511999999999', true );
				paitiago_campo( 'instagram', 'Link do Instagram' );
				paitiago_campo( 'aviso_pagamento', 'Aviso de pagamento' );
				paitiago_campo( 'rodape_texto', 'Frase do rodapé' );
				?>
			</div>

			<?php submit_button( 'Salvar tudo' ); ?>
		</form>
	</div>
	<?php
}
