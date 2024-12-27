# Easy Encryption

[![Netlify Status](https://api.netlify.com/api/v1/badges/6b6b9ecd-446c-4f77-abf6-c45a20a5da63/deploy-status)](https://app.netlify.com/sites/easyencryption/deploys)

## Live Demo

You can try out the live demo of Easy Encryption here: [Easy Encryption Live Demo](https://easyencryption.netlify.app/)

Easy Encryption is a Svelte-based web application that provides a simple and intuitive interface for encrypting and decrypting text. It uses AES encryption from the `crypto-ts` library, allowing users to securely transform plaintext into ciphertext and vice versa.

## Features

- **Encrypt Text**: Convert plain text into encrypted text using a custom password.
- **Decrypt Text**: Revert encrypted text back to its original form using the same password.
- **Clipboard Integration**: Easily copy encrypted/decrypted text to the clipboard or paste input text from the clipboard.
- **Dynamic UI**: The app dynamically switches between encryption and decryption modes with a clean and responsive design.

## Usage

### Encrypting Text

1. Select the **Encrypt** button from the navigation bar.
2. Enter the text you want to encrypt in the input box.
3. Provide a password for encryption in the password input field.
4. The encrypted text will appear in the output box. You can copy it to the clipboard by clicking the "Copy" icon.

### Decrypting Text

1. Select the **Decrypt** button from the navigation bar.
2. Paste the encrypted text in the input box.
3. Provide the same password used for encryption.
4. The decrypted text will appear in the output box. You can copy it to the clipboard by clicking the "Copy" icon.

### Clipboard Integration

- **Paste from Clipboard**: Click the "Paste" icon in the input box to automatically paste clipboard content.
- **Copy to Clipboard**: Click the "Copy" icon in the output box to copy the result.

## API

This application also exposes an API endpoint to perform encryption and decryption operations programmatically.

### Endpoint

**`GET /api`**

### Query Parameters

| Parameter   | Type   | Required | Description                                                                 |
|-------------|--------|----------|-----------------------------------------------------------------------------|
| `action`    | string | Yes      | Specifies the action to perform: `encrypt` or `decrypt`.                    |
| `text`      | string | Yes      | The text to be encrypted or decrypted.                                      |
| `password`  | string | No       | The password used for encryption or decryption. Defaults to an empty string.|

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "result": "encryptedOrDecryptedText"
  }
  ```

#### Error Responses
- **Status Code:** `400 Bad Request`
- **Possible Error Messages:**
  - `"Action is required"`: The `action` parameter is missing.
  - `"Text is required"`: The `text` parameter is missing.
  - `"Invalid action"`: The `action` parameter is not `encrypt` or `decrypt`.
  - `"Invalid password"`: The password is incorrect for decryption.
        
## Technologies Used

- **[SvelteKit](https://kit.svelte.dev/)**: Framework for building modern web apps.
- **[crypto-ts](https://www.npmjs.com/package/crypto-ts)**: AES encryption library.
- **[Font Awesome](https://fontawesome.com/)**: Icon library for UI elements.

## License

This project is open-source and available under the [MIT License](LICENSE).
