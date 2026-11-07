# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.28.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Deploying on Cloudflare Pages

The Cloudflare build serves Angular as a static single-page application. Before deploying, replace the example API URL in `src/environments/environment.cloudflare.ts` with the public HTTPS URL of the FastAPI service on Render.

In Cloudflare Pages, connect the repository and configure:

- **Root directory:** `frontend`
- **Build command:** `npm run build:cloudflare`
- **Build output directory:** `dist/frontend/browser`

The `cloudflare` build configuration disables server-side rendering and uses client-side routing, which is supported by Pages' SPA fallback. Cloudflare Pages does not run Docker images; deploy FastAPI separately on Render. See the repository README for deployment steps. Set the backend `CORS_ORIGINS` to the Pages site's exact origin.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
