import { test, expect } from '@playwright/test';
import exp from 'constants';

const userName = "Admin"
const password = "admin123"
const firstName = "Liang";
const lastName = "Wang";

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  // Login with username and password
  await page.getByPlaceholder('Username').fill(userName);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
});

test('test add employee', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Add Employee' }).click();

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

  // Verify it is saved successfully
  await expect(page.getByText('Success', { exact: true})).toBeVisible();
});

test('test search employee', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  await page.getByPlaceholder('Type for hints...').first().fill(firstName);
  await page.getByRole('button', { name: 'Search' }).click();
  
  await page.getByRole('row', { name: firstName }).first().click();

  await expect(page.getByRole('heading', { name: firstName })).toBeVisible();
  
  // await expect(page.getByPlaceholder('First Name')).toHaveText('Liang');
  // await expect(page.getByPlaceholder('Last Name')).toHaveText('Wang');
  
});

test.afterAll('Teardown', async () => {
  console.log('Done with tests');
  // ...
});