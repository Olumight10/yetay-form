document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validate that at least one category is checked
    const checkboxes = document.querySelectorAll('input[name="competingCategories"]');
    const isAnyCategorySelected = Array.from(checkboxes).some(cb => cb.checked);
    
    if (!isAnyCategorySelected) {
        Swal.fire({
            icon: 'warning',
            title: 'Action Required',
            text: 'Please select at least one Competing Category.',
        });
        return; 
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.textContent = "Submitting...";

    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    for (const pair of formData.entries()) {
      params.append(pair[0], pair[1]); 
    }

    try {
      // REPLACE THIS URL WITH YOUR ACTUAL GOOGLE APPS SCRIPT WEB APP URL
      const scriptURL = "https://script.google.com/macros/s/AKfycbzEn_YFIdAU7RdHVahIXORYzHDVr0DX9owFMTTe8MD4LVUZ-GKdI2-LWEB7iEuhYsQy/exec";
      
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
        
        setTimeout(() => {
          // Redirecting to the main app on Render
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