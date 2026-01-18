// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// Theme Toggle Functionality
const handleThemeToggleClick = () => {
  const element = document.documentElement;
  const isDark = element.classList.toggle("dark");
  const theme = isDark ? "dark" : "light";

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem("theme", theme);
  }

  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  if (isDark) {
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');
  } else {
    sunIcon?.classList.add('hidden');
    moonIcon?.classList.remove('hidden');
  }
};

const setupTheme = () => {
  const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
  const prefersDark = typeof window !== 'undefined' && window.matchMedia ?
    window.matchMedia('(prefers-color-scheme: dark)').matches : false;

  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  const element = document.documentElement;
  const isDark = theme === 'dark';
  element.classList.toggle('dark', isDark);

  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  if (isDark) {
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');
  } else {
    sunIcon?.classList.add('hidden');
    moonIcon?.classList.remove('hidden');
  }

  if (typeof localStorage !== 'undefined' && !savedTheme) {
    localStorage.setItem('theme', theme);
  }

  const themeToggleButton = document.getElementById("theme-toggle");
  if (themeToggleButton && !themeToggleButton.hasAttribute('data-theme-handler')) {
    themeToggleButton.setAttribute('data-theme-handler', 'true');
    themeToggleButton.addEventListener("click", handleThemeToggleClick);
  }
};

// Sidebar Functionality
const toggleSidebar = (open = null) => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (!sidebar || !overlay) return;

  const isCurrentlyOpen = sidebar.classList.contains('open');
  const shouldOpen = open !== null ? open : !isCurrentlyOpen;

  if (shouldOpen) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
};

const setupSidebar = () => {
  const sidebarToggleButton = document.getElementById("sidebar-toggle");
  const overlay = document.getElementById("sidebar-overlay");

  if (sidebarToggleButton && !sidebarToggleButton.hasAttribute('data-sidebar-handler')) {
    sidebarToggleButton.setAttribute('data-sidebar-handler', 'true');
    sidebarToggleButton.addEventListener("click", () => toggleSidebar());
  }

  if (overlay && !overlay.hasAttribute('data-overlay-handler')) {
    overlay.setAttribute('data-overlay-handler', 'true');
    overlay.addEventListener("click", () => toggleSidebar(false));
  }
};

const setupSidebarClose = () => {
  const closeBtn = document.getElementById('sidebar-close-btn');
  const sidebar = document.getElementById('sidebar');

  if (closeBtn && !closeBtn.hasAttribute('data-close-handler')) {
    closeBtn.setAttribute('data-close-handler', 'true');
    closeBtn.addEventListener('click', () => {
      toggleSidebar(false);
    });
  }

  if (sidebar && !sidebar.hasAttribute('data-link-handler')) {
    sidebar.setAttribute('data-link-handler', 'true');
    sidebar.addEventListener('click', (e) => {
      if (e.target && e.target.closest('.post-link')) {
        toggleSidebar(false);
      }
    });
  }
};

// Copy Button Functionality
const setupCopyButtons = () => {
  const codeBlocks = document.querySelectorAll("pre code");
  if (codeBlocks.length === 0) return;

  codeBlocks.forEach((codeBlock) => {
    const wrapper = codeBlock.parentElement;
    if (!wrapper) return;

    if (wrapper.classList.contains("code-block-wrapper") ||
        wrapper.querySelector(".copy-code-button")) return;

    const newWrapper = document.createElement("div");
    newWrapper.className = "code-block-wrapper";
    wrapper.insertBefore(newWrapper, codeBlock);
    newWrapper.appendChild(codeBlock);

    const btn = document.createElement("button");
    btn.className = "copy-code-button";
    btn.setAttribute("aria-label", "Copy code");
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>`;

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const text = codeBlock.textContent || "";
        await navigator.clipboard.writeText(text);

        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg><span class="btn-text">Copied!</span>`;
        btn.classList.add("copied");

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    });

    newWrapper.appendChild(btn);
  });
};

// Make toggleSidebar available globally
window.toggleSidebar = toggleSidebar;

// Initialize everything
const initializeAll = () => {
  setupTheme();
  setupSidebar();
  setupSidebarClose();
  setupCopyButtons();
};

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  initializeAll();
}

// Run on Turbo navigation
document.addEventListener('turbo:load', initializeAll);
document.addEventListener('turbo:render', initializeAll);
