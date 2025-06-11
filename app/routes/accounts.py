from flask import Blueprint, request, jsonify, current_app

accounts_bp = Blueprint('accounts', __name__)

@accounts_bp.get('')
def accounts():
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    accounts = current_app.config['DATABASE'].accounts_repo.list(user)
    
    return jsonify({'numberOfAccounts': len(accounts)})

@accounts_bp.get('/<int:account_id>')
def account_detail(account_id):
    username = request.cookies.get('username')
    
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    accounts = current_app.config['DATABASE'].accounts_repo.list(user)
    
    if account_id < 0 or account_id >= len(accounts):
        return jsonify({'error': 'Account not found'}), 404
    
    return jsonify(accounts[account_id])

@accounts_bp.post('')
def create_account():
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
    
    if not data or 'account' not in data:
        return jsonify({'error': 'Missing account data'}), 400
    
    account_data = data['account']
    
    if not isinstance(account_data, dict):
        return jsonify({'error': 'Account must be an object'}), 400
    
    if 'name' not in account_data or 'amount' not in account_data:
        return jsonify({'error': 'Account must have name and amount fields'}), 400
    
    if not isinstance(account_data['name'], str) or not isinstance(account_data['amount'], (int, float)):
        return jsonify({'error': 'Name must be string and amount must be number'}), 400
    
    # Read existing accounts
    accounts = current_app.config['DATABASE'].accounts_repo.list(user)
    
    # Add new account to the array
    accounts.append(account_data)
    
    # Overwrite accounts in database
    current_app.config['DATABASE'].accounts_repo.save(user, accounts)
    
    return jsonify({'message': 'Account created successfully'}), 201