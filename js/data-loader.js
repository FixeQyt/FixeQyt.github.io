// Data loader module for fetching and managing portfolio data

class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
    }

    // Generic fetch function with caching
    async fetchData(url, useCache = true) {
        try {
            // Check cache first
            if (useCache && this.cache.has(url)) {
                return this.cache.get(url);
            }

            // Check if already loading
            if (this.loadingStates.has(url)) {
                return this.loadingStates.get(url);
            }

            // Create loading promise
            const loadingPromise = fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.cache.set(url, data);
                    this.loadingStates.delete(url);
                    return data;
                })
                .catch(error => {
                    this.loadingStates.delete(url);
                    throw error;
                });

            this.loadingStates.set(url, loadingPromise);
            return loadingPromise;

        } catch (error) {
            utils.errorHandler(error, 'DataLoader.fetchData');
            throw error;
        }
    }

    // Load developer data
    async loadDeveloperData() {
        const trackLoading = window.loadingManager?.trackDataLoading('developer-data');
        
        try {
            const data = await this.fetchData('./data/data.json');
            trackLoading?.(true);
            return data;
        } catch (error) {
            console.error('Failed to load developer data:', error);
            utils.errorHandler(error, 'DataLoader.loadDeveloperData');
            trackLoading?.(false);
            // Return fallback data
            return this.getFallbackDeveloperData();
        }
    }

    // Load projects data
    async loadProjectsData() {
        const trackLoading = window.loadingManager?.trackDataLoading('projects-data');
        
        try {
            // Add timestamp to avoid caching issues during development
            const url = './data/projects.json?t=' + Date.now();
            const data = await this.fetchData(url, false); // Disable cache for projects
            
            // Track project images for loading manager
            if (data.projects && window.loadingManager) {
                data.projects.forEach(project => {
                    if (project.image) {
                        window.loadingManager.addResource('image', project.image);
                    }
                });
            }
            
            trackLoading?.(true);
            return data; // Return full data object including underConstruction flag
        } catch (error) {
            console.error('Failed to load projects data:', error);
            utils.errorHandler(error, 'DataLoader.loadProjectsData');
            trackLoading?.(false);
            // Return fallback data
            return { 
                underConstruction: false, 
                projects: this.getFallbackProjectsData() 
            };
        }
    }

    // Fallback developer data
    getFallbackDeveloperData() {
        return {
            developer: {
                name: "Paweł Sobczak",
                nickname: "FixeQ",
                title: "Full Stack Developer",
                tagline: "Crafting Digital Experiences with Code",
                description: "Passionate full-stack developer specializing in modern web technologies.",
                location: "Arch Linux Enthusiast",
                experience: "3+ Years",
                projectsCompleted: "25+",
                technologiesMastered: "15+"
            },
            skills: [
                {
                    category: "Frontend",
                    technologies: [
                        { name: "JavaScript", level: 95, icon: "⚡", color: "#F7DF1E" },
                        { name: "HTML5", level: 90, icon: "🌐", color: "#E34F26" },
                        { name: "CSS3", level: 88, icon: "🎨", color: "#1572B6" }
                    ]
                },
                {
                    category: "Backend",
                    technologies: [
                        { name: "Node.js", level: 92, icon: "🚀", color: "#339933" },
                        { name: "Python", level: 85, icon: "🐍", color: "#3776AB" }
                    ]
                }
            ],
            socials: [
                { name: "GitHub", url: "https://github.com/fixeq", icon: "github", color: "#00D9FF" },
                { name: "Threads", url: "https://threads.net/@fixeq", icon: "threads", color: "#FF0080" },
                { name: "Instagram", url: "https://instagram.com/fixeq", icon: "instagram", color: "#E4405F" }
            ]
        };
    }

    // Fallback projects data
    getFallbackProjectsData() {
        return [
            {
                id: 1,
                title: "Portfolio Website",
                description: "Modern portfolio website with 3D animations and responsive design.",
                image: "",
                technologies: ["HTML5", "CSS3", "JavaScript"],
                category: "Frontend",
                status: "Completed",
                demoUrl: "#",
                githubUrl: "#",
                features: ["3D animations", "Responsive design", "Modern UI/UX"]
            }
        ];
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        this.loadingStates.clear();
    }

    // Preload all data
    async preloadAllData() {
        try {
            const [developerData, projectsData] = await Promise.all([
                this.loadDeveloperData(),
                this.loadProjectsData()
            ]);

            return {
                developer: developerData,
                projects: projectsData
            };
        } catch (error) {
            utils.errorHandler(error, 'DataLoader.preloadAllData');
            throw error;
        }
    }
}

// Create global instance
window.dataLoader = new DataLoader();

// Data management functions
const dataManager = {
    data: {
        developer: null,
        projects: null,
        skills: null,
        socials: null
    },

    // Initialize all data
    async init() {
        try {
            utils.performanceMonitor.mark('data-load-start');
            
            const allData = await window.dataLoader.preloadAllData();
            
            this.data.developer = allData.developer.developer;
            this.data.skills = allData.developer.skills;
            this.data.socials = allData.developer.socials;
            this.data.projects = allData.projects.projects || allData.projects;
            this.data.projectsData = allData.projects; // Store full projects data object
            
            utils.performanceMonitor.mark('data-load-end');
            utils.performanceMonitor.measure('data-load-time', 'data-load-start', 'data-load-end');
            
            return this.data;
        } catch (error) {
            utils.errorHandler(error, 'dataManager.init');
            throw error;
        }
    },

    // Get developer info
    getDeveloper() {
        return this.data.developer;
    },

    // Get skills by category
    getSkillsByCategory(category) {
        if (!this.data.skills) return [];
        
        const skillCategory = this.data.skills.find(cat => 
            cat.category.toLowerCase() === category.toLowerCase()
        );
        
        return skillCategory ? skillCategory.technologies : [];
    },

    // Get all skills
    getAllSkills() {
        return this.data.skills || [];
    },

    // Get projects by category
    getProjectsByCategory(category) {
        if (!this.data.projects) return [];
        
        if (category === 'all') return this.data.projects;
        
        return this.data.projects.filter(project => 
            project.category.toLowerCase().replace(' ', '-') === category.toLowerCase()
        );
    },

    // Get project by ID
    getProjectById(id) {
        if (!this.data.projects) return null;
        
        return this.data.projects.find(project => project.id === parseInt(id));
    },

    // Get social links
    getSocials() {
        return this.data.socials || [];
    },

    // Search projects
    searchProjects(query) {
        if (!this.data.projects || !query) return this.data.projects;
        
        const searchTerm = query.toLowerCase();
        
        return this.data.projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
    },

    // Get project categories
    getProjectCategories() {
        if (!this.data.projects) return [];
        
        const categories = [...new Set(this.data.projects.map(project => project.category))];
        return ['All', ...categories];
    },

    // Get technology list
    getAllTechnologies() {
        const technologies = new Set();
        
        if (this.data.skills) {
            this.data.skills.forEach(category => {
                category.technologies.forEach(tech => {
                    technologies.add(tech.name);
                });
            });
        }
        
        if (this.data.projects) {
            this.data.projects.forEach(project => {
                project.technologies.forEach(tech => {
                    technologies.add(tech);
                });
            });
        }
        
        return Array.from(technologies);
    },

    // Update data (for future real-time updates)
    updateData(type, newData) {
        if (this.data.hasOwnProperty(type)) {
            this.data[type] = newData;
            this.notifyDataChanged(type, newData);
        }
    },

    // Event system for data changes
    listeners: new Map(),

    // Add data change listener
    addListener(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type).push(callback);
    },

    // Remove data change listener
    removeListener(type, callback) {
        if (this.listeners.has(type)) {
            const callbacks = this.listeners.get(type);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    },

    // Notify listeners of data changes
    notifyDataChanged(type, data) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    utils.errorHandler(error, `dataManager.notifyDataChanged.${type}`);
                }
            });
        }
    }
};

// Export data manager
window.dataManager = dataManager;
