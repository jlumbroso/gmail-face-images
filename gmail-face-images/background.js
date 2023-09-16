// lookupEmail with one named optional parameter "ignoreSubdomain"
// lookupEmail with one named optional parameter "ignoreSubdomain"
function lookupEmail(email, ignoreSubdomain, callback) {
    const emailLower = email.toLowerCase();

    function getMainEntry(result) {
        if (result && result[emailLower]) {
            if (result[emailLower].alias && ignoreSubdomain) {
                // If it's an alias and "ignore subdomain" is turned on, lookup the main entry:
                lookupEmail(result[emailLower].alias, ignoreSubdomain, callback);
            } else if (result[emailLower].imageBlob) {
                callback({ imageBlob: result[emailLower].imageBlob });
            } else {
                callback({ imageBlob: null });
            }
        } else  {
            // If there's no result for the exact email address, try the main domain address
            const mainDomainEmail = emailLower.split('@')[0] + '@' + emailLower.split('.').slice(-2).join('.');
            if (emailLower !== mainDomainEmail && ignoreSubdomain) {
                lookupEmail(mainDomainEmail, ignoreSubdomain, callback);
            } else {
                callback({ imageBlob: null });
            }
        }
    }
    chrome.storage.local.get(emailLower, getMainEntry);
}


    

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getImageBlob") {
        chrome.storage.local.get('ignoreSubdomain', function(data) {
            let ignoreSubdomain = data.ignoreSubdomain || false;
            lookupEmail(request.email, ignoreSubdomain, sendResponse);
        });
        return true;  // indicates the response is sent asynchronously
    }
});
