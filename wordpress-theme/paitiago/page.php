<?php
/**
 * Página padrão.
 *
 * @package paitiago
 */

get_header();
?>

<main id="conteudo">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<section class="page-head">
			<div class="wrap">
				<h1><?php the_title(); ?></h1>
			</div>
		</section>

		<section class="detail">
			<div class="wrap" style="max-width:820px;">
				<div class="entry">
					<?php the_content(); ?>
				</div>
				<?php edit_post_link( 'Editar esta página', '<p class="edit-link">', '</p>' ); ?>
			</div>
		</section>
	<?php endwhile; ?>
</main>

<?php
get_footer();
