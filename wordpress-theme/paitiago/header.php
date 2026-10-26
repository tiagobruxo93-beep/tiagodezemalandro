<?php
/**
 * Cabeçalho do site.
 *
 * @package paitiago
 */

$paitiago_trabalhos_url = get_post_type_archive_link( 'trabalho' );
if ( ! $paitiago_trabalhos_url ) {
	$paitiago_trabalhos_url = home_url( '/trabalhos/' );
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="screen-reader-text" href="#conteudo">Pular para o conteúdo</a>

<header class="site-header" id="site-header">
	<div class="wrap site-header__inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<span class="brand__name">Pai Tiago</span>
			<span class="brand__sub">de Zé Malandro</span>
		</a>

		<nav class="site-nav" id="site-nav" aria-label="Menu principal">
			<?php if ( has_nav_menu( 'principal' ) ) : ?>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'principal',
						'container'      => false,
						'items_wrap'     => '<ul>%3$s</ul>',
						'depth'          => 1,
					)
				);
				?>
			<?php else : ?>
				<ul>
					<li><a href="<?php echo esc_url( $paitiago_trabalhos_url ); ?>">Trabalhos</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#como-funciona' ) ); ?>">Como funciona</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#sobre' ) ); ?>">Sobre mim</a></li>
					<li><a href="<?php echo esc_url( home_url( '/#duvidas' ) ); ?>">Dúvidas</a></li>
				</ul>
			<?php endif; ?>
		</nav>

		<div class="site-header__actions">
			<a class="btn btn--forward btn--sm" href="<?php echo esc_url( paitiago_whatsapp() ); ?>" target="_blank" rel="noreferrer">
				Participar <span aria-hidden="true">&#8599;</span>
			</a>
			<button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menu">
				<span></span><span></span><span></span>
			</button>
		</div>
	</div>
</header>
