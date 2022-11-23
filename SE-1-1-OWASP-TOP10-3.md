## Scenario

CVE-2013-4660 exploited against a vulnerable version of the `js-yaml` package (very popular package on npm).

Before you start: do you know what is a CVE?

## 1. give the targeted vulnerability class, according to OWASP reference.

A9:2017-Using Components with Known Vulnerabilities

## 2. explain steps in case of successful exploit of the vulnerability (you can suppose the developer wrote ugly code without any security concern).

`js-yaml` is a package that parse YAML files. It is used in many production projects, including `webpack` and `babel`. 
1. The attacker could create a malicious YAML file that contains a malicious JavaScript code.
2. The attacker would then use an application that uses `js-yaml` to parse the malicious YAML file to execute the malicious JavaScript code on the server or the app.

## 3. explain how developers can protect their software against your example.
- Developers should always check the version of the packages they use and update them regularly.
- Developers should always check the changelog of the packages they use to see if there are any security fixes.
- Developers should always keep updated with CVE updates.