function replaceProfileImages() {
    // Get all the profile images
    const profileImages = document.querySelectorAll('img.ajn[jid]');

    // Replace each image's src with the web-accessible dummy image
    profileImages.forEach(img => {
        img.src = chrome.runtime.getURL('dummy.png');
    });
}

// Continuously check and replace images every 2 seconds
setInterval(replaceProfileImages, 2000);
