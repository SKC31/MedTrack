-- ============================================================
--  MedTrack Database Schema
--  Run: psql -U postgres -d medtrack -f schema.sql
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120)        NOT NULL,
    email       VARCHAR(180) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    role        VARCHAR(30)         NOT NULL DEFAULT 'staff',
                -- roles: admin | staff | healthcare
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(150)  NOT NULL,
    serial_number VARCHAR(100)  UNIQUE NOT NULL,
    department    VARCHAR(100)  NOT NULL,
    location      VARCHAR(150),
    status        VARCHAR(50)   NOT NULL DEFAULT 'Operational',
                  -- Operational | Under Maintenance | Out of Service | Retired
    notes         TEXT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Maintenance records table
CREATE TABLE IF NOT EXISTS maintenance_records (
    id                SERIAL PRIMARY KEY,
    equipment_id      INTEGER      NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_type  VARCHAR(50)  NOT NULL,
                      -- Preventive | Corrective | Inspection | Calibration
    technician_name   VARCHAR(120) NOT NULL,
    scheduled_date    DATE         NOT NULL,
    completed_date    DATE,
    status            VARCHAR(30)  NOT NULL DEFAULT 'Scheduled',
                      -- Scheduled | In Progress | Completed | Overdue
    notes             TEXT,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Fault reports table
CREATE TABLE IF NOT EXISTS fault_reports (
    id            SERIAL PRIMARY KEY,
    equipment_id  INTEGER      NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    description   TEXT         NOT NULL,
    reported_by   VARCHAR(120) NOT NULL,
    severity      VARCHAR(20)  NOT NULL DEFAULT 'Medium',
                  -- Low | Medium | High | Critical
    status        VARCHAR(20)  NOT NULL DEFAULT 'Open',
                  -- Open | Resolved | Closed
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Seed: default admin account (password: Admin@1234) ──
INSERT INTO users (name, email, password, role) VALUES
  ('System Administrator', 'admin@medtrack.local',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;
