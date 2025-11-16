const { chromium } = require('playwright');
const { createCursor } = require('ghost-cursor-playwright');

// ==================== GENERATORY ====================
function generateEmail() {
  const useGmailForTest = false; // ← ZMIEŃ NA true ŻEBY PRZETESTOWAĆ
  
  if (useGmailForTest) {
    const randomNumber = Math.floor(Math.random() * 9999);
    return { 
      email: `twoj-gmail+test${randomNumber}@gmail.com`,
      firstName: 'Test'
    };
  }
  
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
      console.log('  💤 Długa pauza...');
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
(async () => {
  const { email, firstName } = generateEmail();
  const lastName = generateLastName();
  const password = generatePassword();
  
  console.log('🥷 GHOST-CURSOR ONLY - Totalna Przebudowa');
  console.log('📧 Email:', email);
  console.log('👤 Imię:', firstName);
  console.log('👤 Nazwisko:', lastName);
  console.log('🔑 Hasło:', password);
  
  const pathToExtension = 'C:\\Users\\User\\Desktop\\cookie-sender-extension';
  
  const browser = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled'
    ],
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'Europe/Warsaw'
  });
  
  const page = await browser.newPage();
  
  // 🚀 GHOST-CURSOR
  const cursor = await createCursor(page);
  console.log('✅ Ghost-cursor aktywny!');
  
  // WIZUALNY KURSOR
  await page.addInitScript(() => {
    const cursor = document.createElement('div');
    cursor.id = 'fake-cursor';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'red';
    cursor.style.border = '2px solid white';
    cursor.style.position = 'fixed';
    cursor.style.zIndex = '999999';
    cursor.style.pointerEvents = 'none';
    cursor.style.transition = 'none';
    cursor.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';
    
    if (document.body) {
      document.body.appendChild(cursor);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(cursor);
      });
    }
    
    document.addEventListener('mousemove', (e) => {
      const cursor = document.getElementById('fake-cursor');
      if (cursor) {
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
      }
    });
  });
  
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
    console.log('📝 Idę na PhantomBuster...');
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
    console.log('✍️ Email (ghost-cursor ONLY)...');
    await page.waitForSelector('input[type="email"]');
    
    await cursor.actions.click({ 
      target: 'input[type="email"]',
      waitBeforeClick: [200, 600]
    });
    
    await typeHumanLike(page, email);
    
    // ========== HASŁO ==========
    console.log('✍️ Hasło (ghost-cursor ONLY)...');
    
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
      console.log('🔍 Cookies...');
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
    console.log('✍️ Imię, Nazwisko, Company (ghost-cursor)...');
    
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
      console.log('✍️ Pole 1 (imię)...');
      const box1 = await textInputs[0].boundingBox();
      await cursor.actions.click({ 
        target: box1,
        waitBeforeClick: [300, 700]
      });
      await typeHumanLike(page, firstName);
      
      await cursor.actions.move({ x: 400 + Math.random() * 600, y: 300 + Math.random() * 400 });
      await page.waitForTimeout(700 + Math.random() * 1300);
      
      console.log('✍️ Pole 2 (nazwisko)...');
      const box2 = await textInputs[1].boundingBox();
      await cursor.actions.click({ 
        target: box2,
        waitBeforeClick: [250, 650]
      });
      await typeHumanLike(page, lastName);
      
      await cursor.actions.move({ x: 500 + Math.random() * 500, y: 350 + Math.random() * 350 });
      await page.waitForTimeout(600 + Math.random() * 1400);
      
      console.log('✍️ Pole 3 (company)...');
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
    console.log('🔍 Pytania...');
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
    
    console.log('📧 Aktualny URL:', page.url());
    
    // ========== UŻYCIE ROZSZERZENIA ==========
    console.log('');
    console.log('🔌 ========================================');
    console.log('🔌 OTWIERANIE ROZSZERZENIA...');
    console.log('🔌 ========================================');
    
    const webhookURL = 'https://server.compa-mate.com/webhook-test/c07ec221-2026-4a69-951a-b382fd46acbc';
    const domain = 'phantombuster.com';
    
    try {
      // Znajdź ID rozszerzenia
      console.log('🔍 Szukam ID rozszerzenia...');
      await page.goto('chrome://extensions/');
      await page.waitForTimeout(2000);
      
      // Pobierz ID rozszerzenia z pliku manifestu lub z chrome://extensions
      // Dla uproszczenia, spróbuj otworzyć popup.html bezpośrednio
      console.log('🔓 Otwieram popup rozszerzenia...');
      
      // Znajdź wszystkie strony rozszerzeń
      const allPages = browser.contexts()[0].pages();
      let extensionId = null;
      
      for (const p of allPages) {
        const url = p.url();
        if (url.includes('chrome-extension://')) {
          const match = url.match(/chrome-extension:\/\/([a-z]+)\//);
          if (match) {
            extensionId = match[1];
            console.log('✅ Znaleziono ID rozszerzenia:', extensionId);
            break;
          }
        }
      }
      
      // Jeśli nie znaleziono, spróbuj alternatywnej metody
      if (!extensionId) {
        console.log('🔍 Próba alternatywna - szukam w background scripts...');
        // Otwórz nową kartę z popup
        const extensionPage = await browser.newPage();
        
        // Spróbuj różne ścieżki popup
        const possiblePaths = [
          'popup.html',
          'popup/popup.html',
          'src/popup.html',
          'extension/popup.html'
        ];
        
        let popupOpened = false;
        
        // Najpierw spróbuj znaleźć extension ID czytając wszystkie extension pages
        const extPages = await browser.contexts()[0].pages();
        for (const p of extPages) {
          if (p.url().startsWith('chrome-extension://')) {
            extensionId = p.url().split('/')[2];
            break;
          }
        }
        
        if (extensionId) {
          for (const path of possiblePaths) {
            try {
              await extensionPage.goto(`chrome-extension://${extensionId}/${path}`, { 
                waitUntil: 'networkidle',
                timeout: 5000 
              });
              console.log(`✅ Otwarto popup: ${path}`);
              popupOpened = true;
              break;
            } catch (e) {
              console.log(`  ⚠️ Nie znaleziono: ${path}`);
            }
          }
        }
        
        if (popupOpened) {
          console.log('✅ Popup rozszerzenia otwarty!');
          await extensionPage.waitForTimeout(2000);
          
          // Ghost-cursor dla extension page
          const extCursor = await createCursor(extensionPage);
          
          // Wypełnij pole Webhook URL
          console.log('✍️ Wpisuję Webhook URL...');
          const webhookInput = await extensionPage.$('input[type="text"]');
          if (webhookInput) {
            const webhookBox = await webhookInput.boundingBox();
            await extCursor.actions.click({ 
              target: webhookBox,
              waitBeforeClick: [300, 700]
            });
            await extensionPage.fill('input[type="text"]', webhookURL);
            console.log('  ✅ Webhook URL wpisany!');
          }
          
          await extensionPage.waitForTimeout(1000 + Math.random() * 1000);
          
          // Wypełnij pole Domain
          console.log('✍️ Wpisuję domenę...');
          const allInputs = await extensionPage.$('input[type="text"]');
          if (allInputs.length >= 2) {
            const domainBox = await allInputs[1].boundingBox();
            await extCursor.actions.click({ 
              target: domainBox,
              waitBeforeClick: [300, 700]
            });
            await extensionPage.fill('input[type="text"]', domain);
            console.log('  ✅ Domena wpisana!');
          }
          
          await extensionPage.waitForTimeout(1500 + Math.random() * 1500);
          
          // Kliknij przycisk "Wyślij do n8n"
          console.log('🚀 Klikam "Wyślij do n8n"...');
          const sendButton = await extensionPage.$('button:has-text("Wyślij do n8n")');
          if (sendButton) {
            const btnBox = await sendButton.boundingBox();
            await extCursor.actions.click({ 
              target: btnBox,
              waitBeforeClick: [400, 900]
            });
            console.log('  ✅ Wysłano cookies do n8n!');
          }
          
          await extensionPage.waitForTimeout(3000);
          
          console.log('');
          console.log('✅ ========================================');
          console.log('✅ ROZSZERZENIE UŻYTE POMYŚLNIE!');
          console.log('✅ Cookies wysłane do n8n!');
          console.log('✅ ========================================');
          
        } else {
          console.log('⚠️ Nie udało się otworzyć popup rozszerzenia');
          console.log('ℹ️ Możliwe, że rozszerzenie nie ma popup.html');
        }
      }
      
    } catch (e) {
      console.log('⚠️ Błąd podczas użycia rozszerzenia:', e.message);
      console.log('ℹ️ Możesz użyć rozszerzenia ręcznie');
    }
    
    console.log('');
    console.log('✅ ========================================');
    console.log('✅ PROCES ZAKOŃCZONY POMYŚLNIE!');
    console.log('✅ ========================================');
    console.log('📧 Email:', email);
    console.log('🔑 Hasło:', password);
    console.log('🌐 URL:', page.url());
    console.log('');
    console.log('🔄 Skrypt będzie działał przez 5 minut...');
    console.log('⏸️ Ctrl+C aby zakończyć wcześniej');
    console.log('');
    
    // Czekaj 5 minut, aby rozszerzenie mogło pracować
    await page.waitForTimeout(300000); // 5 minut
    
  } catch (error) {
    console.error('❌ BŁĄD:', error.message);
    console.log('📍 Stack:', error.stack);
    await page.screenshot({ path: 'error.png', fullPage: true });
    console.log('📸 Screenshot: error.png');
    
    console.log('');
    console.log('⏸️ PAUZA - Ctrl+C aby zakończyć');
    await page.waitForTimeout(999999999);
  } finally {
    console.log('👋 Zamykam przeglądarkę...');
    await browser.close();
    console.log('✅ Koniec');
  }
})();