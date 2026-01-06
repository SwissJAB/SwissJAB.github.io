// Timeline background switching on scroll
function initializeTimeline() {
    const timelineSections = document.querySelectorAll('.timeline-section');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-30% 0px -30% 0px'
    };

    timelineSections.forEach(section => {
        const timelineItems = section.querySelectorAll('.timeline-item');
        let currentEventIndex = 0;

        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Find the actual index of this item in the timeline
                    let itemIndex = -1;
                    for (let i = 0; i < timelineItems.length; i++) {
                        if (timelineItems[i] === entry.target) {
                            itemIndex = i;
                            break;
                        }
                    }
                    
                    if (itemIndex !== -1 && itemIndex !== currentEventIndex) {
                        currentEventIndex = itemIndex;
                        
                        // Preload next image to prevent flickering
                        if (itemIndex + 1 < timelineItems.length) {
                            const nextBg = timelineItems[itemIndex + 1].getAttribute('data-bg');
                            if (nextBg) new Image().src = nextBg;
                        }
                        
                        // Create fade effect
                        section.classList.add('fading');
                        
                        setTimeout(() => {
                            // Set background image from data attribute
                            const bgImage = entry.target.getAttribute('data-bg');
                            if (bgImage) {
                                section.style.setProperty('--bg-image', `url('${bgImage}')`);
                            }
                            
                            // Reset background position when switching images
                            // section.style.backgroundPosition = 'center 0%'; // Handled in CSS now
                            
                            // End fade effect
                            section.classList.remove('fading');
                            
                            // Highlight current item
                            timelineItems.forEach(item => item.classList.remove('active'));
                            entry.target.classList.add('active');
                            
                            console.log('Switched to event', itemIndex + 1, 'image:', bgImage);
                        }, 250);
                    }
                }
            });
        }, observerOptions);

        timelineItems.forEach(item => {
            bgObserver.observe(item);
        });
        
        // Set initial state
        if (timelineItems.length > 0) {
            timelineItems[0].classList.add('active');
            const initialBg = timelineItems[0].getAttribute('data-bg');
            if (initialBg) {
                section.style.setProperty('--bg-image', `url('${initialBg}')`);
            }
            // Preload the second image immediately
            if (timelineItems.length > 1) {
                const secondBg = timelineItems[1].getAttribute('data-bg');
                if (secondBg) new Image().src = secondBg;
            }
            console.log('Timeline initialized - set to event 1');
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializeTimeline);

// Open media in modal
function openMediaModal(element) {
    const modal = document.getElementById('mediaModal');
    const modalContent = document.getElementById('modalContent');
    const downloadBtn = document.getElementById('downloadBtn');
    
    const media = element.querySelector('img') || element.querySelector('video');
    if (!media) return;
    
    let mediaClone;
    if (media.tagName === 'IMG') {
        mediaClone = document.createElement('img');
        mediaClone.src = media.src;
        mediaClone.alt = media.alt;
        downloadBtn.onclick = () => downloadFile(media.src, media.alt);
    } else {
        mediaClone = document.createElement('video');
        mediaClone.src = media.querySelector('source')?.src;
        mediaClone.controls = true;
        mediaClone.autoplay = true;
        downloadBtn.onclick = () => downloadFile(mediaClone.src, 'video');
    }
    
    modalContent.innerHTML = '';
    modalContent.appendChild(mediaClone);
    modal.classList.add('active');
}

// Close media modal
function closeMediaModal(event) {
    const modal = document.getElementById('mediaModal');
    if (!event || event.target === modal) {
        modal.classList.remove('active');
    }
}

// Download file
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('mediaModal').classList.remove('active');
    }
});
