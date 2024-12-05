document.addEventListener('DOMContentLoaded', () => {
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const recipientNameInput = document.getElementById('recipientName');
    const recipientEmailInput = document.getElementById('recipientEmail');
    const statusElement = document.getElementById('status');

    sendEmailBtn.addEventListener('click', async () => {
        const recipientName = recipientNameInput.value.trim();
        const recipientEmail = recipientEmailInput.value.trim();

        if (!recipientName || !recipientEmail) {
            statusElement.textContent = 'Please fill in all fields';
            statusElement.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientName: recipientName,
                    recipientEmail: recipientEmail,
                    emailSubject: 'Test Email from The Wrench',
                    emailBody: 'This is a test email sent from our application.'
                })
            });

            if (response.ok) {
                statusElement.textContent = 'Email sent successfully!';
                statusElement.style.color = 'green';
                // Clear inputs
                recipientNameInput.value = '';
                recipientEmailInput.value = '';
            } else {
                const errorText = await response.text();
                statusElement.textContent = `Error: ${errorText}`;
                statusElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            statusElement.textContent = 'An error occurred while sending email';
            statusElement.style.color = 'red';
        }
    });
});