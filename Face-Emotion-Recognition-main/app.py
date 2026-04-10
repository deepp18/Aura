from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import subprocess
import sys

app = Flask(__name__)
CORS(app)

def get_hist_data(symbol):
    stock = yf.Ticker(symbol)
    hist = stock.history(period="1y")
    hist.reset_index(inplace=True)
    hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
    return hist.to_json(orient='records')

@app.route('/get_historical_data', methods=['GET'])
def get_historical_data():
    symbol = request.args.get('symbol')
    if symbol is None:
        return jsonify({"error": "Symbol parameter is missing"}), 400
    try:
        return get_hist_data(symbol)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔥 FIXED SCAN ROUTE
@app.route('/scan', methods=['GET'])
def scan():
    try:
        result = subprocess.check_output([
            sys.executable,
            "run_webcam.py"
        ], text=True)

        emotion = result.strip().split("\n")[-1]  # get LAST line

        return jsonify({"emotion": emotion})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)