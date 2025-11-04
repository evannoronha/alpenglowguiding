export function handleContactFormSubmit(form: HTMLFormElement): void {
  const inquiryType = document.getElementById('inquiryType');
  const tripDetailsGroup = document.getElementById('tripDetailsGroup');
  const submitButton = form.querySelector('.submit-button');
  const formMessage = document.getElementById('formMessage');

  if (!inquiryType || !tripDetailsGroup || !submitButton || !formMessage) {
    console.error('Required form elements not found');
    return;
  }

  // Show/hide trip details based on inquiry type
  inquiryType.addEventListener('change', () => {
    if ((inquiryType as HTMLSelectElement).value === 'booking') {
      tripDetailsGroup.classList.remove('hidden');
    } else {
      tripDetailsGroup.classList.add('hidden');
    }
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formMessage.classList.add('hidden');

    try {
      const formData = new FormData(form);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json() as { message?: string };

      if (response.ok) {
        // Success
        formMessage.textContent = 'Success! Your message has been sent. We\'ll be in touch within 24 hours to start planning your adventure!';
        formMessage.classList.remove('error', 'hidden');
        formMessage.classList.add('success');
        form.reset();
        tripDetailsGroup.classList.add('hidden');
      } else {
        // Error
        formMessage.textContent = result.message || 'Something went wrong. Please try again or call us at (206) 697-3966.';
        formMessage.classList.remove('success', 'hidden');
        formMessage.classList.add('error');
      }
    } catch (error) {
      // Network or other error
      formMessage.textContent = 'Failed to send message. Please check your connection or call us at (206) 697-3966.';
      formMessage.classList.remove('success', 'hidden');
      formMessage.classList.add('error');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Let\'s Make It Happen';
    }
  });
}
