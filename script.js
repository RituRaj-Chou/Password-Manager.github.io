
        let CORRECT_PASSWORD = localStorage.getItem('masterPassword') || "RituRaj@#1";
        let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        let currentEditingId = null;
        let loginAttempts = 0;
        let isLockedOut = false;
        let lockoutTimeout = null;
        const ALLOWED_EMAILS = ['hackerraj592@gmail.com', 'choudhurygokul7@gmail.com'];

        // Login elements
        const loginModal = document.getElementById('loginModal');
        const loadingContainer = document.getElementById('loadingContainer');
        const welcomeContainer = document.getElementById('welcomeContainer');
        const loginPassword = document.getElementById('loginPassword');
        const loginEmail = document.getElementById('loginEmail');
        const loginBtn = document.getElementById('loginBtn');
        const submitEmailBtn = document.getElementById('submitEmailBtn');
        const resetPasswordBtn = document.getElementById('resetPasswordBtn');
        const loginError = document.getElementById('loginError');
        const loginSuccess = document.getElementById('loginSuccess');
        const lockoutMessage = document.getElementById('lockoutMessage');
        const countdownTimer = document.getElementById('countdownTimer');

        // Login sections
        const passwordLoginSection = document.getElementById('passwordLoginSection');
        const emailLoginSection = document.getElementById('emailLoginSection');
        const resetPasswordSection = document.getElementById('resetPasswordSection');

        // Links
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const backToPasswordLink = document.getElementById('backToPasswordLink');
        const backToEmailLink = document.getElementById('backToEmailLink');

        // Password reset elements
        const newMasterPassword = document.getElementById('newMasterPassword');
        const confirmMasterPassword = document.getElementById('confirmMasterPassword');
        const newMasterPasswordStrengthBar = document.getElementById('newMasterPasswordStrengthBar');
        const resetPasswordError = document.getElementById('resetPasswordError');

        // Main app elements
        const mainContent = document.getElementById('mainContent');
        const addProductBtn = document.getElementById('addProductBtn');
        const addFirstPasswordBtn = document.getElementById('addFirstPasswordBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const addProductModal = document.getElementById('addProductModal');
        const viewPasswordModal = document.getElementById('viewPasswordModal');
        const settingsModal = document.getElementById('settingsModal');
        const closeModal = document.getElementById('closeModal');
        const closeViewModal = document.getElementById('closeViewModal');
        const closeViewModalBtn = document.getElementById('closeViewModalBtn');
        const closeSettingsModal = document.getElementById('closeSettingsModal');
        const cancelAdd = document.getElementById('cancelAdd');
        const cancelSettings = document.getElementById('cancelSettings');
        const passwordTableBody = document.getElementById('passwordTableBody');
        const emptyState = document.getElementById('emptyState');
        const productForm = document.getElementById('productForm');
        const settingsForm = document.getElementById('settingsForm');
        const submitLoading = document.getElementById('submitLoading');
        const submitText = document.getElementById('submitText');
        const passwordInput = document.getElementById('productPassword');
        const strengthBar = document.getElementById('strengthBar');
        const generatePasswordBtn = document.getElementById('generatePassword');
        const copyPasswordBtn = document.getElementById('copyPasswordBtn');
        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const settingsError = document.getElementById('settingsError');
        const settingsSubmitLoading = document.getElementById('settingsSubmitLoading');
        const settingsSubmitText = document.getElementById('settingsSubmitText');
        const newPasswordStrengthBar = document.getElementById('newPasswordStrengthBar');

        document.addEventListener('DOMContentLoaded', () => {
            // Show loading animation first
            loadingContainer.style.display = 'flex';

            setTimeout(() => {
                loadingContainer.style.display = 'none';
                document.body.style.overflow = 'auto';
                // Show login modal after loading animation
                if (sessionStorage.getItem('loggedIn') === 'true') {
                    loginModal.style.display = 'none';
                    mainContent.style.display = 'block';
                    initializeApp();
                } else {
                    loginModal.style.display = 'flex';
                    const lockoutEnd = localStorage.getItem('lockoutEnd');
                    if (lockoutEnd && new Date().getTime() < parseInt(lockoutEnd)) {
                        startLockoutTimer(parseInt(lockoutEnd));
                    }
                }
            }, 3500);

            // Event listeners for login flow
            loginBtn.addEventListener('click', handlePasswordLogin);
            loginPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handlePasswordLogin();
                }
            });

            submitEmailBtn.addEventListener('click', handleEmailSubmit);
            loginEmail.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleEmailSubmit();
                }
            });

            resetPasswordBtn.addEventListener('click', handlePasswordReset);
            newMasterPassword.addEventListener('input', updateNewMasterPasswordStrength);
            confirmMasterPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handlePasswordReset();
                }
            });

            // Navigation between login sections
            forgotPasswordLink.addEventListener('click', showEmailLogin);
            backToPasswordLink.addEventListener('click', showPasswordLogin);
            backToEmailLink.addEventListener('click', showEmailLogin);
        });

        function showPasswordLogin() {
            passwordLoginSection.style.display = 'block';
            emailLoginSection.style.display = 'none';
            resetPasswordSection.style.display = 'none';
            loginError.style.display = 'none';
            loginSuccess.style.display = 'none';
            resetPasswordError.style.display = 'none';
            loginPassword.value = '';
            loginEmail.value = '';
            newMasterPassword.value = '';
            confirmMasterPassword.value = '';
            newMasterPasswordStrengthBar.style.width = '0%';
        }

        function showEmailLogin(e) {
            if (e) e.preventDefault();
            passwordLoginSection.style.display = 'none';
            emailLoginSection.style.display = 'block';
            resetPasswordSection.style.display = 'none';
            loginError.style.display = 'none';
            loginSuccess.style.display = 'none';
            resetPasswordError.style.display = 'none';
            loginEmail.focus();
        }

        function showResetPassword() {
            passwordLoginSection.style.display = 'none';
            emailLoginSection.style.display = 'none';
            resetPasswordSection.style.display = 'block';
            loginError.style.display = 'none';
            loginSuccess.style.display = 'none';
            resetPasswordError.style.display = 'none';
            newMasterPassword.focus();
        }

        function handlePasswordLogin() {
            if (isLockedOut) return;

            const enteredPassword = loginPassword.value.trim();
            if (enteredPassword === CORRECT_PASSWORD) {
                loginAttempts = 0;
                localStorage.removeItem('lockoutEnd');
                loginError.style.display = 'none';
                loginSuccess.style.display = 'block';
                loginModal.style.display = 'none';
                welcomeContainer.style.display = 'flex';
                setTimeout(() => {
                    welcomeContainer.style.display = 'none';
                    sessionStorage.setItem('loggedIn', 'true');
                    mainContent.style.display = 'block';
                    initializeApp();
                }, 3500);
            } else {
                loginAttempts++;
                loginSuccess.style.display = 'none';
                loginError.style.display = 'block';
                loginPassword.classList.add('shake');
                setTimeout(() => {
                    loginPassword.classList.remove('shake');
                }, 500);
                loginPassword.value = '';
                loginPassword.focus();
            }

            if (loginAttempts >= 3) {
                isLockedOut = true;
                loginBtn.disabled = true;
                loginError.style.display = 'none';
                lockoutMessage.style.display = 'block';
                const lockoutEndTime = new Date().getTime() + 3 * 60 * 1000;
                localStorage.setItem('lockoutEnd', lockoutEndTime);
                startLockoutTimer(lockoutEndTime);
            }
        }

        function handleEmailSubmit() {
            if (isLockedOut) return;

            const enteredEmail = loginEmail.value.trim().toLowerCase();
            if (ALLOWED_EMAILS.includes(enteredEmail)) {
                loginAttempts = 0;
                localStorage.removeItem('lockoutEnd');
                loginError.style.display = 'none';
                showResetPassword();
            } else {
                loginAttempts++;
                loginError.style.display = 'block';
                loginError.textContent = 'Invalid email. Please try again.';
                loginEmail.classList.add('shake');
                setTimeout(() => {
                    loginEmail.classList.remove('shake');
                }, 500);
                loginEmail.value = '';
                loginEmail.focus();
            }

            if (loginAttempts >= 3) {
                isLockedOut = true;
                submitEmailBtn.disabled = true;
                loginError.style.display = 'none';
                lockoutMessage.style.display = 'block';
                const lockoutEndTime = new Date().getTime() + 3 * 60 * 1000;
                localStorage.setItem('lockoutEnd', lockoutEndTime);
                startLockoutTimer(lockoutEndTime);
            }
        }

        function handlePasswordReset() {
            if (isLockedOut) return;

            const newPass = newMasterPassword.value.trim();
            const confirmPass = confirmMasterPassword.value.trim();

            if (newPass !== confirmPass) {
                resetPasswordError.textContent = 'Passwords do not match';
                resetPasswordError.style.display = 'block';
                confirmMasterPassword.classList.add('shake');
                setTimeout(() => {
                    confirmMasterPassword.classList.remove('shake');
                }, 500);
                return;
            }

            if (newPass.length < 8 || !/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass) || !/[^A-Za-z0-9]/.test(newPass)) {
                resetPasswordError.textContent = 'Password must be at least 8 characters with letters, numbers, and symbols';
                resetPasswordError.style.display = 'block';
                newMasterPassword.classList.add('shake');
                setTimeout(() => {
                    newMasterPassword.classList.remove('shake');
                }, 500);
                return;
            }

            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerHTML = '<span class="loading"></span> Resetting...';

            setTimeout(() => {
                CORRECT_PASSWORD = newPass;
                localStorage.setItem('masterPassword', newPass);
                resetPasswordBtn.disabled = false;
                resetPasswordBtn.innerHTML = '<i class="fas fa-check"></i> Password Reset!';
                loginAttempts = 0;
                localStorage.removeItem('lockoutEnd');
                loginError.style.display = 'none';
                resetPasswordError.style.display = 'none';

                setTimeout(() => {
                    loginModal.style.display = 'none';
                    welcomeContainer.style.display = 'flex';
                    setTimeout(() => {
                        welcomeContainer.style.display = 'none';
                        sessionStorage.setItem('loggedIn', 'true');
                        mainContent.style.display = 'block';
                        initializeApp();
                        resetPasswordBtn.innerHTML = '<i class="fas fa-key"></i> Reset Password';
                        showPasswordLogin();
                        newMasterPassword.value = '';
                        confirmMasterPassword.value = '';
                        newMasterPasswordStrengthBar.style.width = '0%';
                    }, 3500);
                }, 500);
            }, 800);
        }

        function startLockoutTimer(lockoutEndTime) {
            isLockedOut = true;
            loginBtn.disabled = true;
            submitEmailBtn.disabled = true;
            resetPasswordBtn.disabled = true;
            lockoutMessage.style.display = 'block';
            loginPassword.disabled = true;
            loginEmail.disabled = true;
            newMasterPassword.disabled = true;
            confirmMasterPassword.disabled = true;

            function updateTimer() {
                const timeLeft = lockoutEndTime - new Date().getTime();
                if (timeLeft <= 0) {
                    isLockedOut = false;
                    loginBtn.disabled = false;
                    submitEmailBtn.disabled = false;
                    resetPasswordBtn.disabled = false;
                    loginPassword.disabled = false;
                    loginEmail.disabled = false;
                    newMasterPassword.disabled = false;
                    confirmMasterPassword.disabled = false;
                    lockoutMessage.style.display = 'none';
                    loginAttempts = 0;
                    localStorage.removeItem('lockoutEnd');
                    clearInterval(lockoutTimeout);
                    return;
                }

                const minutes = Math.floor(timeLeft / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);
                countdownTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
            }

            updateTimer();
            lockoutTimeout = setInterval(updateTimer, 1000);
        }

        function updateNewMasterPasswordStrength() {
            const password = newMasterPassword.value;
            let strength = 0;
            if (password.length > 0) strength += 20;
            if (password.length >= 8) strength += 20;
            if (/[A-Z]/.test(password)) strength += 20;
            if (/[0-9]/.test(password)) strength += 20;
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;
            newMasterPasswordStrengthBar.style.width = strength + '%';
            if (strength < 40) {
                newMasterPasswordStrengthBar.style.backgroundColor = 'var(--danger-color)';
            } else if (strength < 80) {
                newMasterPasswordStrengthBar.style.backgroundColor = 'var(--warning-color)';
            } else {
                newMasterPasswordStrengthBar.style.backgroundColor = 'var(--secondary-color)';
            }
        }

        function initializeApp() {
            renderPasswordTable();
            updateEmptyState();

            addProductBtn.addEventListener('click', openAddModal);
            addFirstPasswordBtn.addEventListener('click', openAddModal);
            settingsBtn.addEventListener('click', openSettingsModal);
            closeModal.addEventListener('click', closeAddModal);
            closeViewModal.addEventListener('click', closeViewModalFunc);
            closeViewModalBtn.addEventListener('click', closeViewModalFunc);
            closeSettingsModal.addEventListener('click', closeSettingsModalFunc);
            cancelAdd.addEventListener('click', closeAddModal);
            cancelSettings.addEventListener('click', closeSettingsModalFunc);
            productForm.addEventListener('submit', handleFormSubmit);
            settingsForm.addEventListener('submit', handleSettingsSubmit);
            generatePasswordBtn.addEventListener('click', generateStrongPassword);
            copyPasswordBtn.addEventListener('click', copyPasswordToClipboard);
            passwordInput.addEventListener('input', updatePasswordStrength);
            newPassword.addEventListener('input', updateNewPasswordStrength);

            window.addEventListener('click', (e) => {
                if (e.target === addProductModal) closeAddModal();
                if (e.target === viewPasswordModal) closeViewModalFunc();
                if (e.target === settingsModal) closeSettingsModalFunc();
            });
        }

        function renderPasswordTable() {
            passwordTableBody.innerHTML = '';

            if (passwords.length === 0) {
                updateEmptyState();
                return;
            }

            passwords.forEach((password, index) => {
                const tr = document.createElement('tr');
                tr.style.animationDelay = `${index * 0.1}s`;
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${password.name}</td>
                    <td>${password.username}</td>
                    <td class="password-field">
                        <span class="password-text" data-password="${password.password}">••••••••</span>
                        <i class="fas fa-eye toggle-password" onclick="togglePasswordVisibility(this)"></i>
                    </td>
                    <td>
                        <button class="action-btn view-btn" title="View" onclick="viewPassword(${index})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" title="Edit" onclick="editPassword(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" title="Delete" onclick="deletePassword(${index})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                passwordTableBody.appendChild(tr);
            });
        }

        function updateEmptyState() {
            if (passwords.length === 0) {
                document.querySelector('.password-table').style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                document.querySelector('.password-table').style.display = 'table';
                emptyState.style.display = 'none';
            }
        }

        function openAddModal() {
            currentEditingId = null;
            document.getElementById('productForm').reset();
            strengthBar.style.width = '0%';
            submitText.textContent = 'Save Password';
            document.querySelector('.modal-title').textContent = 'Add New Password';
            addProductModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.getElementById('productName').focus();
            }, 300);
        }

        function closeAddModal() {
            addProductModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function openViewModal() {
            viewPasswordModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeViewModalFunc() {
            viewPasswordModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function openSettingsModal() {
            document.getElementById('settingsForm').reset();
            newPasswordStrengthBar.style.width = '0%';
            settingsError.style.display = 'none';
            settingsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.getElementById('currentPassword').focus();
            }, 300);
        }

        function closeSettingsModalFunc() {
            settingsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function viewPassword(index) {
            const password = passwords[index];
            document.getElementById('viewAccountName').textContent = password.name;
            document.getElementById('viewUsername').textContent = password.username;
            document.getElementById('viewPassword').textContent = '••••••••';
            document.getElementById('viewPassword').setAttribute('data-password', password.password);
            openViewModal();
        }

        function editPassword(index) {
            currentEditingId = index;
            const password = passwords[index];
            document.getElementById('productName').value = password.name;
            document.getElementById('productUsername').value = password.username;
            document.getElementById('productPassword').value = password.password;
            updatePasswordStrength();
            document.querySelector('.modal-title').textContent = 'Edit Password';
            submitText.textContent = 'Update Password';
            addProductModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.getElementById('productName').focus();
            }, 300);
        }

        function deletePassword(index) {
            if (confirm('Are you sure you want to delete this password?')) {
                const row = passwordTableBody.children[index];
                row.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    passwords.splice(index, 1);
                    savePasswords();
                    renderPasswordTable();
                    updateEmptyState();
                }, 300);
            }
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('productName').value.trim();
            const username = document.getElementById('productUsername').value.trim();
            const password = document.getElementById('productPassword').value;

            submitLoading.style.display = 'inline-block';
            submitText.textContent = 'Saving...';

            setTimeout(() => {
                if (currentEditingId !== null) {
                    passwords[currentEditingId] = { name, username, password };
                } else {
                    passwords.push({ name, username, password });
                }
                savePasswords();
                submitLoading.style.display = 'none';
                submitText.textContent = 'Saved!';

                setTimeout(() => {
                    productForm.reset();
                    strengthBar.style.width = '0%';
                    closeAddModal();
                    renderPasswordTable();
                    updateEmptyState();
                    submitText.textContent = currentEditingId !== null ? 'Update Password' : 'Save Password';
                }, 500);
            }, 800);
        }

        function handleSettingsSubmit(e) {
            e.preventDefault();
            const current = currentPassword.value.trim();
            const newPass = newPassword.value.trim();
            const confirmPass = confirmPassword.value.trim();

            if (current !== CORRECT_PASSWORD) {
                settingsError.textContent = 'Current password is incorrect';
                settingsError.style.display = 'block';
                currentPassword.classList.add('shake');
                setTimeout(() => {
                    currentPassword.classList.remove('shake');
                }, 500);
                return;
            }

            if (newPass !== confirmPass) {
                settingsError.textContent = 'New passwords do not match';
                settingsError.style.display = 'block';
                confirmPassword.classList.add('shake');
                setTimeout(() => {
                    confirmPassword.classList.remove('shake');
                }, 500);
                return;
            }

            if (newPass.length < 8 || !/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass) || !/[^A-Za-z0-9]/.test(newPass)) {
                settingsError.textContent = 'New password must be at least 8 characters with letters, numbers, and symbols';
                settingsError.style.display = 'block';
                newPassword.classList.add('shake');
                setTimeout(() => {
                    newPassword.classList.remove('shake');
                }, 500);
                return;
            }

            settingsSubmitLoading.style.display = 'inline-block';
            settingsSubmitText.textContent = 'Changing...';

            setTimeout(() => {
                CORRECT_PASSWORD = newPass;
                localStorage.setItem('masterPassword', newPass);
                settingsSubmitLoading.style.display = 'none';
                settingsSubmitText.textContent = 'Changed!';

                setTimeout(() => {
                    settingsForm.reset();
                    newPasswordStrengthBar.style.width = '0%';
                    settingsError.style.display = 'none';
                    closeSettingsModalFunc();
                    settingsSubmitText.textContent = 'Change Password';
                    // Force re-login
                    sessionStorage.removeItem('loggedIn');
                    loginModal.style.display = 'flex';
                    mainContent.style.display = 'none';
                    showPasswordLogin();
                }, 500);
            }, 800);
        }

        function savePasswords() {
            localStorage.setItem('passwords', JSON.stringify(passwords));
        }

        function togglePasswordVisibility(icon, inputId = null) {
            let passwordField;
            if (inputId) {
                passwordField = document.getElementById(inputId);
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            } else {
                passwordField = icon.parentElement.querySelector('.password-text');
                const realPassword = passwordField.getAttribute('data-password');
                if (passwordField.textContent === '••••••••') {
                    passwordField.textContent = realPassword;
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.textContent = '••••••••';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        }

        function updatePasswordStrength() {
            const password = passwordInput.value;
            let strength = 0;
            if (password.length > 0) strength += 20;
            if (password.length >= 8) strength += 20;
            if (/[A-Z]/.test(password)) strength += 20;
            if (/[0-9]/.test(password)) strength += 20;
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;
            strengthBar.style.width = strength + '%';
            if (strength < 40) {
                strengthBar.style.backgroundColor = 'var(--danger-color)';
            } else if (strength < 80) {
                strengthBar.style.backgroundColor = 'var(--warning-color)';
            } else {
                strengthBar.style.backgroundColor = 'var(--secondary-color)';
            }
        }

        function updateNewPasswordStrength() {
            const password = newPassword.value;
            let strength = 0;
            if (password.length > 0) strength += 20;
            if (password.length >= 8) strength += 20;
            if (/[A-Z]/.test(password)) strength += 20;
            if (/[0-9]/.test(password)) strength += 20;
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;
            newPasswordStrengthBar.style.width = strength + '%';
            if (strength < 40) {
                newPasswordStrengthBar.style.backgroundColor = 'var(--danger-color)';
            } else if (strength < 80) {
                newPasswordStrengthBar.style.backgroundColor = 'var(--warning-color)';
            } else {
                newPasswordStrengthBar.style.backgroundColor = 'var(--secondary-color)';
            }
        }

        function generateStrongPassword() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
            let password = '';
            for (let i = 0; i < 16; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            passwordInput.value = password;
            passwordInput.dispatchEvent(new Event('input'));
            generatePasswordBtn.innerHTML = '<i class="fas fa-check"></i> Generated!';
            setTimeout(() => {
                generatePasswordBtn.innerHTML = '<i class="fas fa-key"></i> Generate Strong Password';
            }, 2000);
        }

        function copyPasswordToClipboard() {
            const password = document.getElementById('viewPassword').getAttribute('data-password');
            navigator.clipboard.writeText(password).then(() => {
                const originalText = copyPasswordBtn.innerHTML;
                copyPasswordBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyPasswordBtn.innerHTML = originalText;
                }, 2000);
            });
        }

        window.togglePasswordVisibility = togglePasswordVisibility;
        window.viewPassword = viewPassword;
        window.editPassword = editPassword;
        window.deletePassword = deletePassword;
    