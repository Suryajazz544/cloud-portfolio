document.querySelector('#year').textContent = new Date().getFullYear();

// Fetch and render projects from the backend API
async function loadProjects() {
  const container = document.querySelector('#projects-container');
  if (!container) return;

  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const projects = await response.json();
    container.innerHTML = ''; // Clear loading text

    projects.forEach((project) => {
      const article = document.createElement('article');
      article.className = 'project-card';
      
      // Determine what to show in the visual section
      let visualContent = '';
      if (project.visual && project.visual.type === 'architecture') {
        const comps = project.visual.components;
        visualContent = `
          <strong>Architecture</strong>
          <div class="boxes">
            <div class="box">${comps[0] || 'Cloud'}</div>
            <div class="box">${comps[1] || 'ALB'}</div>
          </div>
          <div class="boxes">
            <div class="box">${comps[2] || 'EC2'}</div>
            <div class="box">${comps[3] || 'EC2'}</div>
          </div>
          <div class="box" style="margin-top: 10px;">${comps[4] || 'Auto Scaling'}</div>
        `;
      } else {
        visualContent = `<strong>Backend Architecture</strong>`;
      }

      article.innerHTML = `
        <div class="project-content">
          <h3>${project.title}</h3>
          <div class="tag-list">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <p>${project.description}</p>
          <ul class="feature-list">
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
          <a class="button primary" href="${project.githubLink}" target="_blank" rel="noreferrer">View Repository</a>
        </div>
        <div class="project-visual">
          ${visualContent}
        </div>
      `;
      
      container.appendChild(article);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    container.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
  }
}

// Handle Contact Form Submission
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('#contact-submit');
    const statusText = document.querySelector('#contact-status');
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    statusText.textContent = '';
    statusText.className = 'contact-status';
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        statusText.textContent = data.message;
        statusText.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(data.error || 'Failed to send message.');
      }
    } catch (error) {
      statusText.textContent = error.message;
      statusText.classList.add('error');
    } finally {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });
}

// Initialize the data fetching
loadProjects();
