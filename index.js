document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");

  // --- Dynamic Form Logic ---
  const checkboxes = {
    Junior: document.getElementById('checkJunior'),
    Intermediate: document.getElementById('checkIntermediate'),
    Senior: document.getElementById('checkSenior')
  };

  const sections = {
    Junior: document.getElementById('juniorSection'),
    Intermediate: document.getElementById('intermediateSection'),
    Senior: document.getElementById('seniorSection')
  };

  // Function to toggle sections and required attributes
  function toggleSection(category) {
    const isChecked = checkboxes[category].checked;
    const section = sections[category];
    
    if (isChecked) {
      section.classList.remove('hidden');
      // Make inputs required when visible
      const inputs = section.querySelectorAll('.cat-input');
      inputs.forEach(input => input.setAttribute('required', 'true'));
    } else {
      section.classList.add('hidden');
      // Remove required when hidden so form can submit
      const inputs = section.querySelectorAll('.cat-input');
      inputs.forEach(input => {
        input.removeAttribute('required');
        input.value = ''; // Optional: clear data if unchecked
      });
    }
  }

  // Add event listeners to checkboxes
  Object.keys(checkboxes).forEach(category => {
    checkboxes[category].addEventListener('change', () => toggleSection(category));
  });

  // Handle Form Reset to hide sections again
  form.addEventListener('reset', () => {
    setTimeout(() => { // Wait for reset to clear checkboxes
      Object.keys(checkboxes).forEach(category => toggleSection(category));
    }, 10);
  });


  // --- Form Submission Logic ---
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Check if at least one category is selected
    const isAnyCategorySelected = Object.values(checkboxes).some(cb => cb.checked);
    if (!isAnyCategorySelected) {
        Swal.fire({
            icon: 'warning',
            title: 'Action Required',
            text: 'Please select at least one Competing Category.',
        });
        return; // Stop submission
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.textContent = "Submitting...";

    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    // Process form data
    for (const pair of formData.entries()) {
      // The checkboxes share the name 'competingCategories'
      // URLSearchParams handles multiple values with the same key automatically
      params.append(pair[0], pair[1]); 
    }

    try {
      // REPLACE THIS URL WITH YOUR ACTUAL GOOGLE APPS SCRIPT WEB APP URL
      const scriptURL = "https://script.google.com/macros/s/AKfycbw0IwDJgnOvZp-nYI5fNtumxbu5_npoi_YL89opYFfQLMqIRJ9KmImA5Ng_1nVnu050/exec";
      
      const response = await fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const result = await response.text();

      if (result.toLowerCase().includes("success")) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Thank you for registering. Redirecting...",
          showConfirmButton: false,
          timer: 2200,
          timerProgressBar: true
        });
        
        // Optional: Reset form instead of redirecting if you prefer
        // form.reset();
        // submitBtn.disabled = false;
        // submitBtn.style.opacity = "1";
        // submitBtn.textContent = "Submit Registration";

        setTimeout(() => {
          // Change to your success page or keep it to refresh
          window.location.href = "https://yetay-quiz.onrender.com/"; 
        }, 2200);

      } else {
        showError("Form submitted, but something went wrong: " + result);
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.textContent = "Submit Registration";
      }
    } catch (error) {
      showError("Failed to submit form: " + error.message);
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.textContent = "Submit Registration";
    }
  });

  function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
  }
});