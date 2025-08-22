document.addEventListener('DOMContentLoaded', () => {

    const fields = {
        'startDate': 'preview-startDate',
        'startDay': 'preview-startDay',
        'startTime': 'preview-startTime',
        'endDate': 'preview-endDate',
        'endDay': 'preview-endDay',
        'endTime': 'preview-endTime',
        'venue': 'preview-venue',
        'inviter': 'preview-inviter',
        'contact': 'preview-contact'
    };

    function updatePreview() {
        for (const [inputId, previewId] of Object.entries(fields)) {
            const inputElement = document.getElementById(inputId);
            const previewElement = document.getElementById(previewId);
            if (inputElement && previewElement) {
                if (inputElement.tagName.toLowerCase() === 'textarea') {
                    previewElement.innerHTML = inputElement.value.replace(/\n/g, '<br>');
                } else {
                    previewElement.textContent = inputElement.value;
                }
            }
        }
    }

    for (const inputId in fields) {
        document.getElementById(inputId)?.addEventListener('input', updatePreview);
    }

    // --- Color PNG Download Logic ---
    document.getElementById('downloadColorBtn').addEventListener('click', () => {
        downloadImage('color');
    });

    // --- Black & White JPG Download Logic ---
    document.getElementById('downloadBwBtn').addEventListener('click', () => {
        downloadImage('bw');
    });

    // --- Universal Image Download Function ---
    function downloadImage(type) {
        const cardElement = document.getElementById('invitation-card');
        
        // Temporarily apply a class for black & white version if needed
        if (type === 'bw') {
            cardElement.classList.add('bw-export-prep');
        }

        window.scrollTo(0, 0);

        const dpi = 300;
        const targetWidthInches = 5.25;
        const targetHeightInches = 7.69;

        const finalWidthPx = Math.round(targetWidthInches * dpi);
        const finalHeightPx = Math.round(targetHeightInches * dpi);

        html2canvas(cardElement, {
            scale: 3,
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Remove the temporary class *after* the canvas is created
            if (type === 'bw') {
                cardElement.classList.remove('bw-export-prep');
            }

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = finalWidthPx;
            finalCanvas.height = finalHeightPx;
            const ctx = finalCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
            
            // Determine file type and data URL
            let dataUrl, fileName;
            if (type === 'bw') {
                dataUrl = finalCanvas.toDataURL('image/jpeg', 0.95);
                fileName = 'invitation_bw.jpg';
            } else {
                dataUrl = finalCanvas.toDataURL('image/png');
                fileName = 'invitation_color.png';
            }

            // Trigger download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);

        }).catch(err => {
            // Always remove the class in case of an error
            if (type === 'bw') {
                cardElement.classList.remove('bw-export-prep');
            }
            console.error("Image generation failed:", err);
            alert("Sorry, the image could not be created. Please try again.");
        });
    }

    updatePreview();
});