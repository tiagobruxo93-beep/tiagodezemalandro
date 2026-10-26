<?php
/**
 * Rodapé do site. Sem qualquer link para painel administrativo.
 *
 * @package paitiago
 */

$paitiago_trabalhos_url = get_post_type_archive_link( 'trabalho' );
if ( ! $paitiago_trabalhos_url ) {
	$paitiago_trabalhos_url = home_url( '/trabalhos/' );
}
$paitiago_instagram = paitiago_option( 'instagram' );
?>
<footer class="site-footer">
	<div class="wrap">
		<div class="footer__grid">
			<div>
				<p class="footer__brand">Pai Tiago <em>de Zé Malandro</em></p>
				<p class="footer__text">
					<?php echo esc_html( paitiago_option( 'rodape_texto' ) ); ?>
					Trabalhos conduzidos com responsabilidade, tradição e respeito a quem procura a casa.
				</p>
			</div>

			<div class="footer__col">
				<h2>Navegar</h2>
				<ul>
					<li><a href="<?php echo esc_url( $paitiago_trabalhos_url ); ?>">Trabalhos</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#como-funciona' ) ); ?>">Como funciona</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#sobre' ) ); ?>">Sobre o Pai Tiago</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#duvidas' ) ); ?>">Perguntas frequentes</a></li>
				</ul>
			</div>

			<div class="footer__col">
				<h2>Atendimento</h2>
				<ul>
					<li>
						<a href="<?php echo esc_url( paitiago_whatsapp() ); ?>" target="_blank" rel="noreferrer">
							WhatsApp do terreiro &#8599;
						</a>
					</li>
					<?php if ( $paitiago_instagram ) : ?>
						<li>
							<a href="<?php echo esc_url( $paitiago_instagram ); ?>" target="_blank" rel="noreferrer">
								Instagram &#8599;
							</a>
						</li>
					<?php endif; ?>
					<li><?php echo esc_html( paitiago_option( 'aviso_pagamento' ) ); ?></li>
				</ul>
			</div>
		</div>

		<div class="footer__bottom">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Pai Tiago de Zé Malandro</p>
			<p>Umbanda · Fé · Tradição</p>
		</div>
	</div>
</footer>

<a class="whatsapp-fab" href="<?php echo esc_url( paitiago_whatsapp() ); ?>" target="_blank" rel="noreferrer">
	<span>Falar com o Pai Tiago</span>
	<strong aria-hidden="true">&#8599;</strong>
</a>

<?php wp_footer(); ?>
</body>
</html>
