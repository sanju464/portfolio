// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
  // Form submit alert
document.querySelector(".contact-form").addEventListener("submit", function (e) {
    e.preventDefault(); // stop real submission
    alert("Thanks for your message! I'll get back to you soon.");
    this.reset(); // clear the form
  });
  