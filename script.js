// Update these launch details in one place before going live.
const siteConfig = {
    businessName: "Belle Vie Spa & Barber Shop",
    phoneDisplay: "0750573891",
    phoneLink: "+254750573891",
    whatsappNumber: "254750573891",
    defaultMessage: "Hi, I'd like to book an appointment.",
    address: "Along Diani Beach Road opp Rockstar Village",
    hours: "Mon - Sat: 8:00 AM - 9:00 PM | Sun: 8:00 AM - 9:00 PM",
    instagram: "https://www.instagram.com/spa_bellevie_diani?igsh=MTZkMDZxcmtkNWk3bA==",
    tiktok: "https://tiktok.com/@bellevie1231"
};

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

const buildWhatsappLink = (message = siteConfig.defaultMessage) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
};

const applySiteConfig = () => {
    document.querySelectorAll("[data-business-name]").forEach((element) => {
        element.textContent = siteConfig.businessName;
    });

    document.querySelectorAll("[data-phone-display]").forEach((element) => {
        element.textContent = siteConfig.phoneDisplay;
    });

    document.querySelectorAll("[data-address]").forEach((element) => {
        element.textContent = siteConfig.address;
    });

    document.querySelectorAll("[data-hours]").forEach((element) => {
        element.textContent = siteConfig.hours;
    });

    document.querySelectorAll("[data-phone-link]").forEach((element) => {
        element.setAttribute("href", `tel:${siteConfig.phoneLink}`);
    });

    document.querySelectorAll("[data-social='instagram']").forEach((element) => {
        element.setAttribute("href", siteConfig.instagram);
    });

    document.querySelectorAll("[data-social='tiktok']").forEach((element) => {
        element.setAttribute("href", siteConfig.tiktok);
    });

    document.querySelectorAll("[data-whatsapp-link]").forEach((element) => {
        const message = element.dataset.whatsappMessage || siteConfig.defaultMessage;
        element.setAttribute("href", buildWhatsappLink(message));
    });

    const year = document.querySelector("[data-year]");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
};

const setHeaderState = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeNav = () => {
    if (!navToggle || !siteNav) {
        return;
    }

    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
};

const initNavigation = () => {
    navToggle?.addEventListener("click", () => {
        const isOpen = navToggle.classList.toggle("is-active");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        siteNav?.classList.toggle("is-open", isOpen);
    });

    siteNav?.querySelectorAll("a[href^='#']").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();
};

const initRevealObserver = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !revealItems.length) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
};

const initGalleryFilters = () => {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const galleryCards = document.querySelectorAll(".gallery-card");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            galleryCards.forEach((card) => {
                const matches = filter === "all" || card.dataset.category === filter;
                card.hidden = !matches;
            });
        });
    });
};

const initLightbox = () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.getElementById("lightbox-close");
    const triggers = document.querySelectorAll(".gallery-button");
    const closeTriggers = document.querySelectorAll("[data-lightbox-close]");

    if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
    }

    const closeLightbox = () => {
        lightbox.hidden = true;
        body.style.overflow = "";
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            lightboxImage.src = trigger.dataset.image || "";
            lightboxImage.alt = trigger.querySelector("img")?.alt || "Gallery image";
            lightboxCaption.textContent = trigger.dataset.caption || "";
            lightbox.hidden = false;
            body.style.overflow = "hidden";
        });
    });

    closeTriggers.forEach((trigger) => {
        trigger.addEventListener("click", closeLightbox);
    });

    closeButton?.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNav();
            if (!lightbox.hidden) {
                closeLightbox();
            }
        }
    });
};

const initTestimonials = () => {
    const cards = Array.from(document.querySelectorAll("[data-testimonial]"));
    const dots = Array.from(document.querySelectorAll(".dot"));
    const prevButton = document.getElementById("testimonial-prev");
    const nextButton = document.getElementById("testimonial-next");

    if (!cards.length) {
        return;
    }

    let index = 0;
    let autoRotate;

    const showSlide = (nextIndex) => {
        index = (nextIndex + cards.length) % cards.length;

        cards.forEach((card, cardIndex) => {
            card.classList.toggle("is-active", cardIndex === index);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    const restartAutoRotate = () => {
        window.clearInterval(autoRotate);
        autoRotate = window.setInterval(() => {
            showSlide(index + 1);
        }, 6500);
    };

    prevButton?.addEventListener("click", () => {
        showSlide(index - 1);
        restartAutoRotate();
    });

    nextButton?.addEventListener("click", () => {
        showSlide(index + 1);
        restartAutoRotate();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            restartAutoRotate();
        });
    });

    showSlide(index);
    restartAutoRotate();
};

const initBookingForm = () => {
    const form = document.getElementById("booking-form");
    const bookingDate = document.getElementById("booking-date");

    if (bookingDate) {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        bookingDate.min = today.toISOString().split("T")[0];
    }

    form?.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get("name")?.toString().trim();
        const service = formData.get("service")?.toString().trim();
        const date = formData.get("date")?.toString().trim();
        const contact = formData.get("contact")?.toString().trim();
        const notes = formData.get("notes")?.toString().trim();

        const message = [
            "Hi, I'd like to book an appointment.",
            "",
            `Name: ${name || "-"}`,
            `Service: ${service || "-"}`,
            `Preferred date: ${date || "Flexible"}`,
            `Contact: ${contact || "-"}`,
            `Notes: ${notes || "None"}`
        ].join("\n");

        window.open(buildWhatsappLink(message), "_blank", "noopener");
    });
};

applySiteConfig();
initNavigation();
initRevealObserver();
initGalleryFilters();
initLightbox();
initTestimonials();
initBookingForm();
