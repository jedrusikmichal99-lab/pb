const { chromium } = require('playwright');
const { createCursor } = require('ghost-cursor-playwright');

// ==================== GŁÓWNY SKRYPT ====================
async function visitPageScript(targetUrl) {
  const startTime = Date.now();
  console.log('🌐 ========================================');
  console.log('🌐 VISIT PAGE - Ghost-cursor automation');
  console.log('🌐 Target URL:', targetUrl);
  console.log('🌐 ========================================');
  
  const browser = await chromium.launch({
    headless: true, // TRUE dla serwera!
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'Europe/Warsaw'
  });
  
  const page = await context.newPage();
  
  // 🚀 GHOST-CURSOR
  const cursor = await createCursor(page);
  console.log('✅ Ghost-cursor aktywny!');
  
  // Anti-detection (taki sam jak w phantombuster-automation)
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    
    delete navigator.__proto__.webdriver;
    
    window.chrome = { runtime: {} };
    
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
    
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });
    
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });
  
  try {
    console.log('🌐 Wchodzę na stronę:', targetUrl);
    
    // ZMIENIONE: domcontentloaded zamiast networkidle + dłuższy timeout
    await page.goto(targetUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 // 60 sekund zamiast domyślnych 30
    });
    
    console.log('✅ Strona załadowana!');
    
    // Poczekaj chwilę na dodatkowe zasoby
    await page.waitForTimeout(2000);
    
    // Symulacja czytania strony (scroll)
    console.log('👀 Symulacja czytania strony...');
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(500 + Math.random() * 500); // ZREDUKOWANE z 500-1500
    await page.mouse.wheel(0, -50);
    await page.waitForTimeout(300 + Math.random() * 400); // ZREDUKOWANE z 300-1000
    
    // Losowe naturalne ruchy myszką (3-6 razy) - SZYBSZE
    const numberOfMoves = Math.floor(Math.random() * 4) + 3; // 3-6 ruchów
    console.log(`🖱️ Wykonuję ${numberOfMoves} naturalnych ruchów myszką...`);
    
    for (let i = 0; i < numberOfMoves; i++) {
      const x = 200 + Math.random() * 1200;
      const y = 150 + Math.random() * 700;
      
      console.log(`  🖱️ Ruch ${i + 1}/${numberOfMoves} → (${Math.round(x)}, ${Math.round(y)})`);
      
      await cursor.actions.move({ x, y });
      
      // ZREDUKOWANA pauza między ruchami (500ms-1s zamiast 2-5s)
      const pauseTime = 500 + Math.random() * 500;
      await page.waitForTimeout(pauseTime);
    }
    
    // Dodatkowy scroll w środku
    console.log('📜 Dodatkowy scroll...');
    await page.mouse.wheel(0, 200 + Math.random() * 300);
    await page.waitForTimeout(500 + Math.random() * 500); // ZREDUKOWANE z 1000-3000
    
    // Jeszcze jeden losowy ruch
    await cursor.actions.move({ 
      x: 400 + Math.random() * 800, 
      y: 300 + Math.random() * 500 
    });
    await page.waitForTimeout(300 + Math.random() * 500); // ZREDUKOWANE z 500-2000
    
    // ZREDUKOWANY czas oczekiwania: 20-25 sekund zamiast 55-65 sekund
    const waitTime = 20000 + Math.random() * 5000;
    console.log(`⏳ Czekam ${Math.round(waitTime/1000)} sekund na stronie...`);
    
    // Podziel czas oczekiwania na mniejsze kawałki z mini-aktywnościami
    const chunks = 4; // ZREDUKOWANE z 6 do 4
    const chunkTime = waitTime / chunks;
    
    for (let i = 0; i < chunks; i++) {
      await page.waitForTimeout(chunkTime);
      
      // Co jakiś czas małe poruszenie myszką
      if (i % 2 === 0) {
        await cursor.actions.move({ 
          x: 300 + Math.random() * 1000, 
          y: 200 + Math.random() * 600 
        });
      }
    }
    
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ ========================================');
    console.log('✅ WIZYTA ZAKOŃCZONA POMYŚLNIE!');
    console.log(`✅ Czas wykonania: ${executionTime}s`);
    console.log('✅ ========================================');
    
    const finalUrl = page.url();
    console.log('🌐 Final URL:', finalUrl);
    
    await browser.close();
    
    return {
      success: true,
      targetUrl,
      finalUrl,
      movesPerformed: numberOfMoves,
      timeSpent: Math.round(waitTime/1000),
      executionTime: `${executionTime}s`,
      message: 'Strona odwiedzona pomyślnie'
    };
    
  } catch (error) {
    console.error('❌ BŁĄD:', error.message);
    console.log('🔍 Stack:', error.stack);
    
    await browser.close();
    
    throw new Error(`Błąd podczas wizyty na stronie: ${error.message}`);
  }
}

module.exports = { visitPageScript };

// Test lokalny (opcjonalnie)
if (require.main === module) {
  console.log('🚀 Uruchamiam test...');
  const testUrl = process.argv[2] || 'https://example.com';
  
  visitPageScript(testUrl)
    .then(result => {
      console.log('✅ GOTOWE!', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ BŁĄD:', error);
      process.exit(1);
    });
}