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
  category VARCHAR(100) NOT NULL DEFAULT 'Birthday',
  theme VARCHAR(120) NOT NULL,
  flavor VARCHAR(120) NOT NULL,
  size VARCHAR(60) NOT NULL,
  weight VARCHAR(60) NOT NULL,
  price_range VARCHAR(80) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  availability VARCHAR(40) NOT NULL DEFAULT 'Available',
  tags TEXT,
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
  selected_design VARCHAR(180),
  reference_id VARCHAR(60),
  category VARCHAR(100),
  occasion VARCHAR(100),
  theme VARCHAR(120),
  flavor VARCHAR(120),
  size VARCHAR(60),
  weight VARCHAR(60),
  budget DECIMAL(10, 2),
  required_date DATE,
  fulfillment_type VARCHAR(30) NOT NULL DEFAULT 'Pickup',
  follow_up_date DATE,
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'New',
  priority VARCHAR(40) NOT NULL DEFAULT 'High Priority',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT enquiries_status_check CHECK (status IN ('New', 'Contacted', 'Design Shared', 'Confirmed', 'Completed', 'Cancelled'))
);

CREATE TABLE confirmed_orders (
  id SERIAL PRIMARY KEY,
  enquiry_id INTEGER REFERENCES enquiries(id),
  customer_id INTEGER REFERENCES customers(id),
  cake_design_id INTEGER REFERENCES cake_designs(id),
  selected_cake VARCHAR(180) NOT NULL,
  final_price DECIMAL(10, 2) NOT NULL,
  delivery_date DATE NOT NULL,
  fulfillment_type VARCHAR(30) NOT NULL DEFAULT 'Pickup',
  notes TEXT,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  order_status VARCHAR(30) NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payment_status_check CHECK (payment_status IN ('Pending', 'Advance Paid', 'Fully Paid')),
  CONSTRAINT order_status_check CHECK (order_status IN ('Confirmed', 'Preparing', 'Ready', 'Delivered', 'Completed', 'Cancelled'))
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
