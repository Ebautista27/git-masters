// tests/auth/auth.controller.test.js
// Importamos las funciones del controlador que vamos a probar
const {
  githubCallback,
  getProfile,
  logout,
} = require("../../src/modules/auth/controller/auth.controller");
// Importamos el servicio para poder simularlo
const authService = require("../../src/modules/auth/service/auth.service");

// Simulamos el servicio para probar el controlador de forma aislada
jest.mock("../../src/modules/auth/service/auth.service", () => ({
  // Finge la función para generar un token falso y poder controlarlo en los tests
  generateAuthToken: jest.fn(),
}));

// Agrupamos las pruebas para el controlador de autenticación
describe("Auth Controller Unit Tests", () => {
  let mockRequest;
  let mockResponse;

  // Preparamos los objetos falsos de 'req' y 'res' antes de cada prueba
  beforeEach(() => {
    mockRequest = {
      user: { id: "123", displayName: "Test User" },
    };
    mockResponse = {
      cookie: jest.fn(() => mockResponse),
      redirect: jest.fn(),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };
    // Limpiamos los "espías" de Jest después de cada prueba
    jest.clearAllMocks();
  });

  // ---

  // Prueba para el flujo de autenticación con GitHub
  describe("githubCallback", () => {
    it("should redirect to homepage on successful authentication", () => {
      // Configuramos el servicio simulado para que devuelva un token falso
      authService.generateAuthToken.mockReturnValue("fake-token");
      
      githubCallback(mockRequest, mockResponse);

      // Verificamos que se llamó al servicio y que la respuesta redirigió a la página principal
      expect(authService.generateAuthToken).toHaveBeenCalledWith(mockRequest.user);
      expect(mockResponse.cookie).toHaveBeenCalled();
      expect(mockResponse.redirect).toHaveBeenCalledWith("/");
    });
  });

  // Prueba para obtener el perfil del usuario
  describe("getProfile", () => {
    it("should return user profile data", () => {
      getProfile(mockRequest, mockResponse);
      // Verificamos que la respuesta envió los datos del usuario en formato JSON
      expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.user);
    });
  });

  // Prueba para la función de cerrar sesión
  describe("logout", () => {
    it("should clear the cookie and redirect to the homepage", () => {
      logout(mockRequest, mockResponse);
      // Verificamos que la cookie de sesión se eliminó y que redirigió al inicio
      expect(mockResponse.clearCookie).toHaveBeenCalledWith("token", expect.any(Object));
      expect(mockResponse.redirect).toHaveBeenCalledWith("/");
    });
  });
});