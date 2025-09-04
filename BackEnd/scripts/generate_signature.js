const crypto = require('crypto');

// ¡IMPORTANTE! Reemplaza con tu clave secreta de webhook de .env
const WEBHOOK_SECRET = 'clave_secreta_gitmasters_1347'; 

// Define el payload como un OBJETO JavaScript.
// Esto nos asegura que el formato JSON será consistente cuando lo stringifiquemos.
const PAYLOAD_OBJECT = {
  "ref": "refs/heads/main",
  "before": "0000000000000000000000000000000000000000",
  "after": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
  "repository": {
    "id": 123456789,
    "node_id": "MDEwOlJlcG9zaXRvcnkxMjM0NTY3ODk=",
    "name": "mi-repo-de-pruebas",
    "full_name": "tu-usuario/mi-repo-de-pruebas",
    "private": false,
    "owner": {
      "name": "tu-usuario",
      "email": "tu-email@example.com",
      "login": "tu-usuario",
      "id": 987654321
    }
  },
  "pusher": {
    "name": "tu-usuario",
    "email": "tu-email@example.com"
  },
  "sender": {
    "login": "tu-usuario",
    "id": 987654321
  },
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/tu-usuario/mi-repo-de-pruebas/compare/0000000...a1b2c3d4e5f6",
  "commits": [
    {
      "id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      "message": "feat: Añadir nueva funcionalidad de prueba",
      "timestamp": "2023-01-01T12:00:00Z",
      "url": "https://github.com/tu-usuario/mi-repo-de-pruebas/commit/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      "author": {
        "name": "Tu Nombre",
        "email": "tu-email@example.com",
        "username": "tu-usuario"
      },
      "committer": {
        "name": "Tu Nombre",
        "email": "tu-email@example.com",
        "username": "tu-usuario"
      },
      "added": [],
      "removed": [],
      "modified": [
          "README.md"
        ]
    }
  ],
  "head_commit": {
    "id": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    "tree_id": "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
    "distinct": true,
    "message": "feat: Añadir nueva funcionalidad de prueba",
    "timestamp": "2023-01-01T12:00:00Z",
    "url": "https://github.com/tu-usuario/mi-repo-de-pruebas/commit/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    "author": {
      "name": "Tu Nombre",
      "email": "tu-email@example.com",
      "username": "tu-usuario"
    },
    "committer": {
      "name": "Tu Nombre",
      "email": "tu-email@example.com",
      "username": "tu-usuario"
    },
    "added": [],
    "removed": [],
    "modified": [
        "README.md"
      ]
  }
};

// ¡AHORA STRINGIFICAMOS EL OBJETO! Esto asegura un formato consistente.
const PAYLOAD_JSON_STRING = JSON.stringify(PAYLOAD_OBJECT);

const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
const digest = 'sha256=' + hmac.update(PAYLOAD_JSON_STRING).digest('hex');

console.log('---------------------------------------------------');
console.log('¡COPIA ESTE JSON PARA EL BODY DE POSTMAN (raw, JSON)!');
console.log(PAYLOAD_JSON_STRING); // Imprime el JSON stringificado
console.log('---------------------------------------------------');
console.log('Firma generada (X-Hub-Signature-256):');
console.log(digest); // Imprime la firma
console.log('---------------------------------------------------');
