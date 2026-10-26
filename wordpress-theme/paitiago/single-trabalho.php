<?php
/**
 * Página de um trabalho.
 *
 * @package paitiago
 */

get_header();

$paitiago_archive = get_post_type_archive_link( 'trabalho' );
if ( ! $paitiago_archive ) {
	$paitiago_archive = home_url( '/trabalhos/' );
}
?>

<main id="conteudo">
	<?php
	while ( have_posts() ) :
		the_post();

		$paitiago_id      = get_the_ID();
		$paitiago_frente  = paitiago_frente_slug( $paitiago_id );
		$paitiago_labels  = paitiago_frente_labels( $paitiago_frente );
		$paitiago_imagem  = paitiago_image_url( $paitiago_id );
		$paitiago_valor   = paitiago_meta( $paitiago_id, 'valor', 'Sob consulta' );
		$paitiago_apoio   = paitiago_meta( $paitiago_id, 'apoio' );
		$paitiago_selo    = paitiago_meta( $paitiago_id, 'selo' );
		$paitiago_botao   = paitiago_button_label( $paitiago_id );
		$paitiago_link    = paitiago_forward_url( $paitiago_id );
		$paitiago_externo = paitiago_is_external( $paitiago_id );
		$paitiago_inclui  = paitiago_includes( $paitiago_id );
		$paitiago_zap     = paitiago_whatsapp( 'Olá, Pai Tiago! Vim pelo site e quero saber mais sobre "' . get_the_title() . '".' );
		?>

		<section class="page-head">
			<div class="wrap">
				<a class="breadcrumb" href="<?php echo esc_url( $paitiago_archive ); ?>">
					&#8592; Todos os trabalhos
				</a>

				<div class="page-head__tags">
					<span class="pill"><?php echo esc_html( $paitiago_labels['singular'] ); ?></span>
					<?php if ( $paitiago_apoio ) : ?>
						<span class="page-head__kicker"><?php echo esc_html( $paitiago_apoio ); ?></span>
					<?php endif; ?>
					<?php if ( $paitiago_selo ) : ?>
						<span class="pill pill--red"><?php echo esc_html( $paitiago_selo ); ?></span>
					<?php endif; ?>
				</div>

				<h1><?php the_title(); ?></h1>

				<?php if ( has_excerpt() ) : ?>
					<p class="page-head__lead"><?php echo esc_html( get_the_excerpt() ); ?></p>
				<?php endif; ?>
			</div>
		</section>

		<section class="detail">
			<div class="wrap">
				<div class="detail__grid">
					<div>
						<?php if ( $paitiago_imagem ) : ?>
							<div class="detail__media">
								<div class="frame">
									<img src="<?php echo esc_url( $paitiago_imagem ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" />
								</div>
							</div>
						<?php endif; ?>

						<div class="entry">
							<?php the_content(); ?>
						</div>

						<?php if ( ! empty( $paitiago_inclui ) ) : ?>
							<div class="includes">
								<p class="eyebrow">O que está incluso</p>
								<ul class="includes__list">
									<?php foreach ( $paitiago_inclui as $paitiago_item ) : ?>
										<li><?php echo esc_html( $paitiago_item ); ?></li>
									<?php endforeach; ?>
								</ul>
							</div>
						<?php endif; ?>

						<div class="trust">
							<div>
								<p class="trust__icon">&#9670;</p>
								<h3>Sigilo total</h3>
								<p>Seu nome e seu pedido ficam só entre você e o terreiro.</p>
							</div>
							<div>
								<p class="trust__icon">&#9670;</p>
								<h3>Data avisada</h3>
								<p>Você recebe no WhatsApp a data da firmeza.</p>
							</div>
							<div>
								<p class="trust__icon">&#9670;</p>
								<h3>Pagamento seguro</h3>
								<p><?php echo esc_html( paitiago_option( 'aviso_pagamento' ) ); ?></p>
							</div>
						</div>
					</div>

					<aside class="panel">
						<p class="panel__label">Valor do trabalho</p>
						<p class="panel__price"><?php echo esc_html( $paitiago_valor ); ?></p>
						<p class="panel__note">
							<?php if ( $paitiago_externo ) : ?>
								O botão abaixo encaminha direto para o checkout seguro. Depois é só enviar seu nome no WhatsApp.
							<?php else : ?>
								Atendimento combinado direto no WhatsApp, com sigilo e orientação do Pai Tiago.
							<?php endif; ?>
						</p>

						<div class="panel__actions">
							<a class="btn btn--forward btn--block" href="<?php echo esc_url( $paitiago_link ); ?>" target="_blank" rel="noreferrer">
								<?php echo esc_html( $paitiago_botao ); ?> <span aria-hidden="true">&#8599;</span>
							</a>
							<a class="btn btn--whatsapp btn--block" href="<?php echo esc_url( $paitiago_zap ); ?>" target="_blank" rel="noreferrer">
								Tirar dúvida no WhatsApp
							</a>
						</div>

						<div class="panel__checks">
							<p>Nome firmado em corrente</p>
							<p>Aviso da data no WhatsApp</p>
							<p>Atendimento direto com o Pai Tiago</p>
						</div>

						<p class="panel__payment"><?php echo esc_html( paitiago_option( 'aviso_pagamento' ) ); ?></p>

						<?php edit_post_link( 'Editar este trabalho', '<p class="edit-link">', '</p>' ); ?>
					</aside>
				</div>

				<?php
				$paitiago_relacionados = new WP_Query(
					array(
						'post_type'      => 'trabalho',
						'posts_per_page' => 3,
						'post__not_in'   => array( $paitiago_id ),
						'orderby'        => array(
							'menu_order' => 'ASC',
							'date'       => 'DESC',
						),
						'tax_query'      => array(
							array(
								'taxonomy' => 'frente',
								'field'    => 'slug',
								'terms'    => $paitiago_frente,
							),
						),
					)
				);
				?>

				<?php if ( $paitiago_relacionados->have_posts() ) : ?>
					<div class="related">
						<div class="related__head">
							<div>
								<p class="eyebrow">Na mesma frente</p>
								<h2>Outros <?php echo esc_html( strtolower( $paitiago_labels['plural'] ) ); ?></h2>
							</div>
							<a class="related__link" href="<?php echo esc_url( $paitiago_archive ); ?>">Ver todos</a>
						</div>

						<div class="cards">
							<?php
							while ( $paitiago_relacionados->have_posts() ) :
								$paitiago_relacionados->the_post();
								get_template_part( 'template-parts/trabalho', 'card' );
							endwhile;
							wp_reset_postdata();
							?>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</section>

	<?php endwhile; ?>
</main>

<?php
get_footer();
