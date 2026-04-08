import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "OceanPulse API is Running!"

def fetch_noaa_sea_level():
    """Fetches Sea Level data from NOAA CO-OPS API (The Battery, NY)"""
    url = (
        "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"
        "?begin_date=20140101&end_date=20241231&station=8518750"
        "&product=monthly_mean&datum=MLLW&time_zone=gmt&units=metric&format=json"
    )
    try:
        res = requests.get(url, timeout=10)
        data = res.json().get('data', [])
        
        labels = []
        values = []
        
        for entry in data:
            if int(entry['month']) == 1: 
                labels.append(entry['year'])

                water_level = entry.get('value') or entry.get('mean') or entry.get('MSL') or entry.get('msl')
                
                if water_level is not None:
                    mm_value = round(float(water_level) * 1000)
                    values.append(mm_value)
        return labels, values
    except Exception as e:
        print(f"NOAA API Error: {e}")
        return [], []

def fetch_openmeteo_sst():
    """Fetches Sea Surface Temp from Open-Meteo Marine API"""
    url = (
        "https://marine-api.open-meteo.com/v1/marine"
        "?latitude=40.71&longitude=-74.01&daily=sea_surface_temperature_max"
        "&timezone=GMT&start_date=2023-01-01&end_date=2024-12-31&format=json"
    )
    try:
        res = requests.get(url, timeout=10)
        data = res.json().get('daily', {})
        
        raw_labels = data.get('time', [])
        raw_temps = data.get('sea_surface_temperature_max', [])

        labels = [raw_labels[i] for i in range(0, len(raw_labels), 60)]
        values = [raw_temps[i] for i in range(0, len(raw_temps), 60)]

        anomalies = [round(t - 15.0, 2) for t in values]
        
        return labels, values, anomalies
    except Exception as e:
        print(f"Open-Meteo API Error: {e}")
        return [], [], []

def fetch_hosted_climate_data():
    gist_url = "https://gist.githubusercontent.com/anemoia1/854e8fe4cbca8de5a06aee90e0ddedc6/raw/8670891f4dc3007db810d7a11b469c04889fbf01/climate-data.json"
    
    try:
        res = requests.get(gist_url, timeout=5)
        return res.json()
    except Exception as e:
        print(f"GitHub Gist Error: {e}")
        return {"ph": {"labels": [], "data": []}, "ohc": {"labels": [], "data": []}}

@app.route('/api/ocean-data', methods=['GET'])
def get_ocean_data():
    """Aggregates all data sources"""

    sl_labels, sl_values = fetch_noaa_sea_level()
    sst_labels, sst_values, sst_anomalies = fetch_openmeteo_sst()
    climate_data = fetch_hosted_climate_data()

    payload = {
        "seaLevel": {
            "labels": sl_labels,
            "data": sl_values
        },
        "sst": {
            "labels": sst_labels,
            "data": sst_values,
            "anomaly": sst_anomalies
        },
        "ph": climate_data.get("ph", {"labels": [], "data": []}),
        "ohc": climate_data.get("ohc", {"labels": [], "data": []})
    }

    return jsonify(payload)

if __name__ == '__main__':
    print("Multi-Source API Proxy live on http://localhost:5000")
    app.run(port=5000, debug=True)