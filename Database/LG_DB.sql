-- Users table to store all types of users (lawyers, individuals, etc.)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- 'lawyer', 'individual', 'admin'
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lawyer profiles extending user information
CREATE TABLE lawyer_profiles (
    lawyer_id INTEGER PRIMARY KEY REFERENCES users(user_id),
    bar_license_number VARCHAR(50) UNIQUE NOT NULL,
    specialization TEXT[],
    years_of_experience INTEGER,
    firm_name VARCHAR(255),
    office_address TEXT
);

-- Legal cases table for managing case information
CREATE TABLE legal_cases (
    case_id SERIAL PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    case_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'active', 'closed', 'pending'
    filing_date DATE NOT NULL,
    closure_date DATE,
    court_name VARCHAR(255),
    judge_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case citations table for storing legal citations
CREATE TABLE case_citations (
    citation_id SERIAL PRIMARY KEY,
    citation_number VARCHAR(100) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    decision_summary TEXT,
    court VARCHAR(255) NOT NULL,
    judgment_date DATE,
    citation_text TEXT NOT NULL,
    keywords TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table for storing all legal documents
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'contract', 'evidence', 'motion', etc.
    file_path VARCHAR(512) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INTEGER REFERENCES users(user_id),
    case_id INTEGER REFERENCES legal_cases(case_id),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events table for scheduling
CREATE TABLE calendar_events (
    event_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    case_id INTEGER REFERENCES legal_cases(case_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'hearing', 'meeting', 'deadline', etc.
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location TEXT,
    reminder_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client information table
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    lawyer_id INTEGER REFERENCES lawyer_profiles(lawyer_id),
    company_name VARCHAR(255),
    industry VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Case assignments linking lawyers to cases
CREATE TABLE case_assignments (
    assignment_id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES legal_cases(case_id),
    lawyer_id INTEGER REFERENCES lawyer_profiles(lawyer_id),
    client_id INTEGER REFERENCES clients(client_id),
    role VARCHAR(100), -- 'lead', 'associate', 'consultant'
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL -- 'active', 'completed', 'transferred'
);

-- Chat history for the AI chatbot interactions
CREATE TABLE chat_history (
    chat_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    query_text TEXT NOT NULL,
    response_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback_rating INTEGER,
    feedback_text TEXT
);

-- Legal statutes and regulations
CREATE TABLE legal_statutes (
    statute_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    effective_date DATE,
    content TEXT NOT NULL,
    keywords TEXT[],
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
