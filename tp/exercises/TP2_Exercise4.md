## Question 4 : how behaves fastify :

- if no json schema is provided for any of body, query and params ?
- if the client submits an unknown property, according to the JSON schema?
- if the client omits a required property, according to the JSON schema?

- If no JSON schema is provided for any of the body, query, and params, Fastify will not perform any validation on the incoming request. The request will be processed as usual and the handler function will receive the request parameters without any validation or modification.

- If the client submits an unknown property, according to the JSON schema, Fastify will ignore it and the request will be processed as usual. The handler function will receive the request parameters with the unknown property.

- If the client omits a required property, according to the JSON schema, Fastify will return a 400 Bad Request response to the client, indicating that the request is missing a required field. The request will not be passed to the handler function.