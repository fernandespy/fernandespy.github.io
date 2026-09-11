// Theme
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") document.documentElement.classList.add("dark");

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;
if (themeToggle) themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
});

// Scroll indicator
const sections = document.querySelectorAll("section[id]");
const scrollDots = document.querySelectorAll(".scroll-dot");
function updateActiveSection() {
    let current = "";
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    scrollDots.forEach(dot => dot.classList.toggle("active", dot.dataset.section === current));
}
window.addEventListener("scroll", updateActiveSection, { passive: true });

scrollDots.forEach(dot => dot.addEventListener("click", () => {
    const section = document.getElementById(dot.dataset.section);
    if (section) section.scrollIntoView({ behavior: "smooth" });
}));

// Back to top
const backToTopButton = document.getElementById("back-to-top");
if (backToTopButton) {
    window.addEventListener("scroll", () => {
        backToTopButton.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
    }, { passive: true });
    backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// GitHub projects
// The portfolio already contains a static fallback in index.html, so the
// Projects section remains visible even if GitHub's API is unavailable.
const GITHUB_USERNAME = "fernandespy";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&direction=desc`;

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatUpdatedDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(value));
}

function languageIcon(language) {
    return ({
        JavaScript: "fab fa-js-square",
        TypeScript: "fab fa-js-square",
        Python: "fab fa-python",
        Java: "fab fa-java",
        Go: "fas fa-code",
        HTML: "fab fa-html5",
        CSS: "fab fa-css3-alt",
        PHP: "fab fa-php"
    })[language] || "fas fa-code";
}

function renderProjects(repositories) {
    const grid = document.getElementById("projects-grid");
    if (!grid || !repositories.length) return;

    grid.innerHTML = repositories.map(repo => {
        const topics = (repo.topics || []).slice(0, 4);
        const tags = topics.length
            ? topics.map(topic => `<span class="tech-tag small">${escapeHtml(topic)}</span>`).join("")
            : `<span class="tech-tag small">${escapeHtml(repo.language || "Software")}</span>`;

        return `<article class="glass rounded-2xl p-7 card-hover project-card h-full flex flex-col">
            <div class="flex items-start justify-between gap-4 mb-5">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <i class="fab fa-github text-2xl text-primary"></i>
                </div>
                <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(repo.name)} on GitHub" class="text-gray-500 hover:text-primary transition-colors">
                    <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
            </div>
            <h3 class="text-xl font-bold mb-3">${escapeHtml(repo.name)}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-grow">${escapeHtml(repo.description || "Software project by Bruno Fernandes.")}</p>
            <div class="flex flex-wrap gap-2 mb-5">${tags}</div>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                <span class="flex items-center gap-2"><i class="${languageIcon(repo.language)} text-primary"></i>${escapeHtml(repo.language || "Software")}</span>
                <span>${repo.pushed_at ? `Updated ${formatUpdatedDate(repo.pushed_at)}` : "GitHub project"}</span>
            </div>
        </article>`;
    }).join("");
}

async function loadGitHubProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: { Accept: "application/vnd.github+json" }
        });

        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const repositories = await response.json();

        // Do not require a "portfolio" topic. Most existing repositories do not have one.
        const projects = repositories
            .filter(repo => !repo.fork && !repo.archived)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 6);

        renderProjects(projects);
    } catch (error) {
        // Keep the static cards already present in index.html.
        console.warn("GitHub projects could not be refreshed. Keeping static projects.", error);
    }
}

loadGitHubProjects();
