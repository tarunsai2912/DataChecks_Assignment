🚀 Features
View Blogs: Browse through all blogs on the platform.
User Authentication: Sign up, log in, and log out.
Create Blogs: Authenticated users can create blogs with images, videos, titles, and descriptions.
Edit Blogs: Users can edit their own blogs.
Bookmark & Like: Users can bookmark and like blogs they enjoy.
Download Blogs: Logged-in users can download blogs for offline access.
Share Blogs: Blogs can be shared across various platforms.
🛠 Tech Stack
Frontend: Vite + React.js
Backend: Node.js + Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Deployment: Vercel (Frontend), Render/Heroku (Backend)
🔧 Installation & Setup Instructions
Follow these steps to set up the project locally.

1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/tarunsai2912/DataChecks_Assignment.git
cd blogi
2️⃣ Backend Setup
Navigate to the server directory:
bash
Copy
Edit
cd server
Install dependencies:
bash
Copy
Edit
npm install
Create a .env file and configure environment variables:
env
Copy
Edit
PORT = 3000
SECRET = tarun
DATABASE = mongodb+srv://tarunsairayapureddi:iTqczztUddvB9geL@rirm.5iaui.mongodb.net/?retryWrites=true&w=majority&appName=rirm
Start the backend server:
bash
Copy
Edit
npm start
The server should now be running at http://localhost:5000.
3️⃣ Frontend Setup
Navigate to the client directory:
bash
Copy
Edit
cd ../client
Install dependencies:
bash
Copy
Edit
npm install
Create a .env file:
env
Copy
Edit
VITE_APP_BACKEND = https://blogi-backend.vercel.app
Start the React app:
bash
Copy
Edit
npm run dev
The app should now be running at http://localhost:5173.
4️⃣ Deploying to Vercel
Install Vercel CLI if not installed:
bash
Copy
Edit
npm install -g vercel
Login to Vercel:
bash
Copy
Edit
vercel login
Deploy the frontend:
bash
Copy
Edit
vercel
Deploy the backend (if using Vercel for backend):
bash
Copy
Edit
cd server
vercel
🖥 Demo
(https://blogi-mu.vercel.app/)

📝 License
This project is licensed under the MIT License.