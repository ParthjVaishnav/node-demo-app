import os
import socket
from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello from Flask running in Docker on AWS! 🐍"


@app.route("/health")
def health():
    return jsonify(status="ok")


@app.route("/info")
def info():
    return jsonify(
        message="Container info",
        hostname=socket.gethostname(),
        port=os.environ.get("PORT", "8080"),
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
