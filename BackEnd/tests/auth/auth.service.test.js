// tests/auth/auth.service.test.js
const jwt = require("jsonwebtoken");
const { generateAuthToken } = require("../../src/modules/auth/service/auth.service");

// Mockeamos el módulo `jsonwebtoken` para evitar que firme un token real.
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-token"),
}));

describe("Auth Service Unit Tests", () => {
  // Antes de cada prueba, reinicia los mocks.
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  it("should generate a JWT with the correct user data and secret", () => {
    const mockUser = { id: 1, username: "testuser" };
    const token = generateAuthToken(mockUser);

    // 1. Verificamos que la función `jwt.sign` fue llamada
    expect(jwt.sign).toHaveBeenCalled();

    // 2. Verificamos que se llamó con los argumentos correctos
    expect(jwt.sign).toHaveBeenCalledWith(
      mockUser,
      "test_secret",
      expect.any(Object)
    );
    
    // 3. Verificamos que la función devuelve el token que mockeamos
    expect(token).toBe("mocked-token");
  });

  // Puedes agregar más pruebas aquí, por ejemplo, para verificar la expiración
});