/* =========================================================
   LEGAL NAVIGATION SYSTEM
   SIMPLE LANGUAGE SYSTEM
   English / Hindi
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       GET USER
    ===================================================== */

    function getUser() {

        try {

            return JSON.parse(
                localStorage.getItem("legalUser") || "{}"
            );

        } catch (error) {

            return {};

        }

    }


    /* =====================================================
       GET SAVED LANGUAGE
    ===================================================== */

    function getSavedLanguage() {

        const user = getUser();

        if (user.language === "Hindi") {

            return "hi";

        }

        return "en";

    }


    /* =====================================================
       SAVE LANGUAGE
    ===================================================== */

    function saveLanguage(language) {

        const user = getUser();

        user.language =
            language === "hi"
                ? "Hindi"
                : "English";


        localStorage.setItem(
            "legalUser",
            JSON.stringify(user)
        );

    }


    /* =====================================================
       IS LOGIN PAGE?
       
       Login / OTP / Preferences must stay English.
    ===================================================== */

    function isLoginPage() {

        const path =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        return (
            path === "" ||
            path === "index.html"
        );

    }


    /* =====================================================
       CREATE TRANSLATION WIDGET
    ===================================================== */

    window.googleTranslateElementInit =
        function () {

            if (
                typeof google === "undefined" ||
                !google.translate
            ) {

                return;

            }


            new google.translate.TranslateElement({

                pageLanguage: "en",

                includedLanguages:
                    "en,hi",

                autoDisplay: false

            }, "google_translate_element");


            /*
               If the user already selected Hindi,
               automatically select Hindi.
            */

            if (!isLoginPage()) {

                const savedLanguage =
                    getSavedLanguage();


                if (
                    savedLanguage === "hi"
                ) {

                    setTimeout(
                        function () {

                            const select =
                                document.querySelector(
                                    ".goog-te-combo"
                                );


                            if (select) {

                                select.value =
                                    "hi";


                                select.dispatchEvent(
                                    new Event(
                                        "change"
                                    )
                                );

                            }

                        },
                        1000
                    );

                }

            }

        };


    /* =====================================================
       LOAD GOOGLE TRANSLATE
    ===================================================== */

    function loadGoogleTranslate() {

        /*
           Don't load the translator on
           login / OTP / preferences page.
        */

        if (isLoginPage()) {

            return;

        }


        /*
           Create widget container.
        */

        let container =
            document.getElementById(
                "google_translate_element"
            );


       
if (!container) {
    container = document.createElement("div");
    container.id = "google_translate_element";
    container.className = "google-language-widget";
}

const languageSlot = document.getElementById("googleTranslateSlot");

if (languageSlot && container.parentElement !== languageSlot) {
    languageSlot.appendChild(container);
}


        /*
           Prevent loading twice.
        */

        if (
            document.getElementById(
                "google-translate-script"
            )
        ) {

            return;

        }


        const script =
            document.createElement(
                "script"
            );


        script.id =
            "google-translate-script";


        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";


        script.async =
            true;


        document.body.appendChild(
            script
        );

    }


    /* =====================================================
       LANGUAGE SELECTOR LISTENER
    ===================================================== */

    function watchGoogleLanguageSelector() {

        const observer =
            new MutationObserver(
                function () {

                    const select =
                        document.querySelector(
                            ".goog-te-combo"
                        );


                    if (!select) {

                        return;

                    }


                    if (
                        select.dataset
                            .legalListener ===
                        "true"
                    ) {

                        return;

                    }


                    select.dataset
                        .legalListener =
                        "true";


                    select.addEventListener(
                        "change",
                        function () {

                            saveLanguage(
                                this.value
                            );

                        }
                    );

                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        /*
           Login page stays completely English.
        */

        if (isLoginPage()) {

            return;

        }


        loadGoogleTranslate();

        watchGoogleLanguageSelector();

    }


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    window.LegalLanguage = {

        getLanguage:
            getSavedLanguage,

        saveLanguage:
            saveLanguage

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();