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
const profileSection = document.getElementById('profileSection');
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
const reposSection = document.getElementById('reposSection');
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
    profileSection.classList.remove('active');
    reposSection.classList.remove('active');
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
    profileSection.classList.add('active');
}

// Display repositories
function displayRepos(repos) {
    reposList.innerHTML = '';
    
    if (!repos || repos.length === 0) {
        noReposMessage.classList.add('active');
        reposSection.classList.add('active');
        return;
    }
    
    noReposMessage.classList.remove('active');
    
    repos.forEach(repo => {
        const repoCard = document.createElement('a');
        repoCard.href = repo.html_url;
        repoCard.target = '_blank';
        repoCard.rel = 'noopener noreferrer';
        repoCard.className = 'repo-card';
        repoCard.setAttribute('role', 'listitem');
        repoCard.setAttribute('aria-label', `Repository ${repo.name}`);
        
        const repoHeader = document.createElement('div');
        repoHeader.className = 'repo-header';
        
        const repoName = document.createElement('div');
        repoName.className = 'repo-name';
        repoName.textContent = repo.name;
        
        repoHeader.appendChild(repoName);
        
        const repoDescription = document.createElement('p');
        repoDescription.className = 'repo-description';
        if (repo.description) {
            repoDescription.textContent = repo.description;
        } else {
            repoDescription.textContent = 'No description provided.';
            repoDescription.style.fontStyle = 'italic';
            repoDescription.style.color = 'var(--text-secondary)';
        }
        
        const repoMeta = document.createElement('div');
        repoMeta.className = 'repo-meta';
        
        // Language
        if (repo.language) {
            const langItem = document.createElement('div');
            langItem.className = 'repo-meta-item repo-language';
            
            const langDot = document.createElement('span');
            langDot.className = 'language-dot';
            // Simple color mapping for common languages
            const langColors = {
                'JavaScript': '#f1e05a',
                'TypeScript': '#3178c6',
                'Python': '#3572A5',
                'Java': '#b07219',
                'C++': '#f34b7d',
                'C': '#555555',
                'Go': '#00ADD8',
                'Rust': '#dea584',
                'PHP': '#4F5D95',
                'Ruby': '#701516',
                'Swift': '#ffac45',
                'Kotlin': '#A97BFF',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'Shell': '#89e051',
                'Vue': '#41b883',
                'React': '#61dafb'
            };
            langDot.style.background = langColors[repo.language] || '#8b949e';
            
            const langText = document.createElement('span');
            langText.textContent = repo.language;
            
            langItem.appendChild(langDot);
            langItem.appendChild(langText);
            repoMeta.appendChild(langItem);
        }
        
        // Stars
        const starsItem = document.createElement('div');
        starsItem.className = 'repo-meta-item';
        starsItem.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
            </svg>
            <span>${formatNumber(repo.stargazers_count || 0)}</span>
        `;
        repoMeta.appendChild(starsItem);
        
        // Forks
        const forksItem = document.createElement('div');
        forksItem.className = 'repo-meta-item';
        forksItem.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
            </svg>
            <span>${formatNumber(repo.forks_count || 0)}</span>
        `;
        repoMeta.appendChild(forksItem);
        
        repoCard.appendChild(repoHeader);
        repoCard.appendChild(repoDescription);
        repoCard.appendChild(repoMeta);
        
        reposList.appendChild(repoCard);
    });
    
    reposSection.classList.add('active');
}

// Handle form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (!username) {
        // If empty, just clear previous results
        hideAllStatus();
        hideProfileAndRepos();
        return;
    }
    
    // Clear previous results
    hideAllStatus();
    hideProfileAndRepos();
    reposList.innerHTML = '';
    noReposMessage.classList.remove('active');
    
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
            // If repos failed but profile loaded, just don't show repos or show empty
            reposSection.classList.add('active');
            noReposMessage.textContent = 'Unable to load repositories.';
            noReposMessage.classList.add('active');
        }
    } catch (error) {
        hideAllStatus();
        console.error('Unexpected error:', error);
        showError();
    }
});

// Allow Enter key in input (form submission handles it)
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        // Form submission will handle it
    }
});

// Initialize - ensure all sections are hidden
document.addEventListener('DOMContentLoaded', () => {
    hideAllStatus();
    hideProfileAndRepos();
});
