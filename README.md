# Tracekit

Audit trails made simple for TypeScript applications.

## Workspace

- `packages/tracekit`: publishable `@tracekit/core` package.
- `apps/docs`: Astro documentation site.
- `examples/basic`: minimal Neon-backed example.
- `migrations`: direct SQL setup.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and provide `DATABASE_URL`.
3. Apply `migrations/001_create_audit_events.sql`.
4. Run `npm test`, `npm run build`, or `npm run dev:docs`.

Product scope is defined in [Tracekit_PRD.md](./Tracekit_PRD.md).
