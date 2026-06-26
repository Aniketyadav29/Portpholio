# 📱 Personal Portfolio Website

A modern, responsive portfolio website inspired by professional developer portfolios. Built with HTML, CSS, and JavaScript.

## 🎨 Features

- ✨ Modern dark theme with golden accents
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎯 Smooth scrolling navigation
- 🎬 Scroll animations and transitions
- 📝 Contact form integration
- 🏆 Credentials/Achievements section
- 💻 Skills showcase with icons
- 📊 Statistics counter
- 🔗 Social media links
- ⌨️ Keyboard navigation shortcuts

## 📂 File Structure

```
Aniketyadav29/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
├── README.md           # This file
└── assets/             # (Optional) Images and custom assets
```

## 🚀 Getting Started

### 1. Basic Setup

1. Open `index.html` in your web browser
2. The portfolio will load with placeholder content
3. Customize with your own information

### 2. Customization Guide

#### **Update Your Name & Title**

In `index.html`, find the hero section:

```html
<h1 class="hero-title">Your Name</h1>
<p class="hero-subtitle">A passionate <span class="highlight">Software & Backend</span> Developer</p>
```

Replace:
- "Your Name" → Your actual name
- "Software & Backend" → Your specialization
- Update the description paragraph below

#### **Add Your Photo**

Replace the avatar placeholder in the `.avatar-placeholder` div or add your image:

```html
<div class="avatar-placeholder">
    <img src="assets/your-photo.jpg" alt="Your Name">
</div>
```

Then update the CSS:
```css
.avatar-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
}
```

#### **Update About Section**

Find and replace the content in the about section:

```html
<div class="about-description">
    <p>Your professional summary here</p>
    <p>Your specialization and approach</p>
</div>
```

Update education details:
```html
<div class="education-item">
    <h4>Your University/School Name</h4>
    <p class="year">2023 – Present</p>
    <p class="description">Your description</p>
</div>
```

#### **Add Your Projects**

In the projects section, replace the project cards:

```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-icon-name"></i>  <!-- Change icon here -->
    </div>
    <div class="project-content">
        <h3>Your Project Title</h3>
        <p>Your project description</p>
        <div class="project-tags">
            <span class="tag">Technology1</span>
            <span class="tag">Technology2</span>
        </div>
        <a href="your-project-link" class="project-link">View Project →</a>
    </div>
</div>
```

#### **Update Skills**

Add your technologies in the skills container:

```html
<div class="skill-item">
    <i class="fab fa-python"></i>
    <span>Python</span>
</div>
```

**Common icons:**
- `fab fa-python` - Python
- `fab fa-java` - Java
- `fab fa-javascript` - JavaScript
- `fab fa-react` - React
- `fab fa-node` - Node.js
- `fab fa-docker` - Docker
- `fab fa-git` - Git
- `fab fa-github` - GitHub
- `fab fa-aws` - AWS
- `fas fa-database` - Database

View all available icons at: [Font Awesome Icons](https://fontawesome.com/icons)

#### **Add Your Credentials**

Update the credentials section:

```html
<div class="credential-card">
    <div class="credential-image">
        <i class="fas fa-certificate"></i>
    </div>
    <h4>Credential Name</h4>
    <p>Your Organization</p>
</div>
```

#### **Update Contact Information**

Change your email and social links:

```html
<!-- Email link -->
<a href="mailto:your@email.com" title="Mail">

<!-- Social links in footer -->
<a href="https://github.com/yourusername" title="GitHub">
<a href="https://linkedin.com/in/yourusername" title="LinkedIn">
<a href="https://telegram.me/yourusername" title="Telegram">
```

#### **Update Statistics**

In the stats section, change the numbers:

```html
<div class="stat-item">
    <h3>Your Number+</h3>
    <p>Your Stat</p>
</div>
```

#### **Update Footer**

```html
<p class="footer-copyright">© 2024 Your Name</p>
```

## 🎨 Customizing Colors

To change the color scheme, edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #ffa500;          /* Orange - main accent */
    --primary-light: #ffb84d;
    --primary-dark: #ff8c00;
    --bg-dark: #0a0a0a;                /* Dark background */
    --bg-darker: #050505;              /* Darker background */
    --text-light: #e0e0e0;             /* Light text */
    --text-muted: #a0a0a0;             /* Muted text */
    --border-color: #333;
    --card-bg: #1a1a1a;
    --accent-gold: #ffa500;
}
```

Change `#ffa500` to your preferred color throughout.

## ⌨️ Keyboard Shortcuts

- **H** - Go to hero section
- **C** - Go to contact section

## 📱 Responsive Breakpoints

The portfolio is optimized for:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: Below 768px

## 🔧 JavaScript Features

### Automatic Functions:
- Smooth scrolling on all anchor links
- Active navigation link highlighting
- Scroll animations for cards and items
- Counter animation for statistics
- Form submission handling
- Responsive mobile menu
- Parallax effects

### To customize form submission:

In `script.js`, find the form submission handler and add your backend endpoint:

```javascript
// Option 1: Send to backend
fetch('your-backend-url', {
    method: 'POST',
    body: JSON.stringify({name, email, message})
})

// Option 2: Use email service (FormSpree, Netlify Forms, etc.)
// Option 3: Use mailto link
```

## 🌐 Deployment

### Deploy to GitHub Pages:
1. Create a GitHub repository
2. Enable GitHub Pages in repository settings
3. Push your portfolio files
4. Your site will be live at `username.github.io`

### Deploy to Netlify:
1. Connect your GitHub repository
2. Set build command: (leave empty)
3. Set publish directory: `.` (root)
4. Deploy with one click

### Deploy to Vercel:
1. Connect your GitHub repository
2. Select the portfolio folder
3. Click Deploy

## 📝 Form Submission Setup

To make the contact form functional, choose one option:

### Option 1: Formspree
1. Go to [Formspree](https://formspree.io/)
2. Create account and set up form endpoint
3. Update form action in HTML

### Option 2: Netlify Forms
1. Deploy on Netlify
2. Add `netlify` attribute to form

### Option 3: Backend API
Set up your own backend server to handle form submissions.

## 🎯 SEO Optimization

Update the title and meta tags in `<head>`:

```html
<title>Your Name - Software & Backend Developer Portfolio</title>
<meta name="description" content="Your professional summary...">
<meta name="keywords" content="developer, portfolio, python, backend...">
```

## 🐛 Troubleshooting

**Issues with icons not showing?**
- Ensure Font Awesome CDN is loaded
- Check internet connection
- Verify icon class names

**Forms not sending?**
- Set up form submission backend
- Check console for errors
- Verify email configuration

**Mobile menu not working?**
- Check viewport meta tag in HTML
- Clear browser cache
- Test in incognito mode

## 📚 Additional Resources

- [Font Awesome Icons](https://fontawesome.com/)
- [CSS Gradients](https://cssgradient.io/)
- [Animation Library](https://animate.style/)
- [Web Development MDN](https://developer.mozilla.org/)

## 💡 Tips for Success

1. **Keep it updated** - Update your projects and skills regularly
2. **Add real images** - Replace placeholder images with your own
3. **Write compelling content** - Make descriptions engaging
4. **Test responsively** - Check on multiple devices
5. **Optimize performance** - Compress images and minimize CSS/JS
6. **Enable analytics** - Use Google Analytics to track visitors

## 📄 License

Feel free to use this template for your personal portfolio. 

## 🤝 Support

Need help? Check the HTML comments in the code for additional guidance on customization.

---

**Last Updated:** 2024
**Built with:** HTML5 • CSS3 • JavaScript (Vanilla)
