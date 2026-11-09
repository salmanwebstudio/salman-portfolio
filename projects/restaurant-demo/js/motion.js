/* ==================================
   HERO 3D MOUSE TILT
================================== */

const plateScene = document.querySelector(".plate-scene");
const plateTilt = document.querySelector(".plate-tilt");

if (plateScene && plateTilt) {
  plateScene.addEventListener("mousemove", (event) => {
    const rect = plateScene.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 25;
    const rotateX = (0.5 - y) * 25;

    plateTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });

  plateScene.addEventListener("mouseleave", () => {
    plateTilt.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

/* INTRO SECTION SCROLL REVEAL */

// const introSection = document.querySelector(".intro-section");

// if (introSection) {

//     const introObserver = new IntersectionObserver((entries) => {

//         entries.forEach((entry) => {

//             if (entry.isIntersecting) {

//                 entry.target.classList.add("intro-visible");

//                 introObserver.unobserve(entry.target);

//             }

//         });

//     }, {
//         threshold: 0.2
//     });

//     introObserver.observe(introSection);

// }

// const introSection = document.querySelector(".intro-section");

// if (introSection) {
//     const introObserver = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 introSection.classList.add("intro-visible");
//                 introObserver.unobserve(introSection);
//             }
//         });
//     }, {
//         threshold: 0.9
//     });

//     introObserver.observe(introSection);
// }
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".intro-section");

  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          section.classList.add("intro-visible");
          observer.unobserve(section);
        }
      });
    },
    {
      threshold: [0, 0.5],
    },
  );

  observer.observe(section);
});

document.addEventListener("DOMContentLoaded", () => {

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("dish-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    function observeCards() {
        document.querySelectorAll(".dish-card:not(.dish-visible)")
            .forEach(card => observer.observe(card));
    }

    observeCards();

    const mutationObserver = new MutationObserver(() => {
        observeCards();
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

});

document.addEventListener("DOMContentLoaded", () => {
  const reservation = document.querySelector("#reservation-band");

  if (!reservation) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reservation.classList.add("reservation-visible");
          observer.unobserve(reservation);
        }
      });
    },
    {
      threshold: 0.9,
    },
  );

  observer.observe(reservation);
});

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".reservation-form");

  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("reservation-form-visible");
          observer.unobserve(section);
        }
      });
    },
    {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    },
  );

  observer.observe(section);
});

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".reviews-section");

  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("reviews-visible");
          observer.unobserve(section);
        }
      });
    },
    {
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    },
  );

  observer.observe(section);
});

document.addEventListener("DOMContentLoaded", () => {

    const heroes = document.querySelectorAll(".page-hero");

    if (!heroes.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("hero-visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.1
    });

    heroes.forEach(hero => observer.observe(hero));

});
document.addEventListener("DOMContentLoaded", () => {

    const cartSection = document.querySelector(".cart-reveal");

    if (!cartSection) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("cart-visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.1
    });

    observer.observe(cartSection);

});

document.addEventListener("DOMContentLoaded", () => {

    const story = document.querySelector(".story-reveal");

    if (!story) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                story.classList.add("story-visible");
                observer.unobserve(story);
            }

        });

    }, {
        threshold: 0.1
    });

    story.classList.add("reveal-ready");
    observer.observe(story);

});

document.addEventListener("DOMContentLoaded", () => {

    const chef = document.querySelector(".chef-reveal");

    if (!chef) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                chef.classList.add("chef-visible");
                observer.unobserve(chef);
            }

        });

    }, {
        threshold: 0.1
    });

    chef.classList.add("reveal-ready");
    observer.observe(chef);

});

document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.querySelector(".gallery-reveal");

    if (!gallery) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                gallery.classList.add("gallery-visible");
                observer.unobserve(gallery);
            }

        });

    }, {
        threshold: 0.1
    });

    gallery.classList.add("reveal-ready");
    observer.observe(gallery);

});

document.addEventListener("DOMContentLoaded", () => {

    const contact = document.querySelector(".contact-reveal");

    if (!contact) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                contact.classList.add("contact-visible");
                observer.unobserve(contact);
            }

        });

    }, {
        threshold: 0.1
    });

    contact.classList.add("reveal-ready");
    observer.observe(contact);

});

document.addEventListener("DOMContentLoaded", () => {

    const map = document.querySelector(".map-reveal");

    if (!map) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                map.classList.add("map-visible");
                observer.unobserve(map);
            }

        });

    }, {
        threshold: 0.1
    });

    map.classList.add("reveal-ready");
    observer.observe(map);

});

document.addEventListener("DOMContentLoaded", () => {

    const admin = document.querySelector(".admin-reveal");

    if (!admin) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                admin.classList.add("admin-visible");
                observer.unobserve(admin);
            }

        });

    }, {
        threshold: 0.1
    });

    observer.observe(admin);

});

document.addEventListener("DOMContentLoaded", () => {
    const dashboard = document.querySelector(".admin-dashboard-reveal");

    if (!dashboard) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                dashboard.classList.add("admin-dashboard-visible");
                observer.unobserve(dashboard);
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(dashboard);
});
