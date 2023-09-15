chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getImageBlob") {
        chrome.storage.local.get(request.email, function(result) {
            if (result && result[request.email] && result[request.email].imageBlob) {
                sendResponse({ imageBlob: result[request.email].imageBlob });
            } else {
                sendResponse({ imageBlob: null });
            }
        });
        return true;  // indicates the response is sent asynchronously
    }
});
