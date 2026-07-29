// (() => {
//   "use strict";

//   const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   const captchaValues = {};

//   function generateCaptcha(length = 6) {
//     let code = "";
//     for (let i = 0; i < length; i += 1) {
//       code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
//     }
//     return code;
//   }

//   function refreshCaptcha(type) {
//     const codeElement = document.getElementById(`${type}CaptchaCode`);
//     const inputElement = document.getElementById(`${type}CaptchaInput`);
//     if (!codeElement || !inputElement) return;
//     const code = generateCaptcha();
//     captchaValues[type] = code;
//     codeElement.textContent = code;
//     inputElement.value = "";
//   }

//   function captchaIsValid(type) {
//     const input = document.getElementById(`${type}CaptchaInput`);
//     return Boolean(
//       input && input.value.trim().toUpperCase() === captchaValues[type],
//     );
//   }

//   const rememberedEmail = localStorage.getItem("rigforgeRememberedEmail");
//   const loginEmail = document.getElementById("loginEmail");
//   const rememberMe = document.getElementById("rememberMe");
//   if (loginEmail && rememberedEmail) {
//     loginEmail.value = rememberedEmail;
//     if (rememberMe) rememberMe.checked = true;
//   }

//   document
//     .getElementById("refreshLoginCaptcha")
//     ?.addEventListener("click", () => refreshCaptcha("login"));
//   document
//     .getElementById("refreshRegisterCaptcha")
//     ?.addEventListener("click", () => refreshCaptcha("register"));
//   refreshCaptcha("login");
//   refreshCaptcha("register");

//   const loginForm = document.getElementById("loginForm");
//   loginForm?.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const status = document.getElementById("loginStatus");
//     const email = document.getElementById("loginEmail").value.trim();
//     const password = document.getElementById("loginPassword").value;

//     if (!captchaIsValid("login")) {
//       status.style.color = "var(--red)";
//       status.textContent = "Güvenlik kodu hatalı. Yeni kod oluşturuldu.";
//       refreshCaptcha("login");
//       return;
//     }
//     if (password.length < 6) {
//       status.style.color = "var(--red)";
//       status.textContent = "Şifre en az 6 karakter olmalıdır.";
//       refreshCaptcha("login");
//       return;
//     }

//     if (rememberMe?.checked)
//       localStorage.setItem("rigforgeRememberedEmail", email);
//     else localStorage.removeItem("rigforgeRememberedEmail");

//     const registered = JSON.parse(
//       localStorage.getItem("rigforgeRegisteredUser") || "null",
//     );
//     const user =
//       registered && registered.email.toLowerCase() === email.toLowerCase()
//         ? registered
//         : { name: "RigForge Kullanıcısı", email, phone: "" };
//     localStorage.setItem("rigforgeUser", JSON.stringify(user));
//     status.style.color = "var(--green)";
//     status.textContent =
//       "Giriş başarılı. Profil sayfasına yönlendiriliyorsunuz...";
//     setTimeout(() => {
//       location.href = "profile.html";
//     }, 700);
//   });

//   const registerForm = document.getElementById("registerForm");
//   registerForm?.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const status = document.getElementById("registerStatus");
//     const password = document.getElementById("registerPassword").value;
//     const confirm = document.getElementById("confirmPassword").value;

//     if (password.length < 6) {
//       status.style.color = "var(--red)";
//       status.textContent = "Şifre en az 6 karakter olmalıdır.";
//       refreshCaptcha("register");
//       return;
//     }
//     if (password !== confirm) {
//       status.style.color = "var(--red)";
//       status.textContent = "Şifreler eşleşmiyor.";
//       refreshCaptcha("register");
//       return;
//     }
//     if (!captchaIsValid("register")) {
//       status.style.color = "var(--red)";
//       status.textContent = "Güvenlik kodu hatalı. Yeni kod oluşturuldu.";
//       refreshCaptcha("register");
//       return;
//     }

//     const user = {
//       name: `${document.getElementById("firstName").value.trim()} ${document.getElementById("lastName").value.trim()}`.trim(),
//       email: document.getElementById("registerEmail").value.trim(),
//       phone: document.getElementById("phone").value.trim(),
//     };
//     localStorage.setItem("rigforgeRegisteredUser", JSON.stringify(user));
//     localStorage.setItem("rigforgeUser", JSON.stringify(user));
//     status.style.color = "var(--green)";
//     status.textContent =
//       "Kayıt başarılı. Profil sayfasına yönlendiriliyorsunuz...";
//     setTimeout(() => {
//       location.href = "profile.html";
//     }, 700);
//   });

//   const googleButton = document.getElementById("googleContinueBtn");
//   googleButton?.addEventListener("click", () => {
//     let overlay = document.getElementById("googleDemoOverlay");
//     if (!overlay) {
//       overlay = document.createElement("div");
//       overlay.id = "googleDemoOverlay";
//       overlay.className = "google-demo-overlay";
//       overlay.innerHTML = `<div class="google-demo-card"><button class="google-close" type="button" aria-label="Kapat">×</button><div class="google-logo">G</div><h3>Google ile devam et</h3><p>Demo hesap seçin</p><button class="google-account" type="button"><span>RK</span><div><strong>RigForge Kullanıcısı</strong><small>demo@rigforge.com</small></div></button><small class="google-note">Bu statik frontend demosudur. Gerçek Google OAuth, .NET tarafında Client ID ile bağlanacaktır.</small></div>`;
//       document.body.appendChild(overlay);
//       const close = () => overlay.remove();
//       overlay.querySelector(".google-close").onclick = close;
//       overlay.onclick = (e) => {
//         if (e.target === overlay) close();
//       };
//       overlay.querySelector(".google-account").onclick = () => {
//         const user = {
//           name: "RigForge Kullanıcısı",
//           email: "demo@rigforge.com",
//           phone: "",
//           provider: "google",
//         };
//         localStorage.setItem("rigforgeUser", JSON.stringify(user));
//         location.href = "profile.html";
//       };
//     }
//   });
// })();


(() => {
  "use strict";

  const API_BASE = "/api/auth";
  const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const captchaValues = {};

  function generateCaptcha(length = 6) {
    let code = "";
    for (let i = 0; i < length; i += 1) {
      code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
    }
    return code;
  }

  function refreshCaptcha(type) {
    const codeElement = document.getElementById(`${type}CaptchaCode`);
    const inputElement = document.getElementById(`${type}CaptchaInput`);
    if (!codeElement || !inputElement) return;
    const code = generateCaptcha();
    captchaValues[type] = code;
    codeElement.textContent = code;
    inputElement.value = "";
  }

  function captchaIsValid(type) {
    const input = document.getElementById(`${type}CaptchaInput`);
    return Boolean(
      input && input.value.trim().toUpperCase() === captchaValues[type],
    );
  }

  document
    .getElementById("refreshLoginCaptcha")
    ?.addEventListener("click", () => refreshCaptcha("login"));
  document
    .getElementById("refreshRegisterCaptcha")
    ?.addEventListener("click", () => refreshCaptcha("register"));
  refreshCaptcha("login");
  refreshCaptcha("register");

  // GİRİŞ YAP (LOGIN) -> C# API ENTEGRASYONU
  const loginForm = document.getElementById("loginForm");
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("loginStatus");
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!captchaIsValid("login")) {
      status.style.color = "var(--red)";
      status.textContent = "Güvenlik kodu hatalı.";
      refreshCaptcha("login");
      return;
    }

    try {
      status.style.color = "#74afff";
      status.textContent = "Giriş yapılıyor...";

      const response = await window.RigForgeApi.fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, sifre: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("rigforgeToken", data.token);
        localStorage.setItem(
          "rigforgeUser",
          JSON.stringify({
            name: data.adSoyad,
            email: data.email,
            role: data.rol,
            phone: data.telefon || "",
          }),
        );

        status.style.color = "var(--green)";
        status.textContent = "Giriş başarılı! Yönlendiriliyorsunuz...";
        setTimeout(() => {
          location.href = data.rol === "Admin" ? "admin.html" : "profile.html";
        }, 700);
      } else {
        status.style.color = "var(--red)";
        status.textContent = data.message || "Giriş başarısız.";
        refreshCaptcha("login");
      }
    } catch (err) {
      status.style.color = "var(--red)";
      status.textContent = err.message || "Sunucuya bağlanılamadı. API açık mı?";
    }
  });

  // KAYIT OL (REGISTER) -> C# API ENTEGRASYONU
  const registerForm = document.getElementById("registerForm");
  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("registerStatus");
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      status.style.color = "var(--red)";
      status.textContent = "Şifreler eşleşmiyor.";
      refreshCaptcha("register");
      return;
    }

    try {
      status.style.color = "#74afff";
      status.textContent = "Kayıt yapılıyor...";

      const response = await window.RigForgeApi.fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: document.getElementById("firstName").value.trim(),
          soyad: document.getElementById("lastName").value.trim(),
          kullaniciAdi: document.getElementById("registerEmail").value.trim(),
          email: document.getElementById("registerEmail").value.trim(),
          sifre: password,
          telefon: document.getElementById("phone").value.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        status.style.color = "var(--green)";
        status.textContent = "Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...";
        setTimeout(() => {
          location.href = "login.html";
        }, 1000);
      } else {
        status.style.color = "var(--red)";
        status.textContent = data.message || "Kayıt oluşturulamadı.";
      }
    } catch (err) {
      status.style.color = "var(--red)";
      status.textContent = err.message || "Sunucu hatası oluştu.";
    }
  });
})();