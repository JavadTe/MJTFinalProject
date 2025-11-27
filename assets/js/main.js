const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        document.getElementById('firstNameError').textContent = '';
        document.getElementById('familyNameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('messageError').textContent = '';
        document.getElementById('successMessage').textContent = '';

        const firstName = document.getElementById('firstName').value.trim();
        const familyName = document.getElementById('familyName').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Regex: letters, spaces, apostrophes and hyphens, min 2 chars
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;
        // Standard email pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Message: at least 10 characters
        const messageRegex = /^.{10,}$/;

        if (!nameRegex.test(firstName)) {
            document.getElementById('firstNameError').textContent =
                'First name must be at least 2 letters (letters, spaces, - and \' only)';
            isValid = false;
        }

        if (!nameRegex.test(familyName)) {
            document.getElementById('familyNameError').textContent =
                'Family name must be at least 2 letters (letters, spaces, - and \' only)';
            isValid = false;
        }

        if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Valid email is required';
            isValid = false;
        }

        if (!messageRegex.test(message)) {
            document.getElementById('messageError').textContent =
                'Message must be at least 10 characters';
            isValid = false;
        }

        if (isValid) {
            document.getElementById('successMessage').textContent =
                `Thank you ${firstName} ${familyName}, your message has been sent!`;

            form.reset();

            setTimeout(() => {
                document.getElementById('successMessage').textContent = '';
            }, 5000);
        }
    });
}
