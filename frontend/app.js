// Frontend Application Logic

// Initialize particles
function initParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(particle);
    }
}

// Algorithm selector functionality
function initAlgorithmSelector() {
    document.querySelectorAll('.algo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tool panels
            document.querySelectorAll('.tool-panel').forEach(panel => panel.style.display = 'none');
            
            // Show selected tool panel
            const algo = this.dataset.algo;
            document.getElementById(algo + '-tool').style.display = 'block';
        });
    });
}

// Smooth scrolling for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Caesar Cipher Functions
async function caesarEncrypt() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const text = document.getElementById('caesar-input').value;
        const shift = parseInt(document.getElementById('caesar-shift').value);
        
        if (!text) {
            throw new Error('Please enter text to encrypt');
        }
        
        const response = await caesarEncryptAPI(text, shift);
        displayResult('caesar', response.output, {
            algorithm: response.algorithm,
            shift: response.shift,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('caesar', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

async function caesarDecrypt() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const text = document.getElementById('caesar-input').value;
        const shift = parseInt(document.getElementById('caesar-shift').value);
        
        if (!text) {
            throw new Error('Please enter text to decrypt');
        }
        
        const response = await caesarDecryptAPI(text, shift);
        displayResult('caesar', response.output, {
            algorithm: response.algorithm,
            shift: response.shift,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('caesar', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

// Vigenère Cipher Functions
async function vigenereEncrypt() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const text = document.getElementById('vigenere-input').value;
        const key = document.getElementById('vigenere-key').value;
        
        if (!text) {
            throw new Error('Please enter text to encrypt');
        }
        if (!key) {
            throw new Error('Please enter a keyword');
        }
        
        const response = await vigenereEncryptAPI(text, key);
        displayResult('vigenere', response.output, {
            algorithm: response.algorithm,
            key: response.key,
            keyLength: response.keyLength,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('vigenere', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

async function vigenereDecrypt() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const text = document.getElementById('vigenere-input').value;
        const key = document.getElementById('vigenere-key').value;
        
        if (!text) {
            throw new Error('Please enter text to decrypt');
        }
        if (!key) {
            throw new Error('Please enter a keyword');
        }
        
        const response = await vigenereDecryptAPI(text, key);
        displayResult('vigenere', response.output, {
            algorithm: response.algorithm,
            key: response.key,
            keyLength: response.keyLength,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('vigenere', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

// RSA Functions
async function generateRSAKeys() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const p = parseInt(document.getElementById('rsa-p').value);
        const q = parseInt(document.getElementById('rsa-q').value);
        const e = parseInt(document.getElementById('rsa-e').value);
        
        const response = await rsaGenerateKeysAPI(p, q, e);
        
        // Store keys globally
        currentRSAKeys.publicKey = response.publicKey;
        currentRSAKeys.privateKey = response.privateKey;
        
        const output = `Keys Generated Successfully!
        
Public Key:
  n = ${response.publicKey.n}
  e = ${response.publicKey.e}

Private Key:
  n = ${response.privateKey.n}
  d = ${response.privateKey.d}

Parameters:
  p = ${response.parameters.p}
  q = ${response.parameters.q}
  φ(n) = ${response.parameters.phi}`;
        
        displayResult('rsa', output, {
            algorithm: response.algorithm,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('rsa', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

async function rsaEncrypt() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const message = document.getElementById('rsa-input').value;
        
        if (!message) {
            throw new Error('Please enter a message to encrypt');
        }
        
        // Generate keys if not already generated
        if (!currentRSAKeys.publicKey) {
            await generateRSAKeys();
            // Wait a bit for keys to be generated
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (!currentRSAKeys.publicKey) {
            throw new Error('Failed to generate keys. Please try again.');
        }
        
        const response = await rsaEncryptAPI(message, currentRSAKeys.publicKey);
        
        const output = `Encrypted: ${response.output}

Formula: ${response.formula}

Public Key Used:
  n = ${response.publicKey.n}
  e = ${response.publicKey.e}`;
        
        displayResult('rsa', output, {
            algorithm: response.algorithm,
            input: response.input,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('rsa', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

async function rsaDecrypt() {
    const button = event.target.closest('button');
    setButtonLoading(button, true);
    
    try {
        const ciphertext = document.getElementById('rsa-input').value;
        
        if (!ciphertext) {
            throw new Error('Please enter ciphertext to decrypt');
        }
        
        if (!currentRSAKeys.privateKey) {
            throw new Error('Private key not available. Please generate keys first.');
        }
        
        const response = await rsaDecryptAPI(ciphertext, currentRSAKeys.privateKey);
        
        const output = `Decrypted: ${response.output}

Formula: ${response.formula}

Private Key Used:
  n = ${response.privateKey.n}
  d = ${response.privateKey.d}`;
        
        displayResult('rsa', output, {
            algorithm: response.algorithm,
            input: response.input,
            timestamp: new Date(response.timestamp).toLocaleString()
        });
    } catch (error) {
        showError('rsa', error.message);
    } finally {
        setButtonLoading(button, false);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initAlgorithmSelector();
    initSmoothScroll();
    
    console.log('CryptoLearn Frontend Initialized');
    console.log('API Base URL:', CONFIG.API_BASE_URL);
});
