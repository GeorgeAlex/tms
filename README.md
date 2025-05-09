# DotfileTms

## Requirements

⚠️ Make sure you have installed all [requirements](./docs/requirements.md)

```bash
cd dotfile-tms
make -C dev-stack certs-generate
make -C dev-stack add-hosts
make -C dev-stack start
npm install
```

## Start apps

```bash
nx serve tms-api # start & serve API
nx serve tms-app-backend # start & serve App Backend
```

Before running the frontend app make sure to run
```bash
nx codegen tms-app-frontend
```

Followed by the command to start the forntend app
```bash
nx serve tms-app-frontend
```

## Docs

Swagger docs for the TMS API are available under the `/docs` route once the service is runnnig.

## Testing

Run the unit tests across the codebase using the command
```bash
nx test <app> e.g. nx test tms-api
```

To run the e2e tests first run the tms-api app then
```bash
nx e2e tms-api-e2e
```