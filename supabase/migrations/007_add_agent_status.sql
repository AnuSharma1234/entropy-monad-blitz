-- Add status column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add index for faster active agent queries
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- Add check constraint to ensure valid status values
ALTER TABLE agents ADD CONSTRAINT check_agent_status CHECK (status IN ('active', 'inactive'));
