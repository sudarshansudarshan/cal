# Continuous Active Learning (CAL)

**Continuous Active Learning (CAL)** is a revolutionary, minimalist and scalable educational platform designed to promote cheat-free, active learning. It ensures that students genuinely engage with course material, validating their understanding and discouraging dishonest practices through AI-driven proctoring and progressive content unlocking.

---

## Features
### Core Functionalities
- **Active Participation**: Tracks student presence and activity during learning sessions.
- **Contextual Assessments**: Injects questions during video playback to validate understanding.
- **AI-Enhanced Features**:
  - AI-based proctoring to monitor activity and ensure integrity.
  - Question generation using LLMs and human validation.
- **Cheat-Free Progression**:
  - Sequential unlocking of content based on mastery.
  - Strict anti-cheating measures during assignments and exams.

### AI Proctoring Capabilities
1. **Multiple People Detection**: Ensures only one student is present and prevents external interference or help.
2. **Focus Detection**: Verifies if the student is paying attention to the screen.
3. **Background Blur Detection**: Detects software-based background replacement to ensure an authentic environment.
4. **Voice Activity Detection**: Monitors audio to ensure students are not speaking to others during study sessions. (Language agnostic.)
5. **Hand Raise Detection**: Randomly prompts students to raise their hand, ensuring they are not using a virtual camera or other deceptive tools.

---

## Installation and Setup

### Prerequisites
To set up the development environment, the following tools are required:
- **Docker**: For containerized development and deployment.
- **VSCode**: For IDE-based development and DevContainer support.
- **Git**: For version control and repository management.

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/sudarshansudarshan/cal.git
   cd cal
   ```

2. **Set Up Dev Containers**
   - Open the repository in VSCode with Docker enabled.
   - Select the relevant DevContainer configuration based on the `.devcontainer` folder.

3. **Run Backend Services by opening the Dev Containers**
   - For LMS Engine:
     ```bash
     cd backend/lms_engine
     ```
     
   - For Activity Engine:
     ```bash
     cd backend/activity_engine
     ```
     
   - For AI Engine:
     ```bash
     cd backend/ai_engine
     ```

4. **Run the Frontend**
   - Navigate to `frontend-cal` and start the React app:
     ```bash
     cd frontend-cal
     npm install
     npm run dev
     ```

---

## Repository Structure

```
.
|
├── .github/                       # GitHub-specific configuration
│   ├── ISSUE_TEMPLATE/            # Issue templates for GitHub
│   └── workflows/                 # CI/CD workflows for linting, testing, etc.
├── backend/                       # Backend systems
│   ├── ai_engine/                 # AI Engine: Handles AI-related tasks (e.g., question generation, proctoring)
│   ├── activity_engine/
│   │   ├── prisma/
│   │   │   ├── migrations/        # Contains all migrations
│   │   │   └── schema.prisma      # Contains the Prisma schema for data storage
│   │   ├── src/
│   │   │   ├── config/            # Configured to log various levels of information
│   │   │   ├── constant.ts        # Stores the URL of the LM engine
│   │   │   ├── controller/        # Contains different controllers for each API call functionality
│   │   │   ├── middleware/        # Contains Google authentication middleware responsible for verifying users
│   │   │   ├── repositories/      # Stores all repository files for database interactions
│   │   │   ├── routes/            # Contains various route files for backend API endpoints
│   │   │   ├── server.ts          # Configures and initializes the Express server
│   │   │   ├── services/          # Includes business logic services for each functionality (like course progress)
│   │   │   └── types/             # Defines TypeScript types for various elements
│   │   ├── README.md              # Doc for activity engine
│   └── lms_engine/                # Core LMS engine
│       ├── .devcontainer/         # DevContainer setup for LMS engine
│       └── core/                  # Main LMS engine code
│           ├── assessment/        # Assessment-related modules
│           ├── authentication/    # Authentication system
│           ├── course/            # Course management modules
│           ├── institution/       # Institution-related modules
│           ├── user/              # User management modules
├── docs/                          # Documentation files
├── frontend-cal/                  # Frontend system
│   ├── .vscode/                   # VSCode-specific settings for frontend development
│   ├── public/                    # Static assets for the frontend
│   └── src/                       # React source code
│       ├── assets/                # Images and static assets
│       ├── components/            # Reusable UI components
│       │   ├── proctoring-components/ # Proctoring-specific components
│       │   └── ui/                # General UI components
│       ├── hooks/                 # Custom React hooks
│       ├── lib/                   # Utility functions and libraries
│       ├── models/                # TypeScript models
│       ├── pages/                 # Page components
│       │   ├── Admins/            # Admin-specific pages
│       │   ├── Students/          # Student-specific pages
│       │   ├── home/              # Home pages
│       │   └── login/             # Login components
├── LICENSE                        # Project License
└── README.md                      # Project documentation

```

---

## Documentation
For more detailed documentation and guides, refer to the **[Wiki](https://github.com/sudarshansudarshan/cal/wiki)**.

---

## Contributions
We welcome contributions to CAL! To contribute:
1. Fork the repository.
2. Create a feature branch.
3. Push your changes and submit a pull request.

---

## License
This project is licensed under the **MIT License**. See `LICENSE` for more information.

---

For any inquiries, feedback, or suggestions, feel free to:

- Open an issue on the repository.
- Reach out to the maintainers at staff.aditya.bmv@iitrpr.ac.in or at sidrao2006@gmail.com.

