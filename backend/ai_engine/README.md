# FastAPI Application

## Overview
This FastAPI application is designed to handle video transcript processing and generate questions, including analytical case study-based MCQs. The application leverages LLMs for generating high-quality, exam-level questions from transcript content.


## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables

4. Start the application:
   ```bash
   # Example production command
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

5. The front end of the application can be accessed at "127.0.0.1:8000/".
