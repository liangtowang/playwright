import { test, expect } from '@playwright/test';

test('Login', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  // await page.getByPlaceholder('Username').click();
  await page.locator('[placeholder="Username"]').fill('Admin');
  await page.locator('[placeholder="Password"]').fill('admin123');

  await page.waitForSelector('text=Login', {timeout: 5000});
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Add Employee' }).click();
  
  const firstName = "Liang";
  const lastName = "Wang";

  await page.getByPlaceholder('First Name').fill(firstName);
  await page.getByPlaceholder('Last Name').fill(lastName);

  // Add image 
  // Start waiting for file chooser before clicking. 
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('form').getByRole('img', { name: 'profile picture' }).click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./tests/fixtures/imageName.png');

  // Save
  await page.getByRole('button', { name: 'Save' }).click();

});