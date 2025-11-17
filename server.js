const express = require('express');
const { runPhantombusterScript } = require('./phantombuster-automation');
const { visitPageScript } = require('./visit-page');
const { loginPhantombuster } = require('./pb-login');

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

// ENDPOINT - odwiedza stronę
app.post('/visit-page', async (req, res) => {
  const { url } = req.body;
  
  console.log(`[${new Date().toISOString()}] 🚀 Nowe żądanie wizyty na stronie: ${url}`);
  
  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'Brak parametru "url" w żądaniu',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    const result = await visitPageScript(url);
    
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

// ENDPOINT - logowanie do PhantomBuster
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log(`[${new Date().toISOString()}] 🔐 Nowe żądanie logowania: ${email}`);
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Brak parametrów "email" lub "password" w żądaniu',
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    const result = await loginPhantombuster(email, password);
    
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

// Zapisz server do zmiennej i ustaw timeouty
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API działa na porcie ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Create account: POST http://localhost:${PORT}/create-account`);
  console.log(`🔍 Visit page: POST http://localhost:${PORT}/visit-page`);
  console.log(`🔍 Login: POST http://localhost:${PORT}/login`);
});

// Zwiększ timeout do 4 minut (240 sekund)
server.timeout = 240000;
server.keepAliveTimeout = 240000;
server.headersTimeout = 245000;

console.log(`⏱️ Server timeout ustawiony na: ${server.timeout / 1000}s`);