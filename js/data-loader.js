class DataLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
    }
    async fetchData(url, useCache = true) {
        try {
            if (useCache && this.cache.has(url)) {
                return this.cache.get(url);
            }
            if (this.loadingStates.has(url)) {
                return this.loadingStates.get(url);
            }
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
            return this.getFallbackDeveloperData();
        }
    }
    async loadProjectsData() {
        const trackLoading = window.loadingManager?.trackDataLoading('projects-data');
        try {
            const url = './data/projects.json?t=' + Date.now();
            const data = await this.fetchData(url, false); 
            if (data.projects && window.loadingManager) {
                data.projects.forEach(project => {
                    if (project.image) {
                        window.loadingManager.addResource('image', project.image);
                    }
                });
            }
            trackLoading?.(true);
            return data; 
        } catch (error) {
            console.error('Failed to load projects data:', error);
            utils.errorHandler(error, 'DataLoader.loadProjectsData');
            trackLoading?.(false);
            return { 
                underConstruction: false, 
                projects: this.getFallbackProjectsData() 
            };
        }
    }
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
                { name: "GitHub", url: "https://github.com/FixeQyt" },
                { name: "Threads", url: "https://threads.com/@fixeq.dev" },
                { name: "Instagram", url: "https://instagram.com/fixeq.dev" }
            ]
        };
    }
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
    clearCache() {
        this.cache.clear();
        this.loadingStates.clear();
    }
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
window.dataLoader = new DataLoader();
const dataManager = {
    data: {
        developer: null,
        projects: null,
        skills: null,
        socials: null
    },
    async init() {
        try {
            utils.performanceMonitor.mark('data-load-start');
            const allData = await window.dataLoader.preloadAllData();
            this.data.developer = allData.developer.developer;
            this.data.skills = allData.developer.skills;
            this.data.socials = allData.developer.socials;
            this.data.projects = allData.projects.projects || allData.projects;
            this.data.projectsData = allData.projects; 
            utils.performanceMonitor.mark('data-load-end');
            utils.performanceMonitor.measure('data-load-time', 'data-load-start', 'data-load-end');
            return this.data;
        } catch (error) {
            utils.errorHandler(error, 'dataManager.init');
            throw error;
        }
    },
    getDeveloper() {
        return this.data.developer;
    },
    getSkillsByCategory(category) {
        if (!this.data.skills) return [];
        const skillCategory = this.data.skills.find(cat => 
            cat.category.toLowerCase() === category.toLowerCase()
        );
        return skillCategory ? skillCategory.technologies : [];
    },
    getAllSkills() {
        return this.data.skills || [];
    },
    getProjectsByCategory(category) {
        if (!this.data.projects) return [];
        if (category === 'all') return this.data.projects;
        return this.data.projects.filter(project => 
            project.category.toLowerCase().replace(' ', '-') === category.toLowerCase()
        );
    },
    getProjectById(id) {
        if (!this.data.projects) return null;
        return this.data.projects.find(project => project.id === parseInt(id));
    },
    getSocials() {
        return this.data.socials || [];
    },
    searchProjects(query) {
        if (!this.data.projects || !query) return this.data.projects;
        const searchTerm = query.toLowerCase();
        return this.data.projects.filter(project => 
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
    },
    getProjectCategories() {
        if (!this.data.projects) return [];
        const categories = [...new Set(this.data.projects.map(project => project.category))];
        return ['All', ...categories];
    },
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
    updateData(type, newData) {
        if (this.data.hasOwnProperty(type)) {
            this.data[type] = newData;
            this.notifyDataChanged(type, newData);
        }
    },
    listeners: new Map(),
    addListener(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type).push(callback);
    },
    removeListener(type, callback) {
        if (this.listeners.has(type)) {
            const callbacks = this.listeners.get(type);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    },
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
window.dataManager = dataManager;
