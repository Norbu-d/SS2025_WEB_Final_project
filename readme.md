# Frontend Instagram

- To run the frontend please "***cd frontend***" and run "***npm run dev***" to run the instagram fontend website.
- This project is implemented using ***react, vite, shadCN UI, lucide-react, react-router-dom*** in this project

## pages in frontend

- login page (/login)
- signup page (/signup)
- home page (/)
- reels page (/reels)

### login page -> (/login)

 - It features a responsive split layout: the left shows the image like the real instagram , while the right presents a login form with email/password inputs, styled icons, and buttons. A "Create new account" button uses React Router's `useNavigate` to redirect users. The bottom includes a footer with helpful links.  
- This component is imported into `pages/loginPage.tsx`, which is then used in `App.tsx`.

### signup page -> (/signup)

- This React component renders a styled Instagram-like signup form. It includes input fields for mobile/email, full name, username, password, and a date picker for the user's birthday. 
- Icons are used for visual context beside inputs from lucide react. 
- The form displays informational text about policies and offers navigation to the login page. The layout is responsive with a dark theme.
-  It ends with a footer containing common links and copyright info..

### Home Page -> (/)


- *LeftSidebar*: Provides a vertical navigation menu with icons for Home, Search, Explore, Reels, Messages, Notifications, Create, Profile, and More.
- *MiddleContent*: Displays user stories in a horizontal scroll area and a feed with posts, each featuring avatars, images, captions, and interaction buttons (like, comment, share, save).
- *RightSidebar*: Shows the current user profile, followed by suggested accounts and useful links in the footer.

These components are imported in homePage.tsx and imported via app.tsx.

### Reels Page -> (/reels)

- The `ReelsPage.tsx` componenent is a vertically scrollable Instagram-style Reels feed, displaying short video posts with user info, likes, comments, and action buttons.
 - It imports and uses a reusable `LeftSidebar` component for navigation, which includes icons and links such as Home, Search, Explore, and Reels. 
-  Each reel in the feed showcases a thumbnail, user caption, and interactive buttons.  
 - This `ReelsPage` is integrated into the main application through `App.tsx`, ensuring consistent layout across routes.

# Backend Instagram

- For the Backends the api routes are given in the images folder as it got tested 
screenshots are saved there

- For the Backend only 5 routes/endpoint works that are `register,login,update profile,update password,look user porfile`

### `/api/auth/register`  -> in frontend it would mean signup


### `/api/auth/login`  -> in frontend it would mean login

This module handles user registration, login, and token verification using Express.js and JWT. In `authController.js`, the `register` function validates inputs, checks for existing users, creates a new user, and returns a JWT token with user data. If a duplicate email or username exists, specific error messages are returned.

The `login` function validates credentials, checks the user’s email, and verifies the password before issuing a JWT token upon success. Both `register` and `login` provide structured error responses for invalid fields or server issues.

The `verifyToken` function is a protected route that returns user details after token authentication, relying on middleware to decode the token and extract user info.

The router (`routes/auth.js`) wires up the endpoints `/register` and `/login`, applying custom validation middleware for each. This ensures secure, well-validated user authentication flows, ready for integration with the frontend. Error handling, token management, and user lookup are all handled asynchronously and robustly.

---

©️ 2025 Norbu Dhendup. All rights reserved. 

### **Authentication Routes**

### **Register User**

- **Method**: **`POST`**
- **URL**: **`http://localhost:5000/api/auth/register`**
- **Body (JSON)**:CopyDownload
    
    json
    
    ```
    {
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123",
      "full_name": "Test User"
    }
    ```
    

### **Login User**

- **Method**: **`POST`**
- **URL**: **`http://localhost:5000/api/auth/login`**
- **Body (JSON)**:CopyDownload
    
    json
    
    ```
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
    
- **Response**: Returns a JWT token (use this for authenticated routes).

---

### **2. User Routes *(Require JWT in `Authorization` Header)***

### **Get User Profile**

- **Method**: **`GET`**
- **URL**: **`http://localhost:5000/api/users/:id`**
    
    *(Replace **`:id`** with the user's ID)*
    
- **Headers**:CopyDownload
    
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
    

### **Update Profile**

- **Method**: **`PUT`**
- **URL**: **`http://localhost:5000/api/profile`**
- **Headers**:CopyDownload
    
    ```
    Authorization: Bearer <JWT_TOKEN>
    Content-Type: application/json
    ```
    
- **Body (JSON)**:CopyDownload
    
    json
    
    ```
    {
      "full_name": "Updated Name",
      "bio": "New bio here"
    }
    ```
    

### **Update Profile Picture**

- **Method**: **`PUT`**
- **URL**: **`http://localhost:5000/api/profile/picture`**
- **Headers**:CopyDownload
    
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
    
- **Body**: **`form-data`** with key **`profile_picture`** (upload an image file).

### **Change Password**

- **Method**: **`PUT`**
- **URL**: **`http://localhost:5000/api/password`**
- **Headers**:CopyDownload
    
    ```
    Authorization: Bearer <JWT_TOKEN>
    Content-Type: application/json
    ```
    
- **Body (JSON)**:CopyDownload
    
    json
    
    ```
    {
      "currentPassword": "oldpassword123",
      "newPassword": "newpassword456"
    }
    ```
    

---

### **3. Post Routes *(Require JWT)***

### **Create Post**

- **Method**: **`POST`**
- **URL**: **`http://localhost:5000/api/posts`**
- **Headers**:CopyDownload
    
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
    
- **Body**: **`form-data`** with:
    - **`image`** (file upload)
    - **`caption`** (optional text)

### **Get All Posts (Feed)**

- **Method**: **`GET`**
- **URL**: **`http://localhost:5000/api/posts`**

### **Get Single Post**

- **Method**: **`GET`**
- **URL**: **`http://localhost:5000/api/posts/:postId`**
    
    *(Replace **`:postId`** with the post's ID)*
    

### **Delete Post**

- **Method**: **`DELETE`**
- **URL**: **`http://localhost:5000/api/posts/:postId`**

### **Get User's Posts**

- **Method**: **`GET`**
- **URL**: **`http://localhost:5000/api/posts/users/:userId/posts`**
    
    *(Replace **`:userId`** with the user's ID)*
    

---

### **4. Health Check**

- **Method**: **`GET`**
- **URL**: **`http://localhost:5000/api/health`**
    
    *(Should return **`{"status":"healthy"}`**)*
    

---

### **Postman Setup Guide**

1. **Create a Collection** (e.g., "Instagram Clone API").
2. **Add Environment Variables**:
    - **`base_url`**: **`http://localhost:5000/api`**
    - **`token`** (save the JWT after login).
3. **Use Auth Token**:
    - After login, save the token in the environment.
    - For authenticated routes, add:CopyDownload
        
        ```
        Authorization: Bearer {{token}}
        ```
        

# Like

### **1. Like a Post**

**Endpoint:**

Copy

Download

```
POST /api/posts/:postId/like
```

**Headers:**

Copy

Download

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`postId`** (e.g., **`1`**)

**Successful Response (201):**

json

Copy

Download

```
{
  "success": true,
  "data": {
    "id": 5,
    "user_id": 3,
    "post_id": 1,
    "user": {
      "id": 3,
      "username": "john_doe",
      "profile_picture": "/uploads/profile.jpg"
    }
  }
}
```

**Error Cases:**

- Already liked (400):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Post already liked" }
    ```
    
- Post not found (404):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Post not found" }
    ```
    

---

### **2. Unlike a Post**

**Endpoint:**

Copy

Download

```
DELETE /api/posts/:postId/like
```

**Headers:**

Copy

Download

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`postId`** (e.g., **`1`**)

**Successful Response (200):**

json

Copy

Download

```
{
  "success": true,
  "message": "Post unliked successfully",
  "data": { "postId": 1 }
}
```

**Error Cases:**

- Like not found (404):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Like not found" }
    ```
    

---

### **3. Get Post Likes**

**Endpoint:**

Copy

Download

```
GET /api/posts/:postId/likes
```

**Headers:**

Copy

Download

```
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`postId`** (e.g., **`1`**)

**Successful Response (200):**

json

Copy

Download

```
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 5,
      "user_id": 3,
      "post_id": 1,
      "user": {
        "id": 3,
        "username": "john_doe",
        "profile_picture": "/uploads/profile.jpg"
      }
    },
    {
      "id": 8,
      "user_id": 7,
      "post_id": 1,
      "user": {
        "id": 7,
        "username": "jane_smith",
        "profile_picture": "/uploads/jane.jpg"
      }
    }
  ]
}
```

**Error Case:**

- Post not found (404):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Post not found" }
    ```
    

# Comments

### **1. Create a Comment**

**Endpoint:**

Copy

Download

```
POST /api/posts/:postId/comments
```

**Headers:**

Copy

Download

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (JSON):**

json

Copy

Download

```
{
  "content": "This is a great post!"
}
```

**Successful Response (201):**

json

Copy

Download

```
{
  "success": true,
  "data": {
    "id": 5,
    "content": "This is a great post!",
    "user_id": 3,
    "post_id": 7,
    "created_at": "2023-05-15T10:00:00Z",
    "user": {
      "username": "john_doe",
      "profile_picture": "/uploads/profile.jpg"
    }
  }
}
```

**Error Cases:**

- Missing content (400):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Comment content is required" }
    ```
    
- Post not found (404):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Post not found" }
    ```
    

---

### **2. Get All Comments for a Post**

**Endpoint:**

Copy

Download

```
GET /api/posts/:postId/comments
```

**Headers:**

Copy

Download

```
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`postId`** (e.g., **`7`**)

**Successful Response (200):**

json

Copy

Download

```
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 5,
      "content": "Nice post!",
      "created_at": "2023-05-15T10:00:00Z",
      "user": {
        "username": "jane_smith",
        "profile_picture": "/uploads/jane.jpg"
      }
    },
    {
      "id": 3,
      "content": "I agree!",
      "created_at": "2023-05-14T09:30:00Z",
      "user": {
        "username": "mike_jones",
        "profile_picture": "/uploads/mike.jpg"
      }
    }
  ]
}
```

**Error Case:**

- Post not found (404):CopyDownload
    
    json
    
    ```
    { "success": false, "message": "Post not found" }
    ```
    

---

### **3. Delete a Comment**

**Endpoint:**

Copy

Download

```
DELETE /api/comments/:commentId
```

**Headers:**

Copy

Download

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`commentId`** (e.g., **`5`**)

**Successful Response (200):**

json

Copy

Download

```
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

# Follow and unfollow

### **1. Follow a User**

**Endpoint:**

Copy

Download

```
POST /api/follow/user/:userId
```

**Headers:**

Copy

Download

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`userId`** (ID of user to follow, e.g., **`2`**)

**Successful Response (201):**

json

Copy

Download

```
{
  "success": true,
  "message": "Successfully followed user",
  "data": {
    "id": 1,
    "follower_id": 1,
    "following_id": 2,
    "following": {
      "id": 2,
      "username": "user2",
      "profile_picture": "/uploads/user2.jpg"
    }
  }
}
```

### **2. Unfollow a User (Updated)**

**Endpoint:**

Copy

Download

```
DELETE /api/follow/user/:userId
```

**Headers:**

Copy

Download

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**

- **Params:**
    - **`userId`** (same ID used in follow)

---

### **Why This Is Better**

1. **RESTful Design**
    - **`/follow/user/:id`** clearly indicates we're acting on a user resource
    - More intuitive than a generic POST with ID in body
2. **Consistency**
    - Matches the structure of your existing unfollow endpoint
    - No need to parse request bodies - ID is in URL
3. **Security**
    - Still requires authentication via JWT
    - Prevents self-follows through server validation
4. **Postman Testing**CopyDownload
    
    ```
    POST /api/follow/user/2   # Follow user 2
    DELETE /api/follow/user/2 # Unfollow user 2
    ```
    

### **Required Controller Update**

javascript

Copy

Download

```
// Updated followUser controller
exports.followUser = async (req, res) => {
  try {
    const followingId = parseInt(req.params.userId); // Now from URL params
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself"
      });
    }

    // ... rest of the existing logic ...
  }
};
```
