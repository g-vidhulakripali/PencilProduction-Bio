// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Testimonial slider
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    const testimonialNav = document.getElementById('testimonialNav');
    const dots = testimonialNav.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonialsContainer.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto-slide testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % dots.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    // Animate counter numbers
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        const range = end - start;
        const minTimer = 50;
        let stepTime = Math.abs(Math.floor(duration / range));
        
        stepTime = Math.max(stepTime, minTimer);
        const startTime = new Date().getTime();
        const endTime = startTime + duration;
        let timer;
        
        function run() {
            const now = new Date().getTime();
            const remaining = Math.max((endTime - now) / duration, 0);
            const value = Math.round(end - (remaining * range));
            obj.innerHTML = value + '+';
            if (value === end) {
                clearInterval(timer);
            }
        }
        
        timer = setInterval(run, stepTime);
        run();
    }
    
    // Observe when elements enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'clientsCount') {
                    animateValue('clientsCount', 0, 250, 2000);
                } else if (entry.target.id === 'projectsCount') {
                    animateValue('projectsCount', 0, 500, 2000);
                } else if (entry.target.id === 'experienceCount') {
                    animateValue('experienceCount', 0, 10, 1000);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe stats counters
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
    
    // Contact button action
    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            togglePopup();
            // alert('Thanks for your interest! This would you like to continue');
        })
    }
})

// Carousel Auto-Slide Functionality
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
let currentIndex = 0;
const totalItems = carouselItems.length;
let autoSlideInterval;

// Function to update carousel
function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Move to next slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

// Move to previous slide
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
}

// Auto-slide every 4 seconds
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000);
}

// Stop auto-slide when user manually clicks
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Event listeners for manual navigation
nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
});

prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
});

// Initialize carousel
updateCarousel();
startAutoSlide();


function togglePopup() {
    const popup = document.getElementById("formPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  }
  
  // Handle form submission with feedback banner
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
  
    fetch("https://formspree.io/f/xyzabcd", {  // <-- your endpoint here
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          status.style.color = '#2e7d32';
          status.textContent = "✅ Message sent successfully!";
          status.style.display = 'block';
          form.reset();
        } else {
          return response.json().then(data => {
            throw new Error(data.errors ? data.errors[0].message : "Submission failed");
          });
        }
      })
      .catch(error => {
        status.style.color = '#c62828';
        status.textContent = "❌ " + error.message;
        status.style.display = 'block';
      });
  });
  