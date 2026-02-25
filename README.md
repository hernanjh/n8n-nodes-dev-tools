# n8n-nodes-dev-tools

This is an n8n community node that provides a suite of developer utility tools, ranging from secure generators to data transformers and converters.

## Features

This node acts as a "Swiss Army Knife" for developers, offering the following modular tools:

### 1. API Key Generator

Generates secure alfanumeric API keys of custom lengths.

### 2. Password Generator

Generates highly secure passwords with configurable complexity:

- Custom length.
- Toggle special characters, numbers, and uppercase.

### 3. QR Generator

Generates QR codes for plain Text/URLs or WiFi Configurations.

- **Output options**: Base64 Data URI or Binary File.

### 4. Unique ID Generator

Generates standard unique identifiers:

- UUID v4.
- NanoID.

### 5. Barcode Generator

Generates barcodes in multiple formats:

- **Formats**: Code 128, EAN-13, UPC-A.
- **Output options**: Base64 Data URI or Binary File.

### 6. Base64 Encoder/Decoder

Easily encode/decode data to and from Base64.

- **Source types**: Plain text or Binary files.

### 7. URL Encoder/Decoder

Standard percentage encoding for safe URL transmission.

### 8. HTML to Text

Extracts clean, readable text from HTML content, removing tags while preserving basic structure.

### 9. XML <-> JSON Converter

Fast bidirectional conversion between XML strings and JSON objects.

## Installation

Follow the [installation guide in the n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/installation/).

```bash
npm install n8n-nodes-dev-tools
```

## License

[MIT](LICENSE.md)
