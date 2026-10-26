<?php
/**
 * Página inicial.
 *
 * @package paitiago
 */

get_header();

$paitiago_hero_imagem     = paitiago_imagem_opcao( 'hero_imagem', 'hero-altar-art.jpg' );
$paitiago_sobre_imagem    = paitiago_imagem_opcao( 'sobre_imagem', 'pai-tiago.jpg' );
$paitiago_corrente_imagem = paitiago_imagem_opcao( 'corrente_imagem', 'galeria-nomes.jpg' );

$paitiago_trabalhos_url = get_post_type_archive_link( 'trabalho' );
if ( ! $paitiago_trabalhos_url ) {
	$paitiago_trabalhos_url = home_url( '/trabalhos/' );
}
?>

<main id="conteudo">

	<section class="hero">
		<div class="wrap">
			<div class="hero__grid">
				<div class="hero__copy">
					<p class="eyebrow"><?php echo esc_html( paitiago_option( 'hero_eyebrow' ) ); ?></p>

					<h1 class="hero__title">
						<?php echo esc_html( paitiago_option( 'hero_titulo' ) ); ?>
						<em><?php echo esc_html( paitiago_option( 'hero_destaque' ) ); ?></em>
					</h1>

					<p class="hero__lead"><?php echo esc_html( paitiago_option( 'hero_texto' ) ); ?></p>

					<div class="hero__actions">
						<a class="btn btn--forward btn--lg" href="#trabalhos">Ver os trabalhos <span aria-hidden="true">&#8595;</span></a>
						<a class="btn btn--outline btn--lg" href="<?php echo esc_url( paitiago_whatsapp() ); ?>" target="_blank" rel="noreferrer">
							Falar no WhatsApp <span aria-hidden="true">&#8599;</span>
						</a>
					</div>

					<div class="hero__meta">
						<span>&#10003; Sigilo absoluto</span>
						<span>&#9733; Gira toda semana</span>
						<span><i class="dot"></i> Trabalhos filmados e fotografados</span>
					</div>
				</div>

				<div class="hero__media">
					<div class="frame">
						<img src="<?php echo esc_url( $paitiago_hero_imagem ); ?>" alt="Altar do terreiro sob a lua vermelha" />
					</div>
				</div>
			</div>

			<?php
			$paitiago_destaque = paitiago_query_trabalhos( '', 1, true );
			if ( ! $paitiago_destaque->have_posts() ) {
				$paitiago_destaque = paitiago_query_trabalhos( '', 1 );
			}
			?>

			<?php if ( $paitiago_destaque->have_posts() ) : ?>
				<?php
				while ( $paitiago_destaque->have_posts() ) :
					$paitiago_destaque->the_post();
					$paitiago_id_destaque   = get_the_ID();
					$paitiago_img_destaque  = paitiago_image_url( $paitiago_id_destaque, 'medium' );
					?>
					<div class="band">
						<div class="band__inner">
							<div class="band__main">
								<?php if ( $paitiago_img_destaque ) : ?>
									<div class="band__thumb">
										<img src="<?php echo esc_url( $paitiago_img_destaque ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" />
									</div>
								<?php endif; ?>
								<div>
									<p class="eyebrow" style="margin-bottom:4px;">Corrente aberta · <?php echo esc_html( paitiago_frente_nome( $paitiago_id_destaque ) ); ?></p>
									<p class="band__title"><?php the_title(); ?></p>
									<p class="band__meta"><?php echo esc_html( paitiago_meta( $paitiago_id_destaque, 'selo', 'Vagas abertas' ) ); ?></p>
								</div>
							</div>

							<div class="band__side">
								<div>
									<p class="band__price-label">Valor</p>
									<p class="band__price"><?php echo esc_html( paitiago_meta( $paitiago_id_destaque, 'valor', 'Sob consulta' ) ); ?></p>
								</div>
								<div class="band__actions">
									<a class="btn btn--forward" href="<?php echo esc_url( paitiago_forward_url( $paitiago_id_destaque ) ); ?>" target="_blank" rel="noreferrer">
										<?php echo esc_html( paitiago_button_label( $paitiago_id_destaque ) ); ?> <span aria-hidden="true">&#8599;</span>
									</a>
									<a class="btn btn--hairline" href="<?php the_permalink(); ?>">Ver ficha completa</a>
								</div>
							</div>
						</div>
					</div>
					<?php
				endwhile;
				wp_reset_postdata();
				?>
			<?php endif; ?>
		</div>
	</section>

	<section class="section" id="como-funciona">
		<div class="wrap">
			<div class="section__head">
				<p class="eyebrow"><?php echo esc_html( paitiago_option( 'passos_eyebrow' ) ); ?></p>
				<h2 class="section__title"><?php echo esc_html( paitiago_option( 'passos_titulo' ) ); ?></h2>
				<p class="section__note"><?php echo esc_html( paitiago_option( 'passos_texto' ) ); ?></p>
			</div>

			<div class="steps">
				<?php
				$paitiago_passos = paitiago_opcao_lista( 'passos' );
				$paitiago_numero = 1;

				foreach ( $paitiago_passos as $paitiago_passo ) :
					?>
					<div class="step">
						<p class="step__num"><?php echo esc_html( str_pad( (string) $paitiago_numero, 2, '0', STR_PAD_LEFT ) ); ?></p>
						<h3 class="step__title"><?php echo esc_html( isset( $paitiago_passo['titulo'] ) ? $paitiago_passo['titulo'] : '' ); ?></h3>
						<p class="step__text"><?php echo esc_html( isset( $paitiago_passo['texto'] ) ? $paitiago_passo['texto'] : '' ); ?></p>
					</div>
					<?php
					$paitiago_numero++;
				endforeach;
				?>
			</div>
		</div>
	</section>

	<section class="currente">
		<div class="wrap">
			<div class="currente__grid">
				<div>
					<p class="eyebrow"><?php echo esc_html( paitiago_option( 'corrente_eyebrow' ) ); ?></p>
					<h2 class="currente__title">
						<?php echo esc_html( paitiago_option( 'corrente_titulo' ) ); ?>
						<em><?php echo esc_html( paitiago_option( 'corrente_destaque' ) ); ?></em>
					</h2>
					<p class="currente__text"><?php echo esc_html( paitiago_option( 'corrente_texto' ) ); ?></p>
					<p style="margin-top:24px;">
						<a class="btn--link" href="#trabalhos"><?php echo esc_html( paitiago_option( 'corrente_botao' ) ); ?></a>
					</p>
				</div>
				<div class="currente__media">
					<div class="frame">
						<img src="<?php echo esc_url( $paitiago_corrente_imagem ); ?>" alt="Nomes sendo escritos para a firmeza da corrente" loading="lazy" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section section--trabalhos" id="trabalhos">
		<div class="wrap">
			<div class="trabalhos__head">
				<div>
					<p class="eyebrow">Escolha o seu</p>
					<h2><?php echo esc_html( paitiago_option( 'trabalhos_titulo' ) ); ?></h2>
					<p style="color:var(--muted); font-size:14px; max-width:520px; margin-top:10px;">
						<?php echo esc_html( paitiago_option( 'trabalhos_texto' ) ); ?>
					</p>
				</div>
				<p class="trabalhos__count"><?php echo esc_html( paitiago_total_trabalhos() ); ?> anúncios ativos</p>
			</div>

			<?php get_template_part( 'template-parts/tabs' ); ?>

			<div class="cards" data-cards>
				<?php
				$paitiago_trabalhos = paitiago_query_trabalhos( '', -1 );
				if ( $paitiago_trabalhos->have_posts() ) :
					while ( $paitiago_trabalhos->have_posts() ) :
						$paitiago_trabalhos->the_post();
						get_template_part( 'template-parts/trabalho', 'card' );
					endwhile;
					wp_reset_postdata();
				endif;
				?>
			</div>

			<div class="cards__empty" data-empty>
				Nenhum trabalho nesta aba por enquanto. Fale com o Pai Tiago no WhatsApp para saber das próximas aberturas.
			</div>

			<p style="margin-top:28px; text-align:center; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted);">
				<?php echo esc_html( paitiago_option( 'aviso_pagamento' ) ); ?>
			</p>

			<p style="margin-top:24px; text-align:center;">
				<a class="btn btn--outline" href="<?php echo esc_url( $paitiago_trabalhos_url ); ?>">Ver todos os trabalhos</a>
			</p>
		</div>
	</section>

	<?php
	$paitiago_videos = new WP_Query(
		array(
			'post_type'      => 'video',
			'posts_per_page' => 6,
			'orderby'        => array(
				'menu_order' => 'ASC',
				'date'       => 'DESC',
			),
		)
	);
	?>

	<?php if ( '1' === paitiago_option( 'videos_ativo' ) && $paitiago_videos->have_posts() ) : ?>
		<section class="section" id="videos">
			<div class="wrap">
				<div class="section__head">
					<p class="eyebrow"><?php echo esc_html( paitiago_option( 'videos_eyebrow' ) ); ?></p>
					<h2 class="section__title"><?php echo esc_html( paitiago_option( 'videos_titulo' ) ); ?></h2>
					<p class="section__note"><?php echo esc_html( paitiago_option( 'videos_texto' ) ); ?></p>
				</div>

				<div class="videos">
					<?php
					while ( $paitiago_videos->have_posts() ) :
						$paitiago_videos->the_post();
						$paitiago_vid_id   = get_the_ID();
						$paitiago_vid_url  = paitiago_video_url( $paitiago_vid_id );
						$paitiago_vid_emb  = paitiago_video_embed( $paitiago_vid_url );
						$paitiago_vid_capa = has_post_thumbnail( $paitiago_vid_id ) ? get_the_post_thumbnail_url( $paitiago_vid_id, 'large' ) : '';
						$paitiago_vid_tipo = ( $paitiago_vid_emb && $paitiago_vid_emb === $paitiago_vid_url ) ? 'arquivo' : 'iframe';
						?>
						<article class="video">
							<div class="video__frame" data-video data-embed="<?php echo esc_url( $paitiago_vid_emb ); ?>" data-tipo="<?php echo esc_attr( $paitiago_vid_tipo ); ?>">
								<?php if ( $paitiago_vid_capa ) : ?>
									<img src="<?php echo esc_url( $paitiago_vid_capa ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" loading="lazy" />
								<?php else : ?>
									<span class="video__vazio">Vídeo do terreiro</span>
								<?php endif; ?>

								<?php if ( $paitiago_vid_emb && $paitiago_vid_tipo ) : ?>
									<button class="video__play" type="button" aria-label="Assistir: <?php echo esc_attr( get_the_title() ); ?>">
										<span aria-hidden="true"></span>
									</button>
								<?php elseif ( $paitiago_vid_url ) : ?>
									<a class="video__sem-embed" href="<?php echo esc_url( $paitiago_vid_url ); ?>" target="_blank" rel="noreferrer">Abrir vídeo &#8599;</a>
								<?php else : ?>
									<span class="video__breve">Em breve</span>
								<?php endif; ?>
							</div>

							<h3 class="video__title"><?php the_title(); ?></h3>
							<p class="video__text"><?php echo esc_html( get_the_excerpt() ); ?></p>
						</article>
						<?php
					endwhile;
					wp_reset_postdata();
					?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<section class="section about" id="sobre">
		<div class="wrap">
			<div class="about__grid">
				<div class="about__media">
					<div class="frame">
						<img src="<?php echo esc_url( $paitiago_sobre_imagem ); ?>" alt="Pai Tiago de Zé Malandro no terreiro" loading="lazy" />
					</div>
					<?php if ( paitiago_option( 'sobre_frase' ) ) : ?>
						<p class="about__quote">“<?php echo esc_html( paitiago_option( 'sobre_frase' ) ); ?>”</p>
					<?php endif; ?>
				</div>

				<div>
					<p class="eyebrow"><?php echo esc_html( paitiago_option( 'sobre_eyebrow' ) ); ?></p>
					<h2 class="about__title"><?php echo esc_html( paitiago_option( 'sobre_titulo' ) ); ?></h2>

					<div class="about__text">
						<?php echo wp_kses_post( paitiago_option( 'sobre_texto' ) ); ?>
					</div>

					<?php $paitiago_stats = paitiago_opcao_lista( 'stats' ); ?>

					<?php if ( ! empty( $paitiago_stats ) ) : ?>
						<div class="stats">
							<?php foreach ( $paitiago_stats as $paitiago_stat ) : ?>
								<div>
									<p class="stat__value"><?php echo esc_html( isset( $paitiago_stat['valor'] ) ? $paitiago_stat['valor'] : '' ); ?></p>
									<p class="stat__label"><?php echo esc_html( isset( $paitiago_stat['label'] ) ? $paitiago_stat['label'] : '' ); ?></p>
								</div>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>

					<a class="btn btn--outline" href="<?php echo esc_url( paitiago_whatsapp() ); ?>" target="_blank" rel="noreferrer">
						<?php echo esc_html( paitiago_option( 'sobre_botao' ) ); ?>
					</a>
				</div>
			</div>
		</div>
	</section>

	<?php $paitiago_galeria = paitiago_opcao_lista( 'galeria' ); ?>

	<?php if ( ! empty( $paitiago_galeria ) ) : ?>
		<section class="section">
			<div class="wrap">
				<div class="gallery__head">
					<div>
						<p class="eyebrow">Fotos</p>
						<h2 class="section__title" style="font-size:30px;"><?php echo esc_html( paitiago_option( 'galeria_titulo' ) ); ?></h2>
					</div>
					<p class="gallery__note"><?php echo esc_html( paitiago_option( 'galeria_texto' ) ); ?></p>
				</div>

				<div class="gallery__grid">
					<?php foreach ( $paitiago_galeria as $paitiago_foto ) : ?>
						<?php
						$paitiago_foto_url = paitiago_imagem_url(
							isset( $paitiago_foto['imagem'] ) ? $paitiago_foto['imagem'] : '',
							isset( $paitiago_foto['arquivo'] ) && $paitiago_foto['arquivo'] ? paitiago_asset( $paitiago_foto['arquivo'] ) : ''
						);
						?>
						<?php if ( $paitiago_foto_url ) : ?>
							<div class="gallery__item">
								<img src="<?php echo esc_url( $paitiago_foto_url ); ?>" alt="<?php echo esc_attr( isset( $paitiago_foto['alt'] ) ? $paitiago_foto['alt'] : '' ); ?>" loading="lazy" />
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<section class="section" id="duvidas">
		<div class="wrap">
			<div class="faq__grid">
				<div>
					<p class="eyebrow"><?php echo esc_html( paitiago_option( 'faq_eyebrow' ) ); ?></p>
					<h2 class="faq__title">
						<?php echo esc_html( paitiago_option( 'faq_titulo' ) ); ?>
						<em><?php echo esc_html( paitiago_option( 'faq_destaque' ) ); ?></em>
					</h2>
					<p class="faq__intro"><?php echo esc_html( paitiago_option( 'faq_intro' ) ); ?></p>
				</div>

				<div class="faq">
					<?php foreach ( paitiago_opcao_lista( 'faq' ) as $paitiago_duvida ) : ?>
						<details>
							<summary><?php echo esc_html( isset( $paitiago_duvida['pergunta'] ) ? $paitiago_duvida['pergunta'] : '' ); ?></summary>
							<p><?php echo esc_html( isset( $paitiago_duvida['resposta'] ) ? $paitiago_duvida['resposta'] : '' ); ?></p>
						</details>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</section>

</main>

<?php
get_footer();
