-- SimpleTherapy Communications Toolkit Database Setup Script
-- Execute this script to set up the complete database structure with sample data

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS client_assets CASCADE;
DROP TABLE IF EXISTS asset_language_versions CASCADE;
DROP TABLE IF EXISTS asset_templates CASCADE;
DROP TABLE IF EXISTS asset_categories CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Clients table with all the new fields
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    access_code VARCHAR(100) UNIQUE NOT NULL,
    client_id VARCHAR(100),
    client_code VARCHAR(100),
    cualinc_code VARCHAR(100),
    marquee_code VARCHAR(100),
    contact_email VARCHAR(255),
    landing_page_url TEXT,
    logo_url TEXT,
    qr_code_url TEXT,
    eligibility_language TEXT,
    active_programs TEXT[], -- Array of active programs
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Asset Categories table
CREATE TABLE asset_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    program_types TEXT[], -- Array of programs this category applies to
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Asset Templates table
CREATE TABLE asset_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES asset_categories(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- document, image, video, presentation, etc.
    file_type VARCHAR(50), -- pdf, png, mp4, pptx, etc.
    version VARCHAR(20) DEFAULT '1.0',
    description TEXT,
    download_url TEXT,
    vimeo_url TEXT, -- For video assets
    is_template BOOLEAN DEFAULT true, -- true for templates, false for client-specific
    scope VARCHAR(50) DEFAULT 'template', -- 'template' or 'client-specific'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Asset Language Versions table
CREATE TABLE asset_language_versions (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES asset_templates(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL, -- 'English', 'Spanish', etc.
    download_url TEXT,
    vimeo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_id, language)
);

-- Create Client Assets table (for tracking downloads and client-specific assets)
CREATE TABLE client_assets (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES asset_templates(id) ON DELETE CASCADE,
    customized_url TEXT, -- Client-specific customized version
    download_count INTEGER DEFAULT 0,
    last_downloaded TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, template_id)
);

-- Create indexes for better performance
CREATE INDEX idx_clients_access_code ON clients(access_code);
CREATE INDEX idx_clients_active_programs ON clients USING GIN(active_programs);
CREATE INDEX idx_asset_categories_program_types ON asset_categories USING GIN(program_types);
CREATE INDEX idx_asset_templates_category_id ON asset_templates(category_id);
CREATE INDEX idx_asset_templates_type ON asset_templates(type);
CREATE INDEX idx_asset_language_versions_template_language ON asset_language_versions(template_id, language);
CREATE INDEX idx_client_assets_client_template ON client_assets(client_id, template_id);

-- Insert sample users
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2b$10$rQ8QJ5FbT8yF2pT5F8yF2OJ5FbT8yF2pT5F8yF2OJ5FbT8yF2pT5F8', 'admin'),
('manager', '$2b$10$rQ8QJ5FbT8yF2pT5F8yF2OJ5FbT8yF2pT5F8yF2OJ5FbT8yF2pT5F8', 'manager');

-- Insert sample clients with comprehensive data
INSERT INTO clients (
    name, 
    access_code, 
    client_id, 
    client_code, 
    cualinc_code, 
    marquee_code,
    contact_email,
    landing_page_url,
    logo_url,
    qr_code_url,
    eligibility_language,
    active_programs,
    status
) VALUES
(
    'Acme Corporation',
    'ACME2024',
    'ST-001',
    'ACME-MSK-2024',
    'CUA-ACME-001',
    'MQ-ACME-2024',
    'hr@acmecorp.com',
    'https://acme-corp.com/wellness',
    'https://placehold.co/150x75/0066CC/FFFFFF?text=ACME',
    'https://placehold.co/100x100/000000/FFFFFF?text=QR',
    'Available to all full-time employees and their families',
    ARRAY['SimpleMSK', 'SimpleEAP'],
    'active'
),
(
    'TechStart Inc',
    'TECH2024',
    'ST-002',
    'TECH-WELL-2024',
    'CUA-TECH-002',
    'MQ-TECH-2024',
    'benefits@techstart.com',
    'https://techstart.com/employee-benefits',
    'https://placehold.co/150x75/FF6600/FFFFFF?text=TECHSTART',
    'https://placehold.co/100x100/000000/FFFFFF?text=QR',
    'Available to all employees after 90-day probation period',
    ARRAY['SimpleWellbeing', 'SimpleBehavioural'],
    'active'
),
(
    'Global Health Systems',
    'GHS2024',
    'ST-003',
    'GHS-ALL-2024',
    'CUA-GHS-003',
    'MQ-GHS-2024',
    'wellness@globalhealthsys.com',
    'https://globalhealthsys.com/employee-wellness',
    'https://placehold.co/150x75/009900/FFFFFF?text=GHS',
    'https://placehold.co/100x100/000000/FFFFFF?text=QR',
    'Comprehensive wellness program for all staff and dependents',
    ARRAY['SimpleMSK', 'SimpleEAP', 'SimpleWellbeing', 'SimpleBehavioural'],
    'active'
);

-- Insert asset categories for different programs
INSERT INTO asset_categories (name, slug, description, program_types, display_order) VALUES
('Intro Materials', 'intro-materials', 'Overview materials to get started with the program', ARRAY['SimpleMSK', 'SimpleWellbeing', 'SimpleBehavioural'], 1),
('Launch Campaign', 'launch-campaign', 'Essential materials to introduce the program to your organization', ARRAY['SimpleMSK', 'SimpleWellbeing', 'SimpleBehavioural'], 2),
('Ongoing Promotion', 'ongoing-promotion', 'Regularly updated materials to maintain engagement', ARRAY['SimpleMSK', 'SimpleWellbeing', 'SimpleBehavioural'], 3),
('Videos', 'videos', 'Educational and promotional video content', ARRAY['SimpleMSK', 'SimpleWellbeing', 'SimpleBehavioural'], 4),
('EAP Launch Materials', 'eap-launch', 'Employee Assistance Program introduction materials', ARRAY['SimpleEAP'], 1),
('EAP Ongoing Support', 'eap-ongoing', 'Continuous EAP engagement materials', ARRAY['SimpleEAP'], 2),
('EAP Videos', 'eap-videos', 'EAP educational video content', ARRAY['SimpleEAP'], 3),
('EAP Resources', 'eap-resources', 'Additional EAP support materials', ARRAY['SimpleEAP'], 4);

-- Insert sample asset templates
INSERT INTO asset_templates (name, category_id, type, file_type, version, description, download_url, is_template, scope) VALUES
-- SimpleMSK Assets
('MSK Welcome Brochure', 1, 'Document', 'pdf', '2.1', 'Introduction brochure for MSK program', 'https://storage.example.com/msk-welcome-brochure.pdf', true, 'template'),
('MSK Program Poster', 1, 'Image', 'png', '1.5', 'Eye-catching poster for MSK program awareness', 'https://storage.example.com/msk-poster.png', true, 'template'),
('MSK Email Template', 2, 'Email', 'html', '1.0', 'Email template for MSK program launch', 'https://storage.example.com/msk-email-template.html', true, 'template'),
('MSK Presentation Deck', 2, 'Presentation', 'pptx', '3.0', 'Comprehensive presentation for MSK program launch', 'https://storage.example.com/msk-presentation.pptx', true, 'template'),
('MSK Newsletter Insert', 3, 'Document', 'pdf', '1.2', 'Newsletter insert for ongoing MSK promotion', 'https://storage.example.com/msk-newsletter.pdf', true, 'template'),
('MSK Success Stories', 3, 'Document', 'pdf', '2.0', 'Real success stories from MSK program participants', 'https://storage.example.com/msk-success-stories.pdf', true, 'template'),
('MSK Introduction Video', 4, 'Video', 'mp4', '1.0', 'Introductory video explaining MSK benefits', null, true, 'template'),
('MSK Exercise Demo', 4, 'Video', 'mp4', '1.1', 'Demonstration of simple workplace exercises', null, true, 'template'),

-- SimpleWellbeing Assets
('Wellbeing Program Guide', 1, 'Document', 'pdf', '1.8', 'Comprehensive guide to wellbeing program', 'https://storage.example.com/wellbeing-guide.pdf', true, 'template'),
('Mindfulness Poster', 1, 'Image', 'png', '1.0', 'Mindfulness awareness poster', 'https://storage.example.com/mindfulness-poster.png', true, 'template'),
('Wellbeing Launch Kit', 2, 'Presentation', 'pptx', '2.5', 'Complete presentation kit for wellbeing program launch', 'https://storage.example.com/wellbeing-launch-kit.pptx', true, 'template'),
('Mental Health Resources', 2, 'Document', 'pdf', '1.3', 'Mental health resources and contact information', 'https://storage.example.com/mental-health-resources.pdf', true, 'template'),
('Wellness Tips Monthly', 3, 'Document', 'pdf', '4.2', 'Monthly wellness tips and challenges', 'https://storage.example.com/wellness-tips.pdf', true, 'template'),
('Stress Management Infographic', 3, 'Image', 'png', '2.0', 'Visual guide to stress management techniques', 'https://storage.example.com/stress-management.png', true, 'template'),
('Meditation Introduction', 4, 'Video', 'mp4', '1.0', 'Introduction to workplace meditation', null, true, 'template'),
('Breathing Exercises', 4, 'Video', 'mp4', '1.2', 'Guided breathing exercises for stress relief', null, true, 'template'),

-- SimpleBehavioural Assets
('Behavioral Health Overview', 1, 'Document', 'pdf', '1.5', 'Overview of behavioral health program benefits', 'https://storage.example.com/behavioral-overview.pdf', true, 'template'),
('Mental Wellness Poster', 1, 'Image', 'png', '1.1', 'Mental wellness awareness poster', 'https://storage.example.com/mental-wellness-poster.png', true, 'template'),
('Behavioral Program Launch', 2, 'Presentation', 'pptx', '2.2', 'Presentation for behavioral health program introduction', 'https://storage.example.com/behavioral-launch.pptx', true, 'template'),
('Crisis Support Resources', 2, 'Document', 'pdf', '1.7', 'Emergency mental health resources and contacts', 'https://storage.example.com/crisis-support.pdf', true, 'template'),
('Mental Health Awareness', 3, 'Document', 'pdf', '3.1', 'Mental health awareness campaign materials', 'https://storage.example.com/mental-health-awareness.pdf', true, 'template'),
('Resilience Building Tips', 3, 'Image', 'png', '1.4', 'Tips for building psychological resilience', 'https://storage.example.com/resilience-tips.png', true, 'template'),
('Understanding Anxiety', 4, 'Video', 'mp4', '1.0', 'Educational video about managing workplace anxiety', null, true, 'template'),
('Building Resilience', 4, 'Video', 'mp4', '1.3', 'Strategies for building mental resilience', null, true, 'template');

-- Insert language versions for some assets (English and Spanish)
INSERT INTO asset_language_versions (template_id, language, download_url, vimeo_url) VALUES
-- English versions
(1, 'English', 'https://storage.example.com/msk-welcome-brochure-en.pdf', null),
(2, 'English', 'https://storage.example.com/msk-poster-en.png', null),
(7, 'English', null, 'https://vimeo.com/example-msk-intro-en'),
(9, 'English', 'https://storage.example.com/wellbeing-guide-en.pdf', null),
(17, 'English', null, 'https://vimeo.com/example-meditation-intro-en'),

-- Spanish versions
(1, 'Spanish', 'https://storage.example.com/msk-welcome-brochure-es.pdf', null),
(2, 'Spanish', 'https://storage.example.com/msk-poster-es.png', null),
(7, 'Spanish', null, 'https://vimeo.com/example-msk-intro-es'),
(9, 'Spanish', 'https://storage.example.com/wellbeing-guide-es.pdf', null),
(17, 'Spanish', null, 'https://vimeo.com/example-meditation-intro-es');

-- Insert some client asset relationships (for tracking customizations and downloads)
INSERT INTO client_assets (client_id, template_id, download_count, last_downloaded) VALUES
(1, 1, 15, '2024-01-15 10:30:00'),
(1, 2, 8, '2024-01-20 14:22:00'),
(1, 3, 12, '2024-02-01 09:15:00'),
(2, 9, 6, '2024-01-25 11:45:00'),
(2, 10, 4, '2024-02-05 16:30:00'),
(3, 1, 25, '2024-02-10 08:20:00'),
(3, 9, 18, '2024-02-12 13:40:00'),
(3, 17, 22, '2024-02-15 15:10:00');

-- Create a view for easy asset querying with category information
CREATE VIEW asset_view AS
SELECT 
    at.id,
    at.name,
    at.type,
    at.file_type,
    at.version,
    at.description,
    at.download_url,
    at.vimeo_url,
    at.is_template,
    at.scope,
    ac.name as category_name,
    ac.slug as category_slug,
    ac.program_types,
    at.created_at,
    at.updated_at
FROM asset_templates at
LEFT JOIN asset_categories ac ON at.category_id = ac.id;

-- Create a view for client assets with full details
CREATE VIEW client_asset_view AS
SELECT 
    ca.id,
    ca.client_id,
    ca.template_id,
    ca.download_count,
    ca.last_downloaded,
    c.name as client_name,
    c.access_code,
    c.active_programs,
    av.name as asset_name,
    av.type as asset_type,
    av.category_name,
    av.category_slug,
    av.download_url,
    av.vimeo_url
FROM client_assets ca
LEFT JOIN clients c ON ca.client_id = c.id
LEFT JOIN asset_view av ON ca.template_id = av.id;

-- Insert some additional useful functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_categories_updated_at BEFORE UPDATE ON asset_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_templates_updated_at BEFORE UPDATE ON asset_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_assets_updated_at BEFORE UPDATE ON client_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Display summary of created data
SELECT 'Database setup complete!' as status;
SELECT 'Users created:', COUNT(*) FROM users;
SELECT 'Clients created:', COUNT(*) FROM clients;
SELECT 'Asset categories created:', COUNT(*) FROM asset_categories;
SELECT 'Asset templates created:', COUNT(*) FROM asset_templates;
SELECT 'Language versions created:', COUNT(*) FROM asset_language_versions;
SELECT 'Client asset relationships created:', COUNT(*) FROM client_assets;