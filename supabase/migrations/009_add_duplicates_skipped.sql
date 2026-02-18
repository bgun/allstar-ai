-- Track how many duplicate listings were skipped per run
ALTER TABLE agent_runs ADD COLUMN duplicates_skipped INTEGER DEFAULT 0;
