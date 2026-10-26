<?php
/**
 * Opções do site: painel único com textos, fotos, vídeos e contato.
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Valores padrão de todo o conteúdo editável.
 *
 * @return array
 */
function paitiago_padroes() {
	return array(
		'hero_eyebrow'      => 'Trabalhos coletivos · Umbanda',
		'hero_titulo'       => 'A força de muitos,',
		'hero_destaque'     => 'a firmeza do Seu Zé.',
		'hero_texto'        => 'Coloque seu nome na corrente de fé do terreiro. Trabalhos realizados com responsabilidade, tradição e o axé de Zé Malandro.',
		'hero_imagem'       => '',

		'passos_eyebrow'    => 'Como funciona',
		'passos_titulo'     => 'O que é um trabalho coletivo',
		'passos_texto'      => 'No trabalho coletivo, os pedidos de várias pessoas são firmados juntos, na mesma gira. A união de fé de todos fortalece cada nome colocado aos pés do Seu Zé — e torna o trabalho acessível para quem precisa.',
		'passos'            => array(
			array( 'titulo' => 'Escolha o trabalho', 'texto' => 'Veja nas abas qual trabalho combina com o que você precisa neste momento.' ),
			array( 'titulo' => 'Pagamento seguro', 'texto' => 'O botão de encaminhamento leva direto ao checkout, com Pix, cartão ou boleto.' ),
			array( 'titulo' => 'Envie seu nome', 'texto' => 'Após a compra, você informa seu nome completo e o seu pedido no WhatsApp.' ),
			array( 'titulo' => 'Firmeza no terreiro', 'texto' => 'Seu nome é firmado junto com os demais na data do trabalho coletivo.' ),
		),

		'corrente_eyebrow'  => 'A corrente de fé',
		'corrente_titulo'   => 'Seu nome merece estar',
		'corrente_destaque' => 'nessa corrente.',
		'corrente_texto'    => 'Escolha seu trabalho e garanta sua vaga na próxima gira coletiva. O pedido é recebido com sigilo e firmado com o mesmo cuidado de um atendimento individual.',
		'corrente_botao'    => 'Escolher meu trabalho',
		'corrente_imagem'   => '',

		'trabalhos_titulo'  => 'Meus trabalhos',
		'trabalhos_texto'   => 'Cada anúncio tem sua própria aba, com ficha completa e botão de encaminhamento direto para o pagamento seguro ou para o WhatsApp.',

		'sobre_eyebrow'     => 'Sobre mim',
		'sobre_titulo'      => 'Pai Tiago de Zé Malandro',
		'sobre_texto'       => '<p>Sou Pai Tiago, filho de Umbanda e zelador espiritual. Há anos caminho ao lado de Seu Zé Malandro, entidade que me ensinou que a fé, a palavra e o respeito abrem qualquer porta.</p><p>Criei os trabalhos coletivos para que todos tenham acesso à força do terreiro, independente de onde estejam. Cada nome é recebido com carinho e firmado com a mesma seriedade de um trabalho individual.</p><p>Aqui não tem promessa vazia: tem tradição, compromisso e muito axé.</p>',
		'sobre_frase'       => 'A fé, a palavra e o respeito abrem qualquer porta.',
		'sobre_botao'       => 'Conversar com o Pai Tiago',
		'sobre_imagem'      => '',
		'stats'             => array(
			array( 'valor' => '1.000', 'label' => 'Nomes firmados' ),
			array( 'valor' => '13', 'label' => 'Trabalhos ativos' ),
			array( 'valor' => 'Toda', 'label' => 'Semana, gira' ),
		),

		'galeria_titulo'    => 'Do terreiro para você',
		'galeria_texto'     => 'Registros das firmezas, dos nomes e das oferendas preparadas em cada gira.',
		'galeria'           => array(
			array( 'imagem' => '', 'arquivo' => 'galeria-terreiro.jpg', 'alt' => 'Gira de trabalho coletivo no terreiro com velas e flores' ),
			array( 'imagem' => '', 'arquivo' => 'galeria-nomes.jpg', 'alt' => 'Nomes sendo escritos para a firmeza da corrente' ),
			array( 'imagem' => '', 'arquivo' => 'trabalho-caminhos.jpg', 'alt' => 'Firmeza de abertura de caminhos com velas e chaves' ),
			array( 'imagem' => '', 'arquivo' => 'trabalho-demanda.jpg', 'alt' => 'Firmeza de quebra de demanda com correntes e velas' ),
		),

		'videos_ativo'      => '1',
		'videos_eyebrow'    => 'Explicações',
		'videos_titulo'     => 'Assista e entenda cada trabalho',
		'videos_texto'      => 'Vídeos explicando como os trabalhos são preparados e realizados no terreiro.',

		'faq_eyebrow'       => 'Dúvidas',
		'faq_titulo'        => 'Perguntas',
		'faq_destaque'      => 'frequentes',
		'faq_intro'         => 'Se a sua dúvida não estiver aqui, me chame no WhatsApp. Atendimento direto, com sigilo.',
		'faq'               => array(
			array( 'pergunta' => 'Preciso estar presente no terreiro?', 'resposta' => 'Não. Você envia seu nome completo e o seu pedido pelo WhatsApp, e o trabalho é firmado no terreiro na data da gira. A presença física não é necessária.' ),
			array( 'pergunta' => 'Quando o trabalho é realizado?', 'resposta' => 'Os trabalhos coletivos são realizados nas giras semanais da casa. A data exata é avisada no WhatsApp logo após a confirmação do pagamento.' ),
			array( 'pergunta' => 'Como faço o pagamento?', 'resposta' => 'Cada anúncio tem um botão de encaminhamento que abre o checkout seguro, com Pix, cartão ou boleto. Trabalhos individuais e consultas são combinados direto no WhatsApp.' ),
			array( 'pergunta' => 'Posso participar de mais de um trabalho?', 'resposta' => 'Sim. O ideal é respeitar o intervalo que eu orientar entre um trabalho e outro, para que a firmeza faça efeito. Fale comigo antes de somar dois trabalhos.' ),
			array( 'pergunta' => 'O resultado é garantido?', 'resposta' => 'Nenhum trabalho espiritual sério promete resultado. O que eu garanto é compromisso, tradição e a firmeza feita com respeito. O caminho é seu, e eu caminho junto.' ),
		),

		'rodape_texto'      => 'Tradição, sigilo e axé em cada firmeza.',
		'whatsapp'          => '5511999999999',
		'instagram'         => 'https://www.instagram.com/tiagodezemalandro/',
		'aviso_pagamento'   => 'Pagamento processado com segurança pela Cakto',
	);
}

/**
 * Junta os padrões com o que está salvo.
 *
 * @param array $padrao Padrões.
 * @param array $salvo  Valores salvos.
 * @return array
 */
function paitiago_mesclar( $padrao, $salvo ) {
	$saida = $padrao;

	if ( ! is_array( $salvo ) ) {
		return $saida;
	}

	foreach ( $salvo as $chave => $valor ) {
		if ( is_array( $valor ) && isset( $padrao[ $chave ] ) && is_array( $padrao[ $chave ] ) ) {
			$saida[ $chave ] = paitiago_e_lista( $valor ) ? array_values( $valor ) : paitiago_mesclar( $padrao[ $chave ], $valor );
		} elseif ( ! is_array( $valor ) && '' !== $valor && null !== $valor ) {
			$saida[ $chave ] = $valor;
		}
	}

	return $saida;
}

/**
 * Verifica se o array é uma lista de linhas.
 *
 * @param array $arr Array.
 * @return bool
 */
function paitiago_e_lista( $arr ) {
	if ( ! is_array( $arr ) || array() === $arr ) {
		return false;
	}

	return array_keys( $arr ) === range( 0, count( $arr ) - 1 );
}

/**
 * Todas as opções do site (com cache na requisição).
 *
 * @return array
 */
function paitiago_opcoes() {
	static $opcoes = null;

	if ( null === $opcoes ) {
		$salvo  = get_option( 'paitiago_conteudo', array() );
		$opcoes = paitiago_mesclar( paitiago_padroes(), is_array( $salvo ) ? $salvo : array() );
	}

	return $opcoes;
}

/**
 * Uma opção simples (texto).
 *
 * @param string $chave Nome.
 * @return string
 */
function paitiago_option( $chave ) {
	$opcoes = paitiago_opcoes();

	if ( isset( $opcoes[ $chave ] ) && ! is_array( $opcoes[ $chave ] ) ) {
		return (string) $opcoes[ $chave ];
	}

	return '';
}

/**
 * Uma opção em lista (passos, stats, galeria, FAQ).
 *
 * @param string $chave Nome.
 * @return array
 */
function paitiago_opcao_lista( $chave ) {
	$opcoes = paitiago_opcoes();

	if ( isset( $opcoes[ $chave ] ) && is_array( $opcoes[ $chave ] ) ) {
		return $opcoes[ $chave ];
	}

	return array();
}

/**
 * URL de imagem a partir de ID da biblioteca ou de um endereço.
 *
 * @param mixed  $valor    ID, URL ou vazio.
 * @param string $fallback Valor usado quando não houver imagem.
 * @return string
 */
function paitiago_imagem_url( $valor, $fallback = '' ) {
	if ( is_numeric( $valor ) ) {
		$url = wp_get_attachment_image_url( (int) $valor, 'full' );
		if ( $url ) {
			return $url;
		}
	}

	if ( is_string( $valor ) && '' !== trim( $valor ) ) {
		return trim( $valor );
	}

	return $fallback;
}

/**
 * Imagem de uma opção, com arte do tema como reserva.
 *
 * @param string $chave    Nome da opção.
 * @param string $arquivo  Arte do tema usada se a opção estiver vazia.
 * @return string
 */
function paitiago_imagem_opcao( $chave, $arquivo = '' ) {
	$fallback = $arquivo ? paitiago_asset( $arquivo ) : '';
	return paitiago_imagem_url( paitiago_option( $chave ), $fallback );
}

/**
 * Limpa um campo conforme o tipo.
 *
 * @param string $chave Nome do campo.
 * @param string $valor Valor enviado.
 * @return string
 */
function paitiago_limpar_campo( $chave, $valor ) {
	$valor = (string) $valor;

	$longos = array( 'hero_texto', 'passos_texto', 'corrente_texto', 'trabalhos_texto', 'sobre_texto', 'galeria_texto', 'videos_texto', 'faq_intro', 'texto', 'resposta' );

	if ( in_array( $chave, $longos, true ) ) {
		return wp_kses_post( $valor );
	}

	$urls = array( 'hero_imagem', 'corrente_imagem', 'sobre_imagem', 'imagem', 'instagram' );

	if ( in_array( $chave, $urls, true ) ) {
		return esc_url_raw( $valor );
	}

	return sanitize_text_field( $valor );
}

/**
 * Sanitiza o conjunto inteiro antes de salvar.
 *
 * @param array $entrada Dados do formulário.
 * @return array
 */
function paitiago_sanitizar_conteudo( $entrada ) {
	$padroes = paitiago_padroes();
	$saida   = array();

	if ( ! is_array( $entrada ) ) {
		$entrada = array();
	}

	foreach ( $padroes as $chave => $padrao ) {
		$valor = isset( $entrada[ $chave ] ) ? $entrada[ $chave ] : '';

		if ( ! is_array( $padrao ) ) {
			$saida[ $chave ] = paitiago_limpar_campo( $chave, $valor );
			continue;
		}

		$linhas = array();

		if ( is_array( $valor ) ) {
			foreach ( $valor as $linha ) {
				if ( ! is_array( $linha ) || ! isset( $padrao[0] ) || ! is_array( $padrao[0] ) ) {
					continue;
				}

				$nova  = array();
				$vazia = true;

				foreach ( $padrao[0] as $campo => $exemplo ) {
					$conteudo = isset( $linha[ $campo ] ) ? paitiago_limpar_campo( $campo, $linha[ $campo ] ) : '';

					if ( 'arquivo' === $campo ) {
						$artes = paitiago_artes();
						$conteudo = isset( $artes[ $conteudo ] ) ? $conteudo : '';
					}

					if ( '' !== $conteudo ) {
						$vazia = false;
					}

					$nova[ $campo ] = $conteudo;
				}

				if ( ! $vazia ) {
					$linhas[] = $nova;
				}
			}
		}

		$saida[ $chave ] = $linhas;
	}

	return $saida;
}

/**
 * Registra a opção e grava os padrões na ativação do tema.
 */
function paitiago_registrar_conteudo() {
	register_setting(
		'paitiago_conteudo_grupo',
		'paitiago_conteudo',
		array(
			'type'              => 'array',
			'sanitize_callback' => 'paitiago_sanitizar_conteudo',
			'default'           => paitiago_padroes(),
		)
	);
}
add_action( 'admin_init', 'paitiago_registrar_conteudo' );

/**
 * Garante que a opção exista.
 */
function paitiago_semear_conteudo() {
	if ( false === get_option( 'paitiago_conteudo' ) ) {
		add_option( 'paitiago_conteudo', paitiago_padroes() );
	}
}
add_action( 'after_switch_theme', 'paitiago_semear_conteudo' );
add_action( 'admin_init', 'paitiago_semear_conteudo' );
