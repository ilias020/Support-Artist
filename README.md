# Support Artist

<p>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5">
<img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white" alt="Node.js 22">
<img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express 4">
<img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL 8">
</p>
<p>
<a href="https://github.com/ilias020/Support-Artist/actions/workflows/backend.yml"><img src="https://github.com/ilias020/Support-Artist/actions/workflows/backend.yml/badge.svg" alt="Backend CI"></a>
<a href="https://github.com/ilias020/Support-Artist/actions/workflows/frontend.yml"><img src="https://github.com/ilias020/Support-Artist/actions/workflows/frontend.yml/badge.svg" alt="Frontend CI"></a>
</p>

Webplatform waarop fans artiesten financieel steunen met een maandelijks abonnement. Artiesten delen posts met hun supporters, fans beheren hun abonnementen en kunnen contact opnemen met de beheerder.

> **Schoolproject:** teamproject van vijf ontwikkelaars, gebouwd in sprints volgens Scrum tijdens het eerste semester van de HBO Associate Degree Software Development (oktober 2024 – januari 2025). De frontend is bewust gebouwd zonder frameworks of libraries: alleen HTML, CSS en TypeScript. Na afloop heb ik het project opgeschoond: geheimen naar `.env`, restcode verwijderd, fouten opgelost, linting en CI toegevoegd.

---

## Inhoud

- [Aanleiding](#aanleiding)
- [Functionaliteiten](#functionaliteiten)
- [Tech stack](#tech-stack)
- [Architectuur](#architectuur)
- [Mijn bijdrage](#mijn-bijdrage)
- [Werkwijze](#werkwijze)
- [Lokaal draaien](#lokaal-draaien)
- [Projectstructuur](#projectstructuur)
- [Bekende beperkingen](#bekende-beperkingen)

---

## Aanleiding

Veel artiesten en makers zijn afhankelijk van een kleine groep vaste fans. Support Artist geeft die fans een directe manier om een artiest te steunen met een abonnement, en geeft artiesten een eigen plek om hun supporters op de hoogte te houden.

De Product Owner stuurde het project bij met wensen per sprint. Zo moest de navigatie compacter worden (een uitklapbaar menu in plaats van een volle balk), moest de beheerder het platform kunnen modereren en moest een gebruiker in de header kunnen zien dat hij is ingelogd.

## Functionaliteiten

**Fan**
- Account aanmaken en inloggen
- Een abonnement afsluiten op een artiest (*Basic*, *Standard* of *Pro Supporter*) via een gesimuleerde betaling
- Een overzicht van de eigen abonnementen bekijken
- Een contactformulier versturen naar de beheerder

**Artiest**
- Posts plaatsen, wijzigen en verwijderen op het eigen profiel

**Beheerder**
- Contactberichten bekijken en de status bijwerken (*Pending*, *In progress*, *Resolved*)

## Tech stack

| Onderdeel | Technologie |
|---|---|
| Frontend | HTML, CSS, TypeScript (ES-modules, zonder frameworks) |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL, via mysql2 |
| Authenticatie | bcrypt voor wachtwoorden, JWT bij het inloggen |
| Codekwaliteit | ESLint, Prettier |
| CI | GitHub Actions |

## Architectuur

```
HTML + TypeScript  ──fetch──▶  Express API  ──▶  MySQL
één script per pagina            controllers → business (model, service) → data (mysql2)
```

**Backend.** De lagenstructuur werd door de opleiding voorgeschreven. Een controller leest het request uit, een service bevat de businesslogica, de modellen valideren de invoer en de datalaag voert de SQL-queries uit met mysql2. De routes staan in `src/server.ts` en de configuratie komt uit `.env` via `src/config.ts`.

**Frontend.** Elke pagina is een losse HTML-pagina met een eigen TypeScript-bestand, dat naar `build/` wordt gecompileerd. De API-URL staat op één plek in `src/config.ts`.

Het databasemodel staat in [`docs/database`](docs/database): het ERD (MySQL Workbench) en een `schema.sql` om de database aan te maken.

## Mijn bijdrage

Ik was verantwoordelijk voor de **contactfunctie**:

- **Ontwerp:** de statussen van een contactbericht (*Pending*, *In progress*, *Resolved*), afgestemd met de Product Owner
- **Frontend:** het contactformulier met validatie, waarmee een gebruiker een bericht naar de beheerder stuurt
- **Backend:** het contactmodel met validatie, de service, de controller en de datalaag voor het opslaan, ophalen en bijwerken van contactberichten, plus de bijbehorende routes in de Express-server
- **Nog niet af:** het ophalen en bijwerken van berichten heb ik in de frontend wel opgezet, maar nog niet aan de beheerpagina gekoppeld. Verwijderen heb ik niet gebouwd.
- **Opschoning na afloop:** geheimen naar `.env`, restcode en debug-logging verwijderd, fouten opgelost, linting en formatting toegevoegd, kwetsbare dependencies bijgewerkt en een CI-pipeline opgezet

## Werkwijze

Het team werkte in sprints volgens Scrum, met elke sprint een andere scrummaster. Elke sprint begon met een sprintplanning met prioriteiten en issues per teamlid, en eindigde met een review bij de Product Owner en een retrospective. Afspraken over samenwerking stonden in een samenwerkingsovereenkomst.

- **Issues:** de Product Owner keurt issues goed voordat ze in een sprint komen. Issues bevatten een user story met acceptatiecriteria en happy en unhappy paths, en frontend en backend van dezelfde functionaliteit delen dezelfde user story.
- **Definition of Done:** een issue is af als het door minimaal één teamlid is bekeken en goedgekeurd, werkt in de browser, alle happy en unhappy paths afdekt, geen nieuwe bugs introduceert en door de Product Owner is geaccepteerd.
- **Style guide:** lowerCamelCase, kleine functies zonder herhaalde code, expliciete types, één resource per endpoint-naam en aparte klassen per CRUD-actie.
- **Versiebeheer:** teamleden meldden het vooraf als ze gingen committen, om conflicten te voorkomen. Elke commit beschrijft waarom er gecommit wordt en wordt gekoppeld aan het issue.

## Lokaal draaien

**Vereisten:** [Node.js 22](https://nodejs.org/) en MySQL 8.

### Database

```bash
mysql -u root -p < docs/database/schema.sql
```

### Backend

```bash
cd backend
cp .env.example .env     # vul de databasegegevens en JWT_SECRET in
npm install
npm run dev
```

De API draait op `http://localhost:4001`. In [`backend/requests.http`](backend/requests.http) staan voorbeeldrequests.

### Frontend

```bash
cd frontend
npm install
npm run build
npm run serve
```

De site draait op `http://localhost:8080`. Gebruik `npm run watch` in een tweede terminal om TypeScript automatisch opnieuw te compileren.

## Projectstructuur

```
├── backend/
│   └── src/
│       ├── controllers/   # HTTP-laag
│       ├── business/      # modellen en services
│       ├── data/          # SQL-queries met mysql2
│       ├── util/          # databaseverbinding en foutafhandeling
│       ├── config.ts      # configuratie uit .env
│       └── server.ts      # routes en startpunt
├── frontend/
│   ├── src/               # TypeScript per pagina
│   ├── style/             # CSS per pagina
│   ├── img/
│   └── *.html             # pagina's
├── docs/database/         # ERD en schema.sql
└── .github/workflows/     # CI voor backend en frontend
```

## Bekende beperkingen

- De backend geeft bij het inloggen een JWT terug, maar controleert die niet bij andere requests. Rollen worden in de frontend gecontroleerd met gegevens uit `localStorage`.
- De betaalpagina is een simulatie zonder echte betaalprovider en gebruikt een vaste demo-artiest. Er is nog geen pagina om artiesten te zoeken.
- De beheerpagina voor contactberichten toont nog voorbeelddata. De functies om berichten op te halen (`sendContactGetRequest.ts`) en de status bij te werken (`contactUpdate.ts`) zijn nog niet aan de pagina gekoppeld.
- Foutmeldingen van de API hebben nog geen vast formaat: sommige endpoints sturen `{ "error": "..." }`, andere alleen een tekst.
- Er zijn nog geen geautomatiseerde tests.
- De naamgeving mengt nog Nederlands en Engels (bijvoorbeeld `registratie.ts` naast `signin.html`, en Nederlandse naast Engelse foutmeldingen). Bij de volgende refactor wordt dit gelijkgetrokken.
