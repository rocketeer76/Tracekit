# Tracekit — Product Requirements Document

**Tagline:** Audit trails made simple.

## Product Summary
Tracekit is an open-source audit-logging toolkit for TypeScript applications. It records what changed, when it changed, who changed it, and optional metadata.

## Product Form
Primary deliverable: TypeScript package published to npm.

Optional supporting deliverable: Astro + Solid documentation/demo site hosted on Netlify.

## Target Users
Developers building applications that need audit trails, change history, actor tracking, and before/after snapshots.

## Core API
```ts
await tracekit.record({
  actorId: user.id,
  entityType: "invoice",
  entityId: invoice.id,
  action: "update",
  before,
  after
})
```

## Event Fields
`id`, `entity_type`, `entity_id`, `action`, `actor_id`, `before`, `after`, `metadata`, `created_at`.

## Supported Actions
`create`, `update`, `delete`, `custom`.

## Configuration
```ts
const tracekit = createTracekit({
  database,
  ignoredFields: [
    "updated_at",
    "password_hash"
  ]
})
```

## Query API
```ts
tracekit.events.recent()
tracekit.events.forEntity("invoice", "123")
tracekit.events.byActor(user.id)
```

## Database
Use Neon Postgres with direct SQL. Provide SQL migrations or setup scripts.

## Sensitive Fields
Support default/configurable exclusion of passwords, password hashes, tokens, secrets, and API keys.

## Demo / Documentation Screens
- Landing
- Installation
- Configuration
- Audit events
- Event detail
- Query examples
- Releases
- CI status

## Package Quality Requirements
- Full TypeScript types
- Vitest test suite
- ESLint
- Prettier
- Semantic versioning
- Changelog
- GitHub Actions
- npm publishing workflow
- Clear README
- Example project

## Testing
### Vitest
Record create/update/delete events, ignore configured fields, query by entity, query by actor, metadata serialization, failure handling.

### Playwright
Only required for the optional documentation/demo site.

## Technology Baseline
Astro, SolidJS, TypeScript, Vite, Node.js, Tailwind CSS, Neon Postgres, Neon Auth where applicable, direct SQL, Zod where applicable, Vitest, Playwright, ESLint, Prettier, Sentry for docs/demo if desired, GitHub Actions, Netlify, Cloudflare DNS.

## MVP Acceptance Criteria
- Package installs.
- Audit event can be recorded.
- Before/after snapshots work.
- Ignored fields work.
- Events can be queried.
- TypeScript types are clean.
- Tests pass.
- Package can be published to npm.
- Documentation site deploys successfully if included.
