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

  // Add first name and last name
  await page.getByPlaceholder('First Name').fill(testData.user.firstName);
  await page.getByPlaceholder('Last Name').fill(testData.user.lastName);

  // Add image 
  // Start waiting for file chooser before clicking. 
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('form').getByRole('img', { name: 'profile picture' }).click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(testData.user.imagePath);

  // Save
  await page.getByRole('button', { name: 'Save' }).click();
});

test('test add employee details', async () => {
  test.slow();

  // Nationality
  await page.locator('form').filter({ hasText: 'Employee Full' }).locator('i').nth(1).click();
  await page.getByRole('option', { name: 'Swedish' }).click();
  
  // Marital status
  await page.locator('form').filter({ hasText: 'Employee Full' }).locator('i').nth(2).click();
  await page.getByRole('option', { name: 'Married' }).click();

  // Date of birth
  await page.locator('div').filter({ hasText: /^Date of Birth$/ }).locator('i').click();
  await page.getByPlaceholder('yyyy-mm-dd').nth(1).fill('1987-08-15');

  // Gender
  await page.getByText('Male', { exact: true }).check();

  // Save the employee details
  await page.getByRole('button', { name: 'Save' }).first().click();

  // Add file
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('input[type="file"]').setInputFiles(testData.user.imagePath);

  await page.getByPlaceholder('Type comment here').click();
  await page.getByPlaceholder('Type comment here').fill('screenshot');
  
  // Save the file
  await page.getByRole('button', { name: 'Save' }).nth(2).click();
});

test('test search employee', async () => {
  await page.getByRole('link', { name: 'PIM' }).click();

  await page.getByPlaceholder('Type for hints...').first().fill(testData.user.firstName);
  await page.getByRole('button', { name: 'Search' }).click();

  await page.getByRole('row', { name: testData.user.firstName }).first().click();

  await expect(page.getByRole('heading', { name: testData.user.firstName })).toBeVisible();

  await expect(page.getByPlaceholder('yyyy-mm-dd').nth(1)).toHaveValue('1987-08-15');
  await expect(page.getByText('Male', { exact: true })).toBeChecked();
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