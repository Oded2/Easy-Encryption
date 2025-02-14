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

## API Usage Guide

### **Endpoint**

`POST /api`

### **Description**

This API endpoint allows users to encrypt or decrypt text using a password.

### **Request Format**

The request must be sent as a **POST** request with a **JSON body**.

### **Request Headers**

| Header         | Value              |
| -------------- | ------------------ |
| `Content-Type` | `application/json` |

### **Request Body**

The request body should be a JSON object containing the following fields:

| Field      | Type   | Required | Description                                                                          |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `action`   | string | ✅ Yes   | Either `"encrypt"` or `"decrypt"`                                                    |
| `text`     | string | ✅ Yes   | The text to be encrypted or decrypted                                                |
| `password` | string | ❌ No    | The password for encryption/decryption (defaults to an empty string if not provided) |

### **Example Requests**

#### **Encrypt a Message**

```json
POST /api/encrypt-decrypt
{
  "action": "encrypt",
  "text": "Hello, World!",
  "password": "mypassword123"
}
```

#### **Decrypt a Message**

```json
POST /api/encrypt-decrypt
{
  "action": "decrypt",
  "text": "EncryptedTextHere",
  "password": "mypassword123"
}
```

### **Response Format**

The API returns a JSON response with the encryption or decryption result.

#### **Successful Response**

```json
{
  "result": "EncryptedOrDecryptedTextHere"
}
```

#### **Error Responses**

| Status Code | Message                  | Cause                                       |
| ----------- | ------------------------ | ------------------------------------------- |
| 400         | `"Action is required"`   | Missing `action` field                      |
| 400         | `"Text is required"`     | Missing `text` field                        |
| 400         | `"Invalid action"`       | Action is not `"encrypt"` or `"decrypt"`    |
| 401         | `"Invalid password"`     | Decryption failed due to incorrect password |
| 400         | `"Body cannot be empty"` | Request body is empty                       |

### **Usage Example with cURL**

```sh
curl -X POST http://localhost:5173/api/encrypt-decrypt \
     -H "Content-Type: application/json" \
     -d '{"action": "encrypt", "text": "Hello", "password": "123"}'
```

### **Notes**

- If the decryption fails due to an incorrect password, the API will return a `401 Unauthorized` response.
- Ensure that your request body is properly formatted as JSON.

## Technologies Used

- **[SvelteKit](https://kit.svelte.dev/)**: Framework for building modern web apps.
- **[crypto-ts](https://www.npmjs.com/package/crypto-ts)**: AES encryption library.
- **[Font Awesome](https://fontawesome.com/)**: Icon library for UI elements.

## License

This project is open-source and available under the [MIT License](LICENSE).
