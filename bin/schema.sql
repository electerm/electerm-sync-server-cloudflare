CREATE TABLE IF NOT EXISTS sync_data (
  id TEXT PRIMARY KEY,
  data TEXT,
  meta TEXT,
  version TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);