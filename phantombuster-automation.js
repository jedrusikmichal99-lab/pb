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
async function runPhantombusterScript(webhookURL = null) {
  const { email, firstName } = generateEmail();
  const lastName = generateLastName();
  const password = generatePassword();
  
  console.log('🥷 GHOST-CURSOR ONLY - Automatyzacja Phantombuster');
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
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -50);
    
    // Losowe ruchy myszy (ghost-cursor)
    await cursor.actions.move({ x: 300 + Math.random() * 600, y: 200 + Math.random() * 400 });
    await page.waitForTimeout(3000 + Math.random() * 5000);
    
    await cursor.actions.move({ x: 400 + Math.random() * 500, y: 300 + Math.random() * 300 });
    await page.waitForTimeout(800 + Math.random() * 2000);
    
    await cursor.actions.move({ x: 500 + Math.random() * 400, y: 250 + Math.random() * 350 });
    await page.waitForTimeout(500 + Math.random() * 1500);
    
    // ========== EMAIL ==========
    console.log('✏️ Email (ghost-cursor ONLY)...');
    await page.waitForSelector('input[type="email"]');
    
    await cursor.actions.click({ 
      target: 'input[type="email"]',
      waitBeforeClick: [200, 600]
    });
    
    await typeHumanLike(page, email);
    
    // ========== HASŁO ==========
    console.log('✏️ Hasło (ghost-cursor ONLY)...');
    
    await cursor.actions.click({ 
      target: 'input[type="password"]',
      waitBeforeClick: [300, 700]
    });
    
    await typeHumanLike(page, password);
    
    await cursor.actions.move({ x: 600 + Math.random() * 300, y: 400 + Math.random() * 200 });
    await page.waitForTimeout(1000 + Math.random() * 3000);
    
    // ========== SUBMIT ==========
    console.log('🔵 SUBMIT (ghost-cursor ONLY)...');
    
    try {
      await cursor.actions.click({ 
        target: 'button:has-text("Start your 14-day free trial")',
        waitBeforeClick: [300, 800]
      });
      console.log('  ✅ Kliknięto przycisk Submit!');
    } catch (e) {
      console.log('  ⚠️ Błąd 1, próbuję alternatywę...');
      
      try {
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
        console.log('  ❌ Nie udało się kliknąć Submit:', e2.message);
      }
    }
    
    console.log('⏳ Czekam na załadowanie...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('✅ Strona załadowana!');
    
    // ========== COOKIES ==========
    try {
      console.log('🍪 Cookies...');
      const cookieBtn = await page.waitForSelector('button:has-text("Allow all")', { 
        timeout: 3000,
        state: 'visible'
      });
      
      if (cookieBtn) {
        console.log('🍪 Klikam Allow all (ghost-cursor)...');
        await cursor.actions.click({ 
          target: 'button:has-text("Allow all")',
          waitBeforeClick: [100, 400]
        });
        await page.waitForTimeout(1000);
        console.log('  ✅ Cookies OK!');
      }
    } catch (e) {
      console.log('  ℹ️ Brak cookies');
    }
    
    console.log('⏳ Czekam 3 sekundy...');
    await page.waitForTimeout(3000);
    
    await cursor.actions.move({ x: 300 + Math.random() * 700, y: 200 + Math.random() * 500 });
    await page.waitForTimeout(1000 + Math.random() * 2000);
    
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
      await cursor.actions.click({ 
        target: box1,
        waitBeforeClick: [300, 700]
      });
      await typeHumanLike(page, firstName);
      
      await cursor.actions.move({ x: 400 + Math.random() * 600, y: 300 + Math.random() * 400 });
      await page.waitForTimeout(700 + Math.random() * 1300);
      
      console.log('✏️ Pole 2 (nazwisko)...');
      const box2 = await textInputs[1].boundingBox();
      await cursor.actions.click({ 
        target: box2,
        waitBeforeClick: [250, 650]
      });
      await typeHumanLike(page, lastName);
      
      await cursor.actions.move({ x: 500 + Math.random() * 500, y: 350 + Math.random() * 350 });
      await page.waitForTimeout(600 + Math.random() * 1400);
      
      console.log('✏️ Pole 3 (company)...');
      const box3 = await textInputs[2].boundingBox();
      await cursor.actions.click({ 
        target: box3,
        waitBeforeClick: [250, 650]
      });
      await typeHumanLike(page, 'none');
      
      console.log('✅ Wszystkie pola OK!');
    } else {
      console.log('⚠️ Za mało pól!');
    }
    
    await cursor.actions.move({ x: 600 + Math.random() * 400, y: 400 + Math.random() * 300 });
    await page.waitForTimeout(1500 + Math.random() * 2500);
    
    // ========== SIGN UP ==========
    console.log('🔵 SIGN UP (ghost-cursor)...');
    try {
      const signupBtn = await page.$('button:has-text("Sign up")');
      if (signupBtn) {
        const box = await signupBtn.boundingBox();
        await cursor.actions.click({ 
          target: box,
          waitBeforeClick: [300, 800]
        });
        console.log('  ✅ Kliknięto Sign up!');
      }
    } catch (e) {
      console.log('  ⚠️ Nie znaleziono Sign up');
    }
    
    // ========== PYTANIA ==========
    console.log('📋 Pytania...');
    await page.waitForTimeout(2000);
    
    const radioButtons = await page.$$('input[type="radio"]');
    
    if (radioButtons.length > 0) {
      console.log(`❓ ${radioButtons.length} opcji`);
      
      await cursor.actions.move({ x: 400 + Math.random() * 600, y: 300 + Math.random() * 400 });
      await page.waitForTimeout(1500 + Math.random() * 1500);
      
      for (const radio of radioButtons) {
        const parent = await radio.evaluateHandle(el => el.parentElement);
        const text = await parent.textContent();
        
        if (text && !text.toLowerCase().includes('other')) {
          console.log(`✅ Wybieram: ${text.trim()}`);
          const radioBox = await radio.boundingBox();
          await cursor.actions.click({ 
            target: radioBox,
            waitBeforeClick: [200, 600]
          });
          break;
        }
      }
      
      await page.waitForTimeout(1500 + Math.random() * 1000);
      
      const nextBtn = await page.$('button:has-text("Continue"), button:has-text("Next"), button:has-text("Submit")');
      if (nextBtn) {
        const nextBox = await nextBtn.boundingBox();
        await cursor.actions.click({ 
          target: nextBox,
          waitBeforeClick: [200, 600]
        });
        console.log('  ✅ Pytania OK!');
      }
    }
    
    console.log('⏳ Czekam 3 sekundy na załadowanie dashboardu...');
    await page.waitForTimeout(3000);
    
    // ========== BROWSE ==========
    console.log('🔍 Browse Phantoms...');
    const browseBtn = await page.$('a:has-text("Browse"), button:has-text("Browse")');
    
    if (browseBtn) {
      const box = await browseBtn.boundingBox();
      if (box) {
        await cursor.actions.click({ 
          target: box,
          waitBeforeClick: [200, 600]
        });
        console.log('  ✅ Kliknięto Browse!');
      }
    } else {
      console.log('  ⚠️ Nie znaleziono, idę do URL...');
      await page.goto('https://phantombuster.com/phantombuster');
    }
    
    console.log('⏳ Czekam 3 sekundy...');
    await page.waitForTimeout(3000);
    
    const finalUrl = page.url();
    console.log('🌐 Aktualny URL:', finalUrl);
    
    // Pobierz cookies
    const cookies = await context.cookies();
    
    // Konwertuj cookies do formatu string (jak w przeglądarce)
    const cookieString = cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    
    await browser.close();
    
    console.log('✅ ========================================');
    console.log('✅ KONTO UTWORZONE POMYŚLNIE!');
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