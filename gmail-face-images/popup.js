document.getElementById('submitJson').addEventListener('click', function() {
    const file = document.getElementById('jsonUpload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataArray = JSON.parse(e.target.result);
            console.log("Parsed data:", dataArray);  // Log the parsed data

            dataArray.forEach(data => {
                const studentData = {
                    First: data.First || '',
                    Last: data.Last || '',
                    EmailAddress: data.EmailAddress || '',
                    imageBlob: data.imageBlob || '',
                    Notes: data.Notes || ''
                };
                console.log("Processed student data:", studentData);  // Log the processed student data

                // Convert EmailAddress into a lowercase string as index
                let email = studentData.EmailAddress.toLowerCase();

                // Ignore empty emails
                if (!email) return;

                // Store (or update) student data in local storage
                chrome.storage.local.set({ [email]: studentData }, function() {
                    if (chrome.runtime.lastError) {
                        console.error("Error setting data:", chrome.runtime.lastError);
                    } else {
                        console.log("Data set successfully for email:", data.EmailAddress);
                        document.getElementById('uploadStatus').textContent = 'Upload successful!';
                        displayIndexedEmails();
                    }
                });
                
                // "Ignore Subdomain" option

                // Compute the main domain email address if email is not empty
                const mainDomainEmail = email ? email.split('@')[0] + '@' + email.split('.').slice(-2).join('.') : '';

                // To handle the "ignore subdomain" option, we also store the data under the main domain email address
                // if the email address is not empty and is not the same as the main domain email address
                if (email !== mainDomainEmail) {
                    chrome.storage.local.set({ [mainDomainEmail]: { alias: email.toLowerCase() } }, function() {
                        if (chrome.runtime.lastError) {
                            console.error("Error setting data:", chrome.runtime.lastError);
                        } else {
                            console.log("Data set successfully for email:", data.EmailAddress);
                            document.getElementById('uploadStatus').textContent = 'Upload successful!';
                            displayIndexedEmails();
                        }
                    });
                }
            });
        };
        reader.readAsText(file);
    }
});

function displayIndexedEmails() {
    chrome.storage.local.get(null, function(items) {
        const emailList = document.getElementById('emailList');
        emailList.innerHTML = ''; // Clear the list
        for (let email in items) {
            if (items[email].alias) continue;  // Skip aliases

            const li = document.createElement('li');
            li.textContent = items[email].EmailAddress;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', function() {
                chrome.storage.local.remove(email, function() {
                    displayIndexedEmails();
                });
            });
            li.appendChild(removeBtn);
            emailList.appendChild(li);
        }
    });
}

document.getElementById('flushData').addEventListener('click', function() {
    chrome.storage.local.clear(function() {
        displayIndexedEmails();
    });
});

// Display indexed emails on popup load
displayIndexedEmails();

// Load the state of the "Ignore Subdomain" checkbox on popup load
chrome.storage.local.get('ignoreSubdomain', function(data) {
    document.getElementById('ignoreSubdomain').checked = data.ignoreSubdomain || false;
});

// Save the state of the "Ignore Subdomain" checkbox when it's changed
document.getElementById('ignoreSubdomain').addEventListener('change', function() {
    chrome.storage.local.set({ ignoreSubdomain: this.checked });
});