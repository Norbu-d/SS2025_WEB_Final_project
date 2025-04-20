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

