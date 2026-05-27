let pendingFormData = null;

const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userPhoneInput = document.getElementById('userPhone');
const userPasswordInput = document.getElementById('userPassword');
const userConfirmPasswordInput = document.getElementById('userConfirmPassword');
const registerForm = document.getElementById('registerForm');

const privacyModal = document.getElementById('privacyModal');
const agreeCheckbox = document.getElementById('agreeCheckbox');
const continueBtn = document.getElementById('continueBtn');
const cancelModalBtn = document.getElementById('cancelModal');
const closeModalBtn = document.getElementById('closeModalBtn');

const avatarUpload = document.getElementById('avatarUpload');
const avatarImg = document.getElementById('avatarImg');
const successMessage = document.getElementById('successMessage');

function clearErrors() {
    document.querySelectorAll('.register-error').forEach(el => el.remove());

    document.querySelectorAll('.register-input-error')
        .forEach(el => el.classList.remove('register-input-error'));
}

function showError(inputElement, message) {
    const formGroup = inputElement.closest('.register-form-group');

    const existingError = formGroup.querySelector('.register-error');

    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');

    errorDiv.className = 'register-error';

    errorDiv.innerHTML = `
    <i class="fa-solid fa-circle-exclamation"></i> ${message}
  `;

    formGroup.appendChild(errorDiv);

    inputElement.classList.add('register-input-error');
}

function validateForm() {
    clearErrors();

    let isValid = true;

    // NAME
    const name = userNameInput.value.trim();

    if (!name) {
        showError(userNameInput, 'Введите имя');
        isValid = false;
    } else if (name.length < 2) {
        showError(userNameInput, 'Имя должно содержать хотя бы 2 символа');
        isValid = false;
    }

    // EMAIL
    const email = userEmailInput.value.trim();

    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;

    if (!email) {
        showError(userEmailInput, 'Введите email');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError(userEmailInput, 'Введите корректный email');
        isValid = false;
    }

    // PHONE
    const phone = userPhoneInput.value.trim();

    const phoneRegex = /^[\+\d\s\-\(\)]{8,20}$/;

    if (!phone) {
        showError(userPhoneInput, 'Введите номер телефона');
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        showError(userPhoneInput, 'Введите корректный номер');
        isValid = false;
    }

    // PASSWORD
    const password = userPasswordInput.value;

    if (!password) {
        showError(userPasswordInput, 'Введите пароль');
        isValid = false;
    } else if (password.length < 6) {
        showError(userPasswordInput, 'Минимум 6 символов');
        isValid = false;
    }

    // CONFIRM PASSWORD
    const confirmPassword = userConfirmPasswordInput.value;

    if (!confirmPassword) {
        showError(userConfirmPasswordInput, 'Подтвердите пароль');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(userConfirmPasswordInput, 'Пароли не совпадают');
        isValid = false;
    }

    return isValid;
}

function collectFormData() {
    return {
        name: userNameInput.value.trim(),
        email: userEmailInput.value.trim(),
        phone: userPhoneInput.value.trim(),
        password: userPasswordInput.value,
        avatarSrc: avatarImg.src
    };
}

function openPrivacyModal(formData) {
    pendingFormData = formData;

    privacyModal.classList.add('show');

    document.body.style.overflow = 'hidden';

    agreeCheckbox.checked = false;
    continueBtn.disabled = true;
}

function closePrivacyModal() {
    privacyModal.classList.remove('show');

    document.body.style.overflow = '';

    pendingFormData = null;
}

function showSuccess() {
    successMessage.classList.remove('hidden');

    successMessage.style.display = 'flex';

    registerForm.reset();

    avatarImg.src = 'https://i.pravatar.cc/150?img=12';

    setTimeout(() => {
        successMessage.classList.add('hidden');
        successMessage.style.display = 'none';
    }, 4000);
}

function finishRegistration(userData) {

    closePrivacyModal();

    // сохраняем пользователя
    localStorage.setItem('token', 'registered_user');

    localStorage.setItem('userName', userData.name);

    localStorage.setItem('userEmail', userData.email);

    showSuccess();

    console.log('Регистрация:', userData);

    // переход на loading
    setTimeout(() => {

        window.location.href = 'loading.html';

    }, 1500);

}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    openPrivacyModal(collectFormData());
});

agreeCheckbox.addEventListener('change', () => {
    continueBtn.disabled = !agreeCheckbox.checked;
});

continueBtn.addEventListener('click', () => {
    if (!agreeCheckbox.checked) return;

    if (pendingFormData) {
        finishRegistration(pendingFormData);
    }
});

cancelModalBtn.addEventListener('click', closePrivacyModal);
closeModalBtn.addEventListener('click', closePrivacyModal);

privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        closePrivacyModal();
    }
});

avatarUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
            avatarImg.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

const allInputs = [
    userNameInput,
    userEmailInput,
    userPhoneInput,
    userPasswordInput,
    userConfirmPasswordInput
];

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('register-input-error')) {

            input.classList.remove('register-input-error');

            const errorMsg = input
                .closest('.register-form-group')
                ?.querySelector('.register-error');

            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
});