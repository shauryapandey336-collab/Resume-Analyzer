from functools import wraps
from flask import jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)
from bson import ObjectId

from db.connectDb import users


def token_required(func):

    @wraps(func)
    def wrapper(*args, **kwargs):

        try:

            verify_jwt_in_request()

            user_id = get_jwt_identity()

            user = users.find_one({
                "_id": ObjectId(user_id)
            })

            if not user:

                return jsonify({
                    "success": False,
                    "message": "User not found"
                }), 404

            return func(user, *args, **kwargs)

        except Exception as e:

            return jsonify({
                "success": False,
                "message": "Unauthorized",
                "error": str(e)
            }), 401

    return wrapper