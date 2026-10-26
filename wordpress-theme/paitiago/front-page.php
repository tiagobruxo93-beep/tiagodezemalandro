<?php
/**
 * Página inicial.
 *
 * @package paitiago
 */

get_header();

$paitiago_hero_imagem = paitiago_option( 'hero_imagem' );
if ( ! $paitiago_hero_imagem ) {
	$paitiago_hero_imagem = paitiago_asset( 'hero-altar-art.jpg' );
}

$paitiago_sobre_imagem = paitiago_option( 'sobre_imagem' );
if ( ! $paitiago_sobre_imagem ) {
	$paitiago_sobre_imagem = paitiago_asset( 'pai-tiago.jpg' );
}

$paitiago_trabalhos_url = get_post_type_archive_link( 'trabalho' );
if ( ! $paitiago_trabalhos_url ) {
	$paitiago_trabalhos_url = home_url( '/trabalhos/' );
}

$paitiago_galeria = array(
	array( 'arquivo' => 'galeria-terreiro.jpg', 'alt' => 'Gira de trabalho coletivo no terreiro com velas e flores' ),
	array( 'arquivo' => 'galeria-nomes.jpg', 'alt' => 'Nomes sendo escritos para a firmeza da corrente' ),
	array( 'arquivo' => 'trabalho-caminhos.jpg', 'alt' => 'Firmeza de abertura de caminhos com velas e chaves' ),
	array( 'arquivo' => 'trabalho-demanda.jpg', 'alt' => 'Firmeza de quebra de demanda com correntes e velas' ),
);
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
					$paitiago_id_destaque = get_the_ID();
					$paitiago_img_destaque = paitiago_image_url( $paitiago_id_destaque, 'medium' );
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
				<p class="eyebrow">Como funciona</p>
				<h2 class="section__title">O que é um trabalho coletivo</h2>
				<p class="section__note">
					No trabalho coletivo, os pedidos de várias pessoas são firmados juntos, na mesma gira.
					A união de fé de todos fortalece cada nome colocado aos pés do Seu Zé — e torna o trabalho acessível para quem precisa.
				</p>
			</div>

			<div class="steps">
				<div class="step">
					<p class="step__num">01</p>
					<h3 class="step__title">Escolha o trabalho</h3>
					<p class="step__text">Veja nas abas qual trabalho combina com o que você precisa neste momento.</p>
				</div>
				<div class="step">
					<p class="step__num">02</p>
					<h3 class="step__title">Pagamento seguro</h3>
					<p class="step__text">O botão de encaminhamento leva direto ao checkout, com Pix, cartão ou boleto.</p>
				</div>
				<div class="step">
					<p class="step__num">03</p>
					<h3 class="step__title">Envie seu nome</h3>
					<p class="step__text">Após a compra, você informa seu nome completo e o seu pedido no WhatsApp.</p>
				</div>
				<div class="step">
					<p class="step__num">04</p>
					<h3 class="step__title">Firmeza no terreiro</h3>
					<p class="step__text">Seu nome é firmado junto com os demais na data do trabalho coletivo.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="currente">
		<div class="wrap">
			<div class="currente__grid">
				<div>
					<p class="eyebrow">A corrente de fé</p>
					<h2 class="currente__title">
						Seu nome merece estar
						<em>nessa corrente.</em>
					</h2>
					<p class="currente__text">
						Escolha seu trabalho e garanta sua vaga na próxima gira coletiva. O pedido é recebido
						com sigilo e firmado com o mesmo cuidado de um atendimento individual.
					</p>
					<p style="margin-top:24px;">
						<a class="btn--link" href="#trabalhos">Escolher meu trabalho</a>
					</p>
				</div>
				<div class="currente__media">
					<div class="frame">
						<img src="<?php echo esc_url( paitiago_asset( 'galeria-nomes.jpg' ) ); ?>" alt="Nomes sendo escritos para a firmeza da corrente" loading="lazy" />
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
					<h2>Meus trabalhos</h2>
					<p style="color:var(--muted); font-size:14px; max-width:520px; margin-top:10px;">
						Cada anúncio tem sua própria aba, com ficha completa e botão de encaminhamento
						direto para o pagamento seguro ou para o WhatsApp.
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

	<section class="section about" id="sobre">
		<div class="wrap">
			<div class="about__grid">
				<div class="about__media">
					<div class="frame">
						<img src="<?php echo esc_url( $paitiago_sobre_imagem ); ?>" alt="Pai Tiago de Zé Malandro no terreiro" loading="lazy" />
					</div>
					<p class="about__quote">“A fé, a palavra e o respeito abrem qualquer porta.”</p>
				</div>

				<div>
					<p class="eyebrow">Sobre mim</p>
					<h2 class="about__title"><?php echo esc_html( paitiago_option( 'sobre_titulo' ) ); ?></h2>

					<div class="about__text">
						<?php echo wp_kses_post( paitiago_option( 'sobre_texto' ) ); ?>
					</div>

					<div class="stats">
						<div>
							<p class="stat__value">1.000</p>
							<p class="stat__label">Nomes firmados</p>
						</div>
						<div>
							<p class="stat__value"><?php echo esc_html( paitiago_total_trabalhos() ); ?></p>
							<p class="stat__label">Trabalhos ativos</p>
						</div>
						<div>
							<p class="stat__value">Toda</p>
							<p class="stat__label">Semana, gira</p>
						</div>
					</div>

					<a class="btn btn--outline" href="<?php echo esc_url( paitiago_whatsapp() ); ?>" target="_blank" rel="noreferrer">
						Conversar com o Pai Tiago
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="wrap">
			<div class="gallery__head">
				<div>
					<p class="eyebrow">Fotos</p>
					<h2 class="section__title" style="font-size:30px;">Do terreiro para você</h2>
				</div>
				<p class="gallery__note">Registros das firmezas, dos nomes e das oferendas preparadas em cada gira.</p>
			</div>

			<div class="gallery__grid">
				<?php foreach ( $paitiago_galeria as $paitiago_foto ) : ?>
					<div class="gallery__item">
						<img src="<?php echo esc_url( paitiago_asset( $paitiago_foto['arquivo'] ) ); ?>" alt="<?php echo esc_attr( $paitiago_foto['alt'] ); ?>" loading="lazy" />
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="section" id="duvidas">
		<div class="wrap">
			<div class="faq__grid">
				<div>
					<p class="eyebrow">Dúvidas</p>
					<h2 class="faq__title">Perguntas <em>frequentes</em></h2>
					<p class="faq__intro">Se a sua dúvida não estiver aqui, me chame no WhatsApp. Atendimento direto, com sigilo.</p>
				</div>

				<div class="faq">
					<details>
						<summary>Preciso estar presente no terreiro?</summary>
						<p>Não. Você envia seu nome completo e o seu pedido pelo WhatsApp, e o trabalho é firmado no terreiro na data da gira. A presença física não é necessária.</p>
					</details>
					<details>
						<summary>Quando o trabalho é realizado?</summary>
						<p>Os trabalhos coletivos são realizados nas giras semanais da casa. A data exata é avisada no WhatsApp logo após a confirmação do pagamento.</p>
					</details>
					<details>
						<summary>Como faço o pagamento?</summary>
						<p>Cada anúncio tem um botão de encaminhamento que abre o checkout seguro, com Pix, cartão ou boleto. Trabalhos individuais e consultas são combinados direto no WhatsApp.</p>
					</details>
					<details>
						<summary>Posso participar de mais de um trabalho?</summary>
						<p>Sim. O ideal é respeitar o intervalo que eu orientar entre um trabalho e outro, para que a firmeza faça efeito. Fale comigo antes de somar dois trabalhos.</p>
					</details>
					<details>
						<summary>O resultado é garantido?</summary>
						<p>Nenhum trabalho espiritual sério promete resultado. O que eu garanto é compromisso, tradição e a firmeza feita com respeito. O caminho é seu, e eu caminho junto.</p>
					</details>
				</div>
			</div>
		</div>
	</section>

</main>

<?php
get_footer();
