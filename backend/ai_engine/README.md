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

3. Set up environment variables:
   - Configure API keys and other secrets in a `.env` file.

4. Start the application:
   ```bash
   # Example production command
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
