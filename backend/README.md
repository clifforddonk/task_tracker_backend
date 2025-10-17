# Task Tracker API Documentation

This document provides a comprehensive overview of the Task Tracker API, detailing the available endpoints for authentication, task management, and activity logging.

## **Authentication API**

The Authentication API handles user registration, login, and profile management.

### **User Signup**

  * **Endpoint:** `POST /auth/signup/`
  * **Description:** Registers a new user.
  * **Permissions:** AllowAny
  * **Request Body:**
      * `email` (string, required): The user's email address.
      * `username` (string, required): The user's username.
      * `password` (string, required): The user's password.
      * `role` (string, optional): The user's role ('admin' or 'staff'). Defaults to 'staff'.
  * **Success Response:**
      * **Code:** 201 CREATED
      * **Content:**
        ```json
        {
            "message": "User Created Successfully. Redirecting to Login Page",
            "data": {
                "email": "user@example.com",
                "username": "exampleuser",
                "role": "staff"
            }
        }
        ```
  * **Error Response:**
      * **Code:** 400 BAD REQUEST
      * **Content:**
        ```json
        {
            "email": [
                "User with this email already exists. Try using a different email."
            ]
        }
        ```

### **User Login**

  * **Endpoint:** `POST /auth/login/`
  * **Description:** Authenticates a user and returns a JWT token pair.
  * **Permissions:** AllowAny
  * **Request Body:**
      * `email` (string, required): The user's email address.
      * `password` (string, required): The user's password.
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        {
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
  * **Error Response:**
      * **Code:** 401 UNAUTHORIZED
      * **Content:**
        ```json
        {
            "detail": "No active account found with the given credentials"
        }
        ```

### **Refresh Token**

  * **Endpoint:** `POST /auth/token/refresh/`
  * **Description:** Refreshes an expired JWT access token.
  * **Permissions:** AllowAny
  * **Request Body:**
      * `refresh` (string, required): The refresh token.
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        {
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
  * **Error Response:**
      * **Code:** 401 UNAUTHORIZED
      * **Content:**
        ```json
        {
            "detail": "Token is invalid or expired",
            "code": "token_not_valid"
        }
        ```

### **Get User Profile**

  * **Endpoint:** `GET /auth/profile/`
  * **Description:** Retrieves the profile of the currently authenticated user.
  * **Permissions:** IsAuthenticated
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        {
            "id": 1,
            "email": "user@example.com",
            "username": "exampleuser",
            "role": "staff"
        }
        ```

### **List All Users**

  * **Endpoint:** `GET /auth/users/`
  * **Description:** Retrieves a list of all users.
  * **Permissions:** IsAdmin
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        [
            {
                "id": 1,
                "email": "admin@example.com",
                "username": "adminuser",
                "role": "admin"
            },
            {
                "id": 2,
                "email": "staff@example.com",
                "username": "staffuser",
                "role": "staff"
            }
        ]
        ```

-----

## **Tasks API**

The Tasks API allows for the creation, retrieval, updating, and deletion of tasks.

### **List All Tasks**

  * **Endpoint:** `GET /tasks/`
  * **Description:** Lists all tasks. Admins can see all tasks, while staff users can only see tasks assigned to them.
  * **Permissions:** IsAuthenticated
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        [
            {
                "id": 1,
                "title": "Complete project proposal",
                "description": "Draft and finalize the proposal for the new project.",
                "assigned_user": 2,
                "assigned_user_name": "staffuser",
                "created_by": 1,
                "created_by_username": "adminuser",
                "status": "in_progress",
                "priority": "high",
                "deadline": "2025-12-31",
                "created_at": "2025-10-17T10:00:00Z",
                "updated_at": "2025-10-17T11:30:00Z"
            }
        ]
        ```

### **Create Task**

  * **Endpoint:** `POST /tasks/create/`
  * **Description:** Creates a new task.
  * **Permissions:** IsAdmin
  * **Request Body:**
      * `title` (string, required): The title of the task.
      * `description` (string, required): The description of the task.
      * `assigned_user` (integer, required): The ID of the user the task is assigned to.
      * `status` (string, optional): The status of the task ('pending', 'in\_progress', or 'completed'). Defaults to 'pending'.
      * `priority` (string, optional): The priority of the task ('low', 'medium', or 'high'). Defaults to 'medium'.
      * `deadline` (date, required): The deadline for the task.
  * **Success Response:**
      * **Code:** 201 CREATED
      * **Content:**
        ```json
        {
            "id": 2,
            "title": "New Task",
            "description": "This is a new task.",
            "assigned_user": 2,
            "assigned_user_name": "staffuser",
            "created_by": 1,
            "created_by_username": "adminuser",
            "status": "pending",
            "priority": "medium",
            "deadline": "2025-11-15",
            "created_at": "2025-10-17T14:00:00Z",
            "updated_at": "2025-10-17T14:00:00Z"
        }
        ```
  * **Error Response:**
      * **Code:** 403 FORBIDDEN
      * **Content:**
        ```json
        {
            "detail": "Only admin users can create tasks."
        }
        ```

### **Get Task Details**

  * **Endpoint:** `GET /tasks/<int:pk>/`
  * **Description:** Retrieves the details of a single task. Admins can view any task, while staff can only view tasks assigned to them.
  * **Permissions:** IsAuthenticated
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        {
            "id": 1,
            "title": "Complete project proposal",
            "description": "Draft and finalize the proposal for the new project.",
            "assigned_user": 2,
            "assigned_user_name": "staffuser",
            "created_by": 1,
            "created_by_username": "adminuser",
            "status": "in_progress",
            "priority": "high",
            "deadline": "2025-12-31",
            "created_at": "2025-10-17T10:00:00Z",
            "updated_at": "2025-10-17T11:30:00Z"
        }
        ```
  * **Error Response:**
      * **Code:** 403 FORBIDDEN
      * **Content:**
        ```json
        {
            "detail": "You do not have permission to view this task."
        }
        ```

### **Edit/Update Task**

  * **Endpoint:** `PUT /tasks/<int:pk>/edit/` or `PATCH /tasks/<int:pk>/edit/`
  * **Description:** Edits/updates a task. `PUT` is for a full update, while `PATCH` is for a partial update.
  * **Permissions:** IsAdmin
  * **Request Body (PUT):** All fields are required.
  * **Request Body (PATCH):** Only the fields to be updated are required.
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        {
            "id": 1,
            "title": "Updated project proposal",
            "description": "The proposal has been updated with the latest feedback.",
            "assigned_user": 2,
            "assigned_user_name": "staffuser",
            "created_by": 1,
            "created_by_username": "adminuser",
            "status": "completed",
            "priority": "high",
            "deadline": "2025-12-31",
            "created_at": "2025-10-17T10:00:00Z",
            "updated_at": "2025-10-17T15:00:00Z"
        }
        ```
  * **Error Response:**
      * **Code:** 403 FORBIDDEN
      * **Content:**
        ```json
        {
            "detail": "Only admin users can edit tasks."
        }
        ```

### **Delete Task**

  * **Endpoint:** `DELETE /tasks/<int:pk>/delete/`
  * **Description:** Deletes a task.
  * **Permissions:** IsAdmin
  * **Success Response:**
      * **Code:** 204 NO CONTENT
  * **Error Response:**
      * **Code:** 403 FORBIDDEN
      * **Content:**
        ```json
        {
            "detail": "You do not have permission to delete this task."
        }
        ```

### **Update Task Status**

  * **Endpoint:** `PATCH /tasks/<int:pk>/status/`
  * **Description:** Updates the status of a task. Admins can update any task, while staff can only update tasks assigned to them.
  * **Permissions:** IsAuthenticated
  * **Request Body:**
      * `status` (string, required): The new status of the task ('pending', 'in\_progress', or 'completed').
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        {
            "id": 1,
            "title": "Updated project proposal",
            "description": "The proposal has been updated with the latest feedback.",
            "assigned_user": 2,
            "assigned_user_name": "staffuser",
            "created_by": 1,
            "created_by_username": "adminuser",
            "status": "completed",
            "priority": "high",
            "deadline": "2025-12-31",
            "created_at": "2025-10-17T10:00:00Z",
            "updated_at": "2025-10-17T15:00:00Z"
        }
        ```
  * **Error Response:**
      * **Code:** 400 BAD REQUEST
      * **Content:**
        ```json
        {
            "detail": "Status field is required."
        }
        ```

-----

## **Activity API**

The Activity API provides endpoints for retrieving activity logs.

### **Get Activity Logs**

  * **Endpoint:** `GET /api/activity/`
  * **Description:** Retrieves a list of activity logs. Admins see all logs, while staff see logs for tasks assigned to them or actions they performed.
  * **Permissions:** IsAuthenticated
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:**
        ```json
        [
            {
                "id": 1,
                "user": {
                    "id": 1,
                    "email": "admin@example.com",
                    "username": "adminuser",
                    "role": "admin"
                },
                "action": "CREATED",
                "description": "Task 'Complete project proposal' created by adminuser",
                "timestamp": "2025-10-17T10:00:00Z",
                "changes": {
                    "status": "pending",
                    "priority": "medium"
                },
                "task_info": {
                    "id": 1,
                    "title": "Complete project proposal"
                }
            }
        ]
        ```

### **Get Recent Activity**

  * **Endpoint:** `GET /api/activity/recent/`
  * **Description:** Retrieves the 50 most recent activity logs.
  * **Permissions:** IsAuthenticated
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:** (Same as "Get Activity Logs," but limited to the last 50 entries)

### **Get Activity by Task**

  * **Endpoint:** `GET /api/activity/by_task/`
  * **Description:** Retrieves activity logs for a specific task.
  * **Permissions:** IsAuthenticated
  * **Query Parameters:**
      * `task_id` (integer, required): The ID of the task to filter by.
  * **Success Response:**
      * **Code:** 200 OK
      * **Content:** (Same as "Get Activity Logs," but filtered for a specific task)
  * **Error Response:**
      * **Code:** 400 BAD REQUEST
      * **Content:**
        ```json
        {
            "error": "task_id parameter is required"
        }
        ```