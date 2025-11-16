const express = require('express');
const { runPhantombusterScript } = require('./phantombuster-automation');

const app = express();
app.use(express.json());

// Health check dla Coolify
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'phantombuster-automation',
    timestamp: new Date().toISOString()
  });
});

// Główny endpoint - tworzy konto
app.post('/create-account', async (req, res) => {
  const { webhookURL } = req.body;
  
  console.log(`[${new Date().toISOString()}] 🚀 Nowe żądanie tworzenia konta`);
  
  try {
    const result = await runPhantombusterScript(webhookURL);
    
    res.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Błąd:`, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API działa na porcie ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Create account: POST http://localhost:${PORT}/create-account`);
});