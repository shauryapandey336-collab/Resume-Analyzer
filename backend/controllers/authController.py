from flask import request, jsonify
from bson import ObjectId

from db.connectDb import users

from models.user_model import (
    create_user,
    user_response
)

from utils.password import (
    hash_password,
    verify_password
)

from utils.jwt import generate_token


# ==========================================
# Register
# ==========================================

def register():

    try:

        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:

            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400

        email = email.lower()

        existing_user = users.find_one({
            "email": email
        })

        if existing_user:

            return jsonify({
                "success": False,
                "message": "Email already registered."
            }), 409

        hashed_password = hash_password(password)

        user = create_user(
            name=name,
            email=email,
            password=hashed_password
        )

        result = users.insert_one(user)

        created_user = users.find_one({
            "_id": result.inserted_id
        })

        token = generate_token(
            created_user["_id"]
        )

        return jsonify({

            "success": True,

            "message": "Registration Successful",

            "token": token,

            "user": user_response(
                created_user
            )

        }), 201

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# ==========================================
# Login
# ==========================================

def login():

    try:

        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({

                "success": False,

                "message": "Email and Password are required."

            }), 400

        email = email.lower()

        user = users.find_one({

            "email": email

        })

        if not user:

            return jsonify({

                "success": False,

                "message": "Invalid Email."

            }), 404

        if not verify_password(

            password,

            user["password"]

        ):

            return jsonify({

                "success": False,

                "message": "Invalid Password."

            }), 401

        token = generate_token(

            user["_id"]

        )

        return jsonify({

            "success": True,

            "message": "Login Successful",

            "token": token,

            "user": user_response(user)

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# ==========================================
# Get Profile
# ==========================================

def get_profile(current_user):

    try:

        return jsonify({

            "success": True,

            "user": user_response(
                current_user
            )

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# ==========================================
# Edit Profile
# ==========================================

def edit_profile(current_user):

    try:

        data = request.get_json()

        update_data = {

            "name": data.get(
                "name",
                current_user["name"]
            ),

            "phone": data.get(
                "phone",
                current_user.get("phone", "")
            ),

            "github": data.get(
                "github",
                current_user.get("github", "")
            ),

            "linkedin": data.get(
                "linkedin",
                current_user.get("linkedin", "")
            )

        }

        users.update_one(

            {

                "_id": ObjectId(
                    current_user["_id"]
                )

            },

            {

                "$set": update_data

            }

        )

        updated_user = users.find_one({

            "_id": ObjectId(
                current_user["_id"]
            )

        })

        return jsonify({

            "success": True,

            "message": "Profile Updated Successfully.",

            "user": user_response(
                updated_user
            )

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500