-- GLOW Class on Cloudflare (D1 database `glow-class`), 2026-10-19.
-- Applied with: npx wrangler d1 migrations apply glow-class --remote --config <wrangler.jsonc>
-- See cloudflare/worker.ts for what writes each table, and why nothing here names a person.

-- Partner visits, counted per shop code, month (Laos time), event and care track. One row per
-- combination, incremented in place — the report reads a few rows, never a log of every visit.
CREATE TABLE IF NOT EXISTS visit_counts (
  code  TEXT    NOT NULL,                       -- partner shop code, e.g. VTE-01
  month TEXT    NOT NULL,                       -- yyyyMM
  event TEXT    NOT NULL CHECK (event IN ('open', 'result')),
  track TEXT    NOT NULL CHECK (track IN ('face', 'scalp', 'body', '-')),
  n     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (code, month, event, track)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS visit_counts_month ON visit_counts (month);

-- Store gift codes. `device` is a SHA-256 of the random id the app keeps on the phone (the raw
-- id is never stored). One code per device per Laos day; a shop marks it redeemed once.
CREATE TABLE IF NOT EXISTS gift_codes (
  code        TEXT NOT NULL PRIMARY KEY,
  device      TEXT NOT NULL,
  day         TEXT NOT NULL,                    -- yyyy-mm-dd, Laos time
  partner     TEXT,                             -- the shop whose link brought the reader, if any
  status      TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'redeemed')),
  issued_at   TEXT NOT NULL,                    -- ISO 8601 UTC
  redeemed_at TEXT                              -- ISO 8601 UTC
);
CREATE UNIQUE INDEX IF NOT EXISTS gift_codes_device_day ON gift_codes (device, day);

-- Short-lived counters: per-IP rate limits (one row per minute bucket), wrong-key/PIN counts
-- and lockouts. The IP is stored only as a truncated SHA-256, and every row expires; expired rows
-- are swept now and then by the Worker itself.
CREATE TABLE IF NOT EXISTS counters (
  bucket  TEXT    NOT NULL PRIMARY KEY,
  n       INTEGER NOT NULL,
  expires INTEGER NOT NULL                      -- epoch milliseconds
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS counters_expires ON counters (expires);
