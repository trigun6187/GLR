document.addEventListener('DOMContentLoaded', () => {
    // --- Versioning ---
    const currentVersion = "1.1.0"; // Updated version number
    const versionNumberSpan = document.getElementById('version-number');
    if (versionNumberSpan) {
        versionNumberSpan.textContent = `(v${currentVersion})`;
    }

    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'ghost-legacy-theme';

    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme) {
        body.classList.add(savedTheme);
    } else {
        body.classList.add('theme-dark'); // Default to dark mode
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('theme-light');
        body.classList.toggle('theme-dark');
        const newTheme = body.classList.contains('theme-light') ? 'theme-light' : 'theme-dark';
        localStorage.setItem(themeKey, newTheme);
    });

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('nav ul li a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Content Loading and Rendering ---
    async function loadContent() {
        try {
            const response = await fetch('data/content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentData = await response.json();
            renderContent(contentData);
            // Try to render changelog from content.json if it exists
            if (contentData.changelog && contentData.changelog.length > 0) {
                renderChangelog(contentData.changelog);
            } else {
                // If content.json doesn't have changelog or it's empty, use fallback
                renderChangelog();
            }
        } catch (error) {
            console.error("Error loading content:", error);
            // Render fallback changelog if content fails to load
            renderChangelog();
        }
    }

    function renderContent(data) {
        // --- Hero Section ---
        const heroContent = document.querySelector('.hero-content');
        const heroBackground = document.querySelector('.hero-background');
        if (heroContent && data.greeting) {
            heroContent.querySelector('h2').textContent = data.greeting.title;
            heroContent.querySelector('p').textContent = data.greeting.subtitle;
            const ctaButton = heroContent.querySelector('.cta-button');
            if (ctaButton) {
                ctaButton.textContent = data.greeting.callToAction.text;
                ctaButton.href = data.greeting.callToAction.url;
            }
        }
        if (heroBackground && data.greeting.background_image) {
            heroBackground.style.backgroundImage = `url('${data.greeting.background_image}')`;
        }

        // --- Games Section ---
        const gamesGrid = document.querySelector('#games .content-grid');
        if (gamesGrid && data.sections?.games?.items) {
            gamesGrid.innerHTML = ''; // Clear existing placeholders
            data.sections.games.items.forEach(game => {
                const card = document.createElement('div');
                card.className = 'content-card';
                card.innerHTML = `
                    <img src="${game.image || 'assets/img/game-placeholder.png'}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <a href="${game.url || '#'}" class="read-more">Watch/Read More &rarr;</a>
                    <small>Tags: ${game.tags.join(', ')}</small>
                `;
                gamesGrid.appendChild(card);
            });
        }

        // --- Music Section ---
        const musicGrid = document.querySelector('#music .content-grid');
        if (musicGrid && data.sections?.music?.playlists) {
            musicGrid.innerHTML = '';
            data.sections.music.playlists.forEach(playlist => {
                const card = document.createElement('div');
                card.className = 'content-card music-card';
                card.innerHTML = `
                    <h4>${playlist.title}</h4>
                    <p>${playlist.description}</p>
                    <a href="${playlist.url || '#'}">Listen &rarr;</a>
                    ${playlist.image ? `<img src="${playlist.image}" alt="${playlist.title}" style="max-width:100px; margin-top:10px;">` : ''}
                `;
                musicGrid.appendChild(card);
            });
        }

        // --- OBS Section ---
        const obsGrid = document.querySelector('#obs .content-grid');
        if (obsGrid && data.sections?.obs?.guides) {
            obsGrid.innerHTML = '';
            data.sections.obs.guides.forEach(guide => {
                const card = document.createElement('div');
                card.className = 'content-card obs-card';
                card.innerHTML = `
                    <h4>${guide.title}</h4>
                    <p>${guide.description}</p>
                    <a href="${guide.url || '#'}">Read Guide &rarr;</a>
                     ${guide.image ? `<img src="${guide.image}" alt="${guide.title}" style="max-width:100px; margin-top:10px;">` : ''}
                `;
                obsGrid.appendChild(card);
            });
        }

        // --- Blog Section ---
        const blogList = document.getElementById('blog-list');
        if (blogList && data.sections?.blog?.posts) {
            blogList.innerHTML = '';
            data.sections.blog.posts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'blog-post-preview';
                article.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.url || '#'}">Read More &rarr;</a>
                    <p><small>By ${post.author || 'Admin'} on ${post.date || 'N/A'}</small></p>
                `;
                blogList.appendChild(article);
            });
        }
    }

    // --- Changelog Rendering ---
    function renderChangelog(entries) {
        const changelogContentDiv = document.getElementById('changelog-content');
        if (!changelogContentDiv) return; // Exit if the element doesn't exist
        changelogContentDiv.innerHTML = '';

        // Use provided entries if they exist and are not empty, otherwise fallback to hardcoded ones
        const changelogData = entries && entries.length > 0 ? entries : [
            {
                version: "1.1.0",
                date: "2024-03-27",
                changes: [
                    "Fixed version number display in header.",
                    "Ensured changelog is visible and uses fallback data.",
                    "Improved layout alignment with original site inspiration."
                ]
            },
            {
                version: "1.0.0",
                date: "2024-03-26",
                changes: [
                    "Initial release of Ghost Legacy Reloaded.",
                    "Implemented futuristic dark theme, header, navigation, and hero section.",
                    "Added version number and changelog section.",
                    "Basic structure for Games, Music, OBS, Blog, About, and Links sections."
                ]
            }
        ];

        if (changelogData.length === 0) {
             changelogContentDiv.innerHTML = "<p>No changelog entries found.</p>";
             return;
        }

        changelogData.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.innerHTML = `
                <h3>v${entry.version} (${entry.date})</h3>
                <ul>
                    ${entry.changes.map(change => `<li>${change}</li>`).join('')}
                </ul>
            `;
            changelogContentDiv.appendChild(entryDiv);
        });
    }

    // --- Username Format Checker (Keeping for now, can be refactored) ---
    const usernameInput = document.getElementById('username-input');
    const platformSelect = document.getElementById('platform-select');
    const checkUsernameBtn = document.getElementById('check-username-btn');
    const usernameResultP = document.getElementById('username-result');
    let usernameRules = {};

    async function loadUsernameRules() { /* ... existing logic ... */ }
    function populatePlatformSelect() { /* ... existing logic ... */ }

    // --- Password Strength Checker ---
    const passwordInput = document.getElementById('password-input');
    const passwordStrengthP = document.getElementById('password-strength');
    function checkPasswordStrength() { /* ... existing logic ... */ }

    // --- Initial Load ---
    loadContent(); // Load main content data first
    loadUsernameRules(); // Load username rules
    // Initialize password strength display if input has value (though it's empty on load)
    if (passwordInput && passwordInput.value) checkPasswordStrength();
    if (passwordInput) passwordInput.addEventListener('input', checkPasswordStrength);

    // --- Resource Directory (kept for now, might be refactored/removed) ---
    const resourceSearchInput = document.getElementById('resource-search');
    const resourceCategoriesDiv = document.getElementById('resource-categories');
    const resourceListDiv = document.getElementById('resource-list');
    let allResources = [];
    let currentFilter = 'all';

    async function loadResources() { /* ... existing logic ... */ }
    function renderResources(filter = 'all', searchTerm = '') { /* ... existing logic ... */ }
    function populateCategories() { /* ... existing logic ... */ }
    if (resourceSearchInput) resourceSearchInput.addEventListener('input', () => renderResources(currentFilter, resourceSearchInput.value));


});
