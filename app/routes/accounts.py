"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                            RUTAS DE CUENTAS                                 ║
║                                                                              ║
║  Este módulo gestiona todas las operaciones relacionadas con las cuentas    ║
║  bancarias/financieras: consulta, creación y administración de cuentas.     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from flask import Blueprint, request, jsonify, current_app

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN DEL BLUEPRINT
# ═══════════════════════════════════════════════════════════════════════════════

accounts_bp = Blueprint('accounts', __name__)


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS DE GESTIÓN DE CUENTAS
# ═══════════════════════════════════════════════════════════════════════════════

@accounts_bp.get('')
def accounts():
    """
    Obtener el número total de cuentas del usuario
    
    Retorna la cantidad de cuentas que tiene registradas el usuario
    autenticado en el sistema.
    
    Returns:
        JSON: Número total de cuentas del usuario
        401: Si no hay sesión activa
        404: Si el usuario no existe
    """
    # Obtener nombre de usuario desde la cookie de sesión
    username = request.cookies.get('username')
    
    # Validar que existe una sesión activa
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    # Buscar usuario en la base de datos
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Obtener lista de cuentas del usuario
    accounts = current_app.config['DATABASE'].accounts_repo.list(user)
    
    # Retornar el número total de cuentas
    return jsonify({'numberOfAccounts': len(accounts)})


@accounts_bp.get('/<int:account_id>')
def account_detail(account_id):
    """
    Obtener detalles de una cuenta específica
    
    Retorna toda la información de una cuenta particular identificada
    por su índice en la lista de cuentas del usuario.
    
    Args:
        account_id (int): Índice de la cuenta en la lista del usuario
        
    Returns:
        JSON: Información completa de la cuenta solicitada
        401: Si no hay sesión activa
        404: Si el usuario o la cuenta no existen
    """
    # Obtener nombre de usuario desde la cookie de sesión
    username = request.cookies.get('username')
    
    # Validar que existe una sesión activa
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    # Buscar usuario en la base de datos
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Obtener lista de cuentas del usuario
    accounts = current_app.config['DATABASE'].accounts_repo.list(user)
    
    # Validar que el índice de cuenta sea válido
    if account_id < 0 or account_id >= len(accounts):
        return jsonify({'error': 'Account not found'}), 404
    
    # Retornar los detalles de la cuenta solicitada
    return jsonify(accounts[account_id])


@accounts_bp.post('')
def create_account():
    """
    Crear una nueva cuenta financiera
    
    Permite al usuario crear una nueva cuenta con nombre y saldo inicial.
    La cuenta se agrega a la lista existente de cuentas del usuario.
    
    Request Body:
        {
            "account": {
                "name": "Nombre de la cuenta",
                "amount": 1000.50
            }
        }
        
    Returns:
        JSON: Mensaje de confirmación de creación exitosa
        400: Si los datos son inválidos o están incompletos
        401: Si no hay sesión activa
        404: Si el usuario no existe
    """
    # Obtener nombre de usuario desde la cookie de sesión
    username = request.cookies.get('username')
    
    # Validar que existe una sesión activa
    if not username:
        return jsonify({'error': 'No username cookie found'}), 401
    
    # Buscar usuario en la base de datos
    user = current_app.config['DATABASE'].read_user(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # ──────────────────────────────────────────────────────────────────────────
    # VALIDACIÓN DE DATOS DE ENTRADA
    # ──────────────────────────────────────────────────────────────────────────
    
    # Verificar que la petición contenga JSON válido
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    # Obtener datos del cuerpo de la petición
    data = request.get_json()
    
    # Validar estructura básica del JSON
    if not data or 'account' not in data:
        return jsonify({'error': 'Missing account data'}), 400
    
    account_data = data['account']
    
    # Verificar que account sea un objeto
    if not isinstance(account_data, dict):
        return jsonify({'error': 'Account must be an object'}), 400
    
    # Validar campos obligatorios (nombre y cantidad)
    if 'name' not in account_data or 'amount' not in account_data:
        return jsonify({'error': 'Account must have name and amount fields'}), 400
    
    # Validar tipos de datos de los campos obligatorios
    if not isinstance(account_data['name'], str) or not isinstance(account_data['amount'], (int, float)):
        return jsonify({'error': 'Name must be string and amount must be number'}), 400
    
    # ──────────────────────────────────────────────────────────────────────────
    # CREACIÓN Y PERSISTENCIA DE LA CUENTA
    # ──────────────────────────────────────────────────────────────────────────
    
    # Obtener lista actual de cuentas del usuario
    accounts = current_app.config['DATABASE'].accounts_repo.list(user)
    
    # Agregar la nueva cuenta a la lista existente
    accounts.append(account_data)
    
    # Guardar la lista actualizada en la base de datos
    current_app.config['DATABASE'].accounts_repo.save(user, accounts)
    
    # Retornar confirmación de creación exitosa
    return jsonify({'message': 'Account created successfully'}), 201