export type AuditAction = 'create' | 'update' | 'delete' | 'custom';
export type AuditEvent = {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorId: string | null;
  before: unknown;
  after: unknown;
  metadata: unknown;
  createdAt: Date;
};
export type Database = {
  execute<T>(sql: string, parameters: readonly unknown[]): Promise<T[]>;
};
export type RecordInput = {
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
};
export type TracekitOptions = {
  database: Database;
  ignoredFields?: readonly string[];
};
const defaults = ['password', 'password_hash', 'token', 'secret', 'api_key'];
export function sanitize(
  value: unknown,
  ignoredFields: readonly string[] = [],
): unknown {
  const ignored = new Set(
    [...defaults, ...ignoredFields].map((field) => field.toLowerCase()),
  );
  if (Array.isArray(value))
    return value.map((item) => sanitize(item, ignoredFields));
  if (value && typeof value === 'object' && !(value instanceof Date))
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !ignored.has(key.toLowerCase()))
        .map(([key, item]) => [key, sanitize(item, ignoredFields)]),
    );
  return value;
}
export function createTracekit(options: TracekitOptions) {
  const ignored = options.ignoredFields ?? [];
  return {
    async record(input: RecordInput) {
      const id = crypto.randomUUID();
      const rows = await options.database.execute<AuditEvent>(
        'INSERT INTO audit_events (id, entity_type, entity_id, action, actor_id, before_snapshot, after_snapshot, metadata) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8::jsonb) RETURNING id, entity_type AS "entityType", entity_id AS "entityId", action, actor_id AS "actorId", before_snapshot AS before, after_snapshot AS after, metadata, created_at AS "createdAt"',
        [
          id,
          input.entityType,
          input.entityId,
          input.action,
          input.actorId ?? null,
          JSON.stringify(sanitize(input.before, ignored) ?? null),
          JSON.stringify(sanitize(input.after, ignored) ?? null),
          JSON.stringify(sanitize(input.metadata, ignored) ?? null),
        ],
      );
      const event = rows[0];
      if (!event)
        throw new Error('Tracekit failed to persist the audit event.');
      return event;
    },
    events: {
      recent: (limit = 50) =>
        options.database.execute<AuditEvent>(
          'SELECT * FROM audit_events ORDER BY created_at DESC LIMIT $1',
          [limit],
        ),
      forEntity: (entityType: string, entityId: string) =>
        options.database.execute<AuditEvent>(
          'SELECT * FROM audit_events WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
          [entityType, entityId],
        ),
      byActor: (actorId: string) =>
        options.database.execute<AuditEvent>(
          'SELECT * FROM audit_events WHERE actor_id = $1 ORDER BY created_at DESC',
          [actorId],
        ),
    },
  };
}
