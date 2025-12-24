let keys = { n: null, e: null, d: null };
const spinner = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#fff0f5",
  color: "#831843",
  didOpen: (toast) => {
    toast.addEventListener(
      "mouseenter",
      Swal.stopTimer
    );
    toast.addEventListener(
      "mouseleave",
      Swal.resumeTimer
    );
  },
});

function renderSteps(containerId, stepsArray) {
  const container =
    document.getElementById(containerId);
  container.innerHTML = "";

  stepsArray.forEach((step, index) => {
    const stepDiv = document.createElement("div");
    stepDiv.className =
      "flex gap-3 p-3 bg-white/60 border border-white rounded-xl text-xs text-gray-600 font-mono items-start animate-fade-in";
    stepDiv.style.animationDelay = `${
      index * 50
    }ms`;

    stepDiv.innerHTML = `
        <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-fem-primary text-white rounded-full text-[10px] font-bold mt-0.5">
            ${index + 1}
        </span>
        <span class="break-words w-full leading-relaxed">${step}</span>
    `;
    container.appendChild(stepDiv);
  });
}

async function generateKeys() {
  const p = parseInt(
    document.getElementById("primeP").value
  );
  const q = parseInt(
    document.getElementById("primeQ").value
  );
  const btn = document.getElementById(
    "generateBtn"
  );
  const originalText = btn.innerHTML;

  if (isNaN(p) || isNaN(q)) {
    Swal.fire({
      icon: "warning",
      title: "Input Kosong",
      text: "Harap isi bilangan prima P dan Q terlebih dahulu ya! ✨",
      confirmButtonColor: "#f472b6",
    });
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `${spinner} Meracik...`;
  btn.classList.add("opacity-75");

  try {
    const response = await fetch(
      "/generate_keys",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p, q }),
      }
    );
    const data = await response.json();

    if (data.error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: data.error,
        confirmButtonColor: "#a78bfa",
      });
    } else {
      keys = { n: data.n, e: data.e, d: data.d };
      
      // Update Top Stats Cards
      document.getElementById(
        "statN"
      ).textContent = data.n;
      document.getElementById(
        "statE"
      ).textContent = `(${data.e}, ${data.n})`;
      document.getElementById(
        "statD"
      ).textContent = `(${data.d}, ${data.n})`;

      renderSteps("keyStepsContent", data.steps);
      document
        .getElementById("keySteps")
        .classList.remove("hidden");

      Toast.fire({
        icon: "success",
        title: "Kunci berhasil dibuat! 🌸",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error Sistem",
      text: error.message,
      confirmButtonColor: "#f472b6",
    });
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.classList.remove("opacity-75");
  }
}

async function encrypt() {
  if (!keys.e || !keys.n) {
    Swal.fire({
      icon: "info",
      title: "Belum ada kunci",
      text: "Generate kunci dulu di panel kiri ya! 🌸",
      confirmButtonColor: "#f472b6",
    });
    return;
  }
  const plaintext =
    document.getElementById("plaintext").value;
  if (!plaintext) {
    Swal.fire({
      icon: "warning",
      title: "Pesan Kosong",
      text: "Tuliskan pesan rahasia dulu! 💌",
      confirmButtonColor: "#a78bfa",
    });
    return;
  }

  const btn =
    document.getElementById("encryptBtn");
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `${spinner} ...`;

  try {
    const response = await fetch("/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plaintext,
        e: keys.e,
        n: keys.n,
      }),
    });
    const data = await response.json();
    const cipherStr = data.ciphertext.join(" ");

    document.getElementById(
      "ciphertext"
    ).textContent = cipherStr;
    document
      .getElementById("encryptResult")
      .classList.remove("hidden");
    document.getElementById(
      "ciphertextInput"
    ).value = cipherStr; // Auto fill decrypt input
    renderSteps(
      "encryptStepsContent",
      data.steps
    );
    document
      .getElementById("encryptSteps")
      .classList.remove("hidden");

    Toast.fire({
      icon: "success",
      title: "Pesan dikunci! 🔒",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: error.message,
      confirmButtonColor: "#f472b6",
    });
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

async function decrypt() {
  const dInput = document.getElementById("inputD").value;
  const nInput = document.getElementById("inputN").value;

  if (!dInput || !nInput) {
    Swal.fire({
      icon: "warning",
      title: "Kunci Kosong",
      text: "Masukkan Private Key (d) dan Modulus (n) dulu! 🔑",
      confirmButtonColor: "#a78bfa",
    });
    return;
  }

  const d = parseInt(dInput);
  const n = parseInt(nInput);
  const cipherVal = document.getElementById(
    "ciphertextInput"
  ).value;
  if (!cipherVal) {
    Swal.fire({
      icon: "warning",
      title: "Input Kosong",
      text: "Masukkan kode angka dulu! 🔢",
      confirmButtonColor: "#a78bfa",
    });
    return;
  }

  const cipherArray = cipherVal
    .trim()
    .split(/\s+/)
    .map((num) => parseInt(num));
  const btn =
    document.getElementById("decryptBtn");
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = `${spinner} ...`;

  try {
    const response = await fetch("/decrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ciphertext: cipherArray,
        d: d,
        n: n,
      }),
    });
    const data = await response.json();

    document.getElementById(
      "decryptedText"
    ).textContent = data.plaintext;
    document
      .getElementById("decryptResult")
      .classList.remove("hidden");
    renderSteps(
      "decryptStepsContent",
      data.steps
    );
    document
      .getElementById("decryptSteps")
      .classList.remove("hidden");

    Toast.fire({
      icon: "success",
      title: "Pesan dibuka! 🔓",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal Dekripsi",
      text: "Kode salah atau kunci tidak cocok.",
      confirmButtonColor: "#f472b6",
    });
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

function switchTab(tab) {
  const encryptBtn = document.getElementById(
    "tab-encrypt-btn"
  );
  const decryptBtn = document.getElementById(
    "tab-decrypt-btn"
  );
  const encryptContent =
    document.getElementById("encryptTab");
  const decryptContent =
    document.getElementById("decryptTab");

  const activeClass = [
    "bg-white",
    "text-fem-secondary",
    "shadow-sm",
  ];
  const inactiveClass = [
    "text-gray-500",
    "hover:text-gray-700",
  ];

  if (tab === "encrypt") {
    encryptBtn.classList.add(...activeClass);
    encryptBtn.classList.remove(...inactiveClass);
    decryptBtn.classList.remove(...activeClass);
    decryptBtn.classList.add(...inactiveClass);
    encryptContent.classList.remove("hidden");
    decryptContent.classList.add("hidden");
  } else {
    decryptBtn.classList.add(...activeClass);
    decryptBtn.classList.remove(...inactiveClass);
    encryptBtn.classList.remove(...activeClass);
    encryptBtn.classList.add(...inactiveClass);
    decryptContent.classList.remove("hidden");
    encryptContent.classList.add("hidden");
  }
}
