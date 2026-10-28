import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/DevMarket/);
  await page.getByRole('link', { name: 'Connexion' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@sahbi.tn');
  await page.getByLabel('Mot de passe ').fill('Test123M&');
  await page.getByRole('button', { name: 'se connecter' }).click();
  await page.getByRole('link', { name: 'Mes projets'}).click();
  await page.screenshot({ path: './capture/screenshot.png' });
  await page.getByRole('link', { name: 'Publier un projet'}).click();
});
