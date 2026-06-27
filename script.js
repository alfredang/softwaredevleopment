/* ===========================================================
   Forge & Function — enquiry form handling + small niceties
   Vanilla JS, no dependencies.
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const successEl = document.getElementById("form-success");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Field config: which inputs to validate and how.
  const fields = {
    name:    { required: true,  message: "Please enter your name." },
    email:   { required: true,  message: "Please enter your email.", validate: (v) => EMAIL_RE.test(v) ? "" : "Please enter a valid email address." },
    phone:   { required: false },
    service: { required: false },
    message: { required: true,  message: "Please tell us a little about your project." },
  };

  /** Set or clear the inline error for a single field. */
  function setError(id, msg) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`error-${id}`);
    if (!input || !errorEl) return;
    const wrapper = input.closest(".field");
    errorEl.textContent = msg;
    if (wrapper) wrapper.classList.toggle("invalid", Boolean(msg));
    if (msg) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  /** Validate one field by name. Returns true if valid. */
  function validateField(id) {
    const cfg = fields[id];
    const input = document.getElementById(id);
    if (!cfg || !input) return true;
    const value = input.value.trim();

    if (cfg.required && !value) {
      setError(id, cfg.message || "This field is required.");
      return false;
    }
    if (value && typeof cfg.validate === "function") {
      const msg = cfg.validate(value);
      if (msg) { setError(id, msg); return false; }
    }
    setError(id, "");
    return true;
  }

  // Clear a field's error as soon as the user starts fixing it.
  Object.keys(fields).forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      const wrapper = input.closest(".field");
      if (wrapper && wrapper.classList.contains("invalid")) validateField(id);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successEl.hidden = true;

    // Validate every field; collect overall validity.
    let firstInvalid = null;
    const allValid = Object.keys(fields).reduce((ok, id) => {
      const valid = validateField(id);
      if (!valid && !firstInvalid) firstInvalid = id;
      return ok && valid;
    }, true);

    if (!allValid) {
      const el = document.getElementById(firstInvalid);
      if (el) el.focus();
      return;
    }

    // Collect the form data into a plain object.
    const formData = {
      name:    form.name.value.trim(),
      email:   form.email.value.trim(),
      phone:   form.phone.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
    };

    // Placeholder for a real backend call — log to console for now.
    console.log("Enquiry submitted:", formData);

    /*
    // ----- Example: POST the enquiry to a real API endpoint -----
    fetch("https://api.example.com/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => console.log("Saved:", data))
      .catch((err) => console.error("Submission error:", err));
    */

    // Show confirmation and reset the form.
    successEl.hidden = false;
    form.reset();
    successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
