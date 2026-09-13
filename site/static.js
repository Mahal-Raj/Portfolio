(() => {
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || event.defaultPrevented || event.button !== 0) return;
    if (anchor.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(url.href);
  }, true);

  if (!document.documentElement.hasAttribute("data-static-page")) return;

  const trigger = document.querySelector(".menu-trigger");
  if (trigger) {
    const menu = document.createElement("div");
    menu.className = "static-menu";
    menu.innerHTML = '<button class="static-menu-close" type="button">Close</button><nav aria-label="Primary navigation"><a href="/about">About</a><a href="/experience">Experience</a><a href="/projects">Projects</a><a href="/skills">Skills</a><a href="/education">Education</a><a href="/beyond">Beyond</a><a href="/contact">Contact</a></nav>';
    document.body.appendChild(menu);
    const close = () => {
      menu.classList.remove("is-open");
      document.body.style.overflow = "";
      trigger.setAttribute("aria-expanded", "false");
    };
    trigger.addEventListener("click", () => {
      menu.classList.add("is-open");
      document.body.style.overflow = "hidden";
      trigger.setAttribute("aria-expanded", "true");
    });
    menu.querySelector(".static-menu-close").addEventListener("click", close);
  }

  const filterButtons = [...document.querySelectorAll(".project-filters button")];
  const projectCards = [...document.querySelectorAll(".projects-index .project-index-item")];
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.childNodes[0]?.textContent?.trim() || "All";
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      projectCards.forEach((card) => {
        const categories = (card.dataset.categories || "").split(",");
        card.hidden = category !== "All" && !categories.includes(category);
      });
    });
  });

  const storyAudio = document.querySelector('audio[src*="voice.m4a"]');
  const storyButton = document.querySelector('button[aria-label*="photo story"]');
  const storyImage = document.querySelector('figure[aria-label*="story"] img');
  if (storyAudio && storyButton) {
    const frames = ["01", "03", "04", "05", "08", "15"];
    let frameTimer;
    const stopFrames = () => {
      window.clearInterval(frameTimer);
      frameTimer = undefined;
      storyButton.classList.remove("is-playing");
    };
    storyButton.addEventListener("click", async () => {
      if (!storyAudio.paused) {
        storyAudio.pause();
        stopFrames();
        return;
      }
      await storyAudio.play();
      storyButton.classList.add("is-playing");
      if (storyImage && !frameTimer) {
        let index = 0;
        frameTimer = window.setInterval(() => {
          index = (index + 1) % frames.length;
          storyImage.src = `/images/intro-story/story-${frames[index]}.webp`;
        }, 4500);
      }
    });
    storyAudio.addEventListener("ended", stopFrames);
  }
})();
