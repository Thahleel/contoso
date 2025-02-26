# Contoso API
## Steps for running after cloning
- Environment Variables: After cloning, create a .env file in the root directory. This file should have custom values for these variables:

````
PORT=

POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
````

- Database: The database is a postgres database which is placed in a volume using docker-compose. Run `docker compose up -d` within the directory to mount the volume. When done, run `docker compose down` to stop the container in memory. To delete the container, use `docker ps` to discover the containers ID and use `docker rm <Container_ID>`.

### Some Useful Commands

- Install npm dependencies using `npm i`

- Generate the database using `npm run db:generate`

- Push the database up using `npm run db:push`

- Seed the database using `npx run db:seed`

- Start the API using `npm start`

- Start the development environment using `npm run dev`

- Start the testing environment using `npm run test`

- View test coverage using `npm run test-coverage`