import { test, expect } from '@playwright/test';
import exp from 'constants';

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  // Login with username and password
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
});

test('test add employee', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

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

test('test search employee', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  await page.getByPlaceholder('Type for hints...').first().fill('liang');
  await page.getByRole('button', { name: 'Search' }).click();
  
  await page.getByRole('row', { name: 'Liang Wang' }).first().click();

  await expect(page.getByRole('heading', { name: 'Liang Wang' })).toBeVisible();
  
  // await expect(page.getByPlaceholder('First Name')).toHaveText('Liang');
  // await expect(page.getByPlaceholder('Last Name')).toHaveText('Wang');
  
});

test.afterAll('Teardown', async () => {
  console.log('Done with tests');
  // ...
});