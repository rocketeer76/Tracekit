CREATE TABLE IF NOT EXISTS audit_events (id uuid PRIMARY KEY, entity_type text NOT NULL, entity_id text NOT NULL, action text NOT NULL CHECK (action IN ('create','update','delete','custom')), actor_id text, before_snapshot jsonb, after_snapshot jsonb, metadata jsonb, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS audit_events_entity_idx ON audit_events (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_actor_idx ON audit_events (actor_id, created_at DESC);
