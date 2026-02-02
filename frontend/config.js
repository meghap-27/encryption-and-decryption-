// API Configuration
const CONFIG = {
    // Backend API base URL
    API_BASE_URL: 'http://localhost:3000/api',
    
    // API endpoints
    ENDPOINTS: {
        HEALTH: '/health',
        CAESAR_ENCRYPT: '/crypto/caesar/encrypt',
        CAESAR_DECRYPT: '/crypto/caesar/decrypt',
        VIGENERE_ENCRYPT: '/crypto/vigenere/encrypt',
        VIGENERE_DECRYPT: '/crypto/vigenere/decrypt',
        RSA_GENERATE: '/crypto/rsa/generate-keys',
        RSA_ENCRYPT: '/crypto/rsa/encrypt',
        RSA_DECRYPT: '/crypto/rsa/decrypt',
        ALGORITHMS: '/crypto/algorithms'
    },
    
    // Request timeout (ms)
    TIMEOUT: 10000,
    
    // Retry configuration
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

// Store RSA keys globally
let currentRSAKeys = {
    publicKey: null,
    privateKey: null
};
