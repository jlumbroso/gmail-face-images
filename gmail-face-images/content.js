function replaceProfileImages() {
    // Get all the profile images
    const profileImages = document.querySelectorAll('img.ajn[jid]');

    profileImages.forEach(img => {
        const email = img.getAttribute('jid');
        chrome.runtime.sendMessage({ action: "getImageBlob", email: email }, response => {
            if (response && response.imageBlob) {
                img.src = response.imageBlob;
            }
        });
    });
}

// Use a MutationObserver to detect changes in the DOM
const observer = new MutationObserver(replaceProfileImages);
observer.observe(document.body, { childList: true, subtree: true });
