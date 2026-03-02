# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donor",
  "city": "New York",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": { ... }
}
```

---

#### POST /auth/login
Authenticate user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

### Food Donations

#### POST /food/donate
Create a new food donation (Protected).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "foodName": "Biryani",
  "quantity": 10,
  "unit": "servings",
  "vegetarian": "yes",
  "category": "cooked",
  "expiry": "2026-01-30T15:00:00",
  "address": "123 Restaurant Ave",
  "city": "Mumbai",
  "pincode": "400001",
  "landmark": "Near Central Park",
  "description": "Fresh chicken biryani",
  "contactPhone": "9876543210"
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Donation created successfully"
}
```

---

#### GET /food/donations
Get all available donations.

**Response:**
```json
[
  {
    "id": 1,
    "foodName": "Biryani",
    "quantity": 10,
    "unit": "servings",
    "status": "available",
    "city": "Mumbai",
    "donorName": "Rajesh Kumar"
  }
]
```

---

### NGO

#### GET /ngos/donations
Get all donations (NGO view).

**Response:**
```json
[
  {
    "id": 1,
    "foodName": "Biryani",
    "donorName": "Rajesh Kumar",
    "address": "123 Restaurant Ave",
    "phone": "9876543210",
    "status": "available"
  }
]
```

---

#### POST /ngos/claim/:donationId
Claim a donation (Protected).

**Response:**
```json
{
  "message": "Donation claimed successfully"
}
```

---

### Admin

#### GET /admin/users
Get all users (Admin only).

**Response:**
```json
[
  {
    "id": 1,
    "fullName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "donor",
    "city": "Mumbai"
  }
]
```

---

#### GET /admin/donations
Get all donations (Admin only).

**Response:**
```json
[
  {
    "id": 1,
    "foodName": "Biryani",
    "status": "available",
    "quantity": 10,
    "unit": "servings"
  }
]
```

---

#### GET /admin/stats
Get platform statistics (Admin only).

**Response:**
```json
{
  "totalUsers": 9,
  "totalDonors": 4,
  "totalNGOs": 4,
  "totalDonations": 10,
  "availableDonations": 5
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Error Response

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Rate Limiting

No rate limiting implemented in development. Production should implement:
- 100 requests per minute per IP
- 10 requests per second per user token

---

## CORS

CORS is enabled for all origins in development. Production should restrict to specific domains.
