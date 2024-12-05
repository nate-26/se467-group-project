document.addEventListener('DOMContentLoaded', () => {
    // Select form elements
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const streetAddress = document.getElementById('streetAddress');
    const city = document.getElementById('city');
    const stateSelect = document.getElementById('state');
    const cardNumber = document.getElementById('cardNumber');
    const expirationDate = document.getElementById('expirationDate');
    const securityCode = document.getElementById('securityCode');
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    const errorSplash = document.getElementById('errorSplash');
    const email = document.getElementById('email');

    // Generate unique transaction and vendor IDs
    function generateUniqueId() {
        return Date.now().toString() + Math.random().toString(36).substring(2, 15);
    }

    // Validate form inputs before external validation
    function validateLocalForm() {
        const errors = [];

        // Basic local validation
        if (firstName.value.trim().length < 2) errors.push('Invalid First Name');
        if (lastName.value.trim().length < 2) errors.push('Invalid Last Name');
        if (streetAddress.value.trim().length < 5) errors.push('Invalid Street Address');
        if (city.value.trim().length < 2) errors.push('Invalid City');
        if (stateSelect.value === '') errors.push('Please select a state');
        if (cardNumber.value.replace(/\D/g, '').length !== 16) errors.push('Invalid Card Number');
        if (!/^\d{2}\/\d{4}$/.test(expirationDate.value)) errors.push('Invalid Expiration Date'); // Updated regex for MM/YYYY
        if (!/^\d{3}$/.test(securityCode.value)) errors.push('Invalid Security Code');
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Invalid Email Address');
        }

        return errors;
    }

    // Show error splash
    function showErrorSplash(errors) {
        const errorList = Array.isArray(errors) ? errors.join('<br>') : errors;
        errorSplash.innerHTML = `
            <div class="font-bold mb-2">Invalid Card Information</div>
            <div>${errorList}</div>
        `;
        errorSplash.classList.remove('hide');
    }

    // Hide error splash
    function hideErrorSplash() {
        errorSplash.classList.add('hide');
    }

    // Function to show inline error message on form fields
    function showInlineError(fieldId, errorMessage) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden'); // Make error message visible
    }

    // Function to clear all error messages
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.text-red-500');
        errorElements.forEach(errorElement => errorElement.classList.add('hidden'));
    }

    // External credit card validation
    async function validateCreditCard(cardData) {
        try {
            const response = await fetch('http://blitz.cs.niu.edu/CreditCard/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData)
            });

            // Get the response as JSON
            const responseJson = await response.json();

            // Check for errors in response
            if (responseJson.errors && responseJson.errors.length > 0) {
                return responseJson; // Return the errors if they exist
            }

            // If no errors, return the response
            return responseJson;
        } catch (error) {
            console.error('Credit card validation error:', error);
            throw error;
        }
    }

    // Send confirmation email
    async function sendConfirmationEmail(emailData) {
        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData)
            });
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Confirm payment event listener
    confirmPaymentBtn.addEventListener('click', async () => {
        // Reset error splash and clear all inline errors
        hideErrorSplash();
        clearAllErrors();

        // Perform local validation first
        const localErrors = validateLocalForm();
        if (localErrors.length > 0) {
            showErrorSplash(localErrors);
            return;
        }

        // Prepare credit card validation data
        const cardValidationData = {
            vendor: 'VE001-999111',  // Replace with your vendor ID
            trans: generateUniqueId(),  // Unique transaction ID
            cc: cardNumber.value.replace(/\D/g, ''),  // Card number without spaces
            name: `${firstName.value} ${lastName.value}`,
            exp: expirationDate.value, 
            amount: '50.00'  // Adjust this dynamically if needed
        };

        try {
            // Validate credit card
            const response = await validateCreditCard(cardValidationData);

            // Check if there are errors in the response
            if (response.errors && response.errors.length > 0) {
                // Loop through each error and display it next to the relevant field
                response.errors.forEach(error => {
                    if (error.includes('credit card number')) {
                        showInlineError('cardNumber', 'Credit card number is invalid.');
                    } else if (error.includes('expiration date')) {
                        showInlineError('expirationDate', 'Expiration date is invalid.');
                    }
                    // Add additional checks if other fields are involved in errors
                });
                return; // Stop further execution if there are validation errors
            }

            // If there are no errors, then proceed with the success behavior
            const authorizationNumber = response._id || response.trans;  // Use _id or trans for authorization number

            // Display the authorization number
            const authorizationNumberElement = document.getElementById('authorizationNumber');
            authorizationNumberElement.textContent = authorizationNumber;

            // Show the authorization number container
            const authorizationNumberContainer = document.getElementById('authorizationNumberContainer');
            authorizationNumberContainer.classList.remove('hidden'); // Make it visible

            // Prepare email data and send confirmation email
            await sendConfirmationEmail({
                recipientName: `${firstName.value} ${lastName.value}`,
                recipientEmail: email.value,
                emailSubject: 'Order Confirmation - The Wrench',
                emailBody: `
                    <h1>Hello ${firstName.value},</h1>
                    <p>Thank you for your order! Your order has been processed successfully.</p>
                    <p><b>Order Details:</b></p>
                    <ul>
                        <li>Name: ${firstName.value} ${lastName.value}</li>
                        <li>Address: ${streetAddress.value}, ${city.value}, ${stateSelect.value}</li>
                        <li>Authorization Number: ${authorizationNumber}</li>
                    </ul>
                    <p>Thank you for shopping with us, have an amazing day!<br>The Wrench</P>
                `
            });

        } catch (error) {
            // Show error from validation service
            showErrorSplash(error.message);
        }
    });

    // Optional: Format card number input
    cardNumber.addEventListener('input', (e) => {
        // Remove non-digits and limit to 16 digits
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16)
            .replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    // Optional: Format expiration date input (allow MM/YYYY with 4 digits for year)
    expirationDate.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 6); // Allow up to 6 digits
        if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2, 6)}`; // Add '/' after the month and allow up to 4 digits for the year
        }
        e.target.value = value;
    });
});

document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting the default way
  
    // Collect form data
    const formData = new FormData(event.target);
    const data = {
      recipientName: formData.get('recipientName'),
      recipientEmail: formData.get('recipientEmail'),
      emailSubject: formData.get('emailSubject'),
      emailBody: formData.get('emailBody')
    };
  
    // Send the data to the server
    fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data),
    })
    .then(response => response.text())
    .then(responseText => {
      alert('Email sent successfully!');
      console.log(responseText);  // Handle response from server
    })
    .catch(error => {
      alert('There was an error sending the email');
      console.error('Error:', error);  // Handle error
    });
  });
