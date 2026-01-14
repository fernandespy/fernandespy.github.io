tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#DC2626",
                secondary: "#991B1B",
                accent: "#EF4444",
                dark: {
                    bg: "#0F0F0F",
                    card: "#1A1A1A",
                    hover: "#262626",
                },
            },
            animation: {
                "fade-in-up": "fadeInUp 0.6s ease-out",
                "fade-in-left": "fadeInLeft 0.6s ease-out",
                "fade-in-right": "fadeInRight 0.6s ease-out",
                float: "float 3s ease-in-out infinite",
                glow: "glow 2s ease-in-out infinite alternate",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                fadeInRight: {
                    "0%": { opacity: "0", transform: "translateX(20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                glow: {
                    "0%": { boxShadow: "0 0 5px rgba(220, 38, 38, 0.5)" },
                    "100%": { boxShadow: "0 0 20px rgba(220, 38, 38, 0.8)" },
                },
            },
        },
    },
};

// Carregar tema antes do render (evita flash)
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        html.classList.contains("dark") ? "dark" : "light"
    );
});

// Scroll Indicator
const sections = document.querySelectorAll("section[id]");
const scrollDots = document.querySelectorAll(".scroll-dot");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    scrollDots.forEach((dot) => {
        dot.classList.remove("active");
        if (dot.getAttribute("data-section") === current) {
            dot.classList.add("active");
        }
    });
});

// Smooth scroll on dot click
scrollDots.forEach((dot) => {
    dot.addEventListener("click", () => {
        const section = document.getElementById(dot.getAttribute("data-section"));
        section.scrollIntoView({ behavior: "smooth" });
    });
});

const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.6) {
        backToTopButton.classList.add("show");
    } else {
        backToTopButton.classList.remove("show");
    }
});

backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
