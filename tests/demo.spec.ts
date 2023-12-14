import { test, expect, type Page } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
let page: Page;

const loginData = JSON.parse(JSON.stringify(require('../test-data/LoginData.json')));
const testData = JSON.parse(JSON.stringify(require('../test-data/TestData.json')));

const employees = [
  testData.userOne,
  testData.userTwo,
  testData.userThree,
  testData.userFour,
  testData.userFive
]

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test('test login', async () => {
  // Runs before each test and signs in each page.
  await page.goto(loginData.url.baseURL);
  // Login with username and password
  await page.getByPlaceholder('Username').fill(loginData.admin.username);
  await page.getByPlaceholder('Password').fill(loginData.admin.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL((loginData.url.dashboardURL)); 
  await page.getByRole('link', { name: 'PIM' }).click();
});

test('test add one employee', async () => {
  await page.getByRole('link', { name: 'Add Employee' }).click();
  await page.getByPlaceholder('First Name').fill(testData.user.firstName);
  await page.getByPlaceholder('Last Name').fill(testData.user.lastName);

  // Add image 
  // Start waiting for file chooser before clicking. 
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('form').getByRole('img', { name: 'profile picture' }).click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(testData.user.imagePath);

  await page.getByRole('button', { name: 'Save' }).click();
});

test('test search employee', async () => {
  await page.getByRole('link', { name: 'PIM' }).click();

  await page.getByPlaceholder('Type for hints...').first().fill(testData.user.firstName);
  await page.getByRole('button', { name: 'Search' }).click();

  await page.getByRole('row', { name: testData.user.firstName }).first().click();

  await expect(page.getByRole('heading', { name: testData.user.firstName })).toBeVisible();
});

test('test add multiple employees', async () => {
  // give it more time to run this test
  test.slow();

  for (let i = 0; i < employees.length; i++) {
    await page.getByRole('link', { name: 'Add Employee' }).click();

    await page.getByPlaceholder('First Name').fill(employees[i].firstName);
    await page.getByPlaceholder('Last Name').fill(employees[i].lastName);

    // Add image 
    // Start waiting for file chooser before clicking. 
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('form').getByRole('img', { name: 'profile picture' }).click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(employees[i].imagePath);

    await page.getByRole('button', { name: 'Save' }).click();
  }
});

test.afterAll(async () => {
  await page.close();
});