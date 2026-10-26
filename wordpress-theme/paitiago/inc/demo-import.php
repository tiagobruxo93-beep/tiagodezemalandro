<?php
/**
 * Importação dos trabalhos de exemplo.
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Conteúdo inicial: os 13 trabalhos da casa.
 *
 * @return array
 */
function paitiago_dados_exemplo() {
	return array(
		array(
			'slug'     => 'caixao-dos-inimigos',
			'titulo'   => 'Caixão dos Inimigos',
			'frente'   => 'coletivo',
			'valor'    => 'a confirmar',
			'link'     => 'https://pay.cakto.com.br/34u9stt_1207541',
			'botao'    => 'Garantir vaga',
			'selo'     => 'Poucas vagas',
			'apoio'    => 'Ritual de cemitério',
			'arte'     => 'arte-caixao-inimigos.jpg',
			'destaque' => '1',
			'resumo'   => 'Ritual coletivo nas forças de Exu, realizado no cemitério, para enterrar demandas, derrotar inimigos e devolver o mal. Poucas vagas.',
			'conteudo' => '<p>Um trabalho de firmeza pesada, feito em corrente, no cemitério, sob a força de Exu. Os pedidos de todos os participantes são reunidos e enterrados juntos, encerrando ciclos de perseguição e devolvendo ao remetente aquilo que foi enviado.</p>',
			'inclusos' => array( 'Firmeza no cemitério em corrente', 'Nome e pedido firmados no mesmo dia', 'Relatório do trabalho enviado no WhatsApp', 'Vagas limitadas por gira' ),
		),
		array(
			'slug'     => 'cova-dos-inimigos',
			'titulo'   => 'Cova dos Inimigos',
			'frente'   => 'coletivo',
			'valor'    => 'R$ 37,99',
			'link'     => 'https://pay.cakto.com.br/gc94emz_1224839',
			'botao'    => 'Quero participar',
			'selo'     => 'Mais procurado',
			'apoio'    => 'Firmeza de proteção',
			'arte'     => 'arte-cova-inimigos.jpg',
			'destaque' => '1',
			'resumo'   => 'Trabalho espiritual forte para afastar inimigos, inveja e perseguições. Nomes firmados em corrente.',
			'conteudo' => '<p>A Cova dos Inimigos é um trabalho de corte e afastamento. Cada nome é firmado em uma cova preparada com oferendas e velas, pedindo que a inveja, a maledicência e as perseguições não encontrem mais caminho até você.</p>',
			'inclusos' => array( 'Preparo de cova com oferendas', 'Nome firmado em corrente', 'Defumação de proteção', 'Aviso da data da gira' ),
		),
		array(
			'slug'     => 'broxamento',
			'titulo'   => 'Broxamento',
			'frente'   => 'coletivo',
			'valor'    => 'R$ 17,00',
			'link'     => 'https://pay.cakto.com.br/8hwobaw_862628',
			'botao'    => 'Quero participar',
			'selo'     => '',
			'apoio'    => 'Ritual de esfriamento',
			'arte'     => 'arte-broxamento.jpg',
			'destaque' => '',
			'resumo'   => 'Ritual coletivo para homem e mulher: esfriamento, bloqueio sexual e afastamento do desejo.',
			'conteudo' => '<p>Trabalho de esfriamento indicado para encerrar vínculos obsessivos e afastar o desejo que insiste em voltar. Feito em corrente, com ervas de esfriamento e firmeza de afastamento.</p>',
			'inclusos' => array( 'Firmeza com ervas de esfriamento', 'Nome firmado em corrente', 'Orientação de resguardo', 'Aviso da data do trabalho' ),
		),
		array(
			'slug'     => 'cruz-do-desespero',
			'titulo'   => 'Cruz do Desespero',
			'frente'   => 'coletivo',
			'valor'    => 'R$ 77,00',
			'link'     => 'https://pay.cakto.com.br/792cp4e_1165095',
			'botao'    => 'Quero participar',
			'selo'     => '',
			'apoio'    => 'Ritual amoroso',
			'arte'     => 'arte-cruz-desespero.jpg',
			'destaque' => '',
			'resumo'   => 'Ritual coletivo amoroso pra mexer nos pensamentos de alguém.',
			'conteudo' => '<p>Feito na cruz do desespero, o trabalho atua sobre os pensamentos e a saudade de quem se afastou. É um trabalho de corrente, conduzido com firmeza e respeito ao livre arbítrio de cada pessoa envolvida.</p>',
			'inclusos' => array( 'Firmeza na cruz do desespero', 'Nome do consulente e da pessoa amada', 'Velas e rosas vermelhas', 'Orientação após o trabalho' ),
		),
		array(
			'slug'     => 'alianca-de-riqueza',
			'titulo'   => 'Aliança de Riqueza com Belzebu',
			'frente'   => 'coletivo',
			'valor'    => 'R$ 47,00',
			'link'     => 'https://pay.cakto.com.br/kabzvni_876753',
			'botao'    => 'Quero participar',
			'selo'     => '',
			'apoio'    => 'Prosperidade',
			'arte'     => 'arte-alianca-riqueza.jpg',
			'destaque' => '',
			'resumo'   => 'Coletivo e individual. Atraia, conquiste, prospere.',
			'conteudo' => '<p>Uma aliança de prosperidade firmada com Belzebu para destravar o dinheiro, abrir portas de trabalho e sustentar o que já foi conquistado. Feita em corrente, com o nome de cada participante.</p>',
			'inclusos' => array( 'Firmeza de prosperidade', 'Nome firmado em corrente', 'Orientação de oferendas em casa', 'Aviso da data da gira' ),
		),
		array(
			'slug'     => 'exu-do-ouro',
			'titulo'   => 'Exu do Ouro',
			'frente'   => 'coletivo',
			'valor'    => 'R$ 18,99',
			'link'     => 'https://pay.cakto.com.br/xeet7p5_853452',
			'botao'    => 'Quero participar',
			'selo'     => '',
			'apoio'    => 'Prosperidade',
			'arte'     => 'arte-exu-do-ouro.jpg',
			'destaque' => '',
			'resumo'   => 'Ritual coletivo de prosperidade com Exu do Ouro.',
			'conteudo' => '<p>Trabalho de prosperidade com Exu do Ouro para abrir caminhos financeiros, destravar negociações e atrair oportunidades de ganho. Firmeza feita em corrente, com moedas, ouro e velas.</p>',
			'inclusos' => array( 'Firmeza com moedas e velas douradas', 'Nome firmado em corrente', 'Pedido de abertura de caminhos', 'Aviso da data do trabalho' ),
		),
		array(
			'slug'     => 'caldeirao-de-maria-mulambo',
			'titulo'   => 'Caldeirão de Maria Mulambo',
			'frente'   => 'coletivo',
			'valor'    => 'R$ 27,00',
			'link'     => 'https://pay.cakto.com.br/yj2wwrb_1056010',
			'botao'    => 'Quero participar',
			'selo'     => '',
			'apoio'    => 'Ritual de limpeza',
			'arte'     => 'arte-caldeirao-mulambo.jpg',
			'destaque' => '',
			'resumo'   => 'Coloque o seu pedido no caldeirão de Maria Mulambo.',
			'conteudo' => '<p>Seu pedido é escrito e colocado no caldeirão de Maria Mulambo, junto ao de outras pessoas, em uma firmeza de limpeza e prosperidade. Um trabalho de acolhimento para quem precisa virar a página.</p>',
			'inclusos' => array( 'Pedido escrito e firmado', 'Firmeza de limpeza no caldeirão', 'Nome em corrente', 'Aviso da data do trabalho' ),
		),
		array(
			'slug'     => 'abertura-de-caminhos',
			'titulo'   => 'Abertura de Caminhos',
			'frente'   => 'individual',
			'valor'    => 'Sob consulta',
			'link'     => '',
			'botao'    => 'Falar no WhatsApp',
			'selo'     => 'Individual',
			'apoio'    => 'Atendimento exclusivo',
			'arte'     => 'trabalho-caminhos.jpg',
			'destaque' => '1',
			'resumo'   => 'Trabalho individual para destravar a vida, abrir portas no amor, no trabalho e nas finanças.',
			'conteudo' => '<p>Um trabalho feito só para você, com a atenção do Pai Tiago. Conversamos sobre o seu momento, identificamos o que está travado e montamos a firmeza adequada para abrir os caminhos no amor, no trabalho e no dinheiro.</p>',
			'inclusos' => array( 'Conversa individual no WhatsApp', 'Firmeza montada para o seu caso', 'Orientação de resguardo', 'Acompanhamento após o trabalho' ),
		),
		array(
			'slug'     => 'quebra-de-demanda',
			'titulo'   => 'Quebra de Demanda',
			'frente'   => 'individual',
			'valor'    => 'Sob consulta',
			'link'     => '',
			'botao'    => 'Falar no WhatsApp',
			'selo'     => 'Individual',
			'apoio'    => 'Atendimento exclusivo',
			'arte'     => 'trabalho-demanda.jpg',
			'destaque' => '',
			'resumo'   => 'Trabalho individual para desmanchar feitiços, inveja e energias negativas enviadas contra você.',
			'conteudo' => '<p>Se você sente que algo foi enviado contra a sua vida, o atendimento individual faz a leitura do caso e a quebra da demanda com o tempo e o cuidado que cada situação exige. Nada de fórmula pronta: o trabalho é montado para você.</p>',
			'inclusos' => array( 'Leitura do caso no WhatsApp', 'Quebra de demanda individual', 'Banho e firmeza de proteção', 'Retorno sobre o resultado' ),
		),
		array(
			'slug'     => 'prosperidade-individual',
			'titulo'   => 'Prosperidade Individual',
			'frente'   => 'individual',
			'valor'    => 'Sob consulta',
			'link'     => '',
			'botao'    => 'Falar no WhatsApp',
			'selo'     => '',
			'apoio'    => 'Atendimento exclusivo',
			'arte'     => '',
			'destaque' => '',
			'resumo'   => 'Firmeza individual para destravar o dinheiro e sustentar um novo ciclo de trabalho.',
			'conteudo' => '<p>Atendimento feito a quatro mãos: você conta o seu momento financeiro, o Pai Tiago orienta a firmeza e o trabalho é realizado de forma individual, com acompanhamento próximo e sigilo total.</p>',
			'inclusos' => array( 'Orientação financeira e espiritual', 'Firmeza individual de prosperidade', 'Oferenda orientada para a sua casa', 'Acompanhamento por 30 dias' ),
		),
		array(
			'slug'     => 'consulta-de-cartas-e-buzios',
			'titulo'   => 'Consulta de Cartas e Búzios',
			'frente'   => 'consulta',
			'valor'    => 'R$ 37,00',
			'link'     => 'https://pay.cakto.com.br/unb59s3_1101769',
			'botao'    => 'Agendar consulta',
			'selo'     => 'Consulta',
			'apoio'    => 'Leitura espiritual',
			'arte'     => 'arte-cartas-buzios.jpg',
			'destaque' => '',
			'resumo'   => 'Escolha sua leitura: vida amorosa, sexual, financeira, espiritual ou profissional. 1 área à sua escolha.',
			'conteudo' => '<p>Uma consulta direta e sem rodeios. Você escolhe a área e o Pai Tiago abre as cartas e os búzios para responder o que está acontecendo, o que está por trás e o que precisa ser feito daqui para frente.</p>',
			'inclusos' => array( 'Uma área por consulta', 'Leitura de cartas e búzios', 'Resumo do que foi visto', 'Orientação prática' ),
		),
		array(
			'slug'     => 'consulta-de-amor',
			'titulo'   => 'Consulta de Amor',
			'frente'   => 'consulta',
			'valor'    => 'Sob consulta',
			'link'     => '',
			'botao'    => 'Agendar no WhatsApp',
			'selo'     => 'Consulta',
			'apoio'    => 'Leitura afetiva',
			'arte'     => '',
			'destaque' => '',
			'resumo'   => 'Entenda o que está acontecendo no seu relacionamento e o que a espiritualidade mostra sobre o futuro.',
			'conteudo' => '<p>Consulta focada na vida amorosa: sentimentos, intenções, bloqueios e o que está por vir. Feita no WhatsApp, com sigilo total e orientação clara sobre o próximo passo.</p>',
			'inclusos' => array( 'Leitura focada no amor', 'Análise da outra pessoa', 'Orientação do próximo passo', 'Atendimento por WhatsApp' ),
		),
		array(
			'slug'     => 'consulta-financeira',
			'titulo'   => 'Consulta Financeira e Profissional',
			'frente'   => 'consulta',
			'valor'    => 'Sob consulta',
			'link'     => '',
			'botao'    => 'Agendar no WhatsApp',
			'selo'     => '',
			'apoio'    => 'Leitura de caminhos',
			'arte'     => '',
			'destaque' => '',
			'resumo'   => 'Onde está o travamento do seu dinheiro e qual caminho profissional está aberto para você.',
			'conteudo' => '<p>Uma leitura objetiva sobre trabalho, dinheiro e oportunidades. Indicada para quem está em decisão, em transição de carreira ou sente que o dinheiro não rende por mais que se esforce.</p>',
			'inclusos' => array( 'Leitura de trabalho e finanças', 'Identificação de travamentos', 'Caminhos abertos no momento', 'Orientação prática' ),
		),
	);
}

/**
 * Cria o menu "Conteúdo do site".
 */
function paitiago_menu_conteudo() {
	add_theme_page(
		'Conteúdo do site',
		'Conteúdo do site',
		'manage_options',
		'paitiago-conteudo',
		'paitiago_pagina_conteudo'
	);
}
add_action( 'admin_menu', 'paitiago_menu_conteudo' );

/**
 * Página de importação.
 */
function paitiago_pagina_conteudo() {
	$total    = paitiago_total_trabalhos();
	$importou = isset( $_GET['importou'] ) ? (int) $_GET['importou'] : -1;
	$pularam  = isset( $_GET['pularam'] ) ? (int) $_GET['pularam'] : 0;
	?>
	<div class="wrap paitiago-admin">
		<h1>Conteúdo do site</h1>
		<p>O tema já vem com o visual e os textos prontos. Aqui você cria os 13 trabalhos da casa de uma vez, com preço, link de pagamento, arte e descrição.</p>

		<?php if ( $importou >= 0 ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>
					<strong>Pronto.</strong>
					<?php echo esc_html( $importou ); ?> trabalho(s) criado(s).
					<?php if ( $pularam > 0 ) : ?>
						<?php echo esc_html( $pularam ); ?> já existiam e foram mantidos.
					<?php endif; ?>
				</p>
			</div>
		<?php endif; ?>

		<div class="card">
			<h2 style="margin-top:0;">Trabalhos cadastrados: <?php echo esc_html( $total ); ?></h2>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="paitiago_importar" />
				<?php wp_nonce_field( 'paitiago_importar' ); ?>
				<p>
					<button type="submit" class="button button-primary">Criar os 13 trabalhos de exemplo</button>
				</p>
				<p class="description">Trabalhos que já existirem com o mesmo endereço (slug) não são duplicados.</p>
			</form>
		</div>

		<div class="card">
			<h2 style="margin-top:0;">Depois de importar</h2>
			<ol>
				<li>Abra <a href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noreferrer">a página inicial</a> para conferir o site.</li>
				<li>Edite cada trabalho em <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=trabalho' ) ); ?>">Trabalhos</a> para trocar preço, link e arte.</li>
				<li>Em <a href="<?php echo esc_url( admin_url( 'customize.php?autofocus[section]=paitiago_site' ) ); ?>">Aparência → Personalizar → Site Pai Tiago</a>, ajuste WhatsApp, textos e imagens.</li>
				<li>Em <a href="<?php echo esc_url( admin_url( 'nav-menus.php' ) ); ?>">Aparência → Menus</a>, monte o menu principal se quiser links extras.</li>
			</ol>
		</div>
	</div>
	<?php
}

/**
 * Processa a importação.
 */
function paitiago_importar_conteudo() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Você não tem permissão para importar conteúdo.' );
	}

	check_admin_referer( 'paitiago_importar' );

	paitiago_registrar_tipos();

	$frentes = array(
		'coletivo'   => 'Coletivos',
		'individual' => 'Individuais',
		'consulta'   => 'Consultas',
	);

	foreach ( $frentes as $slug => $nome ) {
		if ( ! term_exists( $slug, 'frente' ) ) {
			wp_insert_term( $nome, 'frente', array( 'slug' => $slug ) );
		}
	}

	$criados = 0;
	$pulados = 0;
	$ordem   = array( 'coletivo' => 0, 'individual' => 0, 'consulta' => 0 );

	foreach ( paitiago_dados_exemplo() as $item ) {
		$existente = get_page_by_path( $item['slug'], OBJECT, 'trabalho' );

		if ( $existente ) {
			$pulados++;
			continue;
		}

		if ( ! isset( $ordem[ $item['frente'] ] ) ) {
			$ordem[ $item['frente'] ] = 0;
		}

		$ordem[ $item['frente'] ] = $ordem[ $item['frente'] ] + 1;

		$post_id = wp_insert_post(
			array(
				'post_type'    => 'trabalho',
				'post_status'  => 'publish',
				'post_title'   => $item['titulo'],
				'post_name'    => $item['slug'],
				'post_excerpt' => $item['resumo'],
				'post_content' => wp_slash( $item['conteudo'] ),
				'menu_order'   => $ordem[ $item['frente'] ],
			)
		);

		if ( ! $post_id || is_wp_error( $post_id ) ) {
			continue;
		}

		$termo = get_term_by( 'slug', $item['frente'], 'frente' );
		if ( $termo && ! is_wp_error( $termo ) ) {
			wp_set_object_terms( $post_id, array( (int) $termo->term_id ), 'frente' );
		}

		update_post_meta( $post_id, '_trabalho_apoio', $item['apoio'] );
		update_post_meta( $post_id, '_trabalho_valor', $item['valor'] );
		update_post_meta( $post_id, '_trabalho_botao', $item['botao'] );
		update_post_meta( $post_id, '_trabalho_inclusos', implode( "\n", $item['inclusos'] ) );

		if ( ! empty( $item['selo'] ) ) {
			update_post_meta( $post_id, '_trabalho_selo', $item['selo'] );
		}

		if ( ! empty( $item['link'] ) ) {
			update_post_meta( $post_id, '_trabalho_link', $item['link'] );
		}

		if ( ! empty( $item['arte'] ) ) {
			update_post_meta( $post_id, '_trabalho_arte', $item['arte'] );
		}

		if ( ! empty( $item['destaque'] ) ) {
			update_post_meta( $post_id, '_trabalho_destaque', '1' );
		}

		$criados++;
	}

	wp_safe_redirect(
		add_query_arg(
			array(
				'page'     => 'paitiago-conteudo',
				'importou' => $criados,
				'pularam'  => $pulados,
			),
			admin_url( 'themes.php' )
		)
	);
	exit;
}
add_action( 'admin_post_paitiago_importar', 'paitiago_importar_conteudo' );
