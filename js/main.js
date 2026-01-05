// Timeline background switching on scroll
function initializeTimeline() {
    const timelineSection = document.querySelector('.timeline-section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    let currentEventIndex = 0;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-30% 0px -30% 0px'
    };

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
                    
                    // Create fade effect
                    timelineSection.classList.add('fading');
                    
                    setTimeout(() => {
                        // Remove all background classes
                        timelineSection.classList.remove('bg-event-1', 'bg-event-2', 'bg-event-3', 'bg-event-4', 'bg-event-5', 'bg-event-6', 'bg-event-7', 'bg-event-8', 'bg-event-9');
                        
                        // Add current event background class
                        const eventClass = `bg-event-${itemIndex + 1}`;
                        timelineSection.classList.add(eventClass);
                        
                        // Reset background position when switching images
                        timelineSection.style.backgroundPosition = 'center 0%';
                        
                        // End fade effect
                        timelineSection.classList.remove('fading');
                        
                        // Highlight current item
                        timelineItems.forEach(item => item.classList.remove('active'));
                        entry.target.classList.add('active');
                        
                        console.log('Switched to event', itemIndex + 1, 'class:', eventClass);
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
        timelineSection.classList.add('bg-event-1');
        console.log('Timeline initialized - set to event 1');
    }
    
    // Scroll-based parallax effect (distance-related, not time-based)
    window.addEventListener('scroll', () => {
        const rect = timelineSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate how far through the section the user has scrolled (0 to 1)
        // Clamped to prevent jumps outside the visible range
        let scrollProgress = (viewportHeight - sectionTop) / (viewportHeight + sectionHeight);
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
        
    });
        }

// Open file or URL from timeline item
function openFile(element) {
    const fileUrl = element.getAttribute('data-file');
    const linkUrl = element.getAttribute('data-link');
    
    if (fileUrl) {
        window.open(fileUrl, '_blank');
        console.log('Opening file:', fileUrl);
    } else if (linkUrl) {
        window.open(linkUrl, '_blank');
        console.log('Opening link:', linkUrl);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializeTimeline);

// Gallery toggle (kept for backwards compatibility)
function toggleGallery(galleryId) {
    const gallery = document.getElementById(galleryId);
    if (gallery) {
        gallery.style.display = gallery.style.display === 'none' ? 'block' : 'none';
    }
}

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
