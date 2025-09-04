module.exports = {
  tags: [{ name: 'Profile', description: 'Endpoints relacionados al perfil de usuario' }],
  paths: {
    '/profile/my': {
      get: {
        tags: ['Profile'],
        summary: 'Obtiene el perfil del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Perfil obtenido correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProfileResponse' }
              }
            }
          },
          401: { description: 'No autorizado' },
          404: { description: 'Perfil no encontrado' }
        }
      }
    }
  },
  components: {
    schemas: {
      ProfileResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          name: { type: 'string' },
          avatarUrl: { type: 'string' },
          metrics: {
            type: 'object',
            properties: {
              points: { type: 'integer' },
              commits: { type: 'integer' },
              prs: { type: 'integer' },
              branches: { type: 'integer' }
            }
          }
        }
      }
    }
  }
};
