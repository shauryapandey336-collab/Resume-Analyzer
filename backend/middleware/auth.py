from functools import wraps

from flask import request, jsonify
from bson import ObjectId

from db.connectDb import users
from utils.jwt import decode_token


# ==========================================
# JWT Authentication Middleware
# ==========================================

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        # --------------------------------------
        # Get Authorization Header
        # --------------------------------------

        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Authorization token required."
            }), 401

        # --------------------------------------
        # Check Bearer Format
        # --------------------------------------

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({
                "success": False,
                "message": "Invalid authorization format. Use Bearer <token>."
            }), 401

        token = parts[1]

        # --------------------------------------
        # Decode Token
        # --------------------------------------

        try:

            payload = decode_token(token)

            user_id = payload.get("sub")

            if not user_id:
                return jsonify({
                    "success": False,
                    "message": "Invalid token payload."
                }), 401

            # ----------------------------------
            # Get User
            # ----------------------------------

            try:
                object_id = ObjectId(user_id)
            except Exception:
                return jsonify({
                    "success": False,
                    "message": "Invalid user ID in token."
                }), 401

            current_user = users.find_one({
                "_id": object_id
            })

            if not current_user:
                return jsonify({
                    "success": False,
                    "message": "User not found."
                }), 401

            # ----------------------------------
            # Pass User To Protected Route
            # ----------------------------------

            return f(
                current_user=current_user,
                *args,
                **kwargs
            )

        except Exception as e:

            error_message = str(e).lower()

            if "expired" in error_message:
                message = "Token expired. Please login again."

            else:
                message = "Invalid token. Please login again."

            return jsonify({
                "success": False,
                "message": message
            }), 401

    return decorated