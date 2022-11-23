## Scenario

A production web server sends full stacktrace and debugging info to clients.

## 1. give the targeted vulnerability class, according to OWASP reference.

A3:2017-Sensitive Data Exposure

## 2. explain steps in case of successful exploit of the vulnerability (you can suppose the developer wrote ugly code without any security concern).

1. The attacker sends a malicious request to the server that will trigger an exception.
2. The server responds with a full stacktrace and debugging info concerning the exception.
3. The attacker can use the information to exploit the server by analyzing the stacktrace and debugging info to find sensitive data like language/framework informations, database informations, etc.

## 3. explain how developers can protect their software against your example.

Developers should not send full stacktrace and debugging info to clients. They should send an error message instead and make sure to always configure their server to production mode, which should disable full stacktrace and debugging info.