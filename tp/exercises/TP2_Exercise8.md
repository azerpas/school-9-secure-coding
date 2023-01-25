## Question 5 : compare the stateful session persisted in a backend service with a stateless session management like JWT. Recommendation: summarise the comparison as a grid. For criteria, consider among others: the scalability, the architecture complexity, the type and quantity of information known by the client, revocation strategy, impact if a session leaks, common weaknesses due to misconfigurations, client-side strategy to protect and submit the token (or session identifier), additional library requirements, etc.

Comparison of Stateful Session Persisted in Backend Service vs. Stateless Session Management with JWT:

| Criteria                         |                  Stateful Session                  |                              Stateless Session (JWT) |
| -------------------------------- | :------------------------------------------------: | ---------------------------------------------------: |
| Scalability                      |  Medium - May require more resources and capacity  |               High Can be easily scaled horizontally |
| Architecture Complexity          |            High - Complex to implement             |                                                  Low |
| Type and Quantity of Information |                      Detailed                      |                                              Limited |
| Revocation Strategy              |                        Easy                        |                                            Difficult |
| Impact if a Session Leaks        |                        High                        |                                                  Low |
| Common Weaknesses                | Misconfiguration - Session hijacking, data leakage |   Insecure Storage - Token tampering, replay attacks |
| Client-side Strategy             |               Cookies, local storage               |                           HTTP headers, bearer token |
| Additional Library Requirements  |                        Yes                         | JSON Web Token library required on client and server |

## Question 6: search and summarise solutions to protect the confidentiality of the session identifier stored in a browser’s cookie. Focus on the actions you can take as a backend developer or server-side infrastructure engineer.

Solutions to protect the confidentiality of the session identifier stored in a browser's cookie:

-   Use secure and HTTP-only cookies to store the session identifier
-   Use a secure connection (HTTPS) to transmit the session identifier between the client and server
-   Use a server-side session store to associate the session identifier with a user and their session data
-   Renew the session identifier on login and logout
-   Implement a session timeout to automatically expire sessions after a certain period of inactivity.

Those are general summary, and specific implementation details of the system will affect the actual security and scalability of the session management. It is important to evaluate the specific requirements and constraints of the application before making a decision on which session management solution to use.
