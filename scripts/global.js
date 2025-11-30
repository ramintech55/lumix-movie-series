document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".faq-question");

    let observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if(entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 0.6}s`;
                entry.target.classList.add("show");
            }
        });
    });

    questions.forEach(question => {
        observer.observe(question);
    });

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            question.classList.toggle("active");

            const answer = question.nextElementSibling;

            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    const select = document.getElementById("languageSelect");

    async function loadLanguage(lang) {
        try {
            const res = await fetch(`translations/${lang}.json`);
            const translations = await res.json();

            document.querySelectorAll("[data-i18n]").forEach((el) => {
                const key = el.getAttribute("data-i18n");

                if (translations[key]) {
                    el.innerHTML = translations[key];
                }
            });

            localStorage.setItem("lang", lang);
        } catch (err) {
            console.error("Language cannot load:", err);
        }
    }

    select.addEventListener("change", () => {
        loadLanguage(select.value);
    });

    const savedLang = localStorage.getItem("lang") || "en";
    select.value = savedLang;
    loadLanguage(savedLang);
});
