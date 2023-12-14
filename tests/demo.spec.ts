import { test, expect } from '@playwright/test';

const loginData = JSON.parse(JSON.stringify(require('../test-data/LoginData.json')));
const testData = JSON.parse(JSON.stringify(require('../test-data/TestData.json')));

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto(loginData.url.baseURL);
  // Login with username and password
  await page.getByPlaceholder('Username').fill(loginData.admin.username);
  await page.getByPlaceholder('Password').fill(loginData.admin.password);
  await page.getByRole('button', { name: 'Login' }).click();
});

test('test add employee', async ({ page }) => {
  await page.goto(loginData.url.dashboardURL);

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Add Employee' }).click();

  await page.getByPlaceholder('First Name').fill(testData.user.firstName);
  await page.getByPlaceholder('Last Name').fill(testData.user.lastName);

  // Add image 
  // Start waiting for file chooser before clicking. 
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('form').getByRole('img', { name: 'profile picture' }).click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('./test-data/fixtures/imageName.png');

  // Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Verify it is saved successfully
  await expect(page).toHaveURL(new RegExp(loginData.url.viewProfileURL));
});

test('test search employee', async ({ page }) => {
  await page.goto(loginData.url.dashboardURL);

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  await page.getByPlaceholder('Type for hints...').first().fill(testData.user.firstName);
  await page.getByRole('button', { name: 'Search' }).click();
  
  await page.getByRole('row', { name: testData.user.firstName }).first().click();

  await expect(page.getByRole('heading', { name: testData.user.firstName })).toBeVisible(); 
});

test.afterAll('Teardown', async ({ page }) => {
  console.log('Done with tests');
  await page.close();
});