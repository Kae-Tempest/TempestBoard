# Utilisation de l'image officielle de Node.js 20 comme image de base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json (si présent) dans le conteneur
COPY . .

RUN corepack enable && yarn set version stable

# Installer les dépendances
RUN yarn

# Copier le reste du code source de l'application dans le conteneur


# Construire l'application Nuxt en mode production
RUN yarn build

# Exposer le port 3000 (port par défaut pour Nuxt)
EXPOSE 3000

# Démarrer l'application Nuxt en mode production
CMD ["yarn", "start"]
