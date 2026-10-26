/**
 * Painel do site — escolha de imagens e listas repetíveis.
 */
(function ($) {
	'use strict';

	$(function () {
		$(document).on('click', '.pt-escolher', function (evento) {
			evento.preventDefault();

			var $alvo = $(this).closest('.pt-linha__imagem, .pt-campo--imagem');
			var $input = $alvo.find('input[type="text"]').first();
			var $previa = $alvo.find('.pt-midia__previa');

			var quadro = wp.media({
				title: 'Escolher imagem',
				button: { text: 'Usar esta imagem' },
				library: { type: 'image' },
				multiple: false
			});

			quadro.on('select', function () {
				var anexo = quadro.state().get('selection').first().toJSON();
				$input.val(anexo.url).trigger('change');

				if ($previa.length) {
					$previa.html('<img src="' + anexo.url + '" alt="" />');
				} else if ($alvo.find('.pt-linha__previa').length === 0) {
					$alvo.append('<span class="pt-linha__previa"><img src="' + anexo.url + '" alt="" /></span>');
				} else {
					$alvo.find('.pt-linha__previa img').attr('src', anexo.url);
				}
			});

			quadro.open();
		});

		$(document).on('click', '.pt-limpar', function (evento) {
			evento.preventDefault();

			var $campo = $(this).closest('.pt-campo--imagem');
			$campo.find('input[type="text"]').val('');
			$campo.find('.pt-midia__previa').html('<span class="pt-midia__vazio">sem imagem</span>');
		});

		$(document).on('click', '.pt-adicionar', function (evento) {
			evento.preventDefault();

			var $repetidor = $(this).closest('.pt-repetidor');
			var modelo = $repetidor.find('template.pt-modelo').first().html();

			if (!modelo) {
				return;
			}

			var total = $repetidor.find('.pt-linha').length;
			$repetidor.find('.pt-linhas').append(modelo.replace(/{{indice}}/g, total));
		});

		$(document).on('click', '.pt-remover', function (evento) {
			evento.preventDefault();
			$(this).closest('.pt-linha').remove();
		});
	});
}(jQuery));
