<?php
/**
 * Card de um trabalho.
 *
 * @package paitiago
 */

$paitiago_id      = get_the_ID();
$paitiago_frente  = paitiago_frente_slug( $paitiago_id );
$paitiago_labels  = paitiago_frente_labels( $paitiago_frente );
$paitiago_imagem  = paitiago_image_url( $paitiago_id );
$paitiago_valor   = paitiago_meta( $paitiago_id, 'valor', 'Sob consulta' );
$paitiago_selo    = paitiago_meta( $paitiago_id, 'selo' );
$paitiago_apoio   = paitiago_meta( $paitiago_id, 'apoio' );
$paitiago_botao   = paitiago_button_label( $paitiago_id );
$paitiago_link    = paitiago_forward_url( $paitiago_id );
$paitiago_externo = paitiago_is_external( $paitiago_id );
?>
<article class="card" data-frente="<?php echo esc_attr( $paitiago_frente ); ?>">
	<div class="card__media">
		<?php if ( $paitiago_imagem ) : ?>
			<img src="<?php echo esc_url( $paitiago_imagem ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" loading="lazy" />
		<?php else : ?>
			<div class="card__fallback"><?php echo esc_html( $paitiago_labels['singular'] ); ?></div>
		<?php endif; ?>

		<?php if ( $paitiago_selo ) : ?>
			<span class="card__badge"><?php echo esc_html( $paitiago_selo ); ?></span>
		<?php endif; ?>

		<span class="card__tag"><?php echo esc_html( $paitiago_labels['singular'] ); ?></span>
	</div>

	<div class="card__body">
		<?php if ( $paitiago_apoio ) : ?>
			<p class="card__kicker"><?php echo esc_html( $paitiago_apoio ); ?></p>
		<?php endif; ?>

		<h3 class="card__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h3>

		<p class="card__excerpt"><?php echo esc_html( get_the_excerpt() ); ?></p>

		<div class="card__footer">
			<div>
				<p class="card__price-label">Valor</p>
				<p class="card__price"><?php echo esc_html( $paitiago_valor ); ?></p>
			</div>
			<span class="card__hint"><?php echo $paitiago_externo ? 'Checkout seguro' : 'Atendimento direto'; ?></span>
		</div>

		<div class="card__actions">
			<a class="btn btn--forward" href="<?php echo esc_url( $paitiago_link ); ?>" target="_blank" rel="noreferrer">
				<?php echo esc_html( $paitiago_botao ); ?> <span aria-hidden="true">&#8599;</span>
			</a>
			<a class="btn btn--hairline" href="<?php the_permalink(); ?>">Ver ficha do anúncio</a>
		</div>
	</div>
</article>
