# OceanPulse
Developed as part of Web Programming coursework (Semester 4).

OceanPulse is a data-driven dashboard that visualizes the current state of our oceans. It uses a Python (Flask) backend proxy to aggregate live API data from NOAA and Open-Meteo, rendering it dynamically via an asynchronous JavaScript frontend.

## Features
* **Live Ocean Climate Trends:** Real-time data aggregation via REST API.
* **Marine Heatwave Alert System**
* **Derived Ocean Stress Index**
* **Ethical Data Representation**

## How to Run the Project Locally

Because this project utilizes a Python backend to bypass CORS restrictions and parse live API data, it must be run on a local server.

1. **Clone the repository:**
   `git clone https://github.com/anemoia1/oceanpulse.git`
   `cd oceanpulse`

2. **Set up the Python Virtual Environment:**
   `python3 -m venv venv`
   `source venv/bin/activate`  *(On Windows: `venv\Scripts\activate`)*

3. **Install Dependencies:**
   `pip install -r requirements.txt`

4. **Start the Backend Server:**
   `python3 app.py`

5. **View the Dashboard:**
   Open a secondary terminal, navigate to the project folder, and start a local web server for the frontend:
   `python3 -m http.server 8000`
   Then, navigate to `http://localhost:8000/dashboard.html` in your browser.

## Team Contributions
* **anemoia1 (24BAI1212):** Layout, ideation, styling, API architecture
* **hagoose (24BAI1224):** JS scripts, functions, chart integrations

## Ethics & Citations
All code content is original. External data sources (NOAA CO-OPS, Open-Meteo) and images are cited within the application. This project is strictly for academic and educational purposes.
