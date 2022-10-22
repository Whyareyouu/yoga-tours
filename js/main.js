window.addEventListener("DOMContentLoaded", function () {
	"use strict";
	let tab = document.querySelectorAll(".info-header-tab"),
		info = document.querySelector(".info-header"),
		tabContent = document.querySelectorAll(".info-tabcontent");

	function hideTabContent(a) {
		for (let i = a; i < tabContent.length; i++) {
			tabContent[i].classList.remove("show");
			tabContent[i].classList.add("hide");
		}
	}
	hideTabContent(1);
	function showTabContent(b) {
		if (tabContent[b].classList.contains("hide")) {
			tabContent[b].classList.remove("hide");
			tabContent[b].classList.add("show");
		}
	}
	info.addEventListener("click", function (e) {
		let target = e.target;
		if (target && target.classList.contains("info-header-tab")) {
			for (let i = 0; i < tab.length; i++) {
				if (target == tab[i]) {
					hideTabContent(0);
					showTabContent(i);
					break;
				}
			}
		}
	});
	//Timer
	let deadline = "2022-11-05";
	function getTimerRemaining(endtime) {
		let t = Date.parse(endtime) - Date.parse(new Date()),
			seconds = Math.floor((t / 1000) % 60),
			minutes = Math.floor((t / 1000 / 60) % 60),
			hours = Math.floor(t / (1000 * 60 * 60));
		return {
			total: t,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		};
	}
	function setClock(id, endtime) {
		let timer = document.getElementById(id),
			hours = timer.querySelector(".hours"),
			minutes = timer.querySelector(".minutes"),
			seconds = timer.querySelector(".seconds"),
			timeInterval = setInterval(updateClock, 1000);
		function updateClock() {
			let t = getTimerRemaining(endtime);
			hours.textContent = t.hours;
			minutes.textContent = t.minutes;
			seconds.textContent = t.seconds;
			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
	setClock("timer", deadline);

	//Модальное окно

	let more = document.querySelector(".more"),
		overlay = document.querySelector(".overlay"),
		close = document.querySelector(".popup-close"),
		descriptionBtn = document.querySelectorAll(".description-btn");

	descriptionBtn.forEach(function (item) {
		item.addEventListener("click", function () {
			overlay.style.display = "block";
			this.classList.add = "more-splash";
			document.body.style.overflow = "hidden";
		});
	});
	more.addEventListener("click", function () {
		overlay.style.display = "block";
		this.classList.add = "more-splash";
		document.body.style.overflow = "hidden";
	});

	close.addEventListener("click", function () {
		overlay.style.display = "none";
		overlay.classList.remove("more-splash");
		document.body.style.overflow = "";
	});
	// Здесь будет форма

	let message = {
		loading: "Загрузка...",
		success: "Спасибо, скоро мы с вами свяжемся!",
		failure: "Что-то пошло не так...",
	};
	let form = document.querySelector(".main-form"),
		input = form.getElementsByTagName("input"),
		statusMessage = document.createElement("div");
	statusMessage.classList.add("status");

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		form.appendChild(statusMessage);

		let request = new XMLHttpRequest();
		request.open("POST", "js/phone.php");
		request.setRequestHeader("Content-type", "application/json; charset=utf-8"); // Если мы используем form Data, реквест Хедер не используем

		let formData = new FormData(form);
		// Превращение в JSON формат
		let obj = {};
		formData.forEach(function (value, key) {
			obj[key] = value;
		});
		let json = JSON.stringify(obj);
		request.send(json);
		request.addEventListener("readystatechange", function () {
			if (request.readyState < 4) {
				statusMessage.innerHTML = message.loading;
			} else if (request.readyState == 4 && request.status == 200) {
				statusMessage.innerHTML = message.success;
			} else {
				statusMessage.innerHTML = message.failure;
			}
		});

		for (let i = 0; i < input.length; i++) {
			input[i].value = "";
		}
	});

	// Получение данных с контактов
	let formContacts = document.getElementById("form");
	formContacts.addEventListener("submit", function (event) {
		event.preventDefault();
		let request = new XMLHttpRequest();
		request.open("POST", "js/phone.php");
		request.setRequestHeader("Content-type", "application/json; charset=utf-8"); // Если мы используем form Data, реквест Хедер не используем

		let formData = new FormData(formContacts);
		// Превращение в JSON формат
		let obj = {};
		formData.forEach(function (value, key) {
			obj[key] = value;
		});
		let json = JSON.stringify(obj);
		request.send(json);
		for (let i = 0; i < input.length; i++) {
			input[i].value = "";
		}
	});

	// Slider

	let slideIndex = 1, // Отвечает за тот слайд который есть в текущий момент
		slides = document.querySelectorAll(".slider-item"), // Слайды
		prev = document.querySelector(".prev"), // Прошлая картинка
		next = document.querySelector(".next"), // Следующая картинка
		dotsWrap = document.querySelector(".slider-dots"), // Блок с точками
		dots = document.querySelectorAll(".dot"); // Точки
	showSlides(slideIndex);
	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach((item) => (item.style.display = "none")); // Скрываем все слайды
		dots.forEach((item) => item.classList.remove("dot-active")); // Удаляем активный класс у кнопки

		slides[slideIndex - 1].style.display = "block";
		dots[slideIndex - 1].classList.add("dot-active");
	}
	function plusSlides(n) {
		showSlides((slideIndex += n));
	}
	function currentSlide(n) {
		showSlides((slideIndex = n));
	}
	prev.addEventListener("click", function () {
		plusSlides(-1);
	});
	next.addEventListener("click", function () {
		plusSlides(1);
	});
	dotsWrap.addEventListener("click", function (event) {
		for (let i = 0; i < dots.length + 1; i++) {
			if (
				event.target.classList.contains("dot") &&
				event.target == dots[i - 1]
			) {
				// Проверяем клик на точку
				currentSlide(i);
			}
		}
	});

	//Calc

	let persons = document.querySelectorAll(".counter-block-input")[0],
		restsDays = document.querySelectorAll(".counter-block-input")[1],
		place = document.getElementById("select"),
		totalValue = document.getElementById("total"),
		personsSum = 0,
		daysSum = 0,
		total = 0;

	totalValue.textContent = "0";

	persons.addEventListener("change", function () {
		personsSum = +this.value;
		total = (daysSum + personsSum) * 4000;

		if (restsDays.value == "") {
			totalValue.textContent = "0";
		} else {
			totalValue.innerHTML = total;
		}
	});
	restsDays.addEventListener("change", function () {
		daysSum = +this.value;
		total = (daysSum + personsSum) * 4000;

		if (persons.value == "") {
			totalValue.textContent = "0";
		} else {
			totalValue.innerHTML = total;
		}
	});

	place.addEventListener("change", function () {
		if (persons.value == "" || restsDays.value == "") {
			totalValue.innerHTML = 0;
		} else {
			let a = total;
			totalValue.innerHTML = a * this.options[this.selectedIndex].value;
		}
	});
});
