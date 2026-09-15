import { neon } from '@neondatabase/serverless';
import { createTracekit } from '@tracekit/core';
const sql = neon(process.env.DATABASE_URL);
const database = {
  async execute(query, parameters) {
    return sql.query(query, parameters);
  },
};
const tracekit = createTracekit({ database, ignoredFields: ['updated_at'] });
console.log(await tracekit.events.recent());
