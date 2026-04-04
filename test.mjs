import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  page.on('console', msg => console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`));
  page.on('pageerror', error => console.log('[PAGE ERROR]', error.message));
  
  try {
    await page.goto('http://localhost:5173');
    await page.type('input[type="email"]', 'admin@econest.com');
    await page.type('input[type="password"]', 'admin123');
    
    const buttons = await page.$$('button');
    for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Sign In')) {
            await btn.click();
            break;
        }
    }
    
    await new Promise(r => setTimeout(r, 4000));
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    const hasAdminHome = bodyHTML.includes('AdminOverviewPage') || bodyHTML.includes('SOC Dashboard') || bodyHTML.includes('Overview');
    console.log("BODY HTML LENGTH:", bodyHTML.length);
    console.log("Has Admin content?", hasAdminHome);
    console.log("BODY HTML PREVIEW:", bodyHTML.substring(0, 500));
  } catch(e) {
      console.log("Script error", e);
  } finally {
      await browser.close();
  }
})();
