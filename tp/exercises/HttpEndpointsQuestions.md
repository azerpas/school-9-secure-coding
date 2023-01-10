## Question 1: please write a small paper about that naming convention.

The REST (Representational State Transfer) naming convention is a set of guidelines for mapping CRUD operations (Create, Read, Update, and Delete) on resources to the corresponding HTTP verbs (GET, POST, PUT, and DELETE) and HTTP paths. This convention is designed to make it easy for developers to understand how to interact with an API based on its URL structure.
The convention states that a resource should be accessed using the HTTP verb that corresponds to the intended action:

- GET: Retrieve a resource or a collection of resources
- POST: Create a new resource
- PUT: Update an existing resource
- DELETE: Delete an existing resource

For example, an API endpoint that allows the user to retrieve all books in a library might have a path like /books, and use the GET verb to retrieve the data. A similar endpoint for creating a new book might have a path like /books and use the POST verb.

Additionally, it is a common practice to include a version number in the base path of an API, such as /api/v1/, to allow for updates and changes without breaking existing client applications.

## Question 2 : considering they use REST naming convention, what would do POST /web-api/users and POST /web-api/sessions endpoints ?

Considering the use of REST naming conventions, the endpoint POST /web-api/users would likely be used to create a new user. This would be accomplished by sending a request to the server with the appropriate data in the request body, along with the HTTP verb POST.
The endpoint POST /web-api/sessions, on the other hand, would likely be used to create a new session. A session is a way to persist a user's identity across multiple requests. This is typically achieved by including a session token in the request headers, which the server uses to look up the user's identity. This endpoint would also use POST verb.

It's important to note that these are just examples and actual behavior of the endpoints will depend on the implementation of the API.
