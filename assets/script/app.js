// Gestione header fisso
const header = document.querySelector('.fixed-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Aggiungi classe per lo sfondo più opaco quando si scrolla
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Gestione menu mobile
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
`;

const nav = document.querySelector('nav');
const navLinks = document.querySelector('.nav-links');

if (window.innerWidth <= 768) {
    nav.insertBefore(menuToggle, navLinks);
}

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Gestione form GetResponse
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    // Validazione base
    if (!formData.get('email').includes('@')) {
        alert('Per favore inserisci un indirizzo email valido');
        return;
    }
    
    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Reindirizza alla pagina di ringraziamento
            window.location.href = formData.get('thankyou_url');
        } else {
            throw new Error('Errore nell\'invio del form');
        }
    } catch (error) {
        console.error('Errore:', error);
        alert('Si è verificato un errore. Per favore riprova più tardi.');
    }
});

// Smooth scroll con compensazione per header fisso
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 70;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Chiudi il menu mobile se aperto
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
        }
    });
});

// Tracciamento degli eventi per analytics
function trackEvent(eventName, eventData = {}) {
    // Implementa qui il tuo codice di analytics
    console.log('Event tracked:', eventName, eventData);
}

// Traccia i click sui CTA
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('cta_clicked', {
            button_text: button.innerText,
            page_location: window.location.pathname
        });
    });
});

// Traccia le visualizzazioni delle sezioni
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            trackEvent('section_viewed', {
                section_id: entry.target.id
            });
        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => {
    sectionObserver.observe(section);
});