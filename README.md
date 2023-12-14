﻿# Play with Playwright

Create automated Web UI tests covering the steps provided above using Playwright(Typescript) framework.

1. Navigate to https://opensource-demo.orangehrmlive.com/index.php
I put this as the baseURL and put all urls in a JSON file.

2. Log in as Admin
Log in is required before going to dashboard to add or search for employee.

3. Add new employee (PIM - Add Employee)
Add a test employee by filling in my name.

4. Fill-in few Personal Details and attach a photo
Added a photo while creating new employee, this is also done for all new employees created in step 6.

5. Save the employee details
Save when it is possible, i.e. when the employee ID is available. Further more this could be improved by checking if all required information are filled in.

6. Navigate back to home screen and search with newly created employee details(PIM - Employee List)

7. Verify the personal details of the Employee
Search by name, first name or last name.

8. Create multiple employees using test data file
I created an array of test users mapped from a JSON file where the raw information are stored.

9. Create a basic report after execution.
This project is set up using Github Actions, each commit and pull request merge will trigger a new test, and the test results are uploaded as HTML report to Azure.
For example, this is the link to my latest test result: https://testforplaywright.z1.web.core.windows.net/run-7211585921-1/index.html
