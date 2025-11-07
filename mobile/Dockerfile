# --- Étape 1 : Build de l'application Expo Web ---
FROM node:22-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code source
COPY . .

# --- Variables d’environnement depuis docker-compose ---
ARG API_URL
ENV EXPO_PUBLIC_API_URL=${API_URL}

# ✅ Log utile pendant le build
RUN echo "✅ Building Expo Web with API_URL=${EXPO_PUBLIC_API_URL}"

# --- Build de l’application web Expo (Expo SDK 54) ---
RUN npx expo export --platform web --output-dir dist

# --- Étape 2 : Image finale légère avec Nginx ---
FROM nginx:1.27-alpine

# Supprimer le contenu par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers statiques générés depuis le builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port HTTP standard
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
