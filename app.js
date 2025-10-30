// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// Smooth Scrolling
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Update active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
});

// Service Card Expansion
function toggleService(serviceId) {
  const details = document.getElementById(`service-${serviceId}`);
  details.classList.toggle('expanded');
}

// Support Tabs Switching
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active from all buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Activate button
  event.target.classList.add('active');
}

// Ticket Form Submission
function submitTicket(event) {
  event.preventDefault();
  
  const form = document.getElementById('ticketForm');
  const formData = new FormData(form);
  
  // Collect form data
  const ticketData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    category: formData.get('category'),
    description: formData.get('description')
  };
  
  // Generate ticket ID
  const ticketId = 'TKT-' + Date.now().toString().slice(-6);
  
  // Store ticket in memory (in production, this would call the backend API)
  const tickets = getTickets();
  tickets.push({
    id: ticketId,
    ...ticketData,
    status: 'open',
    createdAt: new Date().toISOString()
  });
  storeTickets(tickets);
  
  // Simulate API call to backend
  // In production: fetch('/api/tickets', { method: 'POST', body: JSON.stringify(ticketData) })
  
  // Show success message
  form.style.display = 'none';
  const successDiv = document.getElementById('ticketSuccess');
  successDiv.classList.add('show');
  document.getElementById('ticketId').textContent = ticketId;
  
  // Simulate email notification
  console.log('Email sent to:', ticketData.email);
  console.log('Email sent to support team');
  
  // Reset form after 5 seconds
  setTimeout(() => {
    form.reset();
    form.style.display = 'block';
    successDiv.classList.remove('show');
  }, 5000);
  
  return false;
}

// Track Ticket
function trackTicket() {
  const ticketId = document.getElementById('trackTicketId').value.trim();
  const resultDiv = document.getElementById('ticketStatusResult');
  
  if (!ticketId) {
    resultDiv.innerHTML = '<p style="color: var(--color-primary);">Please enter a ticket ID</p>';
    resultDiv.classList.add('show');
    return;
  }
  
  // Get tickets from storage
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  
  if (ticket) {
    resultDiv.innerHTML = `
      <h4>Ticket Status</h4>
      <p><strong>ID:</strong> ${ticket.id}</p>
      <p><strong>Status:</strong> <span style="color: var(--color-primary);">${ticket.status.toUpperCase()}</span></p>
      <p><strong>Category:</strong> ${ticket.category}</p>
      <p><strong>Submitted:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
      <p><strong>Description:</strong> ${ticket.description}</p>
    `;
  } else {
    resultDiv.innerHTML = '<p style="color: var(--color-primary);">Ticket not found. Please check the ID and try again.</p>';
  }
  
  resultDiv.classList.add('show');
}

// Callback Form Submission
function submitCallback(event) {
  event.preventDefault();
  
  const form = document.getElementById('callbackForm');
  const formData = new FormData(form);
  
  const callbackData = {
    name: formData.get('name') || document.getElementById('callbackName').value,
    phone: formData.get('phone') || document.getElementById('callbackPhone').value,
    time: document.getElementById('callbackTime').value,
    message: document.getElementById('callbackMessage').value
  };
  
  // Simulate API call
  console.log('Callback requested:', callbackData);
  
  // Show success message
  form.style.display = 'none';
  const successDiv = document.getElementById('callbackSuccess');
  successDiv.classList.add('show');
  
  // Reset form after 4 seconds
  setTimeout(() => {
    form.reset();
    form.style.display = 'block';
    successDiv.classList.remove('show');
  }, 4000);
  
  return false;
}

// Knowledge Base Search
function searchKnowledgeBase() {
  const searchTerm = document.getElementById('kbSearch').value.toLowerCase();
  const articles = document.querySelectorAll('.kb-article');
  
  articles.forEach(article => {
    const title = article.getAttribute('data-title');
    const content = article.textContent.toLowerCase();
    
    if (title.includes(searchTerm) || content.includes(searchTerm) || searchTerm === '') {
      article.classList.remove('hidden');
    } else {
      article.classList.add('hidden');
    }
  });
}

// Knowledge Base Filter
function filterKB(category) {
  const articles = document.querySelectorAll('.kb-article');
  const filters = document.querySelectorAll('.kb-filter');
  
  // Update active filter
  filters.forEach(filter => filter.classList.remove('active'));
  event.target.classList.add('active');
  
  // Filter articles
  articles.forEach(article => {
    const articleCategory = article.getAttribute('data-category');
    
    if (category === 'all' || articleCategory === category) {
      article.classList.remove('hidden');
    } else {
      article.classList.add('hidden');
    }
  });
  
  // Clear search
  document.getElementById('kbSearch').value = '';
}

// Download Resource
function downloadResource(resourceId) {
  console.log('Downloading resource:', resourceId);
  alert('Download started! In production, this would download the actual file.');
}

// Chatbot Functions
let currentDepartment = null;

function toggleChatbot() {
  const widget = document.getElementById('chatbotWidget');
  widget.classList.toggle('active');
}

function openChatbot() {
  const widget = document.getElementById('chatbotWidget');
  widget.classList.add('active');
}

function closeChatbot() {
  const widget = document.getElementById('chatbotWidget');
  widget.classList.remove('active');
  
  // Reset chatbot
  setTimeout(() => {
    const messages = document.getElementById('chatMessages');
    messages.innerHTML = `
      <div class="bot-message">
        <strong>Support Bot:</strong> Hello! How can I help you today? Please select a department:
      </div>
    `;
    document.getElementById('chatDepartments').style.display = 'grid';
    document.getElementById('chatInputArea').style.display = 'none';
    currentDepartment = null;
  }, 300);
}

function selectDepartment(dept) {
  currentDepartment = dept;
  const messages = document.getElementById('chatMessages');
  
  const departmentNames = {
    sales: 'Sales',
    cloud: 'Cloud Support',
    security: 'Firewall & Security',
    technical: 'Technical Help',
    website: 'Website Inquiry',
    msoc: 'MSOC Monitoring'
  };
  
  messages.innerHTML += `
    <div class="user-message">I need help with ${departmentNames[dept]}</div>
    <div class="bot-message">
      <strong>${departmentNames[dept]} Support:</strong> Great! I'm here to help. What can I assist you with?
    </div>
  `;
  
  // Hide department selection, show input
  document.getElementById('chatDepartments').style.display = 'none';
  document.getElementById('chatInputArea').style.display = 'flex';
  
  // Auto-scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  const messages = document.getElementById('chatMessages');
  
  // Add user message
  messages.innerHTML += `
    <div class="user-message">${message}</div>
  `;
  
  // Clear input
  input.value = '';
  
  // Simulate bot response
  setTimeout(() => {
    const responses = [
      'Thank you for your message. Let me check that for you...',
      'I understand. Our team can help with that.',
      'That\'s a great question! Would you like me to create a support ticket for you?',
      'I can connect you with a live agent who specializes in this area.',
      'For complex issues, I recommend submitting a ticket through our support portal.'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    messages.innerHTML += `
      <div class="bot-message">
        <strong>Support Bot:</strong> ${randomResponse}
      </div>
    `;
    
    // Auto-scroll to bottom
    messages.scrollTop = messages.scrollHeight;
  }, 1000);
  
  // Auto-scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

// Ticket Storage Functions (using JavaScript variables)
let ticketStorage = [];

function getTickets() {
  return ticketStorage;
}

function storeTickets(tickets) {
  ticketStorage = tickets;
}

// Initialize with some sample tickets for demo
storeTickets([
  {
    id: 'TKT-100001',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1234567890',
    category: 'cloud',
    description: 'Need help with cloud migration',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'TKT-100002',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567891',
    category: 'security',
    description: 'Firewall configuration assistance needed',
    status: 'resolved',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]);

// Deployment Notes
console.log('\n=== DEPLOYMENT INFORMATION ===\n');
console.log('Frontend Deployment (FREE):');
console.log('- Vercel: https://vercel.com (Recommended)');
console.log('- Netlify: https://netlify.com');
console.log('- GitHub Pages: https://pages.github.com\n');
console.log('Backend Deployment (FREE):');
console.log('- Render: https://render.com (500 hrs/month free)');
console.log('- Railway: https://railway.app (500 hrs/month free)');
console.log('- Fly.io: https://fly.io (3 VMs free)\n');
console.log('Database (FREE):');
console.log('- Supabase: https://supabase.com (PostgreSQL)');
console.log('- MongoDB Atlas: https://mongodb.com/atlas (512MB free)');
console.log('- Render PostgreSQL: Included with backend\n');
console.log('Email Service (FREE):');
console.log('- SendGrid: 100 emails/day free');
console.log('- Mailgun: 5,000 emails/month free');
console.log('- Brevo (formerly Sendinblue): 300 emails/day free\n');
console.log('===============================\n');