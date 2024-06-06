# GreatNotesMain

## Running the project

1. **Docker**
- Populate the cognito environment variables, `DOMAIN` and ports accordingly in the `.env.template.docker` file in the `server` directory. Note that `API_PORT` and `WEB_PORT` have to be the same.
- Rename the file to `.env`.
- If you changed the ports in the `.env` file, make sure to also do the same in the `docker-compose.yml` file in the root directory.
- Run `docker compose up`

2. **Using the webpack devserver and express (recommended node version >= 20)**
- Populate the cognito environment variables, `DOMAIN` and ports accordingly in the `.env.template.webpack` file in the `server` directory. Note that `API_PORT` represents the express port and `WEB_PORT` represents the dev server port the servers the react app (they have to be different).
- Populate the database environment variables with your local database credentials (must be Postgres)
- Run a flyway migration using the scripts in the `database/scripts` directory i.e ` flyway migrate -url=jdbc:postgresql://<db_host>:<port>/<dbname> -schemas=public -user=<db_user> -password=<db_password>`
- Rename the file to `.env`.
- Navigate to the `server` folder, install the dependencies and run `npm run dev` or `npm run start`
- Navigate to the `client` folder, install the dependencies and run `npm run dev`
- You will now be able to access the app through the `WEB_PORT` on localhost.

3. **Using express (recommended node version >= 20)**
- Populate the cognito environment variables, `DOMAIN` and ports accordingly in the `.env.template.webpack` file in the `server` directory. Note that `API_PORT` and `WEB_PORT` have to be the same.
- Populate the database environment variables with your local database credentials (must be Postgres)
- Run a flyway migration using the scripts in the `database/scripts` directory i.e ` flyway migrate -url=jdbc:postgresql://<db_host>:<port>/<dbname> -schemas=public -user=<db_user> -password=<db_password>`
- Rename the file to `.env`.
- Navigate to the `client` folder, install the dependencies and run `npm run build`
- Navigate to the `server` folder, install the dependecies and run `npm run dev` or `npm run start`
- You will now be able to access the app through the `API_PORT` on localhost.



