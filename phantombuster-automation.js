const { chromium } = require('playwright');
const { createCursor } = require('ghost-cursor-playwright');

// ==================== GENERATORY ====================
function generateEmail() {
  const names = [
    'john', 'alice', 'bob', 'emma', 'mike', 'sarah', 'david', 'lisa',
    'james', 'mary', 'robert', 'patricia', 'michael', 'jennifer', 'william',
    'linda', 'richard', 'elizabeth', 'joseph', 'barbara', 'thomas', 'susan',
    'charles', 'jessica', 'daniel', 'karen', 'matthew', 'nancy', 'anthony',
    'betty', 'mark', 'helen', 'donald', 'sandra', 'steven', 'ashley', 'paul',
    'kimberly', 'andrew', 'emily', 'joshua', 'donna', 'kenneth', 'michelle',
    'kevin', 'carol', 'brian', 'amanda', 'george', 'melissa', 'edward',
    'deborah', 'ronald', 'stephanie', 'timothy', 'rebecca', 'jason', 'sharon',
    'jeffrey', 'laura', 'ryan', 'cynthia', 'jacob', 'kathleen', 'gary',
    'amy', 'nicholas', 'shirley', 'eric', 'angela', 'jonathan', 'anna'
  ];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(Math.random() * 9999);
  return { 
    email: `${randomName}${randomNumber}@compa-mate.com`,
    firstName: randomName.charAt(0).toUpperCase() + randomName.slice(1)
  };
}

function generateLastName() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return (letters[Math.floor(Math.random() * letters.length)] + 
          letters[Math.floor(Math.random() * letters.length)]).toUpperCase();
}

function generatePassword() {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  let password = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
  for (let i = 0; i < 8; i++) {
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
  }
  
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  return password;
}

// ==================== LUDZKIE PISANIE - ORYGINALNE ====================
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

// ==================== FUNKCJA DO KLIKANIA Z LOSOWYM OFFSETEM ====================
async function clickWithRandomOffset(cursor, box, waitBefore = [100, 300]) {
  const centerX = box.x + (box.width / 2);
  const centerY = box.y + (box.height / 2);
  
  // Losowy offset: ±20% szerokości/wysokości
  const offsetX = (Math.random() - 0.5) * box.width * 0.4;
  const offsetY = (Math.random() - 0.5) * box.height * 0.4;
  
  const clickX = centerX + offsetX;
  const clickY = centerY + offsetY;
  
  console.log(`  🔹 Klikam: (${Math.round(clickX)}, ${Math.round(clickY)}) [offset: ${Math.round(offsetX)}, ${Math.round(offsetY)}]`);
  
  await cursor.actions.click({ 
    target: { x: clickX, y: clickY },
    waitBeforeClick: waitBefore
  });
}

// ==================== GŁÓWNY SKRYPT ====================
async function runPhantombusterScript(webhookURL = null) {
  const startTime = Date.now();
  const { email, firstName } = generateEmail();
  const lastName = generateLastName();
  const password = generatePassword();
  
  console.log('🥷 GHOST-CURSOR ONLY - Automatyzacja Phantombuster (OPTIMIZED <60s)');
  console.log('📧 Email:', email);
  console.log('👤 Imię:', firstName);
  console.log('👤 Nazwisko:', lastName);
  console.log('🔑 Hasło:', password);
  
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
    console.log('🌐 Idę na PhantomBuster...');
    await page.goto('https://phantombuster.com/signup', { waitUntil: 'networkidle' });
    
    console.log('👀 Symulacja czytania strony...');
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, -50);
    
    // ⚡ ZOPTYMALIZOWANE ruchy myszy - TYLKO 1 ruch, max 400ms
    await cursor.actions.move({ x: 400 + Math.random() * 400, y: 300 + Math.random() * 300 });
    await page.waitForTimeout(200 + Math.random() * 200); // 200-400ms TOTAL
    
    // ========== EMAIL ==========
    console.log('✏️ Email (ghost-cursor ONLY)...');
    const emailInput = await page.waitForSelector('input[type="email"]', {
      state: 'visible',
      timeout: 10000
    });
    const emailBox = await emailInput.boundingBox();
    await clickWithRandomOffset(cursor, emailBox, [100, 250]); // SKRÓCONE z [200,600]
    await typeHumanLike(page, email);
    
    // ========== HASŁO ==========
    console.log('✏️ Hasło (ghost-cursor ONLY)...');
    const passwordInput = await page.waitForSelector('input[type="password"]', {
      state: 'visible',
      timeout: 10000
    });
    const passwordBox = await passwordInput.boundingBox();
    await clickWithRandomOffset(cursor, passwordBox, [100, 250]); // SKRÓCONE z [300,700]
    await typeHumanLike(page, password);
    
    // ⚡ SKRÓCONY ruch przed SUBMIT
    await cursor.actions.move({ x: 500 + Math.random() * 150, y: 350 + Math.random() * 100 });
    await page.waitForTimeout(150 + Math.random() * 150); // 150-300ms (było 500-1000ms)
    
    // ========== SUBMIT ==========
    console.log('🔵 SUBMIT (ghost-cursor z losowym offsetem)...');
    
    try {
      const submitBtn = await page.waitForSelector('button:has-text("Start your 14-day free trial")', {
        state: 'visible',
        timeout: 10000
      });
      const submitBox = await submitBtn.boundingBox();
      await clickWithRandomOffset(cursor, submitBox, [100, 300]); // SKRÓCONE z [300,800]
      console.log('  ✅ Kliknięto przycisk Submit!');
    } catch (e) {
      console.log('  ⚠️ Błąd 1, próbuję alternatywę...');
      
      try {
        const submitBtns = await page.$$('button[type="submit"]');
        if (submitBtns.length > 0) {
          const box = await submitBtns[0].boundingBox();
          await clickWithRandomOffset(cursor, box, [100, 300]);
          console.log('  ✅ Kliknięto (boundingBox)!');
        }
      } catch (e2) {
        console.log('  ❌ Nie udało się kliknąć Submit:', e2.message);
      }
    }
    
    console.log('⏳ Czekam na załadowanie...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // SKRÓCONE z 2000ms
    console.log('✅ Strona załadowana!');
    
    // ========== COOKIES ==========
    try {
      console.log('🍪 Cookies...');
      const cookieBtn = await page.waitForSelector('button:has-text("Allow all")', { 
        timeout: 2000, // SKRÓCONE z 3000ms
        state: 'visible'
      });
      
      if (cookieBtn) {
        console.log('🍪 Klikam Allow all (ghost-cursor z offsetem)...');
        const cookieBox = await cookieBtn.boundingBox();
        await clickWithRandomOffset(cursor, cookieBox, [50, 200]); // SKRÓCONE z [100,400]
        await page.waitForTimeout(500); // SKRÓCONE z 800ms
        console.log('  ✅ Cookies OK!');
      }
    } catch (e) {
      console.log('  ℹ️ Brak cookies');
    }
    
    console.log('⏳ Czekam 1 sekundę...');
    await page.waitForTimeout(1000); // SKRÓCONE z 2000ms
    
    // ⚡ SKRÓCONY ruch - tylko 1 ruch zamiast wielu
    await cursor.actions.move({ x: 450 + Math.random() * 200, y: 300 + Math.random() * 150 });
    await page.waitForTimeout(150 + Math.random() * 150); // 150-300ms (było 500-1000ms)
    
    // ========== POLA TEKSTOWE ==========
    console.log('✏️ Imię, Nazwisko, Company (ghost-cursor)...');
    
    const allInputs = await page.$$('input');
    const textInputs = [];
    
    for (const input of allInputs) {
      const type = await input.getAttribute('type');
      if (type === 'text') {
        textInputs.push(input);
      }
    }
    
    console.log(`📋 Pól TEXT: ${textInputs.length}`);
    
    if (textInputs.length >= 3) {
      console.log('✏️ Pole 1 (imię)...');
      const box1 = await textInputs[0].boundingBox();
      await clickWithRandomOffset(cursor, box1, [100, 250]); // SKRÓCONE z [300,700]
      await typeHumanLike(page, firstName);
      
      // ⚡ SKRÓCONY ruch między polami
      await cursor.actions.move({ x: 480 + Math.random() * 150, y: 320 + Math.random() * 120 });
      await page.waitForTimeout(150 + Math.random() * 150); // 150-300ms (było 400-800ms)
      
      console.log('✏️ Pole 2 (nazwisko)...');
      const box2 = await textInputs[1].boundingBox();
      await clickWithRandomOffset(cursor, box2, [100, 250]); // SKRÓCONE z [250,650]
      await typeHumanLike(page, lastName);
      
      // ⚡ SKRÓCONY ruch między polami
      await cursor.actions.move({ x: 520 + Math.random() * 120, y: 360 + Math.random() * 100 });
      await page.waitForTimeout(100 + Math.random() * 150); // 100-250ms (było 300-700ms)
      
      console.log('✏️ Pole 3 (company)...');
      const box3 = await textInputs[2].boundingBox();
      await clickWithRandomOffset(cursor, box3, [100, 250]); // SKRÓCONE z [250,650]
      await typeHumanLike(page, 'none');
      
      console.log('✅ Wszystkie pola OK!');
    } else {
      console.log('⚠️ Za mało pól!');
    }
    
    // ⚡ SKRÓCONY ruch przed SIGN UP
    await cursor.actions.move({ x: 560 + Math.random() * 150, y: 420 + Math.random() * 100 });
    await page.waitForTimeout(200 + Math.random() * 200); // 200-400ms (było 600-1200ms)
    
    // ========== SIGN UP ==========
    console.log('🔵 SIGN UP (ghost-cursor z losowym offsetem)...');
    try {
      const signupBtn = await page.waitForSelector('button:has-text("Sign up")', {
        state: 'visible',
        timeout: 10000
      });
      const signupBox = await signupBtn.boundingBox();
      await clickWithRandomOffset(cursor, signupBox, [100, 300]); // SKRÓCONE z [300,800]
      console.log('  ✅ Kliknięto Sign up!');
    } catch (e) {
      console.log('  ⚠️ Nie znaleziono Sign up:', e.message);
    }
    
    // ========== PYTANIA ==========
    console.log('📋 Pytania...');
    await page.waitForTimeout(1000); // SKRÓCONE z 1500ms
    
    const radioButtons = await page.$$('input[type="radio"]');
    
    if (radioButtons.length > 0) {
      console.log(`❓ ${radioButtons.length} opcji`);
      
      // ⚡ SKRÓCONY ruch
      await cursor.actions.move({ x: 480 + Math.random() * 200, y: 350 + Math.random() * 180 });
      await page.waitForTimeout(200 + Math.random() * 200); // 200-400ms (było 700-1200ms)
      
      for (const radio of radioButtons) {
        const parent = await radio.evaluateHandle(el => el.parentElement);
        const text = await parent.textContent();
        
        if (text && !text.toLowerCase().includes('other')) {
          console.log(`✅ Wybieram: ${text.trim()}`);
          const radioBox = await radio.boundingBox();
          await clickWithRandomOffset(cursor, radioBox, [100, 250]); // SKRÓCONE z [200,600]
          break;
        }
      }
      
      await page.waitForTimeout(300 + Math.random() * 200); // 300-500ms (było 800-1200ms)
      
      const nextBtn = await page.$('button:has-text("Continue"), button:has-text("Next"), button:has-text("Submit")');
      if (nextBtn) {
        const nextBox = await nextBtn.boundingBox();
        await clickWithRandomOffset(cursor, nextBox, [100, 250]); // SKRÓCONE z [200,600]
        console.log('  ✅ Pytania OK!');
      }
    }
    
    console.log('⏳ Czekam 1 sekundę na załadowanie dashboardu...');
    await page.waitForTimeout(1000); // SKRÓCONE z 2000ms
    
    // ========== BROWSE ==========
    console.log('🔍 Browse Phantoms...');
    const browseBtn = await page.$('a:has-text("Browse"), button:has-text("Browse")');
    
    if (browseBtn) {
      const box = await browseBtn.boundingBox();
      if (box) {
        await clickWithRandomOffset(cursor, box, [100, 250]); // SKRÓCONE z [200,600]
        console.log('  ✅ Kliknięto Browse!');
      }
    } else {
      console.log('  ⚠️ Nie znaleziono, idę do URL...');
      await page.goto('https://phantombuster.com/phantombuster');
    }
    
    console.log('⏳ Czekam 1 sekundę...');
    await page.waitForTimeout(1000); // SKRÓCONE z 2000ms
    
    const finalUrl = page.url();
    console.log('🌐 Aktualny URL:', finalUrl);
    
    // Pobierz cookies
    const cookies = await context.cookies();
    
    // Konwertuj cookies do formatu string (jak w przeglądarce)
    const cookieString = cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    await browser.close();
    
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ ========================================');
    console.log('✅ KONTO UTWORZONE POMYŚLNIE!');
    console.log(`✅ Czas wykonania: ${executionTime}s`);
    console.log('✅ ========================================');
    console.log('🍪 Cookies string:', cookieString);
    
    return {
      email,
      password,
      firstName,
      lastName,
      finalUrl,
      cookies: cookies,           // Pełny array cookies
      cookieString: cookieString, // String gotowy do użycia
      cookiesCount: cookies.length,
      executionTime: `${executionTime}s`,
      message: 'Konto PhantomBuster utworzone pomyślnie'
    };
    
  } catch (error) {
    console.error('❌ BŁĄD:', error.message);
    console.log('🔍 Stack:', error.stack);
    
    await browser.close();
    
    throw new Error(`Błąd podczas tworzenia konta: ${error.message}`);
  }
}

module.exports = { runPhantombusterScript };

// Test lokalny (opcjonalnie)
if (require.main === module) {
  console.log('🚀 Uruchamiam test...');
  runPhantombusterScript()
    .then(result => {
      console.log('✅ GOTOWE!', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ BŁĄD:', error);
      process.exit(1);
    });
}