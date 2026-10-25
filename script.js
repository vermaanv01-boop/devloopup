// DevLookup - GitHub Profile Finder
// Vanilla HTML, CSS, JavaScript

const searchForm = document.getElementById('searchForm');
const usernameInput = document.getElementById('usernameInput');

// GSAP
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

let currentScrollTriggers = [];
let prefersReducedMotion = false;

// Check prefers-reduced-motion
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
        prefersReducedMotion = e.matches;
    });
}

// Clear all ScrollTriggers
function clearScrollTriggers() {
    currentScrollTriggers.forEach((trigger) => {
        if (trigger && typeof trigger.kill === 'function') {
            trigger.kill();
        }
    });
    currentScrollTriggers = [];
}

// Status elements
const loadingIndicator = document.getElementById('loadingIndicator');
const notFoundMessage = document.getElementById('notFoundMessage');
const errorMessage = document.getElementById('errorMessage');

// Profile elements
const profileStage = document.getElementById('profileStage');
const avatar = document.getElementById('avatar');
const nameEl = document.getElementById('name');
const usernameEl = document.getElementById('username');
const bioEl = document.getElementById('bio');
const locationItem = document.getElementById('locationItem');
const locationEl = document.getElementById('location');
const companyItem = document.getElementById('companyItem');
const companyEl = document.getElementById('company');
const followersEl = document.getElementById('followers');
const followingEl = document.getElementById('following');
const publicReposEl = document.getElementById('publicRepos');

// Repos elements
const reposStage = document.getElementById('reposStage');
const reposList = document.getElementById('reposList');
const noReposMessage = document.getElementById('noReposMessage');

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Hide all status messages
function hideAllStatus() {
    loadingIndicator.classList.remove('active');
    loadingIndicator.setAttribute('aria-hidden', 'true');
    
    notFoundMessage.classList.remove('active');
    notFoundMessage.setAttribute('aria-hidden', 'true');
    
    errorMessage.classList.remove('active');
    errorMessage.setAttribute('aria-hidden', 'true');
}

// Show loading indicator
function showLoading() {
    hideAllStatus();
    loadingIndicator.classList.add('active');
    loadingIndicator.setAttribute('aria-hidden', 'false');
}

// Show not found message
function showNotFound() {
    hideAllStatus();
    notFoundMessage.classList.add('active');
    notFoundMessage.setAttribute('aria-hidden', 'false');
}

// Show error message
function showError() {
    hideAllStatus();
    errorMessage.classList.add('active');
    errorMessage.setAttribute('aria-hidden', 'false');
}

// Hide profile and repos sections
function hideProfileAndRepos() {
    if (profileStage) {
        profileStage.classList.remove('active');
    }
    if (reposStage) {
        reposStage.classList.remove('active');
    }
    clearScrollTriggers();
}

// Format number with commas
function formatNumber(num) {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString();
}

// Fetch GitHub user profile
async function fetchUserProfile(username) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`);
        
        if (response.status === 404) {
            return { found: false };
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { found: true, data };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Fetch user repositories
async function fetchUserRepos(username) {
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user repos:', error);
        throw error;
    }
}

// Animate profile section
function animateProfile() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || !profileStage) {
        return;
    }
    
    gsap.set(profileStage, { opacity: 0, y: 30 });
    gsap.to(profileStage, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    const statBlocks = profileStage.querySelectorAll('.stat-block');
    gsap.set(statBlocks, { opacity: 0, y: 16 });
    gsap.to(statBlocks, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.25
    });
}

// Display user profile
function displayProfile(userData) {
    // Avatar
    avatar.src = userData.avatar_url || '';
    avatar.alt = `${userData.login || 'User'}'s avatar`;
    
    // Name
    if (userData.name) {
        nameEl.textContent = userData.name;
        nameEl.style.display = 'block';
    } else {
        nameEl.textContent = '';
        nameEl.style.display = 'none';
    }
    
    // Username
    usernameEl.href = userData.html_url || `https://github.com/${userData.login}`;
    usernameEl.textContent = `@${userData.login || ''}`;
    
    // Bio
    if (userData.bio) {
        bioEl.textContent = userData.bio;
        bioEl.style.display = 'block';
    } else {
        bioEl.textContent = '';
        bioEl.style.display = 'none';
    }
    
    // Location
    if (userData.location) {
        locationEl.textContent = userData.location;
        if (locationItem) locationItem.style.display = 'flex';
    } else {
        locationEl.textContent = '';
        if (locationItem) locationItem.style.display = 'none';
    }
    
    // Company
    if (userData.company) {
        companyEl.textContent = userData.company;
        if (companyItem) companyItem.style.display = 'flex';
    } else {
        companyEl.textContent = '';
        if (companyItem) companyItem.style.display = 'none';
    }
    
    // Stats
    followersEl.textContent = formatNumber(userData.followers || 0);
    followingEl.textContent = formatNumber(userData.following || 0);
    publicReposEl.textContent = formatNumber(userData.public_repos || 0);
    
    // Show profile section
    if (profileStage) {
        profileStage.classList.add('active');
    }
    animateProfile();
}

// Animate repositories
function animateRepos() {
    if (prefersReducedMotion || typeof gsap !== 'undefined') {
        // handled below
    }
}

// Display repositories
function displayRepos(repos) {
    reposList.innerHTML = '';
    
    if (!repos || repos.length === 0) {
        if (noReposMessage) {
            noReposMessage.classList.add('active');
        }
        if (reposStage) {
            reposStage.classList.add('active');
        }
        if (!prefersReducedMotion && typeof gsap !== 'undefined' && reposStage) {
            gsap.set(reposStage, { opacity: 0, y: 30 });
            gsap.to(reposStage, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
        return;
    }
    
    if (noReposMessage) {
        noReposMessage.classList.remove('active');
    }
    
    repos.forEach((repo, index) => {
        const repoItem = document.createElement('a');
        repoItem.href = repo.html_url;
        repoItem.target = '_blank';
        repoItem.rel = 'noopener noreferrer';
        repoItem.className = 'repo-item';
        repoItem.setAttribute('role', 'listitem');
        repoItem.setAttribute('aria-label', `Repository ${repo.name}`);
        
        const repoNumber = document.createElement('span');
        repoNumber.className = 'repo-number';
        repoNumber.textContent = String(index + 1).padStart(2, '0');
        
        const repoMain = document.createElement('div');
        repoMain.className = 'repo-main';
        
        const repoTop = document.createElement('div');
        repoTop.className = 'repo-top';
        
        const repoName = document.createElement('div');
        repoName.className = 'repo-name';
        repoName.textContent = repo.name;
        
        repoTop.appendChild(repoName);
        
        const repoMetaLine = document.createElement('div');
        repoMetaLine.className = 'repo-meta-line';
        
        // Language
        if (repo.language) {
            const langItem = document.createElement('div');
            langItem.className = 'repo-meta-item repo-language';
            
            const langDot = document.createElement('span');
            langDot.className = 'language-dot';
            const langColors = {
                'JavaScript': '#B5A642',
                'TypeScript': '#4A6FB5',
                'Python': '#3C6B9B',
                'Java': '#8C6B3A',
                'C++': '#9C4D6B',
                'C': '#6B6B6B',
                'Go': '#5A9B9B',
                'Rust': '#B57A5A',
                'PHP': '#6B6B9B',
                'Ruby': '#8B4A4A',
                'Swift': '#B57A3A',
                'Kotlin': '#7A6B9B',
                'HTML': '#9B5A4A',
                'CSS': '#6B5A9B',
                'Shell': '#6B9B6B',
                'Vue': '#5A9B7A',
                'React': '#5A9BB5'
            };
            langDot.style.background = langColors[repo.language] || '#8B8B8B';
            
            const langText = document.createElement('span');
            langText.textContent = repo.language;
            
            langItem.appendChild(langDot);
            langItem.appendChild(langText);
            repoMetaLine.appendChild(langItem);
        }
        
        // Stars
        const starsItem = document.createElement('div');
        starsItem.className = 'repo-meta-item';
        starsItem.innerHTML = `<span>★</span><span>${formatNumber(repo.stargazers_count || 0)}</span>`;
        repoMetaLine.appendChild(starsItem);
        
        // Forks
        const forksItem = document.createElement('div');
        forksItem.className = 'repo-meta-item';
        forksItem.innerHTML = `<span>⑂</span><span>${formatNumber(repo.forks_count || 0)}</span>`;
        repoMetaLine.appendChild(forksItem);
        
        repoMain.appendChild(repoTop);
        repoMain.appendChild(repoMetaLine);
        
        if (repo.description) {
            const repoDescription = document.createElement('p');
            repoDescription.className = 'repo-description';
            repoDescription.textContent = repo.description;
            repoMain.appendChild(repoDescription);
        }
        
        repoItem.appendChild(repoNumber);
        repoItem.appendChild(repoMain);
        
        reposList.appendChild(repoItem);
    });
    
    if (reposStage) {
        reposStage.classList.add('active');
    }
    
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        gsap.set(reposStage, { opacity: 0, y: 30 });
        gsap.to(reposStage, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        const repoItems = reposList.querySelectorAll('.repo-item');
        gsap.set(repoItems, { opacity: 0, y: 20 });
        gsap.to(repoItems, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
            delay: 0.2
        });
    }
}

// Handle form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (!username) {
        // If empty, just clear previous results
        hideAllStatus();
        hideProfileAndRepos();
        reposList.innerHTML = '';
        if (noReposMessage) {
            noReposMessage.classList.remove('active');
        }
        return;
    }
    
    // Clear previous results
    hideAllStatus();
    hideProfileAndRepos();
    reposList.innerHTML = '';
    if (noReposMessage) {
        noReposMessage.classList.remove('active');
        noReposMessage.querySelector('.no-repos-text').textContent = 'NO PUBLIC REPOSITORIES FOUND';
    }
    
    showLoading();
    
    try {
        const [userResult, reposResult] = await Promise.allSettled([
            fetchUserProfile(username),
            fetchUserRepos(username)
        ]);
        
        hideAllStatus();
        
        if (userResult.status === 'rejected') {
            showError();
            return;
        }
        
        if (userResult.value.found === false) {
            showNotFound();
            return;
        }
        
        // Display profile
        displayProfile(userResult.value.data);
        
        // Display repos if successful
        if (reposResult.status === 'fulfilled') {
            displayRepos(reposResult.value);
        } else {
            if (reposStage) {
                reposStage.classList.add('active');
            }
            if (noReposMessage) {
                const noReposText = noReposMessage.querySelector('.no-repos-text');
                if (noReposText) {
                    noReposText.textContent = 'UNABLE TO LOAD REPOSITORIES';
                }
                noReposMessage.classList.add('active');
            }
            if (!prefersReducedMotion && typeof gsap !== 'undefined' && reposStage) {
                gsap.set(reposStage, { opacity: 0, y: 30 });
                gsap.to(reposStage, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        }
    } catch (error) {
        hideAllStatus();
        console.error('Unexpected error:', error);
        showError();
    }
});

// Initialize animations for hero
function initHeroAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
        return;
    }
    
    const heroLines = document.querySelectorAll('.hero-line-inner');
    gsap.set(heroLines, { y: '120%' });
    gsap.to(heroLines, {
        y: '0%',
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.3
    });
    
    const heroRules = document.querySelectorAll('.hero-rule');
    gsap.set(heroRules, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(heroRules, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
        delay: 0.9
    });
    
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) {
        gsap.set(heroDesc, { opacity: 0, y: 20 });
        gsap.to(heroDesc, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.0
        });
    }
}

// Add hover animations
function initHoverAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
        return;
    }
    
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('mouseenter', () => {
            gsap.to(searchButton, {
                x: 4,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        searchButton.addEventListener('mouseleave', () => {
            gsap.to(searchButton, {
                x: 0,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    }
}

// Initialize - ensure all sections are hidden and run animations
document.addEventListener('DOMContentLoaded', () => {
    hideAllStatus();
    hideProfileAndRepos();
    reposList.innerHTML = '';
    if (noReposMessage) {
        noReposMessage.classList.remove('active');
    }
    
    initHeroAnimations();
    initHoverAnimations();
});
