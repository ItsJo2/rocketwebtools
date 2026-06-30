## What Is a JWT Token?

JWT stands for JSON Web Token. It is an open standard (RFC 7519) for securely transmitting information between parties as a compact, URL-safe string. JWTs are used almost universally in modern web applications for authentication and authorization.

When you log in to a web app, the server often responds with a JWT. Your browser stores this token and sends it with every subsequent request. The server validates the token to confirm your identity without needing to check a database on every request.

## The Structure of a JWT

A JWT consists of three parts separated by dots: a header, a payload, and a signature.
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
**The header** contains the token type (JWT) and the signing algorithm being used, such as HS256 or RS256. It is Base64URL encoded.

**The payload** contains the claims — statements about the user and any additional data. Standard claims include `sub` (subject/user ID), `iat` (issued at time), and `exp` (expiration time). It is also Base64URL encoded.

**The signature** is created by taking the encoded header, the encoded payload, a secret key, and the algorithm specified in the header. It verifies the token has not been tampered with.

## What JWT Is Not

JWT is not encryption. The header and payload are Base64URL encoded, which means anyone can decode and read them. Never store sensitive information like passwords or payment details in a JWT payload.

JWT is a way to verify that a token came from a trusted source and has not been modified — not a way to hide its contents.

## How to Inspect a JWT

The JWT Debugger tool on Rocket Web Tools decodes any JWT token client-side and displays the header, payload, and signature separately. Paste any JWT to instantly see what it contains, when it was issued, and when it expires.

This is useful for debugging authentication issues, checking token expiry times, and inspecting what claims your server is returning.

## Common JWT Security Mistakes

Never store JWTs in localStorage if your application is vulnerable to XSS attacks. HttpOnly cookies are a safer storage option.

Always validate the token signature on the server side. Never trust the payload alone without verifying the signature.

Set short expiration times for access tokens (15 minutes to 1 hour is common) and use refresh tokens for long-lived sessions.
