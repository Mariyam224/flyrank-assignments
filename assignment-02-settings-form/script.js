const form = document.getElementById("settings-form");
const formStatus = document.getElementById("form-status");
const bioField = document.getElementById("bio");
const bioCount = document.getElementById("bio-count");

const patterns = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  phone: /^\+?[\d\s().-]{7,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  url: /^https?:\/\/.+\..+/i,
};

const validators = {
  displayName: (value) => {
    if (!value.trim()) return "Display name is required.";
    if (value.trim().length < 2) return "Display name must be at least 2 characters.";
    if (value.trim().length > 50) return "Display name must be 50 characters or fewer.";
    return "";
  },

  email: (value) => {
    if (!value.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    return "";
  },

  username: (value) => {
    if (!value.trim()) return "Username is required.";
    if (!patterns.username.test(value)) {
      return "Username must be 3–20 characters and use only letters, numbers, or underscores.";
    }
    return "";
  },

  bio: (value) => {
    if (value.length > 200) return "Bio must be 200 characters or fewer.";
    return "";
  },

  phone: (value) => {
    if (!value.trim()) return "";
    if (!patterns.phone.test(value)) return "Enter a valid phone number.";
    return "";
  },

  website: (value) => {
    if (!value.trim()) return "";
    if (!patterns.url.test(value)) return "Enter a valid URL starting with http:// or https://.";
    return "";
  },

  password: (value, formData) => {
    const confirmValue = formData.get("confirmPassword");
    if (!value && !confirmValue) return "";

    if (!value) return "Enter a new password or clear the confirmation field.";
    if (!patterns.password.test(value)) {
      return "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    }
    return "";
  },

  confirmPassword: (value, formData) => {
    const passwordValue = formData.get("password");
    if (!passwordValue && !value) return "";
    if (value !== passwordValue) return "Passwords do not match.";
    return "";
  },

  theme: (value) => {
    if (!value) return "Please select a theme.";
    return "";
  },
};

function getFieldElements(name) {
  const input = form.elements[name];
  const errorEl = document.getElementById(`${name.replace(/([A-Z])/g, "-$1").toLowerCase()}-error`);

  return { input, errorEl };
}

function setFieldError(name, message) {
  const { input, errorEl } = getFieldElements(name);

  if (!input || !errorEl) return;

  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message;
}

function validateField(name, formData) {
  const value = formData.get(name) ?? "";
  const message = validators[name] ? validators[name](value, formData) : "";
  setFieldError(name, message);
  return !message;
}

function validateForm() {
  const formData = new FormData(form);
  const fieldsToValidate = Object.keys(validators);
  let isValid = true;

  fieldsToValidate.forEach((name) => {
    const fieldIsValid = validateField(name, formData);
    if (!fieldIsValid) isValid = false;
  });

  return isValid;
}

function clearFormStatus() {
  formStatus.textContent = "";
  formStatus.classList.remove("success", "error");
}

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.classList.remove("success", "error");
  formStatus.classList.add(type);
}

function updateBioCount() {
  bioCount.textContent = String(bioField.value.length);
}

function handleReset() {
  form.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
    field.setAttribute("aria-invalid", "false");
  });

  form.querySelectorAll(".error-message").forEach((errorEl) => {
    errorEl.textContent = "";
  });

  clearFormStatus();
  updateBioCount();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormStatus();

  if (!validateForm()) {
    showFormStatus("Please fix the errors below before saving.", "error");
    const firstInvalid = form.querySelector(".invalid");
    firstInvalid?.focus();
    return;
  }

  const formData = new FormData(form);
  const notifications = formData.getAll("notifications");

  const settings = {
    displayName: formData.get("displayName").trim(),
    email: formData.get("email").trim(),
    username: formData.get("username").trim(),
    bio: formData.get("bio").trim(),
    phone: formData.get("phone").trim(),
    website: formData.get("website").trim(),
    theme: formData.get("theme"),
    language: formData.get("language"),
    notifications,
    passwordUpdated: Boolean(formData.get("password")),
  };

  console.log("Settings saved:", settings);
  showFormStatus("Settings saved successfully!", "success");
});

form.addEventListener("reset", handleReset);

form.addEventListener("blur", (event) => {
  const { name } = event.target;
  if (!name || !validators[name]) return;

  const formData = new FormData(form);
  validateField(name, formData);

  if (name === "password" || name === "confirmPassword") {
    validateField("password", formData);
    validateField("confirmPassword", formData);
  }
}, true);

bioField.addEventListener("input", updateBioCount);

updateBioCount();
