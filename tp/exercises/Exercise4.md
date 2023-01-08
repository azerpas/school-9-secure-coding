## Question 3 : Why do we need both a database constrain and a validation in typescript for the same check?

We need both a database constrain and a validation in typescript for the same check because the database constrain is used to check the email format in the database and the validation in typescript is used to check the email format before the query is executed. This way, we can format an error message to the end user easily and securely without having to catch the error in the database.

## Question 4: how models validations, such as the one you just wrote, can serve the security of your application? Give an example.

**In addition, which database mechanism can be leveraged for security hardening in case a validation fails (ex. while persisting 2 entities in response to the same action)? Clue: the mechanism I am thinking about could also operate on afterUpdate subscriptions.**

Models validations can serve the security of our application by checking the format of the email sent by the user before the query is executed. Therefore, we can check for any unwanted characters or strings in the email, such as the `;` character, which can be used to execute a SQL query thus reducing the mitigation of SQL injection attacks. 

We could also use transactions to rollback the query if the validation fails for 2 entities in response to the same action. 