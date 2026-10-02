ALTER TABLE submissions
  ADD COLUMN invoice_name text NOT NULL DEFAULT '',
  ADD COLUMN invoice_path text NOT NULL DEFAULT '';
