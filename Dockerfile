# Remplace node:18 par node:20 ou node:22
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# On installe Angular CLI globalement pour être sûr qu'il soit trouvé
RUN npm install -g @angular/cli
RUN npm run build

# Étape 2 : On utilise un serveur web léger pour afficher le résultat
FROM nginx:alpine
# Assure-toi que le dossier 'dist' correspond à ce que ton projet génère
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]