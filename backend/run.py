import os
from app import create_app

app = create_app()
PORT = os.getenv("PORT") or 5000

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
