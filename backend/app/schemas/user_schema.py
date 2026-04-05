"""Simple validation helpers — replaces marshmallow schemas."""
import re

def validate_email(email):
    if not email or not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        return "Please provide a valid email address."
    return None

def validate_register(data):
    errors = {}
    if not data.get("name") or len(data["name"].strip()) < 2:
        errors["name"] = "Name must be at least 2 characters."
    email_err = validate_email(data.get("email"))
    if email_err:
        errors["email"] = email_err
    pwd = data.get("password", "")
    if len(pwd) < 6:
        errors["password"] = "Password must be at least 6 characters."
    role = data.get("role", "traveller")
    if role not in ("traveller", "scientist"):
        errors["role"] = "Role must be 'traveller' or 'scientist'."
    return errors

def validate_login(data):
    errors = {}
    email_err = validate_email(data.get("email"))
    if email_err:
        errors["email"] = email_err
    if not data.get("password"):
        errors["password"] = "Password is required."
    return errors

def validate_profile_update(data):
    errors = {}
    if "name" in data and len(str(data["name"]).strip()) < 2:
        errors["name"] = "Name must be at least 2 characters."
    return errors
