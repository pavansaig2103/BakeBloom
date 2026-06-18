CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cake_designs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  occasion VARCHAR(100) NOT NULL,
  theme VARCHAR(120) NOT NULL,
  flavor VARCHAR(120) NOT NULL,
  weight VARCHAR(60) NOT NULL,
  price_range VARCHAR(80) NOT NULL,
  reference_id VARCHAR(60) UNIQUE NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(160),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enquiries (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  cake_design_id INTEGER REFERENCES cake_designs(id),
  reference_id VARCHAR(60),
  occasion VARCHAR(100),
  theme VARCHAR(120),
  flavor VARCHAR(120),
  weight VARCHAR(60),
  budget DECIMAL(10, 2),
  required_date DATE,
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT enquiries_status_check CHECK (status IN ('New', 'Contacted', 'Confirmed', 'Cancelled'))
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id INTEGER,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
