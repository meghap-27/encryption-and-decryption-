
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.error || responseData.message || 'Request failed');
        }
        
        return responseData;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}


async function checkAPIHealth() {
    try {
        const response = await apiRequest(CONFIG.ENDPOINTS.HEALTH, 'GET');
        updateAPIStatus(true);
        return response;
    } catch (error) {
        updateAPIStatus(false);
        return null;
    }
}


function updateAPIStatus(isOnline) {
    const indicator = document.getElementById('api-indicator');
    const statusText = document.getElementById('api-status-text');
    
    if (isOnline) {
        indicator.classList.add('online');
        indicator.classList.remove('offline');
        statusText.textContent = 'API Online';
        statusText.style.color = 'var(--accent-primary)';
    } else {
        indicator.classList.add('offline');
        indicator.classList.remove('online');
        statusText.textContent = 'API Offline';
        statusText.style.color = 'var(--accent-tertiary)';
    }
}


function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');
    
    if (isLoading) {
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        button.disabled = true;
    } else {
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
        button.disabled = false;
    }
}


function displayResult(algo, output, metadata = null) {
    const resultDiv = document.getElementById(`${algo}-result`);
    const outputDiv = document.getElementById(`${algo}-output`);
    const metaDiv = document.getElementById(`${algo}-meta`);
    
    outputDiv.textContent = output;
    
    if (metadata) {
        let metaHTML = '<strong>Response Details:</strong><br>';
        for (const [key, value] of Object.entries(metadata)) {
            if (key !== 'output' && key !== 'input') {
                metaHTML += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}<br>`;
            }
        }
        metaDiv.innerHTML = metaHTML;
    }
    
    resultDiv.classList.add('show');
}


function showError(algo, message) {
    const resultDiv = document.getElementById(`${algo}-result`);
    const outputDiv = document.getElementById(`${algo}-output`);
    
    outputDiv.textContent = `❌ Error: ${message}`;
    outputDiv.style.color = 'var(--accent-tertiary)';
    resultDiv.classList.add('show');
    

    setTimeout(() => {
        outputDiv.style.color = 'var(--accent-primary)';
    }, 3000);
}

// Caesar Cipher API Functions
async function caesarEncryptAPI(text, shift) {
    return await apiRequest(CONFIG.ENDPOINTS.CAESAR_ENCRYPT, 'POST', { text, shift });
}

async function caesarDecryptAPI(text, shift) {
    return await apiRequest(CONFIG.ENDPOINTS.CAESAR_DECRYPT, 'POST', { text, shift });
}

// Vigenère Cipher API Functions
async function vigenereEncryptAPI(text, key) {
    return await apiRequest(CONFIG.ENDPOINTS.VIGENERE_ENCRYPT, 'POST', { text, key });
}

async function vigenereDecryptAPI(text, key) {
    return await apiRequest(CONFIG.ENDPOINTS.VIGENERE_DECRYPT, 'POST', { text, key });
}

// RSA API Functions
async function rsaGenerateKeysAPI(p, q, e) {
    return await apiRequest(CONFIG.ENDPOINTS.RSA_GENERATE, 'POST', { p, q, e });
}

async function rsaEncryptAPI(message, publicKey) {
    return await apiRequest(CONFIG.ENDPOINTS.RSA_ENCRYPT, 'POST', { message, publicKey });
}

async function rsaDecryptAPI(ciphertext, privateKey) {
    return await apiRequest(CONFIG.ENDPOINTS.RSA_DECRYPT, 'POST', { ciphertext, privateKey });
}

// Initialize API connection on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Checking API connection...');
    await checkAPIHealth();
    
    // Check API health every 30 seconds
    setInterval(checkAPIHealth, 30000);
});
