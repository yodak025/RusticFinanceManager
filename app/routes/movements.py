from flask import Blueprint, request, jsonify, current_app
from datetime import datetime

movements_bp = Blueprint('movements', __name__)

# Valid movement types based on MovementsMenu.tsx
VALID_MOVEMENT_TYPES = ["Ingreso", "Gasto", "Transferencia", "Inversión"]


@movements_bp.get('')
def list_movements():
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        movements = current_app.config['DATABASE'].movements_repo.list(user)
        # Return list of indices available 
        return jsonify({"movements": list(range(len(movements)))})
    except Exception as e:
        return jsonify({'error': f'Error fetching movements: {str(e)}'}), 500


@movements_bp.get('/<int:movement_id>')
def movement_detail(movement_id):
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        movements = current_app.config['DATABASE'].movements_repo.list(user)
        
        # Validate index is within range
        if movement_id < 0 or movement_id >= len(movements):
            return jsonify({"error": "Movement not found"}), 404
        
        # Return the movement at the specified index
        return jsonify({"movement": movements[movement_id]})
    except Exception as e:
        return jsonify({'error': f'Error fetching movement: {str(e)}'}), 500


@movements_bp.post('')
def create_movement():
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Validate JSON structure
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    data = request.get_json()
    
    if not data or 'movement' not in data:
        return jsonify({'error': 'Missing movement data'}), 400
    
    movement_data = data['movement']
    
    if not isinstance(movement_data, dict):
        return jsonify({'error': 'Movement must be an object'}), 400
    
    # Validate required fields
    if 'amount' not in movement_data:
        return jsonify({'error': 'Movement must have amount field'}), 400
    
    if not isinstance(movement_data['amount'], (int, float)):
        return jsonify({'error': 'Amount must be a number'}), 400
    
    # Validate at least one of origin or destination is present
    if 'origin' not in movement_data and 'destination' not in movement_data:
        return jsonify({'error': 'Movement must have at least origin or destination'}), 400
    
    # Validate type if provided
    if 'type' in movement_data:
        if movement_data['type'] not in VALID_MOVEMENT_TYPES:
            return jsonify({'error': f'Invalid movement type. Must be one of: {VALID_MOVEMENT_TYPES}'}), 400
    
    # Validate date format if provided (YYYY-MM-DD)
    if 'date' in movement_data:
        try:
            datetime.strptime(movement_data['date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Date must be in YYYY-MM-DD format'}), 400
    
    # Validate optional string fields
    for field in ['description', 'origin', 'destination']:
        if field in movement_data and not isinstance(movement_data[field], str):
            return jsonify({'error': f'{field} must be a string'}), 400
    
    # Validate tags if provided
    if 'tags' in movement_data:
        if not isinstance(movement_data['tags'], list):
            return jsonify({'error': 'Tags must be an array'}), 400
        
        for tag in movement_data['tags']:
            if not isinstance(tag, str):
                return jsonify({'error': 'All tags must be strings'}), 400
    
    try:
        # Register the movement in the database
        current_app.config['DATABASE'].register_movement(user, movement_data)
        return jsonify({'message': 'Movement created successfully'}), 201
    except Exception as e:
        return jsonify({'error': f'Error creating movement: {str(e)}'}), 500


@movements_bp.delete('/<int:movement_id>')
def delete_movement(movement_id):
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        movements = current_app.config['DATABASE'].movements_repo.list(user)
        
        # Validate index is within range
        if movement_id < 0 or movement_id >= len(movements):
            return jsonify({"error": "Movement not found"}), 404
        
        # Remove the movement at the specified index
        movements.pop(movement_id)
        
        # Save the updated movements list
        current_app.config['DATABASE'].movements_repo.save(user, movements)
        
        return jsonify({'message': 'Movement deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Error deleting movement: {str(e)}'}), 500