<?php
/**
 * Personalizador: textos, imagens e contatos do site.
 *
 * @package paitiago
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra os campos no Personalizador.
 *
 * @param WP_Customize_Manager $wp_customize Gerenciador.
 */
function paitiago_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'paitiago_site',
		array(
			'title'       => 'Site Pai Tiago',
			'priority'    => 25,
			'description' => 'Textos do topo, apresentação, WhatsApp e avisos. Os trabalhos são cadastrados em "Trabalhos".',
		)
	);

	$defaults  = paitiago_defaults();
	$sanitize  = array(
		'hero_eyebrow'    => 'sanitize_text_field',
		'hero_titulo'     => 'sanitize_text_field',
		'hero_destaque'   => 'sanitize_text_field',
		'hero_texto'      => 'wp_kses_post',
		'sobre_titulo'    => 'sanitize_text_field',
		'sobre_texto'     => 'wp_kses_post',
		'whatsapp'        => 'sanitize_text_field',
		'aviso_pagamento' => 'sanitize_text_field',
		'rodape_texto'    => 'sanitize_text_field',
		'instagram'       => 'esc_url_raw',
	);

	$campos = array(
		'hero_eyebrow'    => array( 'Linha de apoio do topo', 'text' ),
		'hero_titulo'     => array( 'Título principal', 'text' ),
		'hero_destaque'   => array( 'Destaque em vermelho', 'text' ),
		'hero_texto'      => array( 'Subtítulo do topo', 'textarea' ),
		'sobre_titulo'    => array( 'Título da seção Sobre', 'text' ),
		'sobre_texto'     => array( 'Texto da seção Sobre', 'textarea' ),
		'whatsapp'        => array( 'WhatsApp (só números, com DDI e DDD)', 'text' ),
		'aviso_pagamento' => array( 'Aviso de pagamento', 'text' ),
		'rodape_texto'    => array( 'Frase do rodapé', 'text' ),
		'instagram'       => array( 'Link do Instagram', 'url' ),
	);

	foreach ( $campos as $chave => $info ) {
		$wp_customize->add_setting(
			$chave,
			array(
				'default'           => isset( $defaults[ $chave ] ) ? $defaults[ $chave ] : '',
				'sanitize_callback' => isset( $sanitize[ $chave ] ) ? $sanitize[ $chave ] : 'sanitize_text_field',
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			$chave,
			array(
				'label'   => $info[0],
				'section' => 'paitiago_site',
				'type'    => $info[1],
			)
		);
	}

	$wp_customize->add_setting(
		'hero_imagem',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'hero_imagem',
			array(
				'label'       => 'Imagem do topo',
				'description' => 'Imagem exibida emoldurada ao lado do título.',
				'section'     => 'paitiago_site',
			)
		)
	);

	$wp_customize->add_setting(
		'sobre_imagem',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'sobre_imagem',
			array(
				'label'       => 'Foto da seção Sobre',
				'description' => 'Se ficar vazio, o tema usa a foto que acompanha o pacote.',
				'section'     => 'paitiago_site',
			)
		)
	);
}
add_action( 'customize_register', 'paitiago_customize_register' );
