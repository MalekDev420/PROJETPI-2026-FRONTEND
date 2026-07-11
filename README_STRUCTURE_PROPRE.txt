Frontend Angular restructuré proprement.

Démarrage:
1) npm install
2) npm start
3) ouvrir http://localhost:4200

Structure importante à montrer à la prof:
src/app/pages      => pages FrontOffice, dashboards, admin, assistant
src/app/services   => ApiService centralise les appels REST vers Node/Express
src/app/models     => interfaces TypeScript Mission, Developer, User
src/app/guards     => protection simple des dashboards client/développeur
src/app/app.routes.ts => routing Angular: /, /missions, /client, /developer, /admin

Phrase de soutenance:
Le frontend est structuré en architecture Angular modulaire avec pages, services, models et guards. Angular ne parle jamais directement à MySQL: il communique avec le backend Express via ApiService.
