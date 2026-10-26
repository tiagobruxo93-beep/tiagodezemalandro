<?php
/**
 * Abas das frentes de trabalho.
 *
 * @package paitiago
 */

$paitiago_frentes = paitiago_frentes();
$paitiago_total   = paitiago_total_trabalhos();
?>
<div class="tabs" data-tabs>
	<div class="tabs__list" role="tablist" aria-label="Filtrar trabalhos">
		<button class="tab is-active" type="button" role="tab" aria-selected="true" data-filter="todos">
			Todos <span class="tab__count"><?php echo esc_html( $paitiago_total ); ?></span>
		</button>

		<?php foreach ( $paitiago_frentes as $paitiago_term ) : ?>
			<button class="tab" type="button" role="tab" aria-selected="false" data-filter="<?php echo esc_attr( $paitiago_term->slug ); ?>">
				<?php echo esc_html( $paitiago_term->name ); ?>
				<span class="tab__count"><?php echo esc_html( $paitiago_term->count ); ?></span>
			</button>
		<?php endforeach; ?>
	</div>
</div>
