# easyPagarEnterpriseApi

# 🧠 HRMS Backend – Human Resource Management System

This is the backend of a full-featured Human Resource Management System (HRMS), built with **Express.js**, using **MongoDB** as the primary database, **Kafka** for message queuing, and **Redis** for caching. The system supports dynamic shift management, attendance, employee roles, organizational hierarchy, and more.

---

## ⚙️ Tech Stack

- **Runtime**: Node.js (Express.js)
- **Database**: MongoDB
- **Cache**: Redis
- **Message Broker**: Apache Kafka + Zookeeper
- **Authentication**: JWT-based (with role support)
- **Validation**: Celebrate + Joi
- **API Docs**: Postman Collection
- **Containerization**: Docker (Kafka, Zookeeper, Redis)

---

## 📁 Folder Structure

- `__test__/` - Contains unit tests for various modules.
- `assets/` - Stores static assets like language JSON files.
- `config/` - Configuration files for AWS, Firebase, MongoDB, Redis, etc.
- `controllers/` - Contains controllers for various modules like `auth`, `attendance`, `branch`, etc.
- `grpc/` - gRPC-related files.
- `helper/` - Helper functions and utilities.
- `log/` - Log files for error tracking.
- `models/` - Mongoose models for MongoDB collections.
- `routes/` - API route definitions.
- `utils/` - Utility functions and shared logic.
- `rotes/` - All the routes

---

## 🧪 Main Features / Modules

| Module        | Description                                                                |
|---------------|----------------------------------------------------------------------------|
| `auth`        | User signup, login, JWT auth, profile update                               |
| `roles`       | Role-based access (admin, HR, etc.)                                        |
| `shift`       | Shift management                                                           |
| `groupShift`  | Group of shifts (supports dynamic multiple shifts)                         |
| `attendance`  | Shift-based attendance, Kafka-based message processing                     |
| `branch`      | Organizational branches                                                    |
| `department`  | Departments inside branches                                                |
| `designation` | Job titles                                                                 |
| `assignment`  | One-time assignment of (branch, department, designation) to generate unique role mapping `_id` for user |
| `organization`| Organization-level master data                                             |
| `client`      | Clients and client branches                                                |
| `holidays`    | Manage organizational holidays                                             |
| `leave`       | Leave management for employees                                             |
| `leavePolicy` | Define and manage leave policies                                           |
| `assets`      | Language management for multi-language support                             |

---

## 🔑 Authentication

- JWT-based access tokens
- Roles are checked per route
- Add middleware for role-based checks where needed

---

## 📦 Environment Variables (`.env`)

```env
PORT=8050
MONGO_PORT=27017
MONGO_URI=mongodb://localhost
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKER=localhost:9092
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
FIREBASE_API_KEY=your_firebase_api_key
```

---

## 📜 API Documentation

- Import the Postman collection from `https://easypagarenterprise.postman.co/workspace/easyPagarEnterprise~792af02f-8f84-4d3a-80e8-4663ef1d28f3/collection/36534635-72285b7b-52c0-4e4f-ae26-b9cc4def9bcf?action=share&creator=36534635&active-environment=36534635-1f764722-7abc-45d6-9ea4-45c46acac706` to explore the available APIs.

---

## 🧪 Testing

Run the following command to execute unit tests:

```bash
npm test
```

---

## 📬 Kafka Topics

All Kafka logic is handled in `/utils/kafka/kafka.js`. The following topics are used:

- `user-logs`: Logs user-related activities.
- `user-update`: Handles updates to user profiles and roles.
- `attendance-update`: Processes attendance-related updates.

Tasks for each topic are managed in `/utils/taskHandler.js`.

---

## 🛠️ Docker Services

Docker is used to spin up supporting services like Kafka, Zookeeper, and Redis. To start the services, run:

```bash
docker compose up -d
```

---

## 📝 Logging

- Error logs are stored in the `log` folder, with filenames based on the date (e.g., `results-YYYY-MM-DD.log`).
- Ensure the `log` folder has write permissions.

---

