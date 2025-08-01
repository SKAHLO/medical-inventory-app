-- Create items table with full schema
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INT DEFAULT 0,
  min_stock INT DEFAULT 0,
  price DECIMAL(10,2),
  unit VARCHAR(50),
  supplier VARCHAR(255),
  location VARCHAR(255),
  batch_number VARCHAR(100),
  expiry_date DATE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  rating DECIMAL(2,1),
  products_count INT DEFAULT 0,
  last_order DATE
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT,
  item_name VARCHAR(255),
  quantity INT,
  type ENUM('in', 'out') NOT NULL,
  notes TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user VARCHAR(255),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
);

-- Create categories table for dynamic category management
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('item', 'supplier') NOT NULL,
  value VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_category (type, value)
);

-- Insert mock suppliers data
INSERT INTO suppliers (name, category, phone, email, address, rating, products_count, last_order) VALUES
('PharmaCorp Ltd', 'Pharmaceuticals', '+1 (555) 123-4567', 'orders@pharmacorp.com', '123 Medical Plaza, Healthcare City, HC 12345', 4.8, 45, '2024-01-10'),
('MediSupply Co', 'General Medical', '+1 (555) 234-5678', 'supply@medisupply.com', '456 Supply Street, Medical District, MD 23456', 4.6, 32, '2024-01-08'),
('HealthPlus Distributors', 'Supplements', '+1 (555) 345-6789', 'info@healthplus.com', '789 Wellness Ave, Vitamin Valley, VV 34567', 4.7, 28, '2024-01-12'),
('MedEquip Solutions', 'Medical Equipment', '+1 (555) 456-7890', 'sales@medequip.com', '321 Equipment Blvd, Tech Town, TT 45678', 4.9, 67, '2024-01-09'),
('TechMed Instruments', 'Medical Devices', '+1 (555) 567-8901', 'orders@techmed.com', '654 Innovation Drive, Device City, DC 56789', 4.5, 23, '2024-01-11');

-- Insert mock items data
INSERT INTO items (name, description, category, quantity, min_stock, price, unit, supplier, location, batch_number, expiry_date, last_updated) VALUES
('Amoxicillin 500mg', 'Broad-spectrum antibiotic capsules', 'Antibiotics', 150, 50, 0.75, 'capsules', 'PharmaCorp Ltd', 'Shelf A-1', 'AMX2024001', '2025-06-15', '2024-01-15 10:30:00'),
('Ibuprofen 400mg', 'Anti-inflammatory pain relief tablets', 'Pain Relief', 25, 30, 0.45, 'tablets', 'MediSupply Co', 'Shelf B-2', 'IBU2024002', '2025-08-20', '2024-01-14 14:20:00'),
('Vitamin D3 1000IU', 'Vitamin D3 supplement capsules', 'Vitamins', 200, 40, 0.25, 'capsules', 'HealthPlus Distributors', 'Shelf C-1', 'VD32024003', '2026-03-10', '2024-01-13 09:15:00'),
('Sterile Gauze Pads', '4x4 inch sterile gauze pads', 'First Aid', 5, 20, 1.20, 'pieces', 'MedEquip Solutions', 'Cabinet D-3', 'GAU2024004', '2027-01-30', '2024-01-12 16:45:00'),
('Digital Thermometer', 'Digital oral/rectal thermometer', 'Equipment', 12, 5, 15.99, 'pieces', 'TechMed Instruments', 'Cabinet E-1', 'THERM2024005', NULL, '2024-01-11 11:30:00'),
('Paracetamol 500mg', 'Pain relief and fever reducer tablets', 'Pain Relief', 0, 25, 0.35, 'tablets', 'PharmaCorp Ltd', 'Shelf B-1', 'PARA2024006', '2025-09-15', '2024-01-10 13:20:00');

-- Insert mock transactions data
INSERT INTO transactions (item_id, item_name, quantity, type, notes, date, user) VALUES
(1, 'Amoxicillin 500mg', 50, 'in', 'Monthly restock from PharmaCorp', '2024-01-15 10:30:00', 'Dr. Sarah Johnson'),
(2, 'Ibuprofen 400mg', 10, 'out', 'Dispensed to patient #12345', '2024-01-14 14:20:00', 'Nurse Mike Chen'),
(4, 'Sterile Gauze Pads', 15, 'out', 'Used in emergency room', '2024-01-13 16:45:00', 'Dr. Emily Rodriguez'),
(3, 'Vitamin D3 1000IU', 100, 'in', 'New shipment received', '2024-01-13 09:15:00', 'Pharmacy Tech Alex Kim'),
(6, 'Paracetamol 500mg', 25, 'out', 'Last stock dispensed - urgent reorder needed', '2024-01-10 13:20:00', 'Dr. Sarah Johnson');

-- Insert default item categories
INSERT INTO categories (type, value) VALUES
('item', 'Antibiotics'),
('item', 'Pain Relief'),
('item', 'Vitamins'),
('item', 'First Aid'),
('item', 'Equipment'),
('item', 'Surgical Supplies'),
('item', 'Diagnostics'),
('item', 'Emergency Medicine'),
('item', 'Wound Care'),
('item', 'Respiratory');

-- Insert default supplier categories
INSERT INTO categories (type, value) VALUES
('supplier', 'Pharmaceuticals'),
('supplier', 'General Medical'),
('supplier', 'Supplements'),
('supplier', 'Medical Equipment'),
('supplier', 'Medical Devices'),
('supplier', 'Surgical Instruments'),
('supplier', 'Laboratory Supplies'),
('supplier', 'Emergency Equipment'),
('supplier', 'Diagnostic Tools'),
('supplier', 'Specialty Medicine');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  level ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, password, level) VALUES 
('admin', '$2b$10$wBs0CWo5GvMyuGCPaDDZ2.p5B5hzpYgFLseCe5WPQetoONSN26t3i', 'admin');
