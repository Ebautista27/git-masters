const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
      
    },
    async function (accessToken, refreshToken, profile, done) {

      try {
        let userEmail = null;

        // Si el email no está en el perfil principal, hacemos una llamada adicional a la API
        if (profile.emails === undefined || profile.emails.length === 0) {
          console.log("El email no se encontró en el perfil. Haciendo llamada a la API de GitHub...");

          const response = await fetch('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `token ${accessToken}`,
              'User-Agent': 'tu-aplicacion-de-node' // Requerido por la API de GitHub
            }
          });

          if (!response.ok) {
            throw new Error(`Error al obtener los emails de GitHub: ${response.statusText}`);
          }
          
          const emails = await response.json();
          // Buscamos el email primario (el que el usuario usa para notificaciones)
          const primaryEmail = emails.find(email => email.primary === true);
          
          if (primaryEmail) {
            userEmail = primaryEmail.email;
          } else if (emails.length > 0) {
            // Si no hay primario, tomamos el primero
            userEmail = emails[0].email;
          }
        } else {
          // Si el email ya está en el perfil, lo usamos 
          userEmail = profile.emails[0].value;
        }

        const user = {
          id: profile.id,
          username: profile.username,
          avatar_url: profile.photos?.[0]?.value || null,
          email: userEmail, // Ahora con el email obtenido
        };

        return done(null, user);

      } catch (error) {
        console.error("Error en la estrategia de GitHub:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
