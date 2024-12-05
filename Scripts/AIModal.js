document.addEventListener('DOMContentLoaded', () => {
    // All the interactive elements that make up the modal
    const aiButton = document.getElementById('ai-button');
    const aiModal = document.getElementById('ai-modal');
    const closeButton = aiModal.querySelector('.close-button');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const modalOverlay = document.createElement('div');

    // Check for stupidity
    if (!aiButton || !aiModal || !closeButton) {
        console.error("One or more elements are missing from the DOM.");
        return;
    }

    // Open the modal's transparent overlay
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);

    // Open modal and overlay when the AI button is clicked
    aiButton.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        aiModal.style.display = 'block';
    });

    // Function to close modal and overlay
    const closeModal = () => {
        modalOverlay.style.display = 'none';
        aiModal.style.display = 'none';
    };

    // Close modal and overlay when 'x' is clicked
    closeButton.addEventListener('click', closeModal);

    // Close modal and overlay when clicking on overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Functionality for sending the AI a chat
    sendButton.addEventListener('click', () => {
        // Assign the chatInput to a variable 
        const message = chatInput.value.trim();

        // If there is a message, send it and clear the chatInput
        if (message) {
          console.log(message); // TODO: Placeholder for AI chatbout
          chatInput.value = ''; // Clear the input
        }
      });
});