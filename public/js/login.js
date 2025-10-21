
// Signup form submission handling
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('.register-form form');
  const loginForm = document.querySelector('.login-form form');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        username: signupForm.username.value,
        email: signupForm.email.value,
        password: signupForm.password.value
      };

      try {
        const response = await fetch('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          alert('Signup successful! You can now log in.');
          window.location.href = 'login.html';
        } else {
          alert(data.error || 'Signup failed.');
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        email: loginForm.email.value,
        password: loginForm.password.value
      };

      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();

        console.log('Login response:', data);

        if (response.ok && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          alert('Login successful!');
          window.location.href = 'dashboard.html';
        } else {
          alert(data.error || 'Login failed.');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
  }
});


// Toggle password visibility
lucide.createIcons();

function togglePass() {
    const input = document.getElementById("input-pass");
    const eye = document.getElementById("toggle-eye");
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    eye.setAttribute("data-lucide", isPassword ? "eye" : "eye-off");
    lucide.createIcons();
}