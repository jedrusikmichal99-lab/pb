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

// ==================== LUDZKIE PISANIE (ORYGINALNE) ====================
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

// ==================== KLIKANIE ====================
async function clickWithRandomOffset(cursor, box, waitBefore = [100, 300]) {
  const centerX = box.x + (box.width / 2);
  const centerY = box.y + (box.height / 2);
  const offsetX = (Math.random() - 0.5) * box.width * 0.4;
  const offsetY = (Math.random() - 0.5) * box.height * 0.4;
  const clickX = centerX + offsetX;
  const clickY = centerY + offsetY;
  
  await cursor.actions.click({ 
    target: { x: clickX, y: clickY },
    waitBeforeClick: waitBefore
  });
}

async function waitAndClick(page, cursor, selector, stepName, timeout = 10000) {
  const element = await page.waitForSelector(selector, { state: 'visible', timeout });
  const box = await element.boundingBox();
  if (box) {
    await clickWithRandomOffset(cursor, box, [100, 300]);
    console.log(`✅ [${stepName}] OK`);
  }
}

// ==================== GŁÓWNY SKRYPT ====================
async function runPhantombusterScript() {
  const startTime = Date.now();
  const { email, firstName } = generateEmail();
  const lastName = generateLastName();
  const password = generatePassword();
  const isHeadless = process.env.HEADLESS !== 'false';
  
  console.log('🥷 PhantomBuster Automation v3.0 (FAST)');
  console.log(`🖥️ Mode: ${isHeadless ? 'HEADLESS' : 'VISIBLE'}`);
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
  
  const browser = await chromium.launch({
    headless: isHeadless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'Europe/Warsaw'
  });
  
  const page = await context.newPage();
  const cursor = await createCursor(page);
  console.log('✅ Ghost-cursor aktywny!');
  
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    delete navigator.__proto__.webdriver;
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });
  
  try {
    // KROK 1: NAWIGACJA
    console.log('🌐 Idę na PhantomBuster...');
    await page.goto('https://phantombuster.com/signup', { waitUntil: 'networkidle', timeout: 20000 });
    
    console.log('👀 Symulacja czytania strony...');
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(150);
    await page.mouse.wheel(0, -50);
    
    await cursor.actions.move({ x: 400 + Math.random() * 400, y: 300 + Math.random() * 300 });
    await page.waitForTimeout(100 + Math.random() * 150);
    
    // KROK 2: EMAIL
    console.log('✏️ Email...');
    await waitAndClick(page, cursor, 'input[type="email"]', 'EMAIL');
    await page.waitForTimeout(150);
    await typeHumanLike(page, email);
    
    await cursor.actions.move({ x: 500 + Math.random() * 150, y: 350 + Math.random() * 100 });
    await page.waitForTimeout(80 + Math.random() * 120);
    
    // KROK 3: HASŁO
    console.log('✏️ Hasło...');
    await waitAndClick(page, cursor, 'input[type="password"]', 'PASSWORD');
    await page.waitForTimeout(150);
    await typeHumanLike(page, password);
    
    await cursor.actions.move({ x: 520 + Math.random() * 120, y: 380 + Math.random() * 80 });
    await page.waitForTimeout(80 + Math.random() * 120);
    
    // KROK 4: SUBMIT (Start trial)
    console.log('🔵 SUBMIT...');
    try {
      await waitAndClick(page, cursor, 'button:has-text("Start your 14-day free trial")', 'SUBMIT', 5000);
    } catch (e) {
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        const box = await submitBtn.boundingBox();
        if (box) await clickWithRandomOffset(cursor, box, [100, 300]);
      }
    }
    
    console.log('⏳ Czekam na załadowanie...');
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await page.waitForTimeout(1500);
    
    // KROK 5: COOKIES (opcjonalnie)
    try {
      const cookieBtn = await page.waitForSelector('button:has-text("Allow all")', { timeout: 3000 });
      if (cookieBtn) {
        const box = await cookieBtn.boundingBox();
        if (box) {
          await clickWithRandomOffset(cursor, box, [50, 200]);
          console.log('🍪 Cookies OK');
        }
      }
    } catch (e) { }
    
    await cursor.actions.move({ x: 450 + Math.random() * 200, y: 300 + Math.random() * 150 });
    await page.waitForTimeout(80 + Math.random() * 120);
    
    // KROK 6: POLA TEKSTOWE (imię, nazwisko, company)
    console.log('✏️ Imię, Nazwisko, Company...');
    await page.waitForTimeout(1000);
    
    const textInputs = await page.$$('input[type="text"]');
    console.log(`📋 Pól TEXT: ${textInputs.length}`);
    
    if (textInputs.length >= 3) {
      // Pole 1 - Imię
      console.log('✏️ Pole 1 (imię)...');
      const box1 = await textInputs[0].boundingBox();
      if (box1) {
        await clickWithRandomOffset(cursor, box1, [100, 250]);
        await page.waitForTimeout(150);
        await typeHumanLike(page, firstName);
      }
      
      await cursor.actions.move({ x: 480 + Math.random() * 150, y: 320 + Math.random() * 120 });
      await page.waitForTimeout(80 + Math.random() * 120);
      
      // Pole 2 - Nazwisko
      console.log('✏️ Pole 2 (nazwisko)...');
      const box2 = await textInputs[1].boundingBox();
      if (box2) {
        await clickWithRandomOffset(cursor, box2, [100, 250]);
        await page.waitForTimeout(150);
        await typeHumanLike(page, lastName);
      }
      
      await cursor.actions.move({ x: 520 + Math.random() * 120, y: 360 + Math.random() * 100 });
      await page.waitForTimeout(80 + Math.random() * 120);
      
      // Pole 3 - Company
      console.log('✏️ Pole 3 (company)...');
      const box3 = await textInputs[2].boundingBox();
      if (box3) {
        await clickWithRandomOffset(cursor, box3, [100, 250]);
        await page.waitForTimeout(150);
        await typeHumanLike(page, 'none');
      }
      
      console.log('✅ Wszystkie pola OK!');
    }
    
    await cursor.actions.move({ x: 560 + Math.random() * 150, y: 420 + Math.random() * 100 });
    await page.waitForTimeout(80 + Math.random() * 120);
    
    // KROK 7: SIGN UP - OSTATNI KROK!
    console.log('🔵 SIGN UP...');
    await waitAndClick(page, cursor, 'button:has-text("Sign up")', 'SIGNUP');
    
    // KONIEC - czekaj 5 sek i zamknij
    console.log('⏳ Czekam 5 sekund...');
    await page.waitForTimeout(5000);
    
    // Pobierz cookies przed zamknięciem
    const cookies = await context.cookies();
    const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    
    await browser.close();
    
    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('✅ ========================================');
    console.log('✅ KONTO UTWORZONE POMYŚLNIE!');
    console.log(`✅ Czas wykonania: ${executionTime}s`);
    console.log('✅ ========================================');
    
    return {
      email,
      password,
      firstName,
      lastName,
      cookies,
      cookieString,
      cookiesCount: cookies.length,
      executionTime: `${executionTime}s`,
      message: 'Konto PhantomBuster utworzone pomyślnie'
    };
    
  } catch (error) {
    console.error('❌ BŁĄD:', error.message);
    await browser.close();
    throw new Error(`Błąd podczas tworzenia konta: ${error.message}`);
  }
}

module.exports = { runPhantombusterScript };

if (require.main === module) {
  runPhantombusterScript()
    .then(result => { console.log('✅ GOTOWE!', result); process.exit(0); })
    .catch(error => { console.error('❌ BŁĄD:', error); process.exit(1); });
}