from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse,unquote,parse_qs
import json
root=Path.cwd()
with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce',permissions=['clipboard-read','clipboard-write'])
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:8034/');page.wait_for_load_state('networkidle')
 assert page.locator('h1').inner_text().startswith('Rooted in genomics.')
 page.evaluate("document.querySelectorAll('img').forEach(i => i.loading = 'eager')"); page.wait_for_function("[...document.images].every(i=>i.complete && i.naturalWidth>0)")
 assert page.evaluate('''() => [...document.querySelectorAll('a[href^="#"]')].filter(a => a.hash && !document.querySelector(a.hash)).map(a=>a.hash)''')==[]
 for width in [360,390,768,1440]:
  page.set_viewport_size({'width':width,'height':1000});assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'Overflow at {width}'
 page.set_viewport_size({'width':1440,'height':1000})
 page.screenshot(path='preview-desktop.png',full_page=True)
 page.screenshot(path='preview-hero.png')
 page.locator('#tab-resources').click();assert page.locator('#panel-resources').is_visible();assert not page.locator('#panel-crops').is_visible()
 page.locator('#tab-resources').press('ArrowRight');assert page.locator('#tab-ecosystems').get_attribute('aria-selected')=='true';assert page.locator('#panel-ecosystems').is_visible()
 page.locator('#tab-ecosystems').press('Home');assert page.locator('#tab-crops').get_attribute('aria-selected')=='true'
 page.locator('summary').filter(has_text='Are speaker costs covered?').click();assert page.locator('details[open]').inner_text().find('does not defray')>=0
 # Inspect a draft without opening a mail client or sending anything.
 page.locator('#presenter').fill('Test Researcher, Example University')
 page.locator('#talk-title').fill('Crop diversity & resilience')
 page.locator('#talk-summary').fill('Genomics for resilient perennial crop production systems.')
 captured=[]
 page.on('request',lambda r:captured.append(r.url) if r.url.startswith('mailto:') else None)
 page.locator('#proposal').click();assert page.locator('#draft-fallback').is_visible()
 page.locator('#copy-draft').click();text=page.evaluate('navigator.clipboard.readText()');assert 'Crop diversity & resilience' in text and 'Example University' in text
 page.locator('#share').click();text=page.evaluate('navigator.clipboard.readText()');assert 'PAG34' in text and '2027' in text
 assert page.locator('#share-status').inner_text().startswith('Workshop details copied')
 for path in ['credits.html','assets/credits.json','workshop.ics','assets/uga-caes.svg']:
  assert page.request.get('http://localhost:8034/'+path).ok
 page.set_viewport_size({'width':390,'height':844});page.goto('http://localhost:8034/');page.wait_for_load_state('networkidle');page.screenshot(path='preview-mobile.png',full_page=True);page.screenshot(path='preview-mobile-hero.png')
 assert not errors,errors
 print('PASS: 4 viewport widths, all local images, section links, tab click/keyboard, FAQ, proposal draft/copy, sharing, credits, calendar; no runtime errors.')
 context.close()
 nojs=browser.new_context(java_script_enabled=False);pg=nojs.new_page();pg.goto('http://localhost:8034/');assert pg.locator('#panel-resources').is_visible() and pg.locator('a[href="mailto:patersonah@gmail.com"]').first.is_visible();print('PASS: no-JavaScript research content and direct contact.')
 browser.close()
