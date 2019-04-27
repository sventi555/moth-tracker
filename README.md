# moth-tracker
detects Romanian meter moths within a 20m radius

## Requirements

Node.JS 10.15.x, PostgreSQL 11

### Postgres setup

To set up postgres in docker, run the following command:

```
docker run \
    --name moth-tracker-pg \
    -p 5432:5432 \
    -e POSTGRES_DB=moth-tracker \
    -d postgres
```

A postgres database will be created with default user "postgres" and no password.

Next, copy the db_init.sql script into the container like so:

```
docker cp ./src/db/db_init.sql moth-tracker-pg:/docker-entrypoint-initdb.d/init.sql
```

Finally, run the init script:

```
docker exec moth-tracker-pg psql -U postgres -d moth-tracker -f /docker-entrypoint-initdb.d/init.sql
```

The .env.example comes with a connection string that will work with this configuration :)

## project setup

Make a copy of the configuration file like so:

```
cp .env.example .env
```

then edit the resulting file as necessary with your specific environment variables.

Run `yarn` or `npm install`, depending on your package manager of choice, to install dependencies.

To start the service, simply run the following:

(for yarn)
```
yarn start
```
(or for npm)
```
npm run start
```

You can then access the api at `http://localhost:3000` (unless you manually change the port in your .env).
