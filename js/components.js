// Component builders for dynamic content generation

class ComponentBuilder {
    constructor() {
        this.components = new Map();
    }

    // Build skills section
    buildSkillsSection(skills) {
        console.log('Building skills section...');
        const skillsGrid = utils.$('#skills-grid');
        console.log('Skills grid element:', skillsGrid);
        console.log('Skills data:', skills);
        
        if (!skillsGrid) {
            console.error('Skills grid element not found!');
            return;
        }
        
        if (!skills) {
            console.error('No skills data provided!');
            return;
        }

        skillsGrid.innerHTML = '';

        skills.forEach((skillCategory, index) => {
            console.log(`Creating skill category ${index}:`, skillCategory);
            const categoryElement = this.createSkillCategory(skillCategory, index);
            skillsGrid.appendChild(categoryElement);
        });
        
        console.log('Skills section built successfully');
        
        // Force show elements if animations don't work
        setTimeout(() => {
            const skillElements = utils.$$('.skill-category');
            skillElements.forEach(element => {
                if (!element.classList.contains('in-view')) {
                    console.log('Force showing skill element:', element);
                    element.classList.add('in-view');
                }
            });
        }, 500);
    }

    // Create skill category card
    createSkillCategory(category, index) {
        const categoryCard = utils.createElement('div', {
            className: 'skill-category animate-on-scroll',
            style: `animation-delay: ${index * 0.1}s`
        });

        const categoryTitle = utils.createElement('h3', {
            className: 'category-title',
            innerHTML: `
                <div class="category-icon">${this.getCategoryIcon(category.category)}</div>
                ${category.category}
            `
        });

        const technologiesList = utils.createElement('div', {
            className: 'technologies-list'
        });

        // Add 3D skill icons
        const skillIconsContainer = utils.createElement('div', {
            className: 'skill-3d-container'
        });

        category.technologies.forEach((tech, techIndex) => {
            // 3D Icon
            const skillIcon = utils.createElement('div', {
                className: 'skill-3d-icon',
                style: `--index: ${techIndex}`,
                innerHTML: tech.icon,
                title: tech.name
            });
            skillIconsContainer.appendChild(skillIcon);

            // Technology item
            const techItem = this.createTechnologyItem(tech, techIndex);
            technologiesList.appendChild(techItem);
        });

        categoryCard.appendChild(categoryTitle);
        categoryCard.appendChild(skillIconsContainer);
        categoryCard.appendChild(technologiesList);

        return categoryCard;
    }

    // Create technology item with progress bar
    createTechnologyItem(tech, index) {
        const techItem = utils.createElement('div', {
            className: 'technology-item',
            style: `--index: ${index}`
        });

        const techHeader = utils.createElement('div', {
            className: 'tech-header'
        });

        const techName = utils.createElement('div', {
            className: 'tech-name',
            innerHTML: `
                <span class="tech-icon">${tech.icon}</span>
                ${tech.name}
            `
        });

        const techLevel = utils.createElement('div', {
            className: 'tech-level',
            textContent: `${tech.level}%`
        });

        const progressBar = utils.createElement('div', {
            className: 'progress-bar'
        });

        const progressFill = utils.createElement('div', {
            className: 'progress-fill',
            style: `width: 0%` // Will be animated later
        });

        techHeader.appendChild(techName);
        techHeader.appendChild(techLevel);
        progressBar.appendChild(progressFill);
        
        techItem.appendChild(techHeader);
        techItem.appendChild(progressBar);

        return techItem;
    }

    // Build projects section
    buildProjectsSection(projectsData) {
        const projectsGrid = utils.$('#projects-grid');
        const projectsFilter = utils.$('.projects-filter');
        
        console.log('buildProjectsSection called with:', projectsData);
        
        if (!projectsGrid) {
            console.log('Projects grid not found');
            return;
        }

        // Check if section is under construction
        if (projectsData && projectsData.underConstruction) {
            console.log('Projects marked as under construction');
            this.showConstructionMessage(projectsGrid, projectsFilter);
            return;
        }

        const projects = projectsData?.projects || projectsData;
        console.log('Extracted projects:', projects);
        
        if (!projects || projects.length === 0) {
            console.log('No projects found, showing construction message');
            this.showConstructionMessage(projectsGrid, projectsFilter);
            return;
        }

        console.log('Rendering', projects.length, 'projects');

        // Show filter if we have projects
        if (projectsFilter) {
            projectsFilter.style.display = 'flex';
        }

        projectsGrid.innerHTML = '';

        projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
        
        // Force show elements if animations don't work
        setTimeout(() => {
            const projectElements = utils.$$('.project-card');
            projectElements.forEach(element => {
                if (!element.classList.contains('in-view')) {
                    element.classList.add('in-view');
                }
            });
        }, 500);
    }

    // Show construction message
    showConstructionMessage(projectsGrid, projectsFilter) {
        // Hide filter buttons
        if (projectsFilter) {
            projectsFilter.style.display = 'none';
        }

        projectsGrid.innerHTML = `
            <div class="construction-container">
                <div class="construction-icon">
                    <div class="gear gear-1">⚙️</div>
                    <div class="gear gear-2">⚙️</div>
                    <div class="gear gear-3">⚙️</div>
                </div>
                <h3 class="construction-title">Section Under Construction</h3>
                <p class="construction-text">Check back soon!</p>
                <div class="construction-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create project card
    createProjectCard(project, index) {
        const projectCard = utils.createElement('div', {
            className: `project-card animate-on-scroll show ${project.category.toLowerCase().replace(' ', '-')}`,
            style: `--index: ${index}; animation-delay: ${index * 0.1}s`,
            'data-category': project.category.toLowerCase().replace(/\s+/g, '-'),
            'data-project-id': project.id
        });

        // Project image
        const projectImage = utils.createElement('div', {
            className: 'project-image'
        });

        const image = utils.createElement('img', {
            src: project.image,
            alt: project.title,
            loading: 'lazy'
        });

        const overlay = utils.createElement('div', {
            className: 'project-overlay',
            innerHTML: '<div class="overlay-icon">👁️</div>'
        });

        const status = utils.createElement('div', {
            className: `project-status status-${project.status.toLowerCase().replace(' ', '-')}`,
            textContent: project.status
        });

        projectImage.appendChild(image);
        projectImage.appendChild(overlay);
        projectImage.appendChild(status);

        // Project content
        const projectContent = utils.createElement('div', {
            className: 'project-content'
        });

        const projectHeader = utils.createElement('div', {
            className: 'project-header'
        });

        const projectTitle = utils.createElement('h3', {
            className: 'project-title',
            textContent: project.title
        });

        const projectCategory = utils.createElement('span', {
            className: `project-category ${project.category.toLowerCase().replace(' ', '-')}`,
            textContent: project.category
        });

        const projectDescription = utils.createElement('p', {
            className: 'project-description',
            textContent: project.description
        });

        const projectTech = utils.createElement('div', {
            className: 'project-tech'
        });

        project.technologies.forEach(tech => {
            const techTag = utils.createElement('span', {
                className: 'tech-tag',
                textContent: tech
            });
            projectTech.appendChild(techTag);
        });

        const projectLinks = utils.createElement('div', {
            className: 'project-links'
        });

        if (project.demoUrl) {
            const demoLink = utils.createElement('a', {
                href: project.demoUrl,
                className: 'project-link',
                target: '_blank',
                innerHTML: '<span>Live Demo</span> 🚀'
            });
            projectLinks.appendChild(demoLink);
        }

        if (project.githubUrl) {
            const githubLink = utils.createElement('a', {
                href: project.githubUrl,
                className: 'project-link',
                target: '_blank',
                innerHTML: '<span>Code</span> 💻'
            });
            projectLinks.appendChild(githubLink);
        }

        projectHeader.appendChild(projectTitle);
        projectHeader.appendChild(projectCategory);
        
        projectContent.appendChild(projectHeader);
        projectContent.appendChild(projectDescription);
        projectContent.appendChild(projectTech);
        projectContent.appendChild(projectLinks);

        projectCard.appendChild(projectImage);
        projectCard.appendChild(projectContent);

        // Add click handler for modal
        projectCard.addEventListener('click', () => {
            this.openProjectModal(project);
        });

        return projectCard;
    }

    // Build social links
    buildSocialLinks(socials) {
        const socialContainer = utils.$('#social-links');
        if (!socialContainer || !socials) return;

        socialContainer.innerHTML = '';

        socials.forEach((social, index) => {
            const socialLink = utils.createElement('a', {
                href: social.url,
                className: `social-link ${social.icon}`,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: social.name,
                style: `animation-delay: ${index * 0.1}s`,
                innerHTML: this.getSocialIcon(social.icon)
            });

            socialContainer.appendChild(socialLink);
        });
    }

    // Open project modal
    openProjectModal(project) {
        const modal = utils.$('#project-modal');
        const modalBody = utils.$('#modal-body');
        
        if (!modal || !modalBody) return;

        modalBody.innerHTML = this.createProjectModalContent(project);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeProjectModal());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal();
            }
        });

        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        
        document.addEventListener('keydown', escapeHandler);
    }

    // Close project modal
    closeProjectModal() {
        const modal = utils.$('#project-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Create project modal content
    createProjectModalContent(project) {
        return `
            <div class="project-modal-content">
                <img src="${project.image}" alt="${project.title}" class="modal-project-image">
                
                <div class="modal-project-info">
                    <div class="modal-project-details">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        
                        <h4>Key Features</h4>
                        <ul class="modal-features">
                            ${project.features ? project.features.map(feature => `<li>${feature}</li>`).join('') : ''}
                        </ul>
                    </div>
                    
                    <div class="modal-project-sidebar">
                        <div class="modal-tech-stack">
                            <h4>Tech Stack</h4>
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-project-links">
                            ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-primary" target="_blank">Live Demo 🚀</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" class="btn btn-outline" target="_blank">View Code 💻</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update developer info
    updateDeveloperInfo(developer) {
        // Update hero section
        const heroTitle = utils.$('.hero-title .glitch');
        if (heroTitle) {
            heroTitle.textContent = developer.name;
            heroTitle.dataset.text = developer.name;
        }

        const avatarImage = utils.$('#avatar-image');
        if (avatarImage) {
            if (developer.avatar && developer.avatar !== 'https://via.placeholder.com/400x400/0D1117/00D9FF?text=PŚ') {
                // Set real avatar image
                avatarImage.style.backgroundImage = `url('${developer.avatar}')`;
                avatarImage.style.backgroundSize = 'cover';
                avatarImage.style.backgroundPosition = 'center';
                avatarImage.textContent = ''; // Remove fallback text
            } else {
                // Fallback to initials
                avatarImage.textContent = developer.nickname || 'PŚ';
            }
        }

        // Update about section
        const aboutDescription = utils.$('#about-description');
        if (aboutDescription) {
            aboutDescription.textContent = developer.description;
        }

        // Update stats
        const stats = [
            { selector: '.stat-number[data-target="3"]', value: parseInt(developer.experience) || 3 },
            { selector: '.stat-number[data-target="25"]', value: parseInt(developer.projectsCompleted) || 25 },
            { selector: '.stat-number[data-target="15"]', value: parseInt(developer.technologiesMastered) || 15 }
        ];

        stats.forEach(stat => {
            const element = utils.$(stat.selector);
            if (element) {
                element.dataset.target = stat.value;
            }
        });
    }

    // Filter projects
    filterProjects(category) {
        const projectCards = utils.$$('.project-card');
        const projectsGrid = utils.$('.projects-grid');
        
        // Add shuffle animation to grid
        projectsGrid.style.transform = 'scale(0.98)';
        projectsGrid.style.filter = 'blur(1px)';
        
        // First hide all cards
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('show');
                card.classList.add('hide');
            }, index * 30);
        });
        
        // Then show matching cards after a delay
        setTimeout(() => {
            projectsGrid.style.transform = 'scale(1)';
            projectsGrid.style.filter = 'blur(0px)';
            
            let visibleIndex = 0;
            projectCards.forEach((card) => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    setTimeout(() => {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    }, visibleIndex * 80);
                    visibleIndex++;
                }
            });
        }, 400);

        // Update filter buttons
        const filterButtons = utils.$$('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
    }

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            'Frontend': '🎨',
            'Backend': '⚙️',
            'Mobile': '📱',
            'Tools & OS': '🛠️',
            'Database': '🗄️',
            'DevOps': '☁️'
        };
        
        return icons[category] || '💻';
    }

    // Get social icon
    getSocialIcon(iconName) {
        const icons = {
            'github': '📦',
            'threads': '🧵',
            'instagram': '📷',
            'linkedin': '💼',
            'twitter': '🐦',
            'email': '📧'
        };
        
        return icons[iconName] || '🔗';
    }

    // Create loading skeleton
    createLoadingSkeleton(container) {
        const skeleton = utils.createElement('div', {
            className: 'loading-skeleton',
            innerHTML: `
                <div class="skeleton-item"></div>
                <div class="skeleton-item"></div>
                <div class="skeleton-item"></div>
            `
        });
        
        container.appendChild(skeleton);
    }

    // Remove loading skeleton
    removeLoadingSkeleton(container) {
        const skeleton = container.querySelector('.loading-skeleton');
        if (skeleton) {
            skeleton.remove();
        }
    }
}

// Initialize component builder
utils.ready(() => {
    window.componentBuilder = new ComponentBuilder();
});

// Export for external use
window.ComponentBuilder = ComponentBuilder;
