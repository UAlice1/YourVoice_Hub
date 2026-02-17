-- ============================================================
-- YourVoice Hub - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS yourvoice_hub;
USE yourvoice_hub;

-- ============================================================
-- USERS TABLE
-- Stores all registered users (individuals, NGO staff, admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  uuid        VARCHAR(36)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('user', 'ngo', 'admin') NOT NULL DEFAULT 'user',
  phone       VARCHAR(20),
  location    VARCHAR(100),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- CASES TABLE
-- Secure case submissions by users
-- ============================================================
CREATE TABLE IF NOT EXISTS cases (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  uuid           VARCHAR(36)  NOT NULL UNIQUE,
  user_id        INT          NOT NULL,
  type           ENUM('mental_health', 'abuse', 'gbv', 'trauma', 'other') NOT NULL,
  description    TEXT         NOT NULL,
  status         ENUM('pending', 'reviewed', 'referred', 'closed') NOT NULL DEFAULT 'pending',
  priority       ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  is_anonymous   BOOLEAN NOT NULL DEFAULT FALSE,
  date_submitted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- MULTIMEDIA TABLE
-- Files attached to case submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS multimedia (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  uuid          VARCHAR(36)  NOT NULL UNIQUE,
  case_id       INT          NOT NULL,
  file_type     ENUM('image', 'audio', 'document', 'video') NOT NULL,
  file_name     VARCHAR(255) NOT NULL,
  file_path     VARCHAR(500) NOT NULL,
  file_size     INT,
  mime_type     VARCHAR(100),
  date_uploaded DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ============================================================
-- AI GUIDANCE LOGS TABLE
-- Stores AI chat sessions per user
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_guidance_logs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT  NOT NULL,
  session_id    VARCHAR(36) NOT NULL,
  session_text  TEXT NOT NULL,
  response_text TEXT NOT NULL,
  timestamp     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- NGO NOTIFICATIONS TABLE
-- Tracks referral notifications sent to NGOs
-- ============================================================
CREATE TABLE IF NOT EXISTS ngo_notifications (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  case_id       INT NOT NULL,
  ngo_id        INT NOT NULL,
  status        ENUM('sent', 'acknowledged', 'in_progress', 'resolved') NOT NULL DEFAULT 'sent',
  notes         TEXT,
  date_notified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- NGO ORGANIZATIONS TABLE
-- Details about registered NGO partners
-- ============================================================
CREATE TABLE IF NOT EXISTS ngo_organizations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT          NOT NULL UNIQUE,
  org_name      VARCHAR(200) NOT NULL,
  description   TEXT,
  contact_email VARCHAR(150),
  contact_phone VARCHAR(20),
  location      VARCHAR(100),
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_cases_user_id    ON cases(user_id);
CREATE INDEX idx_cases_status     ON cases(status);
CREATE INDEX idx_multimedia_case  ON multimedia(case_id);
CREATE INDEX idx_ai_logs_user     ON ai_guidance_logs(user_id);
CREATE INDEX idx_ai_logs_session  ON ai_guidance_logs(session_id);
CREATE INDEX idx_ngo_notif_case   ON ngo_notifications(case_id);
CREATE INDEX idx_ngo_notif_ngo    ON ngo_notifications(ngo_id);