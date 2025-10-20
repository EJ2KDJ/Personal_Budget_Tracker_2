const e = require("cors");

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.register-form form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            username: signupForm.username.value,
            email: signupForm.email.value,
            password: signupForm.password.value
        };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);

                alert('Signup successful! You can now log in.');

                window.location.href = 'login.html';
                return;
            } else {
                alert(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup. Please try again later.');
        }
    });
});