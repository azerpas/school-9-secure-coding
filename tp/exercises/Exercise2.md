## Exercise 2: Please first focus on implementing (and passing green) the two test cases. 
Once done, you can think about DRY (don’t repeat yourself principle) and mutualise the test database management across the whole test suite (only composed of src/specs/entities/user.spec.ts for now). In addition, you could rely on NODE_ENV=test to override the database name (and potentially more configurations).

### Question 1: Why should you reset the database before each test case? Give examples of issues you may meet otherwise.
We should reset the database before each test case because we want to make sure that the database is empty before each test case. If we don’t reset the database before each test case, we could encounter conflicts between the test cases. For example:
- if we have a test case that creates a user and another test case that tries to create the same user, the second test case will fail because the user already exists in the database. 
- if we have a test case that creates a user and another that is checking that the database is empty, the second test case will fail because the database is not empty.

### Question 2: What kind of error is currently thrown in test case "should raise error if email is missing"? 
#### Is it an SQL error (occurring in the database server) or a validation error before the query got executed? What should it be, so it is easy and secure to format an error message to the end user (considering security, message internationalisation, etc.)?
The error is currently an SQL error occuring in the database and catch by TypeORM as a JavaScript error: `QueryFailedError`. We should throw a validation error before the query got executed by verifying the email format in the `User` class. This way, we can format an error message to the end user easily and securely without having to catch the error in the database.