<?php
/**
 * Listagem padrão (blog / posts).
 *
 * @package paitiago
 */

get_header();

$paitiago_titulo = 'Últimas publicações';

if ( is_home() && ! is_front_page() ) {
	$paitiago_blog_id = (int) get_option( 'page_for_posts' );
	if ( $paitiago_blog_id ) {
		$paitiago_titulo = get_the_title( $paitiago_blog_id );
	}
}
?>

<main id="conteudo">
	<section class="archive-head">
		<div class="wrap">
			<p class="eyebrow">Do terreiro</p>
			<h1><?php echo esc_html( $paitiago_titulo ); ?></h1>
		</div>
	</section>

	<section>
		<div class="wrap">
			<div class="loop">
				<?php if ( have_posts() ) : ?>
					<?php
					while ( have_posts() ) :
						the_post();
						?>
						<article class="loop__item">
							<p class="loop__meta"><?php echo esc_html( get_the_date() ); ?></p>
							<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
							<?php the_excerpt(); ?>
							<p style="margin-top:16px;">
								<a class="btn--link" href="<?php the_permalink(); ?>">Continuar lendo</a>
							</p>
						</article>
					<?php endwhile; ?>
				<?php else : ?>
					<p style="color:var(--muted);">Nada publicado por aqui ainda.</p>
				<?php endif; ?>
			</div>

			<?php
			the_posts_pagination(
				array(
					'mid_size'  => 1,
					'prev_text' => '&#8592;',
					'next_text' => '&#8594;',
					'class'     => 'pagination',
				)
			);
			?>
		</div>
	</section>
</main>

<?php
get_footer();
