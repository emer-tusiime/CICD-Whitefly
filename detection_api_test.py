"""
Simple Test Detection API Server
This is a mock server for testing the whitefly detection upload functionality.
It returns dummy detection results without running actual ML inference.

Run this with: python detection_api_test.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/post_single_file/', methods=['POST'])
def post_single_file():
    """Handle single file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Generate random detections (mock data)
    num_detections = random.randint(3, 15)
    detections = []
    
    for i in range(num_detections):
        detection = {
            str(i): {
                'xmin': random.randint(50, 400),
                'ymin': random.randint(50, 400),
                'xmax': random.randint(450, 800),
                'ymax': random.randint(450, 800)
            }
        }
        detections.append(detection)
    
    response = [
        {
            'result': detections
        }
    ]
    
    return jsonify(response)

@app.route('/multi_file_async/', methods=['POST'])
def multi_file_async():
    """Handle multiple file uploads"""
    files = request.files.getlist('files')
    
    if not files:
        return jsonify({'error': 'No files provided'}), 400
    
    # Generate random detections (mock data)
    num_detections = random.randint(5, 20)
    detections = []
    
    for i in range(num_detections):
        detection = {
            str(i): {
                'xmin': random.randint(50, 400),
                'ymin': random.randint(50, 400),
                'xmax': random.randint(450, 800),
                'ymax': random.randint(450, 800)
            }
        }
        detections.append(detection)
    
    response = [
        {
            'result': detections
        }
    ]
    
    return jsonify(response)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Test Detection API is running'
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🧪 TEST DETECTION API SERVER")
    print("=" * 60)
    print("This is a MOCK server for testing purposes only.")
    print("It returns random detection coordinates without ML inference.")
    print("")
    print("Server running on: http://localhost:5000")
    print("Endpoints:")
    print("  - POST /post_single_file/")
    print("  - POST /multi_file_async/")
    print("  - GET  /health")
    print("=" * 60)
    print("")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
