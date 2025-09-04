const DEFAULT_AVATAR_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAACUCAMAAADrljhyAAAAYFBMVEXZ3OFwd3/c3+Rxd31weHxydn9yd3vZ3eDg4+hvdHhtdXjHy89tdHzV2N3N0NV7gIShpqq8wMSTl5uZn6J9g4qvsreLkZhqb3OGiY6AiItkbG9nbne1uL2nrbJ4goSIjpFTcY+bAAAFSElEQVR4nO2c7ZKjKhBAtUEC+BU0ihqN7/+Wi8luZiZ3oqIo5Jbn10xtTdUptm26odXzDg4ODg4ODg4ODg4OPhz4h22ReQD1EiHathUi8Si1rTOF0m3z8uIjLrnvX8q89ajTKw3JOY0U/gP1E0nPibvKpySXkvg/QEzKPHTTGeIulQihF2OFTLvYQWeaVM9oeCViVeLcIwgt5m98FYSR1q1VPnkdwvi9sQoN1p1sW36Hntm7iPgHY2eHAoMWkqAJY0Jk4YwyFOw1RfweGIUjsQwinQqJv4GRCjeUT7eRLPEjMFga25YdoNl1nrBCZg6EMoj5wr7P7ccFxNXkQ/fduLK+Xw95Yr6w2mas54uk1jPmdWJXGNrpveM7GEvLBcapnpeKv+C1VWMIG01hHzdW63uaS21jntvMyXAbKTF/B5HU4hpDOFYUvzMmFsOCFlzbWPWqFqtOyBmZVnwlshnI2SLj0p5w3C8yrqyduYDaopcYX5KTpS4VwnSZcfhZxkHwYcbBYby58T2OreWK8LIwV9jLbtWH5eNlOwhivcVTiwW7NMY8sye8pBLCVkt62ulXmyq7dRarzXaJcWSxm4ZEvwcJAt/mdRlNZx5rfoF5arMzpfkCY7u9tFhwXmH5eFP3SMhH3KqvB2ed0+MBafvKKZy+s/mxwgiFdoW9ONM6jSUss30VAkLnNBYR4sC1Qs40jFlmXVjte2T+xoeYC+MhtGhmG1/duOiF88yND19zB1ZYcYqzefsIt54n/gHxrGvTa2b9Lu8JeJkkZKQdUVkNy8xzRlgFBm1TNpKYCWGpGw/dFxDm8n00M5aHjgkr5ZPopcQ/QEMjinHDS3FyKCKewDBRiPnAQ5ijKFI/D1OFLvoOAPXCIu/rNE2V8O1WX8q8CF2f3FR6SSjuhGFy/919AD5sAPng4H/D6Y5tCx0+yRiAfuF2frvbxYnozmV5uZOdC5HE8fBP7i230k1Ekde8aRp5DYJoONpmUjYNr/NChLFjq63qiS67YPmogZ51sirkkSqIuMSXzKX6Amjc1RhFQfC2PlZrzkhVxE44Qxxm6r8eo2DUOFBtSNNkwnqrB3HbN49QGBEelBEaAqTp29jqgTe0FedaU5CcVK212AAQ/fCo6c3GqgexFna6akgyeY8HjSX2H92UzJL98zN4bSq1Dru/rTSRt3bv/ExPGRk7oJgwJpxn3q5PIIjg+p/XxDSU1V9e9z377shY9p0HJt1eugA55waMOc/3CWbwSt0bsXfIco+jIkgq7SnpdyC2wwDOwtmgN8ZIbq4M3sy3ruY6s3Tb/Q/iWquMmIawetNyLu4XDHWPsvEtKuRmF/jhzM+bLTItDIfEA7zZYD2Ejf5Y0BxjJLcZ5IRk9HJmDdFtmxyXM7KRsc/zDXyh5SuqtQkwMz8DBzHRGf3QJQqMZ2WavX7nwSxX0+/M0nDGS9yr4IavKON+W19lbHYqGdotg3gAcbMPX1wZrdh+VY4qg4tM2+vaHmmSILi25iIZLqu7uhnGkbmXI4d50s2N/QBJYWqRaa89s7sExEpDxkveJl2EsTdQ4bxJWfwLkaHaftmbjouMSyMJDsTomJVRkJGwgM7UEdA00sxHh7bf755EvQnhRGNady2YG2ifaKv9OsJykDSwU9Nsl+3jrzEzUNjTuV8LMmJM1r+QA57pc6txY7k6I4OQ+xqvvh1Z9MGHFcrrP1AG5637pZ+s/1QE9Dsbl6sTcrVx1/9qfFm7T8eX/fboh/HKZAHJzsZ+unKfhjDdqQF5Gq8sOCG8fZzx7mu8cgsBoTnysRo0ZfwHaCZSF7tGCm8AAAAASUVORK5CYII=';
class ComponentBuilder {
    constructor() {
        this.components = new Map();
    }
    buildSkillsSection(skills) {
        const skillsGrid = utils.$('#skills-grid');
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
            const categoryElement = this.createSkillCategory(skillCategory, index);
            skillsGrid.appendChild(categoryElement);
        });
        setTimeout(() => {
            const skillElements = utils.$$('.skill-category');
            skillElements.forEach(element => {
                if (!element.classList.contains('in-view')) {
                    element.classList.add('in-view');
                }
            });
        }, 500);
    }
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
        const skillIconsContainer = utils.createElement('div', {
            className: 'skill-3d-container'
        });
        category.technologies.forEach((tech, techIndex) => {
            const skillIcon = utils.createElement('div', {
                className: 'skill-3d-icon',
                style: `--index: ${techIndex}`,
                innerHTML: tech.icon,
                title: tech.name
            });
            skillIconsContainer.appendChild(skillIcon);
            const techItem = this.createTechnologyItem(tech, techIndex);
            technologiesList.appendChild(techItem);
        });
        categoryCard.appendChild(categoryTitle);
        categoryCard.appendChild(skillIconsContainer);
        categoryCard.appendChild(technologiesList);
        return categoryCard;
    }
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
            style: `width: ${tech.level}%` 
        });
        techHeader.appendChild(techName);
        techHeader.appendChild(techLevel);
        progressBar.appendChild(progressFill);
        techItem.appendChild(techHeader);
        techItem.appendChild(progressBar);
        return techItem;
    }
    buildProjectsSection(projectsData) {
        const projectsGrid = utils.$('#projects-grid');
        const projectsFilter = utils.$('.projects-filter');
        if (!projectsGrid) {
            return;
        }
        if (projectsData && projectsData.underConstruction) {
            this.showConstructionMessage(projectsGrid, projectsFilter);
            return;
        }
        const projects = projectsData?.projects || projectsData;
        if (!projects || projects.length === 0) {
            this.showConstructionMessage(projectsGrid, projectsFilter);
            return;
        }
        if (projectsFilter) {
            projectsFilter.style.display = 'flex';
        }
        projectsGrid.innerHTML = '';
        projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
        setTimeout(() => {
            const projectElements = utils.$$('.project-card');
            projectElements.forEach(element => {
                if (!element.classList.contains('in-view')) {
                    element.classList.add('in-view');
                }
            });
        }, 500);
    }
    showConstructionMessage(projectsGrid, projectsFilter) {
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
    createProjectCard(project, index) {
        const projectCard = utils.createElement('div', {
            className: `project-card animate-on-scroll show ${project.category.toLowerCase().replace(' ', '-')}`,
            style: `--index: ${index}; animation-delay: ${index * 0.1}s`,
            'data-category': project.category.toLowerCase().replace(/\s+/g, '-'),
            'data-project-id': project.id
        });
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
        projectCard.addEventListener('click', () => {
            this.openProjectModal(project);
        });
        return projectCard;
    }
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
    openProjectModal(project) {
        const modal = utils.$('#project-modal');
        const modalBody = utils.$('#modal-body');
        if (!modal || !modalBody) return;
        modalBody.innerHTML = this.createProjectModalContent(project);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeProjectModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal();
            }
        });
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    closeProjectModal() {
        const modal = utils.$('#project-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
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
    updateDeveloperInfo(developer) {
        const heroTitle = utils.$('.hero-title .glitch');
        if (heroTitle) {
            heroTitle.textContent = developer.name;
            heroTitle.dataset.text = developer.name;
        }
        const avatarImage = utils.$('#avatar-image');
        if (avatarImage) {
            if (developer.avatar && developer.avatar !== DEFAULT_AVATAR_BASE64) {
                avatarImage.style.backgroundImage = `url('${developer.avatar}')`;
                avatarImage.style.backgroundSize = 'cover';
                avatarImage.style.backgroundPosition = 'center';
                avatarImage.textContent = ''; 
            } else {
                avatarImage.textContent = developer.nickname || 'PŚ';
            }
        }
        const aboutDescription = utils.$('#about-description');
        if (aboutDescription) {
            aboutDescription.textContent = developer.description;
        }
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
    filterProjects(category) {
        const projectCards = utils.$$('.project-card');
        const projectsGrid = utils.$('.projects-grid');
        projectsGrid.style.transform = 'scale(0.98)';
        projectsGrid.style.filter = 'blur(1px)';
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('show');
                card.classList.add('hide');
            }, index * 30);
        });
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
        const filterButtons = utils.$$('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
    }
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
    removeLoadingSkeleton(container) {
        const skeleton = container.querySelector('.loading-skeleton');
        if (skeleton) {
            skeleton.remove();
        }
    }
}
utils.ready(() => {
    window.componentBuilder = new ComponentBuilder();
});
window.ComponentBuilder = ComponentBuilder;
