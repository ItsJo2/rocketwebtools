## What Is Base64?

Base64 is an encoding scheme that converts binary data into a string of ASCII characters. It was invented to safely transmit binary content — like images or files — through systems that only handle text, such as email protocols.

The name comes from the fact that it uses 64 characters: A-Z, a-z, 0-9, plus `+` and `/`.

## Why Does Base64 Exist?

Many data transmission protocols were originally designed to handle plain text only. Email systems, HTTP headers, and XML documents can break when they encounter raw binary data. Base64 solves this by representing binary as printable characters that survive transmission intact.

## Common Uses of Base64

**Data URIs** embed images directly into HTML or CSS without a separate file request. A small icon can be converted to Base64 and placed inline: `<img src="data:image/png;base64,iVBOR...">`.

**API authentication** uses Base64 to encode credentials. HTTP Basic Auth sends `username:password` as a Base64 string in the Authorization header.

**JWT tokens** use Base64URL encoding (a URL-safe variant) for their header and payload sections.

**Email attachments** are encoded in Base64 before being embedded in the email body.

## What Base64 Is Not

Base64 is not encryption. It is not compression. It is purely an encoding — a way of representing data in a different format. Anyone can decode a Base64 string instantly. Never use it to hide sensitive data.

## How to Encode and Decode Base64

The Base64 Encoder/Decoder tool on Rocket Web Tools handles both directions. Paste text or a data string, choose encode or decode, and get the result instantly. Everything runs locally in your browser.

## The Size Overhead

Base64 increases data size by approximately 33%. A 100KB image encoded in Base64 becomes roughly 133KB. This is an acceptable trade-off for inline data URIs on small assets, but you should avoid Base64 encoding large files.
