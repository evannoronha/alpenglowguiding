export function handleContactFormSubmit(form: HTMLFormElement): void {
  const inquiryType = document.getElementById('inquiryType') as HTMLSelectElement;
  const tripDetailsGroup = document.getElementById('tripDetailsGroup') as HTMLDivElement;
  const submitButton = form.querySelector('.submit-button') as HTMLButtonElement;
  const formMessage = document.getElementById('formMessage') as HTMLDivElement;

  // Show/hide trip details based on inquiry type
  inquiryType.addEventListener('change', () => {
    if (inquiryType.value === 'booking') {
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

      const result = await response.json();

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
