# DevLookup

A responsive GitHub Profile Finder built with vanilla HTML, CSS, and JavaScript. Search for any GitHub user to view their profile information and recent repositories.

## Features

- 🔍 **Search GitHub Profiles** - Enter any GitHub username to fetch and display profile data
- 👤 **Profile Card** - View avatar, name, username, bio, location, company, followers, following, and public repository count
- 📦 **Recent Repositories** - Browse the 10 most recently updated repositories with name, description, language, stars, and forks
- ⚡ **Loading States** - Visual feedback while fetching data
- ❌ **Error Handling** - User-friendly messages for not found users and API errors
- 📱 **Responsive Design** - Optimized for mobile and desktop screens
- ✨ **Modern UI** - Dark theme with smooth transitions and hover effects
- ♿ **Accessible** - Semantic HTML, ARIA attributes, and keyboard navigation support

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - No frameworks or libraries
- **GitHub REST API** - Public API for fetching user data and repositories

## How to Use

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Enter a GitHub username in the search bar and click "Search" or press Enter
4. View the profile information and recent repositories

## API Usage

This app uses the following GitHub REST API endpoints:
- `GET https://api.github.com/users/{username}` - Fetch user profile
- `GET https://api.github.com/users/{username}/repos?sort=updated&per_page=10` - Fetch recent repositories

No authentication required for public data.

## File Structure

```
devlookup/
├── index.html      # Main HTML file
├── style.css       # Styles and responsive design
├── script.js       # JavaScript logic and API calls
└── README.md       # Project documentation
```

## Browser Support

Works in all modern browsers that support ES6+ features (fetch API, async/await, etc.).

## License

This project is open source and available for personal and educational use.
