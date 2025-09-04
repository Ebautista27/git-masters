// src/modules/profile/controller/profile.controller.js
const { getUserProfileData } = require('../service/profile.service.js');

exports.getMyProfile = async (req, res) => {
  try {
    console.log("Datos de usuario del token:", req.user);

    // Usa githubId si viene explícito, si no, usa id (GitHub profile.id)
    const githubIdRaw = req.user.githubId ?? req.user.id;
    if (!githubIdRaw) {
      return res.status(400).json({ error: 'ID de usuario de GitHub no encontrado en el token.' });
    }

    // Normaliza a string para comparar robusto
    const githubId = String(githubIdRaw);

    const profileData = await getUserProfileData(githubId);
    if (!profileData) {
      return res.status(404).json({ error: 'Perfil de usuario no encontrado en la base de datos.' });
    }

    res.json(profileData);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
