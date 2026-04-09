# Student Management System

A full-stack Student Management System built with **ASP.NET Core**, **SQL Server**, **JWT Authentication**, and a **React** frontend.

---

## Features

- CRUD operations for Students
- JWT Authentication & Authorization
- Global Exception Handling (Middleware)
- Serilog logging (Console + Rolling File)
- Swagger UI with Bearer token support
- Layered Architecture: Controller → Service → Repository
- EF Core with SQL Server
- React frontend with Login + Student Dashboard
- Unit Tests (xUnit + Moq)
- Docker support

---

## 🗂 Project Structure

```
StudentManagementAPI/
├── StudentManagement/           ← ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── StudentsController.cs
│   ├── Services/
│   │   ├── IStudentService.cs
│   │   ├── StudentService.cs
│   │   ├── IAuthService.cs
│   │   └── AuthService.cs
│   ├── Repositories/
│   │   ├── IStudentRepository.cs
│   │   └── StudentRepository.cs
│   ├── Models/
│   │   └── Student.cs
│   ├── DTOs/
│   │   └── StudentDtos.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Middleware/
│   │   └── ExceptionMiddleware.cs
│   ├── Migrations/
│   ├── appsettings.json
│   ├── Dockerfile
│   └── Program.cs
├── StudentManagement.Tests/     ← Unit Tests
│   └── StudentServiceTests.cs
└── StudentUI/                   ← React Frontend
    ├── src/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server (Full / Express)
- Node.js 18+ (for React UI)
- Visual Studio 2022 / VS Code

---

## Backend Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/student-management-api.git
cd student-management-api
```

### 2. Configure the database connection
Edit `StudentManagement/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=StudentManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```
> For SQL Server Express use: `Server=localhost\\SQLEXPRESS;...`

### 3. Create the database table
Open SQL Server Management Studio and run:
```sql
USE StudentManagementDB;

CREATE TABLE Students (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    Age INT NOT NULL,
    Course NVARCHAR(100) NOT NULL,
    CreatedDate DATETIME2 NOT NULL
);

CREATE UNIQUE INDEX IX_Students_Email ON Students(Email);
```

### 4. Run the API
```bash
cd StudentManagement
dotnet run --urls "http://localhost:5050"
```

### 5. Open Swagger UI
```
http://localhost:5050/swagger
```

---

## Frontend Setup (React)

### 1. Go to the UI folder
```bash
cd StudentUI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the React app
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

---

## Authentication

### Login endpoint
**POST** `/api/auth/login`

Demo credentials:
| Username | Password   | Role  |
|----------|------------|-------|
| admin    | Admin@123  | Admin |
| user     | User@123   | User  |

**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGci...",
    "expiresAt": "2024-01-01T01:00:00Z"
  }
}
```

### Using the token in Swagger
1. Click **Authorize** button (top right in Swagger UI)
2. Enter: `Bearer YOUR_TOKEN_HERE`
3. Click **Authorize**

---

## API Endpoints

| Method | Endpoint              | Description         | Auth Required |
|--------|-----------------------|---------------------|---------------|
| POST   | `/api/auth/login`     | Get JWT token       | ❌            |
| GET    | `/api/students`       | Get all students    | ✅            |
| GET    | `/api/students/{id}`  | Get student by ID   | ✅            |
| POST   | `/api/students`       | Add new student     | ✅            |
| PUT    | `/api/students/{id}`  | Update student      | ✅            |
| DELETE | `/api/students/{id}`  | Delete student      | ✅            |

---

## Running Unit Tests

```bash
cd StudentManagement.Tests
dotnet test
```

Expected output: **6 tests passing**

---

## Docker

```bash
cd StudentManagement
docker build -t student-management-api .
docker run -p 5050:80 student-management-api
```

---

## Tech Stack

| Technology | Details |
|-----------|---------|
| ASP.NET Core | .NET 10 |
| Entity Framework Core | SQL Server |
| JWT Authentication | Bearer tokens |
| Serilog | Console + File logging |
| Swagger | API documentation |
| React + Vite | Frontend UI |
| xUnit + Moq | Unit testing |
| Docker | Containerization |

---

## Built For

Zest India IT Pvt Ltd — Full Stack Developer Technical Assignment.
