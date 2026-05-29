-- MumChecks Database Schema

CREATE DATABASE IF NOT EXISTS mumchecks;
USE mumchecks;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    pregnancy_week INT DEFAULT 1,
    due_date DATE NOT NULL,
    auth_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Health Logs Table
CREATE TABLE health_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    weight DECIMAL(5, 2),
    blood_pressure VARCHAR(10),
    temperature DECIMAL(4, 2),
    symptoms TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders Table
CREATE TABLE reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Health Tips Table
CREATE TABLE health_tips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(100),
    week_range VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Health Tips
INSERT INTO health_tips (title, content, category, week_range) VALUES
('First Trimester Changes', 'During weeks 1-12, your body undergoes significant changes. Expect nausea, fatigue, and breast tenderness. Rest well and stay hydrated.', 'Pregnancy', '1-12'),
('Prenatal Vitamins', 'Start taking prenatal vitamins with folic acid to support your baby development and prevent neural tube defects.', 'Nutrition', '1-40'),
('Exercise Safety', 'Moderate exercise like walking, swimming, and yoga is safe during pregnancy. Avoid high-impact activities.', 'Health', '1-40'),
('Nutrition Tips', 'Eat a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains. Avoid raw meat and unpasteurized dairy.', 'Nutrition', '1-40'),
('Sleep Position', 'After 20 weeks, avoid sleeping on your back. Sleep on your left side for better blood circulation.', 'Health', '20-40'),
('Third Trimester Preparation', 'Prepare for labor by learning about birth options, preparing your hospital bag, and taking childbirth classes.', 'Pregnancy', '28-40');

-- Create Indexes
CREATE INDEX idx_user_health ON health_logs(user_id);
CREATE INDEX idx_user_reminders ON reminders(user_id);
CREATE INDEX idx_due_date ON reminders(due_date);