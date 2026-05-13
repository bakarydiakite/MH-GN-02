# NaissanceChain Backend

Backend NestJS + Prisma + PostgreSQL Docker.

## Demarrage local avec Docker

1. Installer Docker Desktop puis le lancer.
2. Copier la config locale si besoin :

```bash
cp .env.example .env
```

3. Demarrer PostgreSQL dans Docker :

```bash
npm run db:up
```

4. Synchroniser le schema Prisma :

```bash
npm run db:push
```

5. Demarrer l'API :

```bash
npm start
```

API locale : `http://localhost:3000`

## Commandes utiles

```bash
npm run db:up       # demarre PostgreSQL Docker
npm run db:down     # arrete PostgreSQL Docker
npm run db:logs     # affiche les logs PostgreSQL
npm run db:push     # pousse le schema Prisma dans la DB
npm run db:studio   # ouvre Prisma Studio
npm run start:dev   # demarre Nest en watch mode
npm run dev:docker  # db:up + db:push + start:dev
```

## Configuration Docker

Le fichier `docker-compose.yml` expose PostgreSQL sur le port local `5433`.

```env
DATABASE_URL="postgresql://admin:password123@localhost:5433/naissancechain_db"
```

Si le port `5433` est deja utilise sur votre machine, changez le mapping dans `docker-compose.yml` et adaptez `DATABASE_URL`.

## Compte administrateur

Une fois l'API et le frontend demarres, creer le premier administrateur depuis :

```text
http://localhost:5173/admin/register
```

La creation publique d'un administrateur est automatiquement bloquee apres le premier compte `ADMINISTRATEUR`.
