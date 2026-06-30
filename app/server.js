const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: '01',
      title: 'Highly Available Cloud Portfolio',
      tags: ['AWS', 'CLOUDFORMATION', 'NODE.JS'],
      description: 'A production-minded VPC architecture that runs this portfolio across two Availability Zones behind an Application Load Balancer, with automatic health replacement and CPU-based scaling.',
      features: ['Multi-AZ resilience', 'Zero-click server bootstrap', 'Repeatable stack deployment'],
      githubLink: 'https://github.com/Suryajazz544/cloud-portfolio',
      visual: {
        type: 'architecture',
        components: ['CloudFormation', 'ALB', 'EC2', 'EC2', 'AUTO SCALING GROUP']
      }
    },
    {
      id: '02',
      title: 'Event-Driven S3 Processing',
      tags: ['S3', 'LAMBDA', 'SNS', 'EC2', 'IAM'],
      description: 'An event-driven architecture where S3 object creation triggers a serverless Lambda function to process data and publish notifications via SNS. Includes an EC2 instance with an IAM instance profile for secure S3 access.',
      features: ['Automated trigger via S3 Events', 'Secure IAM Role-Based Access', 'Automated SNS Notifications'],
      githubLink: 'https://github.com/Suryajazz544/cloud-portfolio',
      visual: {
        type: 'architecture',
        components: ['S3 Bucket', 'Lambda', 'EC2', 'SNS Topic', 'EVENT DRIVEN']
      }
    }
  ];
  res.status(200).json(projects);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  
  console.log(`[Contact Form Submission] Name: ${name}, Email: ${email}, Message: ${message}`);
  
  // In a real production scenario, you would integrate AWS SES (Simple Email Service) here 
  // to send this message to your email inbox. For now, we simulate success.
  res.status(200).json({ success: true, message: 'Message received successfully!' });
});

// Fallback for any other request - send index.html (SPA support if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Portfolio listening on port ${port}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`${signal} received; closing HTTP server`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
