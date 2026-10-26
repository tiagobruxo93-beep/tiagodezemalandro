<?php
/**
 * Página não encontrada.
 *
 * @package paitiago
 */

get_header();
?>

<main id="conteudo">
	<section class="section" style="padding-top:140px;">
		<div class="wrap" style="max-width:620px; text-align:center;">
			<p class="eyebrow">Caminho fechado</p>
			<h1 style="font-size:64px; margin:10px 0 0;">404</h1>
			<p style="color:var(--muted); margin-top:16px;">
				Essa página não existe ou saiu do ar. Volte ao início e veja os trabalhos
				disponíveis na corrente.
			</p>
			<p style="margin-top:28px;">
				<a class="btn btn--forward" href="<?php echo esc_url( home_url( '/' ) ); ?>">Voltar ao site</a>
			</p>
		</div>
	</section>
</main>

<?php
get_footer();
