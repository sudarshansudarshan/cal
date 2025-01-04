# Face Recognition app

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- ###Face Recognition Web Application

This is a Face Recognition Web Application built with React.js and powered by the face-api.js library. The project uses a webcam feed to detect, recognize, and compare faces in real-time.
Table of Contents

    Project Features
    Tech Stack and Dependencies
    Installation
    How to Use
    Folder Structure
    Screenshots
    Troubleshooting
    License

## Project Features

    Real-time Face Detection and Recognition.
    Overlay detection boxes on faces using a Canvas.
    Pre-defined face descriptor matching for access validation.
    Uses a Webcam feed to detect live video input.
    Models are loaded remotely from a cloud-hosted location for easy integration.

## Tech Stack and Dependencies

This project uses the following technologies and libraries:
Frontend

    React.js: UI library for building the app.
    face-api.js: Face detection and recognition library.
    React Webcam: To capture video input from the webcam.
    Tailwind CSS: For attractive styling and responsiveness.

## Dependencies

Make sure these dependencies are installed in your project:

# npm install react react-dom
# npm install face-api             # face-api.js library
# npm install react-webcam         # Webcam component
# npm install tailwindcss          # Styling

## Installation

Follow these steps to set up the project on your local machine:

    Clone the Repository

git clone https://github.com/yourusername/face-recognition-app.git
cd face-recognition-app

Install Dependencies Run the following command to install all required packages:

npm install

Set Up Models

    Download the face-api.js models and host them in a public folder (e.g., /public/models) or use a cloud-hosted model URL.
    To use cloud-hosted models, replace the model URL in your code:

    const model_url = "https://cloud-server.com/models";

Start the Development Server Run the project locally:

    npm start

    Your app will be live at http://localhost:5173.

# How to Use
    Upload the image in public folder
    Open the app in your browser.
    Allow camera access when prompted.
    A live webcam feed will display.
    The system will detect faces and compare them with a predefined face descriptor.
    The app will display messages such as:
        ✅ Access Granted: Face matches predefined data.
        ❌ Face Not Recognized: Face does not match.
        ⚠️ No Face Detected: No face is found in the feed.

# Folder Structure

The project follows a clean structure:

face-recognition-app/
│
├── public/                # Public assets
│   ├── models/            # face-api.js models
│   └── image/             # Predefined face images
│
├── src/                   # Source code
│   ├── components/        # React components
│   ├── App.js             # Main application file
│   ├── index.js           # Entry point
│   ├── FaceRecognition.js # Face recognition logic
│   └── styles/            # Tailwind CSS styles
│
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation

    Error Loading Models:
        Ensure the model files are correctly placed in the /public/models folder or hosted online.
        Check the model_url path in your code.

    Camera Not Working:
        Make sure you have allowed browser camera permissions.
        Test your webcam with another app to confirm it works.

    Canvas Not Overlapping Webcam:
        Check that both Webcam and Canvas are styled with absolute positioning inside a relative parent container.

# License

This project is licensed under the MIT License. You are free to use, modify, and distribute it.
Credits

    React Webcam for handling video input.
    face-api.js for enabling face recognition.

Feel free to improve or contribute to this project! 🚀
