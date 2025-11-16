const { chromium } = require('playwright');

// Funkcja generująca losowy email
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

// Funkcja generująca losowe nazwisko (2 litery)
function generateLastName() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return (letters[Math.floor(Math.random() * letters.length)] + 
          letters[Math.floor(Math.random() * letters.length)]).toUpperCase();
}

// Funkcja generująca hasło (1 duża, reszta małe + cyfry, 10 znaków)
function generatePassword() {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  // 1 duża litera na początku
  let password = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
  // 8 małych liter
  for (let i = 0; i < 8; i++) {
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
  }
  
  // 1 cyfra na końcu
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  return password;
}

// Funkcja symulująca ludzkie wpisywanie (litera po literze z opóźnieniem)
async function typeHumanLike(page, selector, text) {
  await page.click(selector); // Kliknij w pole
  await page.waitForTimeout(200 + Math.random() * 300); // Losowe opóźnienie 200-500ms
  
  for (const char of text) {
    await page.keyboard.type(char);
    await page.waitForTimeout(50 + Math.random() * 150); // Losowe opóźnienie między literami 50-200ms
  }
  
  await page.waitForTimeout(300 + Math.random() * 500); // Pauza po wpisaniu 300-800ms
}

// Funkcja symulująca losowy ruch myszy
async function moveMouseRandomly(page) {
  const x = 100 + Math.random() * 800;
  const y = 100 + Math.random() * 600;
  await page.mouse.move(x, y);
}

(async () => {
  const { email, firstName } = generateEmail();
  const lastName = generateLastName();
  const password = generatePassword();
  
  console.log('🚀 Rozpoczynam automatyzację...');
  console.log('📧 Email:', email);
  console.log('👤 Imię:', firstName);
  console.log('👤 Nazwisko:', lastName);
  console.log('🔑 Hasło:', password);
  
  // WAŻNE: Zamień na swoją ścieżkę do rozpakowanego rozszerzenia
  const pathToExtension = 'C:\\Users\\User\\Desktop\\cookie-sender-extension';
  
  const browser = await chromium.launchPersistentContext('', {
    headless: false,
    slowMo: 50,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-sandbox'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // ============ KROK 1: EMAIL I HASŁO ============
    console.log('📝 Idę na stronę rejestracji PhantomBuster...');
    await page.goto('https://phantombuster.com/signup', { waitUntil: 'networkidle' });
    
    // Symuluj przeglądanie strony przed wypełnieniem
    console.log('👀 Symuluj patrzenie na stronę...');
    await moveMouseRandomly(page);
    await page.waitForTimeout(2000 + Math.random() * 2000); // 2-4 sekundy
    
    console.log('✍️ Wypełniam email (jak człowiek)...');
    await page.waitForSelector('input[type="email"]');
    await typeHumanLike(page, 'input[type="email"]', email);
    
    console.log('✍️ Wypełniam hasło (jak człowiek)...');
    await typeHumanLike(page, 'input[type="password"]', password);
    
    // Losowa pauza przed kliknięciem Submit
    await moveMouseRandomly(page);
    await page.waitForTimeout(1000 + Math.random() * 2000); // 1-3 sekundy
    
    console.log('🔵 Klikam przycisk Submit...');
    await page.click('button[type="submit"]');
    
    console.log('⏳ Czekam na załadowanie następnej strony...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('✅ Strona załadowana!');
    
    // ============ KROK 2: COOKIES ============
    try {
      console.log('🔍 Sprawdzam czy jest przycisk cookies...');
      const cookieBtn = await page.waitForSelector('button:has-text("Allow all")', { 
        timeout: 3000,
        state: 'visible'
      });
      
      if (cookieBtn) {
        console.log('🍪 Klikam Allow all...');
        await cookieBtn.click();
        await page.waitForTimeout(1000);
        console.log('✅ Cookies zaakceptowane!');
      }
    } catch (e) {
      console.log('ℹ️ Brak przycisku cookies lub już zaakceptowane');
    }
    
    // ============ KROK 3: IMIĘ, NAZWISKO, COMPANY ============
    console.log('⏳ Czekam 3 sekundy na załadowanie pól...');
    await page.waitForTimeout(3000);
    
    // Symuluj patrzenie na formularz
    await moveMouseRandomly(page);
    await page.waitForTimeout(1500 + Math.random() * 1500); // 1.5-3 sekundy
    
    console.log('✍️ Wypełniam imię, nazwisko i company (jak człowiek)...');
    
    // Znajdź wszystkie pola tekstowe
    console.log('🔍 Szukam pól input type=text...');
    const allInputs = await page.$$('input[type="text"]');
    console.log(`📋 Znaleziono ${allInputs.length} pól`);
    
    if (allInputs.length >= 3) {
      // Wypełnij pierwsze 3 pola POWOLI jak człowiek
      console.log('✍️ Pole 1 (imię)...');
      await allInputs[0].click();
      await page.waitForTimeout(300);
      for (const char of firstName) {
        await page.keyboard.type(char);
        await page.waitForTimeout(50 + Math.random() * 150);
      }
      await page.waitForTimeout(500);
      
      await moveMouseRandomly(page);
      
      console.log('✍️ Pole 2 (nazwisko)...');
      await allInputs[1].click();
      await page.waitForTimeout(300);
      for (const char of lastName) {
        await page.keyboard.type(char);
        await page.waitForTimeout(50 + Math.random() * 150);
      }
      await page.waitForTimeout(500);
      
      await moveMouseRandomly(page);
      
      console.log('✍️ Pole 3 (company)...');
      await allInputs[2].click();
      await page.waitForTimeout(300);
      for (const char of 'none') {
        await page.keyboard.type(char);
        await page.waitForTimeout(50 + Math.random() * 150);
      }
      await page.waitForTimeout(500);
      
      console.log('✅ Wszystkie pola wypełnione!');
    } else {
      console.log('⚠️ Za mało pól! Znaleziono:', allInputs.length);
      throw new Error('Nie znaleziono wystarczającej liczby pól');
    }
    
    // Pauza przed kliknięciem Sign up
    await moveMouseRandomly(page);
    await page.waitForTimeout(1500 + Math.random() * 1500); // 1.5-3 sekundy
    
    // ============ KROK 4: KLIKNIJ SIGN UP ============
    console.log('🔵 Klikam Sign up...');
    await page.click('button:has-text("Sign up")');
    await page.waitForTimeout(3000);
    console.log('✅ Kliknięto Sign up!');
    
    // ============ KROK 5: PYTANIA ============
    console.log('🔍 Sprawdzam czy są pytania...');
    await page.waitForTimeout(2000);
    
    const radioButtons = await page.$$('input[type="radio"]');
    
    if (radioButtons.length > 0) {
      console.log(`❓ Znaleziono ${radioButtons.length} opcji do wyboru`);
      
      // Pauza przed wyborem (jak człowiek czyta pytanie)
      await moveMouseRandomly(page);
      await page.waitForTimeout(1000 + Math.random() * 1500);
      
      // Kliknij pierwszą opcję która nie jest "Other"
      for (const radio of radioButtons) {
        const parent = await radio.evaluateHandle(el => el.parentElement);
        const text = await parent.textContent();
        
        if (text && !text.toLowerCase().includes('other')) {
          console.log(`✅ Wybieram opcję: ${text.trim()}`);
          await radio.click();
          break;
        }
      }
      
      await page.waitForTimeout(1000 + Math.random() * 1000);
      
      // Kliknij Continue/Next
      const nextBtn = await page.$('button:has-text("Continue"), button:has-text("Next"), button:has-text("Submit")');
      if (nextBtn) {
        await nextBtn.click();
        console.log('✅ Pytania wypełnione!');
      }
    } else {
      console.log('ℹ️ Brak pytań do wypełnienia');
    }
    
    // ============ KROK 6: BROWSE PHANTOMS ============
    console.log('⏳ Czekam 10 sekund...');
    await page.waitForTimeout(10000);
    
    console.log('🔍 Szukam Browse Phantoms...');
    const browseBtn = await page.$('a:has-text("Browse"), button:has-text("Browse")');
    
    if (browseBtn) {
      await browseBtn.click();
      console.log('✅ Kliknięto Browse Phantoms!');
    } else {
      console.log('ℹ️ Przechodzę bezpośrednio do Browse Phantoms...');
      await page.goto('https://phantombuster.com/phantombuster');
    }
    
    console.log('⏳ Czekam 10 sekund w Browse Phantoms...');
    await page.waitForTimeout(10000);
    
    // ============ SPRAWDŹ EMAIL ============
    console.log('📧 Sprawdzam czy wysłano email weryfikacyjny...');
    const currentUrl = page.url();
    console.log('📍 Obecny URL:', currentUrl);
    
    // ============ PAUZA - SPRAWDŹ KONTO ============
    console.log('');
    console.log('⏸️  ========================================');
    console.log('⏸️  PAUZA! Teraz możesz:');
    console.log('⏸️  - Sprawdzić Cloudflare Email Routing Activity');
    console.log('⏸️  - Sprawdzić Gmaila czy przyszedł email');
    console.log('⏸️  - Email:', email);
    console.log('⏸️  - Hasło:', password);
    console.log('⏸️  ========================================');
    console.log('⏸️  Wciśnij Ctrl+C aby zakończyć');
    console.log('');
    
    await page.waitForTimeout(999999999); // Czeka w nieskończoność
    
    // Poniższy kod się NIE wykona (chyba że zmienisz timeout powyżej)
    
    // ============ KROK 7: ROZSZERZENIE ============
    console.log('🍪 Otwieram rozszerzenie Cookie Sender...');
    const extensionUrl = 'chrome-extension://fefipelmikjgobbmfgleneoefanmkndd/popup.html';
    await page.goto(extensionUrl);
    await page.waitForTimeout(2000);
    
    console.log('✍️ Wypełniam pola w rozszerzeniu...');
    
    // Wypełnij webhook URL (pierwsze pole)
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].fill('https://server.compa-mate.com/webhook-test/c07ec221-2026-4a69-951a-b382fd46acbc');
      await inputs[1].fill('phantombuster.com');
      console.log('✅ Pola wypełnione!');
    }
    
    // Kliknij "Wyślij do n8n"
    console.log('🚀 Klikam Wyślij do n8n...');
    await page.click('button:has-text("Wyślij do n8n")');
    
    console.log('✅ GOTOWE! Wszystko zrobione!');
    console.log('📧 Email:', email);
    console.log('🔑 Hasło:', password);
    
    await page.screenshot({ path: 'sukces.png' });
    
    console.log('⏸️ PAUZA - możesz teraz działać sam w przeglądarce!');
    console.log('⏸️ Wciśnij Ctrl+C w terminalu aby zakończyć');
    
    // Czekaj w nieskończoność - przeglądarka zostanie otwarta
    await page.waitForTimeout(999999999);
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
    await page.screenshot({ path: 'error.png' });
    
    console.log('⏸️ PAUZA - możesz sprawdzić co się stało');
    console.log('⏸️ Wciśnij Ctrl+C aby zakończyć');
    await page.waitForTimeout(999999999);
  } finally {
    // Zakomentowane - przeglądarka NIE zamknie się automatycznie
    // await browser.close();
    console.log('👋 Skrypt zakończony - przeglądarka zostaje otwarta');
  }
})();