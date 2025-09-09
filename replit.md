# HRMS - Human Resource Management System

## Overview

HRMS is a comprehensive Human Resource Management System built with a modern full-stack architecture. The system provides complete HR functionality including employee management, attendance tracking, shift management, leave policies, organizational hierarchy, and client management. It's designed to handle complex organizational structures with support for branches, departments, designations, and role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18.3 with Vite for fast development and building
- **State Management**: Redux Toolkit for application state management
- **UI Components**: Material-UI v6 and Material Tailwind for consistent design system
- **Styling**: Tailwind CSS with custom color scheme and Poppins font family
- **Maps Integration**: React Google Maps API for location-based features
- **Form Handling**: Formik for form management and validation
- **Date Handling**: Day.js and date-fns for date operations
- **Animations**: Framer Motion for smooth UI transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with native MongoDB driver (not Mongoose)
- **Authentication**: JWT-based authentication with role-based access control
- **Validation**: Celebrate + Joi for request validation
- **File Uploads**: Express-fileupload for handling file operations
- **Caching**: Redis for session management and caching
- **Message Queue**: Apache Kafka for asynchronous processing
- **Logging**: Winston with daily log rotation
- **Rate Limiting**: Express rate limiter for API protection

### Database Design
- **Primary Database**: MongoDB for main application data
- **Collections**: Users, organizations, branches, departments, designations, shifts, attendance, leaves, holidays, roles, assignments
- **Relationships**: Reference-based relationships using ObjectIds
- **Indexing**: Strategic indexing for performance optimization

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with role validation
- **Role-Based Access**: Hierarchical permission system with modules and features
- **Multi-tenant**: Organization-based data isolation
- **Device Management**: Device token tracking for push notifications

### Key Architectural Patterns
- **Service Layer Pattern**: Separate business logic from controllers
- **Repository Pattern**: Data access abstraction layer
- **Middleware Chain**: Express middleware for request processing
- **Event-Driven**: Kafka-based messaging for attendance processing
- **Microservice Ready**: Modular structure supporting service separation

### File Structure
- **Modular Organization**: Feature-based folder structure (auth, user, attendance, etc.)
- **Separation of Concerns**: Clear separation between routes, controllers, models, and helpers
- **Configuration Management**: Environment-based configuration with dotenv
- **Asset Management**: Organized static file handling with proper paths

## External Dependencies

### Cloud Services
- **AWS Rekognition**: Facial recognition for attendance verification
- **Firebase Admin**: Push notifications and real-time features
- **Google Maps API**: Location services and geofencing

### Development Tools
- **MongoDB**: Primary database for application data
- **Redis**: Caching and session storage
- **Apache Kafka**: Message queuing for async operations
- **Zookeeper**: Kafka coordination service

### Third-Party Libraries
- **Payment Processing**: Integrated payment gateway support
- **Email Services**: SMTP configuration for notifications
- **Excel Processing**: ExcelJS for report generation and data import/export
- **PDF Generation**: jsPDF for document creation
- **Image Processing**: Sharp for image optimization
- **Geolocation**: Haversine distance calculations for attendance verification

### APIs and Integrations
- **Google Places**: Address autocomplete and validation
- **Biometric Devices**: Hardware integration for attendance systems
- **GRPC Services**: High-performance service communication
- **RESTful APIs**: Standard HTTP APIs for client communication