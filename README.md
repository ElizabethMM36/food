Crumps is a web application designed to reduce food waste by collecting leftover food from restaurants and selling it at a lower price to students. It provides a seamless platform for students to find and purchase surplus food while promoting sustainability on campus.

🚀 Features
🔑 User Authentication
Users can sign up with their student ID, name, email, and password.
Existing users can log in securely to access food listings.
🍱 Food Posting & Availability
Restaurants can post leftover food with details such as title, description, expiry date, location, and price.
Users can browse available food listings with images.
🔍 Search by Location
Users can search for leftover food based on their current location.
Search results display food title, description, expiry date, location, and price.
🛒 Order Placement
Users can place an order, triggering an alert notification ("Order placed successfully").
The system updates the database to reduce the food quantity accordingly.

📉 Waste Tracking
The app tracks food waste by monitoring quantity data stored in Firebase.
⏳ Automatic Deletion
Food listings are automatically deleted if they exceed 3 hours to ensure freshness.
 Tech Stack
Frontend:
React.js (for building the UI)
HTML, CSS, JavaScript (for styling & interactivity)
Backend:
Node.js & Express.js (for API handling)
Database:
Firebase Firestore (for real-time data storage)
