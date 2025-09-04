# FixeQ Portfolio 🚀

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Ffixeqyt.github.io)](https://fixeqyt.github.io)
[![GitHub Stars](https://img.shields.io/github/stars/FixeQyt/FixeQyt.github.io?style=social)](https://github.com/FixeQyt/FixeQyt.github.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Modern, responsive portfolio website showcasing my journey as a Full Stack Developer and Linux enthusiast.

## 🌟 Features

### ✨ **Visual Excellence**
- **3D Interactive Background**: Three.js powered particle system
- **Smooth Animations**: CSS3 and JavaScript animations with performance optimization
- **Glass Morphism Design**: Modern UI with backdrop-filter effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Theme**: Professional dark color scheme with neon accents

### 🚀 **Performance & Functionality**
- **Progressive Web App (PWA)**: Installable with offline functionality
- **Service Worker**: Smart caching and background sync
- **Lazy Loading**: Optimized content loading for better performance
- **SEO Optimized**: Complete meta tags, sitemap, and structured data
- **Accessibility**: WCAG compliant with screen reader support

### 🎯 **Interactive Elements**
- **Dynamic Content Loading**: JSON-driven content management
- **Project Filtering**: Category-based project showcase
- **Contact Form**: Fully functional contact system with validation
- **Scroll Animations**: Intersection Observer powered reveal animations
- **Back-to-top**: Smooth scroll navigation enhancement

## 🛠️ **Tech Stack**

### Frontend
- **HTML5** - Semantic markup with modern standards
- **CSS3** - Advanced styling with custom properties and grid/flexbox
- **JavaScript ES6+** - Modern vanilla JS with modules and async/await
- **Three.js** - 3D graphics and particle systems

### Performance & Tools
- **Service Workers** - Offline functionality and caching
- **Web APIs** - Intersection Observer, Performance API
- **PWA Features** - Manifest, installability, offline support
- **Responsive Images** - Optimized loading and display

### Development
- **Git** - Version control with semantic commits
- **GitHub Pages** - Static site hosting
- **VS Code** - Development environment with extensions

## 📁 **Project Structure**

```
FixeQyt.github.io/
│
├── 📄 index.html              # Main HTML file
├── 📄 manifest.json           # PWA manifest
├── 📄 sw.js                   # Service worker
├── 📄 robots.txt              # Search engine directives
├── 📄 sitemap.xml             # Site structure for SEO
│
├── 🎨 css/                    # Stylesheets
│   ├── reset.css              # CSS reset and normalization
│   ├── variables.css          # CSS custom properties
│   ├── base.css               # Base styles and utilities
│   ├── components.css         # Reusable components
│   ├── hero.css               # Hero section styles
│   ├── about.css              # About section styles
│   ├── skills.css             # Skills showcase styles
│   ├── projects.css           # Projects gallery styles
│   ├── contact.css            # Contact form styles
│   ├── footer.css             # Footer styles
│   ├── animations.css         # Animation definitions
│   ├── construction.css       # Construction/maintenance styles
│   └── responsive.css         # Media queries and responsive design
│
├── ⚡ js/                     # JavaScript modules
│   ├── main.js                # Main application controller
│   ├── utils.js               # Utility functions and helpers
│   ├── navigation.js          # Navigation and scroll handling
│   ├── animations.js          # Animation controllers
│   ├── components.js          # Dynamic component builders
│   ├── data-loader.js         # Data fetching and management
│   ├── three-scene.js         # Three.js 3D scene management
│   └── stats.js               # GitHub stats page controller
│
├── 📊 data/                   # Dynamic content
│   ├── data.json              # Personal and skills data
│   └── projects.json          # Projects showcase data
│
├── 🖼️ assets/                 # Media files
│   ├── avatar.jpg             # Profile image
│   ├── icons/                 # PWA icons
│   └── projects/              # Project images and banners
│
└── 📈 stats/                  # GitHub statistics subsite
    ├── index.html             # Stats page with 3D rocket animation
    └── image.html             # Direct image redirect
```

## 🎨 **Design Philosophy**

### **Modern Aesthetic**
- **Glass Morphism**: Translucent elements with backdrop filters
- **Neon Accents**: Vibrant blue (#4a9eff) and purple (#6c5ce7) highlights
- **Smooth Transitions**: All interactions have fluid animations
- **Minimalist Layout**: Clean, focused content presentation

### **User Experience**
- **Progressive Enhancement**: Works without JavaScript
- **Performance First**: Optimized loading and rendering
- **Accessibility**: Screen reader friendly and keyboard navigable
- **Mobile Responsive**: Touch-friendly interface design

## 🚀 **Getting Started**

### **Local Development**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FixeQyt/FixeQyt.github.io.git
   cd FixeQyt.github.io
   ```

2. **Serve locally** (choose one):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (if you have it)
   npx serve .
   
   # PHP
   php -S localhost:8000
   
   # Live Server (VS Code extension)
   # Right-click index.html -> "Open with Live Server"
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000`

### **Customization**

#### **Personal Information**
Edit `data/data.json` to update:
- Personal details and bio
- Skills and technologies
- Social media links
- Professional experience

#### **Projects**
Edit `data/projects.json` to:
- Add new projects
- Update project details
- Modify categories and filters
- Change project status

#### **Styling**
- `css/variables.css` - Colors, fonts, and spacing
- `css/base.css` - Core styling and utilities
- Individual CSS files for specific sections

#### **Content**
- `index.html` - Main structure and content
- Update meta tags for SEO
- Modify section content as needed

## 📱 **PWA Features**

### **Installation**
- **Desktop**: Chrome will show install prompt
- **Mobile**: "Add to Home Screen" option
- **Offline Access**: Service worker provides offline functionality

### **Capabilities**
- **Standalone Mode**: Runs like a native app
- **Background Sync**: Queues form submissions when offline
- **Push Notifications**: Ready for future implementation
- **Shortcuts**: Quick access to main sections

## 🔧 **Browser Support**

### **Fully Supported**
- Chrome 88+ ✅
- Firefox 85+ ✅
- Safari 14+ ✅
- Edge 88+ ✅

### **Progressive Enhancement**
- **Modern Features**: Service Workers, Intersection Observer
- **Fallbacks**: CSS Grid with Flexbox fallback
- **Graceful Degradation**: Works without JavaScript

## 📊 **Performance**

### **Lighthouse Scores**
- **Performance**: 95+ 🚀
- **Accessibility**: 100 ♿
- **Best Practices**: 100 ⭐
- **SEO**: 100 🔍

### **Optimization Techniques**
- **Critical CSS**: Inlined for faster initial render
- **Lazy Loading**: Images and content load on demand
- **Resource Hints**: Preload, prefetch, and preconnect
- **Compression**: Gzip/Brotli ready assets

## 🤝 **Contributing**

I welcome contributions! Here's how you can help:

### **Bug Reports**
- Use GitHub Issues to report bugs
- Include browser version and steps to reproduce
- Screenshots are helpful for UI issues

### **Feature Requests**
- Suggest new features via GitHub Issues
- Explain the use case and expected behavior
- Consider backwards compatibility

### **Pull Requests**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **About the Developer**

**Paweł Sobczak (FixeQ)**
- 🔭 Full Stack Developer with 3+ years of experience
- 🐧 Linux enthusiast (Arch Linux user)
- 📱 Mobile development with Java/Kotlin
- 🌐 Web technologies specialist
- ⚡ Always learning and building cool stuff

### **Connect with me:**
- 🔗 **Portfolio**: [fixeqyt.github.io](https://fixeqyt.github.io)
- 💼 **GitHub**: [@FixeQyt](https://github.com/FixeQyt)
- 🧵 **Threads**: [@fixeq.dev](https://threads.com/@fixeq.dev)
- 📸 **Instagram**: [@fixeq.dev](https://instagram.com/fixeq.dev)
- 📧 **Email**: contact@fixeq.dev

---

<div align="center">

**⭐ Star this repository if you found it helpful! ⭐**

Made with ❤️ by [FixeQ](https://github.com/FixeQyt)

</div>
