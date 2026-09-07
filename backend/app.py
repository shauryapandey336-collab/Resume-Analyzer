from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from routes.web import web


# ==========================================
# Create Flask Application
# ==========================================

app = Flask(__name__)


# ==========================================
# Configuration
# ==========================================

app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY

app.config["UPLOAD_FOLDER"] = Config.UPLOAD_FOLDER

app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH


# ==========================================
# Initialize CORS
# ==========================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    },
    allow_headers=[
        "Content-Type",
        "Authorization"
    ],
    methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ]
)


# ==========================================
# Initialize JWT Extension
# ==========================================

jwt = JWTManager(app)


# ==========================================
# Register Blueprint
# ==========================================

app.register_blueprint(
    web,
    url_prefix="/api"
)


# ==========================================
# Home Route
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "success": True,
        "message": "🚀 AI Resume Analyzer Backend Running Successfully"
    })


# ==========================================
# Health Check
# ==========================================

@app.route("/health")
def health():

    return jsonify({
        "success": True,
        "status": "Running"
    })


# ==========================================
# JWT Error Handlers
# ==========================================

@jwt.expired_token_loader
def expired_token(jwt_header, jwt_payload):

    return jsonify({
        "success": False,
        "message": "Token Expired"
    }), 401


@jwt.invalid_token_loader
def invalid_token(error):

    return jsonify({
        "success": False,
        "message": "Invalid Token"
    }), 401


@jwt.unauthorized_loader
def unauthorized(error):

    return jsonify({
        "success": False,
        "message": "Authorization Token Required"
    }), 401


# ==========================================
# 404 Handler
# ==========================================

@app.errorhandler(404)
def page_not_found(error):

    return jsonify({
        "success": False,
        "message": "Route Not Found"
    }), 404


# ==========================================
# 500 Handler
# ==========================================

@app.errorhandler(500)
def internal_server_error(error):

    return jsonify({
        "success": False,
        "message": "Internal Server Error"
    }), 500


# ==========================================
# Run Server
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )