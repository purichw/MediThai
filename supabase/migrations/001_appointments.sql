-- Appointments table
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS appointments (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at        TIMESTAMPTZ DEFAULT now(),
  appointment_number TEXT        UNIQUE NOT NULL,
  first_name        TEXT        NOT NULL,
  last_name         TEXT        NOT NULL,
  phone             TEXT        NOT NULL,
  email             TEXT,
  id_number         TEXT,
  dob               DATE,
  patient_type      TEXT        DEFAULT 'new'     CHECK (patient_type IN ('new','old')),
  insurance         TEXT,
  service_type      TEXT        DEFAULT 'onsite'  CHECK (service_type IN ('onsite','virtual','second')),
  hospital          TEXT        NOT NULL,
  specialty         TEXT        NOT NULL,
  appointment_date  DATE        NOT NULL,
  appointment_time  TEXT,
  symptoms          TEXT,
  medications       TEXT,
  medical_history   TEXT,
  status            TEXT        DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  user_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS appointments_user_id_idx     ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_date_idx        ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS appointments_status_idx      ON appointments(status);
CREATE INDEX IF NOT EXISTS appointments_number_idx      ON appointments(appointment_number);

-- Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Logged-in users can view/insert their own appointments
CREATE POLICY "users_select_own" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins (service role) bypass RLS automatically
