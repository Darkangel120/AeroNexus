
const passwordInput = document.getElementById("passwordInput");
const toggleBtn = document.getElementById("toggleBtn");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const requirements = {
    case: document.getElementById("req-case"),
    number: document.getElementById("req-number"),
    special: document.getElementById("req-special"),
    length: document.getElementById("req-length"),
};
// Toggle password visibility
toggleBtn.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
});
// Validate password
passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    let strength = 0;
    // Check lowercase and uppercase
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasBothCases = hasLowerCase && hasUpperCase;
    if (hasBothCases) {
        requirements.case.classList.add("met");
        strength++;
    } else {
        requirements.case.classList.remove("met");
    }
    // Check number
    const hasNumber = /[0-9]/.test(password);
    if (hasNumber) {
        requirements.number.classList.add("met");
        strength++;
    } else {
        requirements.number.classList.remove("met");
    }
    // Check special character
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasSpecial) {
        requirements.special.classList.add("met");
        strength++;
    } else {
        requirements.special.classList.remove("met");
    }
    // Check length
    const hasLength = password.length >= 8;
    if (hasLength) {
        requirements.length.classList.add("met");
        strength++;
    } else {
        requirements.length.classList.remove("met");
    }
    // Update strength indicator
    strengthBar.className = "strength-bar-fill";
    strengthText.className = "strength-value";
    if (password.length === 0) {
        strengthBar.classList.add("weak");
        strengthText.classList.add("weak");
        strengthText.textContent = "Weak";
    } else if (strength <= 2) {
        strengthBar.classList.add("weak");
        strengthText.classList.add("weak");
        strengthText.textContent = "Weak";
    } else if (strength === 3) {
        strengthBar.classList.add("medium");
        strengthText.classList.add("medium");
        strengthText.textContent = "Medium";
    } else if (strength === 4) {
        strengthBar.classList.add("strong");
        strengthText.classList.add("strong");
        strengthText.textContent = "Strong";
    }
});
