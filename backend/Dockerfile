FROM node:22-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste des fichiers du projet
COPY . .

# Copier le fichier .env (si tu veux qu’il soit accessible dans le conteneur)
# ⚠️ Optionnel — uniquement si tu veux inclure le .env dans l’image (pas recommandé en prod)
# COPY .env .env

# Exposer le port backend (celui défini dans ton .env)
EXPOSE 5002

# Définir la variable d'environnement NODE_ENV (bonne pratique)
ENV NODE_ENV=production



# Lancer ton backend
CMD ["npm", "start"]
