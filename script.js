document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Project Data (Array of Objects)
    const projects = [
        {
            name: 'HTML Calculator',
            description: 'Responsive calculator with HTML, CSS, and JavaScript for real-time arithmetic.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/calculator_app',
            demoLink: 'calculator_app/index.html',
            image: 'assets/calculator_app.png',
            date: '11/2024'
        },
        {
            name: 'Snake Game',
            description: 'Classic Snake Game using HTML, CSS, and JavaScript with keyboard controls and scoring.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/snake_game',
            demoLink: 'snake_game/index.html',
            image: 'assets/snake_game.png',
            date: '11/2024'
        },
        {
            name: 'Recipe Website',
            description: 'Responsive recipe website with HTML, CSS, and JavaScript showcasing recipes with a clean UI.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/recipe_website',
            demoLink: 'recipe_website/index.html',
            image: 'assets/recipe_website.png',
            date: '11/2024'
        },
        {
            name: 'Chat Analyzer',
            description: 'Python tool for sentiment analysis and keyword extraction.',
            tags: ['python'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/chat_analyzer',
            image: 'assets/chat_analyzer.png',
            date: '06/2024'
        },
        {
            name: 'Lyrics Search Website',
            description: 'Dynamic lyrics search website using HTML, CSS, and JavaScript integrating APIs for real-time results.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/lyrics_search_app',
            demoLink: 'lyrics_search_app/index.html',
            image: 'assets/lyrics_search_app.png',
            date: '11/2024'
        },
        {
            name: 'Notes App',
            description: 'Notes application with HTML, CSS, and JavaScript to create, edit, and delete notes seamlessly.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/notes_app',
            demoLink: 'notes_app/index.html',
            image: 'assets/notes_app.png',
            date: '11/2024'
        },
        {
            name: 'Loading Screen',
            description: 'Interactive loading screen using HTML and CSS with engaging animations.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/loading_screen',
            demoLink: 'loading_screen/index.html',
            image: 'assets/loading_screen.png',
            date: '11/2024'
        },
        {
            name: 'Birthday Reminder App',
            description: 'Birthday reminder app using HTML, CSS, and JavaScript allowing users to set and manage reminders.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/birthday_reminder_app',
            demoLink: 'birthday_reminder_app/index.html',
            image: 'assets/birthday_reminder_app.png',
            date: '11/2024'
        },
        {
            name: 'Math Sprint Game',
            description: 'Interactive math sprint game with HTML, CSS, and JavaScript featuring timed problem-solving challenges.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/math_sprint_game',
            demoLink: 'math_sprint_game/index.html',
            image: 'assets/math_sprint_game.png',
            date: '11/2024'
        },
        {
            name: 'Alarm Clock',
            description: 'Alarm clock using HTML, CSS, and JavaScript with user-settable alarms and notifications.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/alarm_clock',
            demoLink: 'alarm_clock/index.html',
            image: 'assets/alarm_clock.png',
            date: '11/2024'
        },
        {
            name: 'Expense Tracker',
            description: 'Expense tracker with HTML, CSS, and JavaScript to log, display, and analyze expenses.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/expense_tracker',
            demoLink: 'expense_tracker/index.html',
            image: 'assets/expense_tracker.png',
            date: '12/2024'
        },
        {
            name: 'Drawing App',
            description: 'Drawing app using HTML, CSS, and JavaScript providing customizable tools and real-time drawing capabilities.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/drawing_app',
            demoLink: 'drawing_app/index.html',
            image: 'assets/drawing_app.png',
            date: '12/2024'
        },
        {
            name: 'Joke Generator App',
            description: 'Joke generator app with HTML, CSS, and JavaScript integrating APIs to display random jokes.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/joke_generator_app',
            demoLink: 'joke_generator_app/index.html',
            image: 'assets/joke_generator_app.png',
            date: '12/2024'
        },
        {
            name: 'Tap Levi Game',
            description: 'Simple, interactive HTML, CSS, and JavaScript game to engage users with dynamic UI updates.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/tap_levi_game',
            demoLink: 'tap_levi_game/index.html',
            image: 'assets/tap_levi_game.png',
            date: '12/2024'
        },
        {
            name: 'Tic-Tac-Toe Game',
            description: 'Fully interactive tic-tac-toe game using JavaScript, supporting two-player mode and win-check logic.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/tictactoe_game',
            demoLink: 'tictactoe_game/index.html',
            image: 'assets/tictactoe_game.png',
            date: '12/2024'
        },
        {
            name: 'Weather App',
            description: 'Weather app with HTML, Bootstrap, and JavaScript, integrating real-time weather APIs for updates.',
            tags: ['html', 'css', 'javascript'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/weather_app',
            image: 'assets/weather_app.png',
            date: '12/2024'
        },
        {
            name: 'Discord Bot',
            description: 'Custom Discord bot using JavaScript, automating server moderation, commands, and user interactions.',
            tags: ['javascript'],
            image: 'https://placehold.co/800?text=Unavailable&font=roboto',
            date: '12/2024'
        },
        {
            name: 'Blog App',
            description: 'Full-stack blog application using PHP, enabling users to write, edit, and publish blog posts.',
            tags: ['php'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/blog_app',
            image: 'assets/blog_app.png',
            date: '12/2024'
        },
                {
            name: 'Matchmaker',
            description: 'Matchmaker application using PHP, HTML, CSS, and JavaScript, calculating compatibility scores based on various methods.',
            tags: ['php', 'html', 'css', 'javascript', 'mysql'],
            githubLink: 'https://github.com/muaazl/PBLearning/tree/main/matchmaker_app',
            demoLink: 'matchmaker_app/form.html',
            image: 'assets/matchmaker_app.png',
            date: '01/2025'
        },

        // Add more projects here
    ];


    // Function to create a project card
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.dataset.tags = project.tags.join(' '); // Add tags as data attributes for filtering

        card.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
            <div class="project-card-content">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <a href="${project.githubLink}">GitHub</a>
                <a href="${project.demoLink}">Demo</a>
            </div>
        `;

        return card;
    }

    // Function to render projects based on filter/search
    function renderProjects(filter = 'all', searchTerm = '') {
        projectsContainer.innerHTML = ''; // Clear existing cards

        const filteredProjects = projects.filter(project => {
            const matchesFilter = filter === 'all' || project.tags.includes(filter);
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   project.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        filteredProjects.forEach(project => {
            const card = createProjectCard(project);
            projectsContainer.appendChild(card);
        });
    }

    // Initial project render
    renderProjects();

    // Event listeners for filters
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            //Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderProjects(filter, searchInput.value);
        });
    });

    // Event listener for search input
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all'; //Get active filter, or 'all' if none selected
        renderProjects(activeFilter, searchTerm);
    });

    // Dark mode toggle functionality
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });
});