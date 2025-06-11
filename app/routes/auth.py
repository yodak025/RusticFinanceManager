from flask import Blueprint, current_app
from flask import request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/login')
def login():
    data = request.get_json()
    
    if not data or 'username' not in data:
        return jsonify({'error': 'Username is required'}), 400
    
    user = current_app.config['DATABASE'].read_user(data['username'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    response = jsonify(user)
    response.set_cookie('username', user["name"])
    return response


@auth_bp.post('/register')
def register():
    data = request.get_json()
    
    if not data or 'username' not in data:
        return jsonify({'error': 'Username is required'}), 400
    
    # Check if user already exists
    existing_user = current_app.config['DATABASE'].read_user(data['username'])
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409
    
    # Create new user with default values
    new_user = {
        "name": data['username'],
        "localIncome": 0,
        "localExpenses": 0,
        "total": 0
    }
    
    current_app.config['DATABASE'].register_user(new_user)
    
    response = jsonify(new_user)
    response.set_cookie('username', new_user["name"])
    return response
    

@auth_bp.get('/me')
def me():
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        "localIncome": user.get("localIncome", None),
        "localExpenses": user.get("localExpenses", None), 
        "total": user.get("total", None)
    })