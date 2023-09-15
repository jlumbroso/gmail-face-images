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

                chrome.storage.local.set({ [data.EmailAddress]: studentData }, function() {
                    if (chrome.runtime.lastError) {
                        console.error("Error setting data:", chrome.runtime.lastError);
                    } else {
                        console.log("Data set successfully for email:", data.EmailAddress);
                        document.getElementById('uploadStatus').textContent = 'Upload successful!';
                        displayIndexedEmails();
                    }
                });
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
            const li = document.createElement('li');
            li.textContent = email;
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
