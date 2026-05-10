const petalColors = ['#f5c6cf', '#fbdde4', '#fce4ec', '#f8bbd0', '#e8748a'];
for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const s = 0.6 + Math.random() * 0.9;
    p.style.left = (Math.random() * 100) + '%';
    p.style.background = petalColors[i % petalColors.length];
    p.style.animationDuration = (7 + Math.random() * 9) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.width = Math.round(8 * s) + 'px';
    p.style.height = Math.round(12 * s) + 'px';
    document.body.appendChild(p);
}

// ---- PHOTO DATA ----
const photos = [{
        src: "photos/1.jpeg"
    },
    {
        src: "photos/2.jpeg"
    },
    {
        src: "photos/3.jpeg"
    },
    {
        src: "photos/4.jpeg"
    },
    {
        src: "photos/5.jpeg"
    },
    {
        src: "photos/6.jpeg"
    },
    {
        src: "photos/7.jpeg"
    },
    {
        src: "photos/8.jpeg"
    },
    {
        src: "photos/9.jpeg"
    },
    {
        src: "photos/10.jpeg"
    },
    {
        src: "photos/11.jpeg"
    },
    {
        src: "photos/12.jpeg"
    },
    {
        src: "photos/13.jpeg"
    },
    {
        src: "photos/14.jpeg"
    },
    {
        src: "photos/15.jpeg"
    },
];


// ---- STATE ----
let printing = false;
let carouselIdx = 0;
const totalSlides = photos.length;

// ---- BUILD CAROUSEL ----
function buildCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.getElementById('carousel-dots');
    track.innerHTML = '';
    dots.innerHTML = '';

    photos.forEach((p, i) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide hidden';
        slide.id = 'slide-' + i;
        if (p.src) {
            slide.innerHTML = `<img class="slide-img" src="${p.src}" alt="Photo ${i+1}" onerror="this.innerHTML=getPlaceholderHTML(${i})"/>`;
        } else {
            slide.innerHTML = getPlaceholderHTML(i);
        }
        track.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.onclick = () => goToSlide(i);
        dots.appendChild(dot);
    });

    updateCarousel();
}

function getPlaceholderHTML(i) {
    return `<div class="slide-placeholder"><span class="slide-placeholder-icon">📷</span><span>Photo ${i+1}</span><span style="font-size:11px;opacity:0.5;">Replace src in photos array</span></div>`;
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    slides.forEach((s, i) => {
        s.classList.remove('active', 'prev', 'next', 'hidden');
        const diff = (i - carouselIdx + totalSlides) % totalSlides;
        if (diff === 0) s.classList.add('active');
        else if (diff === totalSlides - 1) s.classList.add('prev');
        else if (diff === 1) s.classList.add('next');
        else s.classList.add('hidden');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
}

function goToSlide(i) {
    carouselIdx = (i + totalSlides) % totalSlides;
    updateCarousel();
}

function carouselPrev() {
    goToSlide(carouselIdx - 1);
}

function carouselNext() {
    goToSlide(carouselIdx + 1);
}

// Keyboard nav
document.addEventListener('keydown', e => {
    if (document.getElementById('scene-gallery').classList.contains('active')) {
        if (e.key === 'ArrowLeft') carouselPrev();
        if (e.key === 'ArrowRight') carouselNext();
        if (e.key === 'Escape') closeGallery();
    }
    if (document.getElementById('scene-card').classList.contains('active')) {
        if (e.key === 'Escape') closeCard();
    }
});

// ---- PRINTING ----
function startPrinting() {
    if (printing) return;
    printing = true;
    const btn = document.getElementById('print-btn');
    btn.disabled = true;
    btn.textContent = 'printing…';

    const strip = document.getElementById('paper-strip');
    const stripText = document.getElementById('strip-text');
    const totalHeight = 220;
    let height = 0;
    const duration = 2200;
    const steps = 60;
    const increment = totalHeight / steps;
    const interval = duration / steps;

    // Rattle animation on bear
    const bear = document.getElementById('bear-machine-wrap');
    bear.style.animation = 'none';
    let rattle = 0;
    const rattleInterval = setInterval(() => {
        rattle++;
        bear.style.transform = `translateX(${Math.sin(rattle * 1.8) * 2.5}px)`;
    }, 60);

    const grow = setInterval(() => {
        height += increment;
        strip.style.height = Math.min(height, totalHeight) + 'px';
        if (height >= totalHeight) {
            clearInterval(grow);
            clearInterval(rattleInterval);
            bear.style.transform = '';
            stripText.style.opacity = '1';

            // Wait, then open card
            setTimeout(() => {
                strip.style.height = '0';
                stripText.style.opacity = '0';
                setTimeout(openCard, 500);
            }, 2000);
        }
    }, interval);
}

// ---- CARD ----
function openCard() {
    const sceneCard = document.getElementById('scene-card');
    const cardInner = document.getElementById('card-inner');

    // Reset to hidden state instantly before making visible
    cardInner.classList.remove('revealed');
    sceneCard.classList.add('active');

    // Kick off card slide-up after overlay fades in
    requestAnimationFrame(() => requestAnimationFrame(() => {
        cardInner.classList.add('revealed');
    }));

    // Show message and buttons after card settles
    setTimeout(() => {
        document.getElementById('card-message-area').classList.add('visible');
    }, 600);
    setTimeout(() => {
        document.getElementById('card-bottom-row').classList.add('visible');
    }, 900);
}

function closeCard() {
    const sceneCard = document.getElementById('scene-card');
    document.getElementById('card-inner').classList.remove('revealed');
    document.getElementById('card-message-area').classList.remove('visible');
    document.getElementById('card-bottom-row').classList.remove('visible');
    setTimeout(() => sceneCard.classList.remove('active'), 350);
    showHomeButtons();
}

function closeCardAndGallery() {
    document.getElementById('card-inner').classList.remove('revealed');
    document.getElementById('card-message-area').classList.remove('visible');
    document.getElementById('card-bottom-row').classList.remove('visible');
    setTimeout(() => {
        document.getElementById('scene-card').classList.remove('active');
        openGallery();
    }, 350);
}

function showHomeButtons() {
    const hb = document.getElementById('home-btns');
    hb.classList.add('visible');
    const btn = document.getElementById('print-btn');
    btn.style.display = 'none';
}

// ---- GALLERY ----
function openGallery() {
    document.getElementById('scene-gallery').classList.add('active');
}

function closeGallery() {
    document.getElementById('scene-gallery').classList.remove('active');
    showHomeButtons();
}

function openCardFromGallery() {
    document.getElementById('scene-gallery').classList.remove('active');
    setTimeout(openCard, 350);
}

// ---- INIT ----
buildCarousel();

// ---- CUSTOM CURSOR + TRAIL ----
const CURSOR_SRC = ''; // ← your image path, e.g. "cursor.png"
const CURSOR_HOTSPOT_X = 4; // nudge so image tip lines up with click point
const CURSOR_HOTSPOT_Y = 4;

// Trail config
const TRAIL_COUNT = 22; // number of lerp segments — longer = more trail
const TRAIL_LERP = 0.18; // how fast each segment chases the one ahead (0–1); lower = smoother/longer lag
const TRAIL_MAX_SIZE = 13; // px — size of the segment right behind the cursor
const TRAIL_COLORS = [
    'rgba(232,116,138,', // rose
    'rgba(245,198,207,', // blush
    'rgba(248,187,208,', // light pink
    'rgba(212,168,71,', // gold
];

// Cursor element — image only, no fallback dot
const cursorEl = document.createElement('div');
cursorEl.id = 'custom-cursor';
cursorEl.innerHTML = CURSOR_SRC ?
    `<img src="${CURSOR_SRC}" alt="" draggable="false">` :
    `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ctext y='38' font-size='38'%3E🌸%3C/text%3E%3C/svg%3E" alt="" draggable="false">`;
document.body.appendChild(cursorEl);

// Trail segments — each is a smoothly interpolating point
const segments = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-trail';
    const frac = 1 - i / TRAIL_COUNT; // 1 near cursor, 0 at tail
    const size = Math.max(2, Math.round(TRAIL_MAX_SIZE * frac * frac));
    const color = TRAIL_COLORS[Math.floor(i / TRAIL_COUNT * TRAIL_COLORS.length)];
    const alpha = 0.7 * frac;
    el.style.cssText = `width:${size}px;height:${size}px;margin-left:${-size/2}px;margin-top:${-size/2}px;background:${color}${alpha.toFixed(2)});`;
    document.body.appendChild(el);
    segments.push({
        el,
        x: -300,
        y: -300
    });
}

let mouseX = -300,
    mouseY = -300;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Snap cursor image to mouse
    cursorEl.style.left = (mouseX - CURSOR_HOTSPOT_X) + 'px';
    cursorEl.style.top = (mouseY - CURSOR_HOTSPOT_Y) + 'px';

    // Each segment lerps toward the point ahead of it (segment 0 chases mouse)
    let targetX = mouseX,
        targetY = mouseY;
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const s = segments[i];
        s.x += (targetX - s.x) * TRAIL_LERP;
        s.y += (targetY - s.y) * TRAIL_LERP;
        s.el.style.left = s.x + 'px';
        s.el.style.top = s.y + 'px';
        // Each subsequent segment chases the current one
        targetX = s.x;
        targetY = s.y;
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();