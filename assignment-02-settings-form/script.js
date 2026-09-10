/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  fullName(value) {
    if (!value.trim()) {
      return "Full name is required.";
    }
    return "";
  },

  email(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Email is required.";
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  },

  password(value) {
    if (!value) {
      return "Password is required.";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }
    return "";
  },
};

function validateField(name, value) {
  return validators[name] ? validators[name](value) : "";
}

function getFormValues(form) {
  const formData = new FormData(form);

  return {
    fullName: formData.get("fullName") || "",
    email: formData.get("email") || "",
    password: formData.get("password") || "",
    theme: formData.get("theme") || "light",
  };
}

function validateForm(values) {
  return {
    fullName: validateField("fullName", values.fullName),
    email: validateField("email", values.email),
    password: validateField("password", values.password),
  };
}

function isFormValid(errors) {
  return Object.values(errors).every((message) => message === "");
}

/* -------------------------------------------------------------------------- */
/* UI helpers                                                                 */
/* -------------------------------------------------------------------------- */

const FIELD_NAMES = ["fullName", "email", "password"];

function getFieldElements(form, fieldName) {
  return {
    input: form.elements[fieldName],
    error: document.getElementById(`${fieldName}-error`),
  };
}

function updateFieldUI(form, fieldName, errorMessage, showError) {
  const { input, error } = getFieldElements(form, fieldName);
  const hasError = showError && errorMessage;

  input.classList.toggle("input--invalid", Boolean(hasError));
  input.setAttribute("aria-invalid", hasError ? "true" : "false");
  error.textContent = hasError ? errorMessage : "";
}

function updateFormUI(form, errors, touched) {
  FIELD_NAMES.forEach((fieldName) => {
    updateFieldUI(form, fieldName, errors[fieldName], touched[fieldName]);
  });
}

function setSubmitEnabled(submitButton, enabled) {
  submitButton.disabled = !enabled;
  submitButton.setAttribute("aria-disabled", enabled ? "false" : "true");
}

function showSuccessMessage(successMessage) {
  successMessage.hidden = false;
}

function hideSuccessMessage(successMessage) {
  successMessage.hidden = true;
}

/* -------------------------------------------------------------------------- */
/* Form controller                                                            */
/* -------------------------------------------------------------------------- */

function createInitialTouchedState() {
  return {
    fullName: false,
    email: false,
    password: false,
  };
}

function initSettingsForm() {
  const form = document.getElementById("settings-form");
  const submitButton = document.getElementById("submit-btn");
  const successMessage = document.getElementById("success-message");
  let touched = createInitialTouchedState();

  function refreshUI() {
    const values = getFormValues(form);
    const errors = validateForm(values);

    updateFormUI(form, errors, touched);
    setSubmitEnabled(submitButton, isFormValid(errors));
  }

  function markAllFieldsTouched() {
    touched = {
      fullName: true,
      email: true,
      password: true,
    };
  }

  FIELD_NAMES.forEach((fieldName) => {
    const input = form.elements[fieldName];

    input.addEventListener("input", () => {
      hideSuccessMessage(successMessage);
      refreshUI();
    });

    input.addEventListener("blur", () => {
      touched[fieldName] = true;
      refreshUI();
    });
  });

  form.querySelectorAll('input[name="theme"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      hideSuccessMessage(successMessage);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    markAllFieldsTouched();

    const values = getFormValues(form);
    const errors = validateForm(values);

    updateFormUI(form, errors, touched);

    if (!isFormValid(errors)) {
      setSubmitEnabled(submitButton, false);
      return;
    }

    const settings = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
      theme: values.theme,
    };

    console.log("Submitted settings:", settings);
    showSuccessMessage(successMessage);
  });

  refreshUI();
}

document.addEventListener("DOMContentLoaded", initSettingsForm);
