# Étape 1 : Build de l'application Angular
FROM node:20 AS build
WORKDIR /app

# On copie d'abord les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./
RUN npm install

# On copie le reste du code source
COPY . .

# Installation de Angular CLI pour assurer la disponibilité de la commande 'ng'
RUN npm install -g @angular/cli

# Build de l'application
RUN npm run build

# Étape 2 : Utilisation d'un serveur Nginx léger pour servir les fichiers statiques
FROM nginx:alpine

# Copie des fichiers buildés vers le répertoire de Nginx
# La commande ci-dessous est conçue pour cibler le dossier 'browser' créé par Angular
# Si ton projet est ancien (Angular < 17), ajuste le chemin si besoin.
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]