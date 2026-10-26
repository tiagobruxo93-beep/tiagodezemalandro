<?php
/**
 * Lista de todos os trabalhos.
 *
 * @package paitiago
 */

get_header();
?>

<main id="conteudo">
	<section class="archive-head">
		<div class="wrap">
			<p class="eyebrow">Escolha o seu</p>
			<h1>Trabalhos</h1>
			<p>
				Todos os trabalhos da casa reunidos: coletivos, individuais e consultas.
				Cada anúncio tem uma ficha completa, com o botão de encaminhamento para o
				pagamento seguro ou para o WhatsApp.
			</p>
		</div>
	</section>

	<section class="section section--trabalhos" style="padding-top:40px;">
		<div class="wrap">
			<?php get_template_part( 'template-parts/tabs' ); ?>

			<div class="cards" data-cards>
				<?php
				if ( have_posts() ) :
					while ( have_posts() ) :
						the_post();
						get_template_part( 'template-parts/trabalho', 'card' );
					endwhile;
				endif;
				?>
			</div>

			<div class="cards__empty" data-empty>
				Nenhum trabalho nesta aba por enquanto. Fale com o Pai Tiago no WhatsApp para saber das próximas aberturas.
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
