# Database Schema Documentation

## Overview
FEEDLINK uses SQLite3 with a relational schema designed for food donation management.

## Tables

### 1. users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique user identifier |
| fullName | TEXT | NOT NULL | User's full name |
| email | TEXT | UNIQUE, NOT NULL | User's email (login) |
| password | TEXT | NOT NULL | Hashed password (bcrypt) |
| role | TEXT | CHECK IN ('donor', 'ngo', 'admin') | User role |
| donorType | TEXT | CHECK IN ('individual', 'restaurant', 'hotel', 'event', 'other') | Donor category |
| city | TEXT | NOT NULL | City where user operates |
| state | TEXT | State/Province |
| phone | TEXT | NOT NULL | Contact phone number |
| address | TEXT | Physical address |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_users_email` - On email column
- `idx_users_role` - On role column  
- `idx_users_city` - On city column

---

### 2. food_donations
Stores food donation listings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Donation ID |
| donor_id | INTEGER | NOT NULL, FOREIGN KEY | References users.id |
| foodName | TEXT | NOT NULL | Name of the food |
| quantity | INTEGER | CHECK > 0 | Amount being donated |
| unit | TEXT | CHECK IN ('servings', 'kg', 'liters', 'plates', 'packets', 'containers', 'boxes') | Measurement unit |
| vegetarian | TEXT | CHECK IN ('yes', 'no') | Is food vegetarian? |
| category | TEXT | CHECK IN ('cooked', 'raw', 'packaged', 'fruits', 'vegetables', 'bakery', 'other') | Food category |
| expiry | DATETIME | NOT NULL | When the food expires |
| address | TEXT | NOT NULL | Pickup location address |
| city | TEXT | NOT NULL | City of pickup |
| pincode | TEXT | NOT NULL | Postal code |
| landmark | TEXT | Nearby landmark for location |
| description | TEXT | Additional details about donation |
| image | TEXT | Path to food image |
| contactPhone | TEXT | NOT NULL | Donor's contact phone |
| status | TEXT | DEFAULT 'available', CHECK IN ('available', 'claimed', 'completed', 'expired', 'cancelled') | Donation status |
| claimed_by | INTEGER | FOREIGN KEY | User who claimed donation |
| claimed_at | DATETIME | When donation was claimed |
| completed_at | DATETIME | When donation was completed |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | When posted |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update |

**Indexes:**
- `idx_food_donor` - On donor_id column
- `idx_food_status` - On status column
- `idx_food_city` - On city column

---

## Relationships

### Users → Food Donations (One-to-Many)
```
users.id ──→ food_donations.donor_id
```
A user (donor) can make many donations.

### Users → Food Donations (Claimed by)
```
users.id ──→ food_donations.claimed_by
```
An NGO user can claim multiple donations.

---

## Data Types

### TEXT
- User names, emails, descriptions
- Food names, categories
- Addresses, landmarks
- File paths

### INTEGER
- IDs, quantities
- Foreign keys
- Numeric identifiers

### DATETIME
- Timestamps (ISO 8601 format)
- Expiry dates
- Claim/completion times

---

## Constraints

### CHECK Constraints
Ensure data integrity:

**user.role:**
```sql
CHECK(role IN ('donor', 'ngo', 'admin'))
```

**food_donation.unit:**
```sql
CHECK(unit IN ('servings', 'kg', 'liters', 'plates', 'packets', 'containers', 'boxes'))
```

**food_donation.status:**
```sql
CHECK(status IN ('available', 'claimed', 'completed', 'expired', 'cancelled'))
```

**food_donation.quantity:**
```sql
CHECK(quantity > 0)
```

---

## Indexes

### Purpose
Improve query performance on frequently searched columns.

### Current Indexes
```sql
CREATE INDEX idx_users_email ON users(email)
CREATE INDEX idx_users_role ON users(role)
CREATE INDEX idx_users_city ON users(city)
CREATE INDEX idx_food_donor ON food_donations(donor_id)
CREATE INDEX idx_food_status ON food_donations(status)
CREATE INDEX idx_food_city ON food_donations(city)
```

---

## Sample Queries

### Find all available donations in a city
```sql
SELECT * FROM food_donations
WHERE city = 'Mumbai' AND status = 'available'
ORDER BY created_at DESC;
```

### Get donor's donation history
```sql
SELECT fd.* FROM food_donations fd
WHERE fd.donor_id = 1
ORDER BY fd.created_at DESC;
```

### Get NGO's claimed donations
```sql
SELECT * FROM food_donations
WHERE claimed_by = 5 AND status IN ('claimed', 'completed');
```

### Count donations by status
```sql
SELECT status, COUNT(*) as count
FROM food_donations
GROUP BY status;
```

### Find donations expiring soon
```sql
SELECT * FROM food_donations
WHERE status = 'available' 
AND datetime(expiry) < datetime('now', '+2 hours')
ORDER BY expiry;
```

---

## Future Enhancements

### Planned Tables
- **reviews** - Food quality and pickup ratings
- **notifications** - Push/email notifications
- **donation_claims** - Claim history tracking
- **ngo_profiles** - Extended NGO information
- **admin_logs** - Audit trail of admin actions

### Optimization Opportunities
- Add composite indexes on (status, city)
- Implement soft deletes for users
- Add triggers for automatic status updates
- Implement audit logging for sensitive operations

---

## Database Maintenance

### Backup
```bash
cp database.db database.db.backup
```

### Reset (Development)
```bash
node init-database.js
```

### Data Export
Use admin dashboard or:
```sql
.headers on
.mode csv
.output data.csv
SELECT * FROM food_donations;
```

---

## Performance Considerations

- **Query Optimization**: Use indexed columns in WHERE clauses
- **Pagination**: Implement LIMIT/OFFSET for large result sets
- **Caching**: Cache frequently accessed data (top donors, popular cities)
- **Partitioning**: Consider date-based partitioning when data grows

---

## Security

- Passwords hashed with bcrypt
- SQL injection prevention via parameterized queries
- Foreign key constraints prevent orphaned records
- Status checks prevent invalid state transitions
