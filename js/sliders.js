// ==========================================
// OCEAN COINS SLIDER - WITH DEBUGGING
// ==========================================

console.log('🚀 sliders.js loaded');

let currentSlide = 0;

function moveSlider(direction) {
    console.log(`\n➡️ moveSlider called with direction: ${direction}`);
    
    const slider = document.getElementById('coinsSlider');
    if (!slider) {
        console.error('❌ coinsSlider not found!');
        return;
    }
    console.log('✅ Slider element found');
    
    const slides = slider.querySelectorAll('.coins-slide');
    const totalSlides = slides.length;
    console.log(`📊 Total slides: ${totalSlides}`);
    
    // Update current slide index
    currentSlide += direction;
    console.log(`📍 Before wrap - currentSlide: ${currentSlide}`);
    
    // Wrap around logic
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
        console.log('⚙️ Wrapped to start');
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
        console.log('⚙️ Wrapped to end');
    }
    
    console.log(`📍 After wrap - currentSlide: ${currentSlide}`);
    
    // Calculate offset
    const offsetPercent = currentSlide * 100;
    const transformValue = `translateX(-${offsetPercent}%)`;
    
    console.log(`🎬 Applying transform: ${transformValue}`);
    console.log(`📐 Offset: -${offsetPercent}%`);
    
    // Apply transform
    slider.style.transform = transformValue;
    console.log(`✨ Transform applied to slider`);
    
    // Update dots
    updateDots();
    
    console.log(`✅ Slide changed to: ${currentSlide}\n`);
}

function updateDots() {
    const dots = document.querySelectorAll('#coinsSliderDots .slider-dot');
    console.log(`🔵 Found ${dots.length} dots`);
    
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
            console.log(`✅ Dot ${index} set to active`);
        } else {
            dot.classList.remove('active');
        }
    });
}

function initSliders() {
    console.log('\n🔧 initSliders() called');
    
    const slider = document.getElementById('coinsSlider');
    if (!slider) {
        console.error('❌ coinsSlider not found in initSliders');
        return;
    }
    
    const slides = slider.querySelectorAll('.coins-slide');
    const totalSlides = slides.length;
    console.log(`📊 Initializing with ${totalSlides} slides`);
    
    const dotsContainer = document.getElementById('coinsSliderDots');
    if (!dotsContainer) {
        console.error('❌ coinsSliderDots not found!');
        return;
    }
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        
        dot.addEventListener('click', () => {
            const diff = i - currentSlide;
            console.log(`🖱️ Dot ${i} clicked (diff: ${diff})`);
            moveSlider(diff);
        });
        
        dotsContainer.appendChild(dot);
        console.log(`✅ Dot ${i} created`);
    }
    
    console.log(`✨ Slider initialized with ${totalSlides} dots\n`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOMContentLoaded fired');
        initSliders();
    });
} else {
    console.log('📄 DOM already loaded');
    initSliders();
}
