/**
 * Tema Pai Tiago de Zé Malandro — interações.
 * Menu mobile, abas dos trabalhos e cabeçalho fixo.
 */
(function () {
	'use strict';

	var header = document.getElementById('site-header');

	if (header) {
		var aoRolar = function () {
			if (window.scrollY > 24) {
				header.classList.add('is-stuck');
			} else {
				header.classList.remove('is-stuck');
			}
		};
		aoRolar();
		window.addEventListener('scroll', aoRolar, { passive: true });
	}

	var toggle = document.getElementById('menu-toggle');
	var nav = document.getElementById('site-nav');

	if (toggle && nav) {
		var fecharMenu = function () {
			nav.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
			toggle.setAttribute('aria-label', 'Abrir menu');
			document.body.style.overflow = '';
			if (header) {
				header.classList.remove('is-open');
			}
		};

		toggle.addEventListener('click', function () {
			var aberto = nav.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
			toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
			document.body.style.overflow = aberto ? 'hidden' : '';
			if (header) {
				header.classList.toggle('is-open', aberto);
			}
		});

		nav.addEventListener('click', function (evento) {
			if (evento.target && evento.target.tagName === 'A') {
				fecharMenu();
			}
		});

		document.addEventListener('keydown', function (evento) {
			if (evento.key === 'Escape') {
				fecharMenu();
			}
		});
	}

	document.querySelectorAll('[data-tabs]').forEach(function (raiz) {
		var abas = raiz.querySelectorAll('.tab');
		var grade = document.querySelector('[data-cards]');
		var vazio = document.querySelector('[data-empty]');

		if (!abas.length || !grade) {
			return;
		}

		var cards = grade.querySelectorAll('.card');

		var aplicar = function (filtro) {
			var visiveis = 0;

			cards.forEach(function (card) {
				var frente = card.getAttribute('data-frente');
				var mostrar = filtro === 'todos' || frente === filtro;

				if (mostrar) {
					card.classList.remove('is-hidden');
					visiveis++;
				} else {
					card.classList.add('is-hidden');
				}
			});

			if (vazio) {
				if (visiveis === 0) {
					vazio.classList.add('is-visible');
				} else {
					vazio.classList.remove('is-visible');
				}
			}
		};

		abas.forEach(function (aba) {
			aba.addEventListener('click', function () {
				abas.forEach(function (outra) {
					outra.classList.remove('is-active');
					outra.setAttribute('aria-selected', 'false');
				});

				aba.classList.add('is-active');
				aba.setAttribute('aria-selected', 'true');

				aplicar(aba.getAttribute('data-filter') || 'todos');
			});
		});
	});
})();
