document.addEventListener("DOMContentLoaded", () => {

  initializeTheme();

  initializeAuthentication();

  initializeApplication();

  initializeLegalQueries();

  initializeChatbot();

});


/* =========================================================
   USER STORAGE
========================================================= */

function getStoredUser() {

  return JSON.parse(
    localStorage.getItem("legalUser") || "{}"
  );

}


function saveUser(user) {

  localStorage.setItem(
    "legalUser",
    JSON.stringify(user)
  );

}


/* =========================================================
   AUTHENTICATION
========================================================= */

function initializeAuthentication() {

  const loginForm =
    document.getElementById("loginForm");

  const signupForm =
    document.getElementById("signupForm");

  const otpForm =
    document.getElementById("otpForm");

  const preferencesForm =
    document.getElementById("preferencesForm");


  if (
    !loginForm ||
    !signupForm ||
    !otpForm ||
    !preferencesForm
  ) {

    return;

  }


  const districtSelect =
    document.getElementById("district");

  const loginError =
    document.getElementById("loginError");

  const signupError =
    document.getElementById("signupError");

  const otpError =
    document.getElementById("otpError");

  const preferencesError =
    document.getElementById("preferencesError");


  /* ---------- DISTRICTS ---------- */

  if (
    districtSelect &&
    typeof maharashtraDistricts !== "undefined"
  ) {

    maharashtraDistricts.forEach(
      district => {

        const option =
          document.createElement("option");

        option.value =
          district;

        option.textContent =
          district;

        districtSelect.appendChild(
          option
        );

      }
    );

  }


  /* ---------- DEMO OTP ---------- */

  let generatedOtp =
    generateOtp();


  const demoOtp =
    document.getElementById("demoOtp");

  if (demoOtp) {

    demoOtp.textContent =
      generatedOtp;

  }


  /* ---------- ERROR HELPERS ---------- */

  function showError(
    element,
    message
  ) {

    if (!element) return;

    element.textContent =
      message;

    element.classList.add(
      "show"
    );

  }


  function hideError(
    element
  ) {

    if (!element) return;

    element.classList.remove(
      "show"
    );

    element.textContent =
      "";

  }


  /* ---------- SHOW LOGIN ---------- */

  const showLogin =
    document.getElementById(
      "showLogin"
    );

  if (showLogin) {

    showLogin.addEventListener(
      "click",
      () => {

        signupForm.classList.remove(
          "active-step"
        );

        otpForm.classList.remove(
          "active-step"
        );

        preferencesForm.classList.remove(
          "active-step"
        );

        loginForm.classList.add(
          "active-step"
        );

        hideError(
          signupError
        );

        hideError(
          loginError
        );

        updateAuthStep(1);

      }
    );

  }


  /* ---------- SHOW SIGNUP ---------- */

  const showSignup =
    document.getElementById(
      "showSignup"
    );

  if (showSignup) {

    showSignup.addEventListener(
      "click",
      () => {

        loginForm.classList.remove(
          "active-step"
        );

        otpForm.classList.remove(
          "active-step"
        );

        preferencesForm.classList.remove(
          "active-step"
        );

        signupForm.classList.add(
          "active-step"
        );

        hideError(
          loginError
        );

        hideError(
          signupError
        );

        updateAuthStep(1);

      }
    );

  }


  /* =====================================================
     LOGIN
  ===================================================== */

  loginForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      hideError(
        loginError
      );


     const loginId = document
  .getElementById("loginId")
  .value.trim();

const loginMobile = document
  .getElementById("loginMobile")
  .value.trim();

const password = document
  .getElementById("password")
  .value;

if (!loginId || !loginMobile || !password) {
  showError(
    loginError,
    "Please enter your username, registered mobile number, and password."
  );
  return;
}

if (!/^[6-9]\d{9}$/.test(loginMobile)) {
  showError(
    loginError,
    "Please enter a valid 10-digit Indian mobile number."
  );
  return;
}


      if (
        !loginId ||
        !password
      ) {

        showError(
          loginError,
          "⚠ Please enter your username/phone number and password."
        );

        return;

      }


      const registeredUser =
        JSON.parse(
          localStorage.getItem(
            "registeredUser"
          ) || "null"
        );


      if (!registeredUser) {

        showError(
          loginError,
          "⚠ Account not found. Please create an account first using \"Create an account\"."
        );

        return;

      }


      const validUsername =
  loginId === registeredUser.username ||
  loginId === registeredUser.phone;

const validMobile =
  loginMobile === registeredUser.phone;

const validPassword =
  password === registeredUser.password;

if (!validUsername || !validMobile || !validPassword) {
  showError(
    loginError,
    "Username, registered mobile number, or password is incorrect."
  );
  return;
}


      if (
        !validUsername ||
        !validPassword
      ) {

        showError(
          loginError,
          "⚠ Username or password is incorrect. Please check again."
        );

        return;

      }


      const oldUser =
        getStoredUser();


      const user = {

        ...oldUser,

        username:
          registeredUser.username,

        name:
          registeredUser.name ||
          oldUser.name ||
          registeredUser.username

      };


      saveUser(user);


      generatedOtp =
        generateOtp();


      if (demoOtp) {

        demoOtp.textContent =
          generatedOtp;

      }


      const otpInput =
        document.getElementById(
          "otpInput"
        );

      if (otpInput) {

        otpInput.value =
          "";

      }


      hideError(
        otpError
      );


      loginForm.classList.remove(
        "active-step"
      );

      signupForm.classList.remove(
        "active-step"
      );

      otpForm.classList.add(
        "active-step"
      );

      updateAuthStep(2);

    }
  );


  /* ---------- LOGIN ERROR CLEAR ---------- */

  const loginIdInput =
    document.getElementById(
      "loginId"
    );

  if (loginIdInput) {

    loginIdInput.addEventListener(
      "input",
      () => {

        hideError(
          loginError
        );

      }
    );

  }


  const passwordInput =
    document.getElementById(
      "password"
    );

  if (passwordInput) {

    passwordInput.addEventListener(
      "input",
      () => {

        hideError(
          loginError
        );

      }
    );

  }


  /* =====================================================
     SIGN UP
  ===================================================== */

  signupForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      hideError(
        signupError
      );


      const name =
        document
          .getElementById("signupName")
          .value
          .trim();


      const usernameOrPhone =
        document
          .getElementById("signupPhone")
          .value
          .trim();


      const password =
        document
          .getElementById("signupPassword")
          .value
          .trim();


      const confirmPassword =
        document
          .getElementById(
            "signupConfirmPassword"
          )
          .value
          .trim();


      if (
        !name ||
        !usernameOrPhone ||
        !password ||
        !confirmPassword
      ) {

        showError(
          signupError,
          "⚠ Please complete all registration fields."
        );

        return;

      }


      if (
        password.length < 6
      ) {

        showError(
          signupError,
          "⚠ Password must contain at least 6 characters."
        );

        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        showError(
          signupError,
          "⚠ Passwords do not match."
        );

        return;

      }


      const existingUser =
        JSON.parse(
          localStorage.getItem(
            "registeredUser"
          ) || "null"
        );


      if (
        existingUser &&
        (
          existingUser.username ===
            usernameOrPhone ||
          existingUser.phone ===
            usernameOrPhone
        )
      ) {

        showError(
          signupError,
          "⚠ An account with this username/phone already exists."
        );

        return;

      }


      const newUser = {

        name:
          name,

        username:
          usernameOrPhone,

        phone:
          usernameOrPhone,

        password:
          password

      };


      localStorage.setItem(
        "registeredUser",
        JSON.stringify(
          newUser
        )
      );


      const user = {

        username:
          usernameOrPhone,

        name:
          name,

        profileProgress:
          30,

        caseProgress:
          0,

        history: [

          {

            title:
              "Account created",

            description:
              "Your legal navigation profile was created.",

            date:
              new Date()
                .toLocaleDateString()

          }

        ]

      };


      saveUser(
        user
      );


      signupForm.reset();


      loginForm.classList.add(
        "active-step"
      );

      signupForm.classList.remove(
        "active-step"
      );


      document.getElementById(
        "loginId"
      ).value =
        usernameOrPhone;


      document.getElementById(
        "password"
      ).value =
        "";


      hideError(
        signupError
      );


      updateAuthStep(1);


      showError(
        loginError,
        "✓ Account created successfully. Please enter your password to continue."
      );


      loginError.classList.remove(
        "login-error"
      );

      loginError.classList.add(
        "login-success"
      );

    }
  );


  /* ---------- SIGNUP ERROR CLEAR ---------- */

  [
    "signupName",
    "signupPhone",
    "signupPassword",
    "signupConfirmPassword"

  ].forEach(
    id => {

      const element =
        document.getElementById(
          id
        );

      if (element) {

        element.addEventListener(
          "input",
          () => {

            hideError(
              signupError
            );

          }
        );

      }

    }
  );


  /* =====================================================
     OTP
  ===================================================== */

  const resendOtp =
    document.getElementById(
      "resendOtp"
    );


  if (resendOtp) {

    resendOtp.addEventListener(
      "click",
      () => {

        generatedOtp =
          generateOtp();


        if (demoOtp) {

          demoOtp.textContent =
            generatedOtp;

        }


        const otpInput =
          document.getElementById(
            "otpInput"
          );

        if (otpInput) {

          otpInput.value =
            "";

        }


        hideError(
          otpError
        );


        showError(
          otpError,
          "✓ A new demo OTP has been generated above."
        );


        otpError.classList.remove(
          "login-error"
        );

        otpError.classList.add(
          "login-success"
        );

      }
    );

  }


  otpForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      hideError(
        otpError
      );


      const otpInput =
        document.getElementById(
          "otpInput"
        );


      const enteredOtp =
        otpInput
          ? otpInput.value.trim()
          : "";


      if (
        !/^\d{6}$/.test(
          enteredOtp
        )
      ) {

        otpError.classList.remove(
          "login-success"
        );

        otpError.classList.add(
          "login-error"
        );


        showError(
          otpError,
          "⚠ Please enter the 6-digit OTP shown above."
        );

        return;

      }


      if (
        enteredOtp !==
        generatedOtp
      ) {

        otpError.classList.remove(
          "login-success"
        );

        otpError.classList.add(
          "login-error"
        );


        showError(
          otpError,
          "⚠ Invalid OTP. Please check the OTP and try again."
        );

        return;

      }


      otpForm.classList.remove(
        "active-step"
      );

      preferencesForm.classList.add(
        "active-step"
      );

      updateAuthStep(3);

    }
  );


  if (otpInput) {

    otpInput.addEventListener(
      "input",
      () => {

        otpError.classList.remove(
          "show"
        );

      }
    );

  }


  /* =====================================================
     LOCATION
  ===================================================== */

  
  /* =====================================================
     LOCATION — GPS + REVERSE GEOCODING
  ===================================================== */

  const manualLocation =
    document.getElementById("manualLocation");

  const useGps =
    document.getElementById("useGps");

  const locationFields =
    document.getElementById("locationFields");

  const gpsMessage =
    document.getElementById("gpsMessage");


  const localityTypeSelect =
    document.getElementById("localityType");

  const localityInput =
    document.getElementById("locality");


  // Display status messages without changing the existing design.
  function showGpsMessage(message, isError = false) {
    if (!gpsMessage) return;

    gpsMessage.textContent = message;

    gpsMessage.classList.toggle("gps-error", isError);

    gpsMessage.setAttribute("role", "status");
    gpsMessage.setAttribute("aria-live", "polite");
  }


  // Always allow users to enter or correct their location manually.
  if (manualLocation) {
    manualLocation.addEventListener("click", () => {
      if (locationFields) {
        locationFields.classList.remove("hidden");
      }

      showGpsMessage(
        "Enter or verify your district, location type, and city/village."
      );

      if (districtSelect) {
        districtSelect.focus();
      }
    });
  }


  // Normalize district names to handle different spellings.
  function normalizeDistrictName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\bdistrict\b/g, "")
      .replace(/[^a-z0-9]/g, "");
  }


  // Match geocoded district names to options already in data.js.
  function findMatchingDistrict(rawDistrict) {
    if (!districtSelect || !rawDistrict) {
      return null;
    }

    const aliases = {
      ahilyanagar: ["ahmednagar"],
      ahmednagar: ["ahilyanagar"],
      chhatrapatisambhajinagar: ["aurangabad"],
      aurangabad: ["chhatrapatisambhajinagar"],
      dharashiv: ["osmanabad"],
      osmanabad: ["dharashiv"],
      mumbai: ["mumbaicity", "mumbaisuburban"]
    };

    const target = normalizeDistrictName(rawDistrict);

    const options = Array.from(districtSelect.options)
      .filter(option => option.value);

    // First try an exact match.
    let match = options.find(option =>
      normalizeDistrictName(option.value) === target ||
      normalizeDistrictName(option.textContent) === target
    );

    if (match) return match;

    // Try alternate district names.
    const alternateNames = aliases[target] || [];

    match = options.find(option => {
      const optionName = normalizeDistrictName(
        option.value || option.textContent
      );

      return alternateNames.includes(optionName);
    });

    return match || null;
  }


  // Obtain GPS coordinates.
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    });
  }


  // Convert coordinates into an address using reverse geocoding.
  async function getAddressFromCoordinates(latitude, longitude) {
    const url = new URL(
      "https://nominatim.openstreetmap.org/reverse"
    );

    url.search = new URLSearchParams({
      format: "jsonv2",
      lat: String(latitude),
      lon: String(longitude),
      zoom: "18",
      addressdetails: "1"
    }).toString();

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        "Address lookup failed. Please enter your location manually."
      );
    }

    const result = await response.json();

    if (!result || !result.address) {
      throw new Error(
        "No address was found. Please enter your location manually."
      );
    }

    return result.address;
  }


  // Select an option and trigger existing form listeners.
  function selectLocationType(value) {
    if (!localityTypeSelect) return;

    const option = Array.from(localityTypeSelect.options)
      .find(item =>
        item.value.toLowerCase() === value.toLowerCase()
      );

    if (option) {
      localityTypeSelect.value = option.value;

      localityTypeSelect.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }
  }


  // Main GPS button handler.
  if (useGps) {
    useGps.addEventListener("click", async () => {

      if (
        !districtSelect ||
        !localityTypeSelect ||
        !localityInput ||
        !locationFields
      ) {
        showGpsMessage(
          "Location form fields are missing. Check index.html.",
          true
        );
        return;
      }

      if (!navigator.geolocation) {
        locationFields.classList.remove("hidden");

        showGpsMessage(
          "Your browser does not support GPS. Please enter your location manually.",
          true
        );
        return;
      }

      useGps.disabled = true;
      useGps.textContent = "Detecting location...";

      locationFields.classList.remove("hidden");

      showGpsMessage("Requesting your current location...");

      try {
        // STEP 1: Read GPS coordinates.
        const position = await getCurrentPosition();

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        showGpsMessage(
          "GPS received. Finding your Maharashtra district and locality..."
        );

        // STEP 2: Reverse-geocode the coordinates.
        const address = await getAddressFromCoordinates(
          latitude,
          longitude
        );

        // STEP 3: Ensure the detected state is Maharashtra.
        const state = String(address.state || "").toLowerCase();

        if (!state.includes("maharashtra")) {
          showGpsMessage(
            "Your detected location is outside Maharashtra. Please select your Maharashtra location manually.",
            true
          );
          return;
        }

        // STEP 4: Find the district.
        const rawDistrict =
          address.state_district ||
          address.county ||
          address.district ||
          "";

        const districtOption =
          findMatchingDistrict(rawDistrict);

        if (!districtOption) {
          showGpsMessage(
            "Your address was detected, but its district could not be matched to the dropdown. Please select the district manually.",
            true
          );
          return;
        }

        // Populate the existing district dropdown.
        districtSelect.value = districtOption.value;

        districtSelect.dispatchEvent(
          new Event("change", { bubbles: true })
        );

        // STEP 5: Find the most specific available locality.
        const locality =
          address.village ||
          address.town ||
          address.city ||
          address.municipality ||
          address.hamlet ||
          address.suburb ||
          address.neighbourhood ||
          address.city_district ||
          "";

        if (locality) {
          localityInput.value = locality;

          localityInput.dispatchEvent(
            new Event("input", { bubbles: true })
          );

          localityInput.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }

        // STEP 6: Suggest rural/urban where possible.
        // This is an inference from address data, not official classification.
        if (address.village || address.hamlet) {
          selectLocationType("Rural");
        } else if (
          address.city ||
          address.town ||
          address.municipality
        ) {
          selectLocationType("Urban");
        }

        showGpsMessage(
          "Location detected: Maharashtra, " +
          districtOption.textContent +
          (locality ? ", " + locality : "") +
          ". Please verify the details before continuing."
        );

      } catch (error) {
        console.error("GPS location error:", error);

        let message =
          error.message ||
          "Unable to detect your location. Please enter it manually.";

        if (typeof error.code === "number") {
          if (error.code === 1) {
            message =
              "Location permission denied. Allow location access in your browser and try again.";
          } else if (error.code === 2) {
            message =
              "Your device could not determine its location. Enable location services and retry.";
          } else if (error.code === 3) {
            message =
              "GPS request timed out. Try again or enter your location manually.";
          }
        }

        showGpsMessage(message, true);

      } finally {
        useGps.disabled = false;
        useGps.textContent = "📍 Use GPS";
      }
    });
  }


  /* =====================================================
     PREFERENCES
  ===================================================== */

  preferencesForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      hideError(
        preferencesError
      );


      const language =
        document.getElementById(
          "language"
        ).value;


      const district =
        document.getElementById(
          "district"
        ).value;


      const localityType =
        document.getElementById(
          "localityType"
        ).value;


      const locality =
        document.getElementById(
          "locality"
        ).value.trim();


      if (!language) {

        showError(
          preferencesError,
          "⚠ Please select your preferred language."
        );

        return;

      }


      if (
        !district ||
        !localityType ||
        !locality
      ) {

        showError(
          preferencesError,
          "⚠ Please complete your Maharashtra district, location type, and city/village."
        );

        return;

      }


      const oldUser =
        getStoredUser();


      const user = {

        ...oldUser,

        language:
          language,

        location: {

          district:
            district,

          localityType:
            localityType,

          locality:
            locality

        },

        profileProgress:
          oldUser.profileProgress || 30,

        caseProgress:
          oldUser.caseProgress || 0,

        history:
          oldUser.history || [

            {

              title:
                "Account created",

              description:
                "Your legal navigation profile was created.",

              date:
                new Date()
                  .toLocaleDateString()

            }

          ]

      };


      saveUser(
        user
      );


      localStorage.setItem(
        "loggedIn",
        "true"
      );


      window.location.href =
        "dashboard.html";

    }
  );

}


/* =========================================================
   OTP GENERATOR
========================================================= */

function generateOtp() {

  return Math
    .floor(
      100000 +
      Math.random() * 900000
    )
    .toString();

}


/* =========================================================
   AUTH STEP INDICATOR
========================================================= */

function updateAuthStep(
  step
) {

  document
    .querySelectorAll(
      ".step-indicator span"
    )
    .forEach(
      (element, index) => {

        element.classList.toggle(
          "active",
          index < step
        );

      }
    );

}


/* =========================================================
   APPLICATION
========================================================= */

function initializeApplication() 
{

  const loggedIn =
    localStorage.getItem(
      "loggedIn"
    );


  if (
    document.querySelector(
      ".app-shell"
    ) &&
    loggedIn !== "true"
  ) {

    window.location.href =
      "index.html";

    return;

  }


  const user =
    getStoredUser();


  /* ---------- USER NAME ---------- */

  document
    .querySelectorAll(
      "[data-user-name]"
    )
    .forEach(
      element => {

        element.textContent =
          user.name ||
          user.username ||
          "User";

      }
    );


  /* ---------- USER LOCATION ---------- */

  document
    .querySelectorAll(
      "[data-user-location]"
    )
    .forEach(
      element => {

        const location =
          user.location || {};


        element.textContent =
          [
            location.locality,
            location.district
          ]
            .filter(Boolean)
            .join(", ") ||
          "Location not available";

      }
    );


  /* ---------- ACTIVE NAVIGATION ---------- */

  const currentPage =
    window.location.pathname
      .split("/")
      .pop() ||
    "dashboard.html";


  document
    .querySelectorAll(
      ".navbar a"
    )
    .forEach(
      link => {

        const linkPage =
          link.getAttribute(
            "href"
          );


        link.classList.toggle(
          "active",
          linkPage === currentPage
        );

      }
    );


  /* ---------- LOGOUT ---------- */

  document
    .querySelectorAll(
      "[data-logout]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            localStorage.removeItem(
              "loggedIn"
            );

            window.location.href =
              "index.html";

          }
        );

      }
    );


  /* ---------- THEME ---------- */

  document
    .querySelectorAll(
      "[data-theme-toggle]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          toggleTheme
        );

      }
    );


  /* ---------- DASHBOARD CHAT ---------- */

  const chatbotBar =
    document.getElementById(
      "chatbotBarInput"
    );

  const chatbotBarButton =
    document.getElementById(
      "chatbotBarButton"
    );


  if (
    chatbotBar &&
    chatbotBarButton
  ) {

    chatbotBarButton.addEventListener(
      "click",
      () => {

        const question =
          chatbotBar.value.trim();


        if (!question) return;


        openChatbot();

        processChatQuestion(
          question
        );


        chatbotBar.value =
          "";

      }
    );


    chatbotBar.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Enter"
        ) {

          event.preventDefault();

          chatbotBarButton.click();

        }

      }
    );

  }


  initializeJourney();

  initializeForms();
  
  /* ---------- HEADER SETTINGS MENU ---------- */

  const settingsButton =
    document.getElementById("settingsMenuButton");

  const settingsDropdown =
    document.getElementById("settingsDropdown");

  if (settingsButton && settingsDropdown) {
    settingsButton.addEventListener("click", () => {
      const isOpening = settingsDropdown.hidden;

      settingsDropdown.hidden = !isOpening;
      settingsButton.setAttribute(
        "aria-expanded",
        String(isOpening)
      );
    });

    document.addEventListener("click", event => {
      if (
        !event.target.closest(".settings-menu")
      ) {
        settingsDropdown.hidden = true;
        settingsButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });
  }

  /* ---------- HEADER THEME BUTTON ---------- */

  const headerThemeButton =
    document.getElementById("headerThemeButton");

  function updateHeaderThemeLabel() {
    if (!headerThemeButton) return;

    headerThemeButton.textContent =
      document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
  }

  if (headerThemeButton) {
    updateHeaderThemeLabel();

    headerThemeButton.addEventListener("click", () => {
      toggleTheme();
      updateHeaderThemeLabel();
    });
  }

  /* ---------- HEADER LOGOUT BUTTON ---------- */

  const headerLogoutButton =
    document.getElementById("headerLogoutButton");

  if (headerLogoutButton) {
    headerLogoutButton.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "index.html";
    });
  }

  /* ---------- HEADER LANGUAGE ---------- */

  const headerLanguage =
    document.getElementById("headerLanguage");

  if (headerLanguage) {
    let user = {};

    try {
      user = JSON.parse(
        localStorage.getItem("legalUser") || "{}"
      );
    } catch (error) {
      user = {};
    }

    headerLanguage.value =
      user.language === "Hindi" ? "Hindi" : "English";

    headerLanguage.addEventListener("change", () => {
      const selectedLanguage = headerLanguage.value;

      let currentUser = {};

      try {
        currentUser = JSON.parse(
          localStorage.getItem("legalUser") || "{}"
        );
      } catch (error) {
        currentUser = {};
      }

      currentUser.language = selectedLanguage;

      localStorage.setItem(
        "legalUser",
        JSON.stringify(currentUser)
      );

      // Apply the selected language using the existing
      // Google Translate integration.
      const translateSelect =
        document.querySelector(".goog-te-combo");

      if (translateSelect) {
        translateSelect.value =
          selectedLanguage === "Hindi" ? "hi" : "en";

        translateSelect.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      } else {
        // Reload so the existing language.js can
        // initialize the selected saved language.
        window.location.reload();
      }
    });
  }


}


/* =========================================================
   FORMS
========================================================= */

function initializeForms() {

  const queryForm =
    document.getElementById(
      "queryForm"
    );


  /*
     This old query form handler is kept
     for compatibility with any older page.
  */

  if (queryForm) {

    queryForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const subjectElement =
          document.getElementById(
            "querySubject"
          );

        const descriptionElement =
          document.getElementById(
            "queryDescription"
          );


        if (
          !subjectElement ||
          !descriptionElement
        ) {

          return;

        }


        const subject =
          subjectElement.value.trim();


        const description =
          descriptionElement.value.trim();


        if (
          !subject ||
          !description
        ) {

          alert(
            "Please complete the query form."
          );

          return;

        }


        const user =
          getStoredUser();


        user.caseProgress =
          Math.min(
            (user.caseProgress || 0) + 10,
            100
          );


        user.history =
          user.history || [];


        user.history.unshift({

          title:
            subject,

          description:
            description,

          date:
            new Date()
              .toLocaleDateString()

        });


        saveUser(
          user
        );


        alert(
          "Your query has been saved to My Legal Journey."
        );


        queryForm.reset();

      }
    );

  }


  /* ---------- LAWYER CONSULTATION ---------- */

  document
    .querySelectorAll(
      "[data-consult-lawyer]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const user =
              getStoredUser();


            user.history =
              user.history || [];


            user.history.unshift({

              title:
                "Lawyer consultation requested",

              description:
                "Your consultation request has been recorded.",

              date:
                new Date()
                  .toLocaleDateString()

            });


            saveUser(
              user
            );


            alert(
              "Consultation request recorded. A backend is required for real appointment booking."
            );

          }
        );

      }
    );


  /* ---------- DOCUMENT BUTTONS ---------- */

  document
    .querySelectorAll(
      "[data-document]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const documentName =
              button.dataset.document;


            alert(
              `${documentName}\n\n` +
              "This prototype provides an overview only. " +
              "The final procedure should be verified with the relevant government department or lawyer."
            );

          }
        );

      }
    );

}


/* =========================================================
   MY LEGAL JOURNEY
========================================================= */

function initializeJourney() {

  const user =
    getStoredUser();


  const progressBar =
    document.getElementById(
      "caseProgressBar"
    );


  const progressText =
    document.getElementById(
      "caseProgressText"
    );


  const profileProgress =
    document.getElementById(
      "profileProgress"
    );


  const historyContainer =
    document.getElementById(
      "historyContainer"
    );


  /* ---------- CASE PROGRESS ---------- */

  if (progressBar) {

    const progress =
      user.caseProgress || 0;


    progressBar.style.width =
      `${progress}%`;


    if (progressText) {

      progressText.textContent =
        `${progress}% completed`;

    }

  }


  /* ---------- PROFILE PROGRESS ---------- */

  if (profileProgress) {

    profileProgress.textContent =
      `${user.profileProgress || 30}%`;

  }


  /* ---------- HISTORY ---------- */

  if (historyContainer) {

    const history =
      user.history || [];


    if (!history.length) {

      historyContainer.innerHTML =
        "<p class='muted'>No activity recorded yet.</p>";

    }

    else {

      historyContainer.innerHTML =
        history
          .map(
            item => `

              <div class="timeline-item">

                <strong>
                  ${escapeHtml(
                    item.title
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    item.description
                  )}
                </span>

                <span>
                  ${escapeHtml(
                    item.date
                  )}
                </span>

              </div>

            `
          )
          .join("");

    }

  }


  /* ---------- HELP BUTTON ---------- */

  const helpButton =
    document.getElementById(
      "helpButton"
    );


  if (helpButton) {

    helpButton.addEventListener(
      "click",
      () => {

        alert(
          "For urgent legal-aid assistance in India, contact the official NALSA helpline at 15100 or approach the appropriate legal-services authority."
        );

      }
    );

  }

}


/* =========================================================
   CHATBOT
========================================================= */

function initializeChatbot() {

  const toggle =
    document.getElementById(
      "chatbotToggle"
    );


  const close =
    document.getElementById(
      "chatbotClose"
    );


  const input =
    document.getElementById(
      "chatInput"
    );


  const send =
    document.getElementById(
      "chatSend"
    );


  const chatbotWindow =
    document.getElementById(
      "chatbotWindow"
    );


  if (
    !toggle ||
    !close ||
    !input ||
    !send ||
    !chatbotWindow
  ) {

    return;

  }


  toggle.addEventListener(
    "click",
    () => {

      chatbotWindow.classList.toggle(
        "open"
      );

    }
  );


  close.addEventListener(
    "click",
    () => {

      chatbotWindow.classList.remove(
        "open"
      );

    }
  );


  send.addEventListener(
    "click",
    () => {

      const question =
        input.value.trim();


      if (!question) return;


      processChatQuestion(
        question
      );


      input.value =
        "";

    }
  );


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        send.click();

      }

    }
  );

}


/* =========================================================
   OPEN CHATBOT
========================================================= */

function openChatbot() {

  const chatbotWindow =
    document.getElementById(
      "chatbotWindow"
    );


  if (chatbotWindow) {

    chatbotWindow.classList.add(
      "open"
    );

  }

}


/* =========================================================
   PROCESS CHAT QUESTION
========================================================= */

function processChatQuestion(
  question
) {

  const messages =
    document.getElementById(
      "chatMessages"
    );


  if (!messages) return;


  appendMessage(
    question,
    "user"
  );


  const normalizedQuestion =
    question.toLowerCase();


  /*
     Convert all five legal categories
     into one searchable array.
  */

  const allLegalQuestions =
    [];


  if (
    typeof legalKnowledge !==
    "undefined"
  ) {

    Object.keys(
      legalKnowledge
    ).forEach(
      category => {

        legalKnowledge[
          category
        ].forEach(
          item => {

            allLegalQuestions.push(
              item
            );

          }
        );

      }
    );

  }


  /*
     Search question keywords.
  */

  const result =
    allLegalQuestions.find(
      item =>

        item.keywords.some(
          keyword =>

            normalizedQuestion.includes(
              keyword.toLowerCase()
            )

        )

    );


  const answer =
    result
      ? result.answer
      : "I could not find sufficient information in the approved legal information base. Please consult a qualified lawyer for case-specific guidance.";


  setTimeout(
    () => {

      appendMessage(
        answer,
        "bot"
      );

    },
    400
  );

}


/* =========================================================
   APPEND CHAT MESSAGE
========================================================= */

function appendMessage(
  message,
  type
) {

  const messages =
    document.getElementById(
      "chatMessages"
    );


  if (!messages) return;


  const div =
    document.createElement(
      "div"
    );


  div.className =
    `message ${type}`;


  div.textContent =
    message;


  messages.appendChild(
    div
  );


  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

  const savedTheme =
    localStorage.getItem(
      "theme"
    );


  if (
    savedTheme ===
    "dark"
  ) {

    document.body.classList.add(
      "dark-mode"
    );

  }

}


function toggleTheme() {

  document.body.classList.toggle(
    "dark-mode"
  );


  localStorage.setItem(
    "theme",

    document.body.classList.contains(
      "dark-mode"
    )
      ? "dark"
      : "light"
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
  value
) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   LEGAL QUERY SYSTEM
========================================================= */

function initializeLegalQueries() {

  const categoryButtons =
    document.querySelectorAll(
      ".legal-category-card"
    );


  const questionInput =
    document.getElementById(
      "legalQuestion"
    );


  const suggestionsContainer =
    document.getElementById(
      "questionSuggestions"
    );


  const getInfoButton =
    document.getElementById(
      "getLegalInfo"
    );


  const answerPanel =
    document.getElementById(
      "legalAnswerPanel"
    );


  const answerQuestion =
    document.getElementById(
      "answerQuestion"
    );


  const answerText =
    document.getElementById(
      "answerText"
    );


  const answerSource =
    document.getElementById(
      "answerSource"
    );


  const saveButton =
    document.getElementById(
      "saveLegalInfo"
    );


  /*
     Run only on queries.html.
  */

  if (
    !categoryButtons.length ||
    !questionInput ||
    !suggestionsContainer ||
    !getInfoButton ||
    !answerPanel
  ) {

    return;

  }


  let selectedCategory =
    null;


  let selectedResult =
    null;


  /* =====================================================
     ALL QUESTIONS
  ===================================================== */

  function getAllLegalQuestions() {

    const allQuestions =
      [];


    if (
      typeof legalKnowledge ===
      "undefined"
    ) {

      return allQuestions;

    }


    Object.keys(
      legalKnowledge
    ).forEach(
      category => {

        legalKnowledge[
          category
        ].forEach(
          item => {

            allQuestions.push({

              ...item,

              category:
                category

            });

          }
        );

      }
    );


    return allQuestions;

  }


  /* =====================================================
     SHOW SUGGESTIONS
  ===================================================== */

  function showSuggestions() {

    suggestionsContainer.innerHTML =
      "";


    const searchText =
      questionInput.value
        .trim()
        .toLowerCase();


    if (!selectedCategory) {

      suggestionsContainer.innerHTML =
        "<p class='muted'>Please select a legal category first.</p>";

      return;

    }


    if (
      typeof legalKnowledge ===
      "undefined"
    ) {

      suggestionsContainer.innerHTML =
        "<p class='muted'>Legal knowledge base could not be loaded.</p>";

      return;

    }


    const questions =
      legalKnowledge[
        selectedCategory
      ] || [];


    const filteredQuestions =
      questions.filter(
        item => {

          if (!searchText) {

            return true;

          }


          const questionMatch =
            item.question
              .toLowerCase()
              .includes(
                searchText
              );


          const keywordMatch =
            item.keywords.some(
              keyword =>
                keyword
                  .toLowerCase()
                  .includes(
                    searchText
                  )
            );


          return (
            questionMatch ||
            keywordMatch
          );

        }
      );


    if (
      !filteredQuestions.length
    ) {

      suggestionsContainer.innerHTML =
        "<p class='muted'>No matching question found in this category.</p>";

      return;

    }


    filteredQuestions.forEach(
      item => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "question-suggestion";


        button.textContent =
          item.question;


        button.addEventListener(
          "click",
          () => {

            questionInput.value =
              item.question;


            selectedResult =
              item;


            suggestionsContainer.innerHTML =
              "";

          }
        );


        suggestionsContainer.appendChild(
          button
        );

      }
    );

  }


  /* =====================================================
     CATEGORY SELECTION
  ===================================================== */

  
/* CATEGORY SELECTION: OPEN A SEPARATE QUESTIONS PAGE */

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    if (!category) {
      alert("Please select a valid legal category.");
      return;
    }

    window.location.href =
      "category-questions.html?category=" +
      encodeURIComponent(category);
  });
});



  /* =====================================================
     SEARCH QUESTION
  ===================================================== */

  questionInput.addEventListener(
    "input",
    () => {

      selectedResult =
        null;


      showSuggestions();

    }
  );


  /* =====================================================
     GET LEGAL INFORMATION
  ===================================================== */

  getInfoButton.addEventListener(
    "click",
    () => {

      const question =
        questionInput.value
          .trim()
          .toLowerCase();


      if (!selectedCategory) {

        alert(
          "Please select a legal category first."
        );

        return;

      }


      if (!question) {

        alert(
          "Please enter or select a legal question."
        );

        return;

      }


      if (
        typeof legalKnowledge ===
        "undefined"
      ) {

        alert(
          "Legal knowledge base could not be loaded."
        );

        return;

      }


      const questions =
        legalKnowledge[
          selectedCategory
        ] || [];


      /*
         First use the selected suggestion.
      */

      let result =
        selectedResult;


      /*
         Search selected category.
      */

      if (!result) {

        result =
          questions.find(
            item => {

              if (
                item.question
                  .toLowerCase() ===
                question
              ) {

                return true;

              }


              return item.keywords.some(
                keyword =>

                  question.includes(
                    keyword.toLowerCase()
                  ) ||

                  keyword
                    .toLowerCase()
                    .includes(
                      question
                    )

              );

            }
          );

      }


      /*
         Search entire database if
         category search found nothing.
      */

      if (!result) {

        result =
          getAllLegalQuestions().find(
            item => {

              if (
                item.question
                  .toLowerCase() ===
                question
              ) {

                return true;

              }


              return item.keywords.some(
                keyword =>
                  question.includes(
                    keyword.toLowerCase()
                  )
              );

            }
          );

      }


      /*
         No answer found.
      */

      if (!result) {

        selectedResult =
          null;


        answerQuestion.textContent =
          questionInput.value;


        answerText.textContent =
          "We could not find sufficient information for this question in the approved legal information base. Please consult a qualified lawyer for case-specific guidance.";


        answerSource.textContent =
          "Approved legal information base";


        answerPanel.style.display =
          "block";


        return;

      }


      /* ---------- SHOW ANSWER ---------- */

      selectedResult =
        result;


      answerQuestion.textContent =
        result.question;


      answerText.textContent =
        result.answer;


      answerSource.textContent =
        result.source;


      answerPanel.style.display =
        "block";


      answerPanel.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start"

      });

    }
  );


  /* =====================================================
     SAVE TO MY LEGAL JOURNEY
  ===================================================== */

  if (saveButton) {

    saveButton.addEventListener(
      "click",
      () => {

        if (!selectedResult) {

          alert(
            "Please get legal information first."
          );

          return;

        }


        const user =
          getStoredUser();


        user.history =
          user.history || [];


        user.caseProgress =
          Math.min(
            (user.caseProgress || 0) + 5,
            100
          );


        user.history.unshift({

          title:
            selectedResult.question,

          description:
            selectedResult.answer,

          date:
            new Date()
              .toLocaleDateString()

        });


        saveUser(
          user
        );


        alert(
          "Legal information has been saved to My Legal Journey."
        );

      }
    );

  }

}