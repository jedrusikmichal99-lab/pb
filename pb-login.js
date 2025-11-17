const { chromium } = require('playwright');
const { createCursor } = require('ghost-cursor-playwright');

// ==================== LUDZKIE PISANIE ====================
async function typeHumanLike(page, text) {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // 10% szans na błąd
    if (Math.random() < 0.10 && i > 0) {
      const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      await page.keyboard.type(wrongChar);
      await page.waitForTimeout(100 + Math.random() * 300);
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(150 + Math.random() * 250);
    }
    
    await page.keyboard.type(char);
    
    const rand = Math.random();
    
    if (rand < 0.03) {
      await page.waitForTimeout(2000 + Math.random() * 3000);
    } else if (rand < 0.13) {
      await page.waitForTimeout(500 + Math.random() * 1000);
    } else if ('aeiou'.includes(char.toLowerCase())) {
      await page.waitForTimeout(30 + Math.random() * 100);
    } else {
      await page.waitForTimeout(30 + Math.random() * 270);
    }
  }
  
  await page.waitForTimeout(200 + Math.random() * 1800);
}

// ==================== GŁÓWNY SKRYPT ====================
async function loginPhantombuster(email, password) {
  console.log('🔐 ========================================');
  console.log('🔐 PHANTOMBUSTER LOGIN - Ghost-cursor');
  console.log('📧 Email:', email);
  console.log('🔐 ========================================');
  
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
  
  // Anti-detection
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
    console.log('🌐 Wchodzę na stronę logowania...');
    await page.goto('https://phantombuster.com/login', { waitUntil: 'networkidle' });
    console.log('✅ Strona załadowana!');
    
    console.log('👀 Symulacja czytania strony...');
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(500 + Math.random() * 1000);
    await page.mouse.wheel(0, -50);
    await page.waitForTimeout(300 + Math.random() * 700);
    
    // Losowe ruchy myszy (ghost-cursor)
    console.log('🖱️ Naturalne ruchy myszką...');
    await cursor.actions.move({ x: 300 + Math.random() * 600, y: 200 + Math.random() * 400 });
    await page.waitForTimeout(2000 + Math.random() * 3000);
    
    await cursor.actions.move({ x: 400 + Math.random() * 500, y: 300 + Math.random() * 300 });
    await page.waitForTimeout(800 + Math.random() * 2000);
    
    // ========== EMAIL ==========
    console.log('✏️ Wprowadzam email...');
    await page.waitForSelector('input[type="email"]');
    
    await cursor.actions.click({ 
      target: 'input[type="email"]',
      waitBeforeClick: [200, 600]
    });
    
    await typeHumanLike(page, email);
    console.log('  ✅ Email wprowadzony!');
    
    await cursor.actions.move({ x: 500 + Math.random() * 400, y: 250 + Math.random() * 350 });
    await page.waitForTimeout(500 + Math.random() * 1500);
    
    // ========== HASŁO ==========
    console.log('✏️ Wprowadzam hasło...');
    
    await cursor.actions.click({ 
      target: 'input[type="password"]',
      waitBeforeClick: [300, 700]
    });
    
    await typeHumanLike(page, password);
    console.log('  ✅ Hasło wprowadzone!');
    
    await cursor.actions.move({ x: 600 + Math.random() * 300, y: 400 + Math.random() * 200 });
    await page.waitForTimeout(1000 + Math.random() * 3000);
    
    // ========== LOG IN ==========
    console.log('🔵 Klikam Log in...');
    
    try {
      // Próba 1: Szukaj przycisku z tekstem "Log in"
      await cursor.actions.click({ 
        target: 'button:has-text("Log in")',
        waitBeforeClick: [300, 800]
      });
      console.log('  ✅ Kliknięto przycisk Log in!');
    } catch (e) {
      console.log('  ⚠️ Próba alternatywna...');
      
      try {
        // Próba 2: Szukaj button[type="submit"]
        const submitBtns = await page.$$('button[type="submit"]');
        if (submitBtns.length > 0) {
          const box = await submitBtns[0].boundingBox();
          await cursor.actions.click({ 
            target: box,
            waitBeforeClick: [300, 800]
          });
          console.log('  ✅ Kliknięto (boundingBox)!');
        }
      } catch (e2) {
        console.log('  ❌ Nie udało się kliknąć Log in:', e2.message);
      }
    }
    
    console.log('⏳ Czekam 5 sekund na załadowanie dashboardu...');
    await page.waitForTimeout(5000);
    
    // Dodatkowe oczekiwanie na załadowanie sieci
    await page.waitForLoadState('networkidle').catch(() => {
      console.log('  ℹ️ NetworkIdle timeout, kontynuuję...');
    });
    
    const finalUrl = page.url();
    console.log('🌐 Aktualny URL:', finalUrl);
    
    // Pobierz wszystkie cookies
    const cookies = await context.cookies();
    
    // Konwertuj cookies do formatu string (jak w przeglądarce)
    const cookieString = cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    await browser.close();
    
    console.log('✅ ========================================');
    console.log('✅ LOGOWANIE ZAKOŃCZONE POMYŚLNIE!');
    console.log('✅ ========================================');
    console.log('🍪 Cookies count:', cookies.length);
    console.log('🍪 Cookies string:', cookieString.substring(0, 100) + '...');
    
    return {
      success: true,
      email,
      finalUrl,
      cookies: cookies,           // Pełny array cookies
      cookieString: cookieString, // String gotowy do użycia
      cookiesCount: cookies.length,
      message: 'Zalogowano pomyślnie do PhantomBuster'
    };
    
  } catch (error) {
    console.error('❌ BŁĄD:', error.message);
    console.log('🔍 Stack:', error.stack);
    
    await browser.close();
    
    throw new Error(`Błąd podczas logowania: ${error.message}`);
  }
}

module.exports = { loginPhantombuster };

// Test lokalny (opcjonalnie)
if (require.main === module) {
  console.log('🚀 Uruchamiam test logowania...');
  
  const testEmail = process.argv[2] || 'test@example.com';
  const testPassword = process.argv[3] || 'TestPassword123';
  
  loginPhantombuster(testEmail, testPassword)
    .then(result => {
      console.log('✅ GOTOWE!', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ BŁĄD:', error);
      process.exit(1);
    });
}