import { describe, expect, it } from 'vitest';
import { createTracekit, sanitize, type Database } from '../src/index';
describe('Tracekit', () => {
  it('removes sensitive fields recursively', () =>
    expect(
      sanitize({
        name: 'A',
        password_hash: 'x',
        nested: { token: 'y', safe: true },
      }),
    ).toEqual({ name: 'A', nested: { safe: true } }));
  it('records a sanitized event', async () => {
    let params: readonly unknown[] = [];
    const database: Database = {
      async execute<T>(_sql, parameters) {
        params = parameters;
        return [{ id: '1' }] as T[];
      },
    };
    await createTracekit({ database }).record({
      entityType: 'invoice',
      entityId: '1',
      action: 'update',
      after: { api_key: 'secret', total: 10 },
    });
    expect(params[6]).toBe('{"total":10}');
  });
});
