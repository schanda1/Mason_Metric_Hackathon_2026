import json
from pymongo import MongoClient
import certifi

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://schanda:WildMusicalLife6@hackathon2026.qmurlgx.mongodb.net/?appName=Hackathon2026"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())

def upload_data():
    try:
        # 2. Select your Database and Collection
        # These will be created automatically if they don't exist
        db = client['GradeData']
        collection = db['Grades']

        # 3. Load your cleaned JSON data
        # Ensure the path matches where your cleaned_grades.json is located
        print("Reading JSON file...")
        with open('./src/assets/cleaned_grades.json', 'r') as f:
            data = json.load(f)

        # 4. Upload in bulk
        print(f"Uploading {len(data)} rows to MongoDB Atlas...")
        result = collection.insert_many(data)

        print(f"Successfully uploaded {len(result.inserted_ids)} records!")
        print("You are now officially cloud-native.")

    except Exception as e:
        print(f"An error occurred during upload: {e}")

if __name__ == "__main__":
    upload_data()