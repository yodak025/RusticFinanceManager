"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                           RUTAS DE MOVIMIENTOS                               ║
║                                                                              ║
║  Este módulo gestiona todas las operaciones relacionadas con los             ║
║  movimientos financieros: ingresos, gastos, transferencias e inversiones.    ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from flask import Blueprint, request, jsonify, current_app
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN DEL BLUEPRINT
# ═══════════════════════════════════════════════════════════════════════════════

movements_bp = Blueprint('movements', __name__)

# Tipos de movimientos válidos basados en la interfaz del frontend (MovementsMenu.tsx)
VALID_MOVEMENT_TYPES = ["Ingreso", "Gasto", "Transferencia", "Inversión"]


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS DE GESTIÓN DE MOVIMIENTOS
# ═══════════════════════════════════════════════════════════════════════════════

@movements_bp.get('')
def list_movements():
    """
    Obtener lista de índices de movimientos disponibles
    
    Retorna una lista con los índices de todos los movimientos del usuario,
    permitiendo al cliente saber cuántos movimientos hay y sus posiciones.
    
    Returns:
        JSON: Lista de índices disponibles para consultar movimientos
        401: Si no hay sesión activa
        404: Si el usuario no existe
        500: Si hay error al acceder a los datos
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
    
    try:
        # Obtener todos los movimientos del usuario
        movements = current_app.config['DATABASE'].movements_repo.list(user)
        
        # Retornar lista de índices disponibles para consulta
        return jsonify({"movements": list(range(len(movements)))})
    except Exception as e:
        return jsonify({'error': f'Error fetching movements: {str(e)}'}), 500


@movements_bp.get('/<int:movement_id>')
def movement_detail(movement_id):
    """
    Obtener detalles de un movimiento específico
    
    Retorna toda la información de un movimiento particular identificado
    por su índice en la lista de movimientos del usuario.
    
    Args:
        movement_id (int): Índice del movimiento en la lista del usuario
        
    Returns:
        JSON: Información completa del movimiento solicitado
        401: Si no hay sesión activa
        404: Si el usuario o el movimiento no existen
        500: Si hay error al acceder a los datos
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
    
    try:
        # Obtener todos los movimientos del usuario
        movements = current_app.config['DATABASE'].movements_repo.list(user)
        
        # Validar que el índice del movimiento sea válido
        if movement_id < 0 or movement_id >= len(movements):
            return jsonify({"error": "Movement not found"}), 404
        
        # Retornar el movimiento en la posición especificada
        return jsonify({"movement": movements[movement_id]})
    except Exception as e:
        return jsonify({'error': f'Error fetching movement: {str(e)}'}), 500


@movements_bp.post('')
def create_movement():
    """
    Crear un nuevo movimiento financiero
    
    Permite registrar un nuevo movimiento (ingreso, gasto, transferencia o inversión)
    con validación completa de todos los campos y tipos de datos.
    
    Request Body:
        {
            "movement": {
                "amount": 1000.50,                    # Obligatorio: cantidad del movimiento
                "type": "Ingreso",                    # Opcional: tipo de movimiento
                "description": "Descripción",         # Opcional: descripción del movimiento
                "origin": "Cuenta origen",            # Opcional: cuenta de origen
                "destination": "Cuenta destino",      # Opcional: cuenta de destino
                "date": "2024-12-25",                # Opcional: fecha en formato YYYY-MM-DD
                "tags": ["etiqueta1", "etiqueta2"]   # Opcional: etiquetas del movimiento
            }
        }
        
    Returns:
        JSON: Mensaje de confirmación de creación exitosa
        400: Si los datos son inválidos o están incompletos
        401: Si no hay sesión activa
        404: Si el usuario no existe
        500: Si hay error al guardar en la base de datos
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
    # VALIDACIÓN BÁSICA DE ESTRUCTURA JSON
    # ──────────────────────────────────────────────────────────────────────────
    
    # Verificar que la petición contenga JSON válido
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    # Obtener datos del cuerpo de la petición
    data = request.get_json()
    
    # Validar estructura básica del JSON
    if not data or 'movement' not in data:
        return jsonify({'error': 'Missing movement data'}), 400
    
    movement_data = data['movement']
    
    # Verificar que movement sea un objeto
    if not isinstance(movement_data, dict):
        return jsonify({'error': 'Movement must be an object'}), 400
    
    # ──────────────────────────────────────────────────────────────────────────
    # VALIDACIÓN DE CAMPOS OBLIGATORIOS
    # ──────────────────────────────────────────────────────────────────────────
    
    # Validar campo obligatorio: amount (cantidad)
    if 'amount' not in movement_data:
        return jsonify({'error': 'Movement must have amount field'}), 400
    
    # Validar tipo de dato del amount (debe ser numérico)
    if not isinstance(movement_data['amount'], (int, float)):
        return jsonify({'error': 'Amount must be a number'}), 400
    
    # Validar que al menos uno de origin o destination esté presente
    if 'origin' not in movement_data and 'destination' not in movement_data:
        return jsonify({'error': 'Movement must have at least origin or destination'}), 400
    
    # ──────────────────────────────────────────────────────────────────────────
    # VALIDACIONES ESPECÍFICAS POR TIPO DE MOVIMIENTO
    # ──────────────────────────────────────────────────────────────────────────
    
    movement_type = movement_data.get('type', '')
    
    # Validar campos requeridos según el tipo de movimiento
    if movement_type == 'Ingreso':
        if 'destination' not in movement_data or not movement_data['destination']:
            return jsonify({'error': 'Los ingresos requieren una cuenta destino'}), 400
    elif movement_type == 'Gasto':
        if 'origin' not in movement_data or not movement_data['origin']:
            return jsonify({'error': 'Los gastos requieren una cuenta origen'}), 400
    elif movement_type in ['Transferencia', 'Inversión']:
        if 'origin' not in movement_data or not movement_data['origin']:
            return jsonify({'error': f'{movement_type}s requieren una cuenta origen'}), 400
        if 'destination' not in movement_data or not movement_data['destination']:
            return jsonify({'error': f'{movement_type}s requieren una cuenta destino'}), 400
    
    # ──────────────────────────────────────────────────────────────────────────
    # VALIDACIÓN DE CAMPOS OPCIONALES
    # ──────────────────────────────────────────────────────────────────────────
    
    # Validar tipo de movimiento si se proporciona
    if 'type' in movement_data:
        if movement_data['type'] not in VALID_MOVEMENT_TYPES:
            return jsonify({'error': f'Invalid movement type. Must be one of: {VALID_MOVEMENT_TYPES}'}), 400
    
    # Validar formato de fecha si se proporciona (formato: YYYY-MM-DD)
    if 'date' in movement_data:
        try:
            datetime.strptime(movement_data['date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Date must be in YYYY-MM-DD format'}), 400
    
    # Validar campos de texto opcionales (descripción, origen, destino)
    for field in ['description', 'origin', 'destination']:
        if field in movement_data and not isinstance(movement_data[field], str):
            return jsonify({'error': f'{field} must be a string'}), 400
    
    # Validar etiquetas si se proporcionan
    if 'tags' in movement_data:
        if not isinstance(movement_data['tags'], list):
            return jsonify({'error': 'Tags must be an array'}), 400
        
        # Verificar que todas las etiquetas sean strings
        for tag in movement_data['tags']:
            if not isinstance(tag, str):
                return jsonify({'error': 'All tags must be strings'}), 400
    
    # ──────────────────────────────────────────────────────────────────────────
    # REGISTRO DEL MOVIMIENTO EN LA BASE DE DATOS
    # ──────────────────────────────────────────────────────────────────────────
    
    try:
        # Actualizar saldos de cuentas según el tipo de movimiento
        current_app.config['DATABASE'].update_account_balances(user, movement_data)
        
        # Registrar el movimiento en la base de datos
        current_app.config['DATABASE'].register_movement(user, movement_data)
        return jsonify({'message': 'Movement created successfully'}), 201
        
    except ValueError as ve:
        # Errores de validación de negocio (ej: saldo insuficiente, cuenta no encontrada)
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        # Otros errores del sistema
        return jsonify({'error': f'Error creating movement: {str(e)}'}), 500


@movements_bp.delete('/<int:movement_id>')
def delete_movement(movement_id):
    """
    Eliminar un movimiento específico y revertir su impacto en los saldos
    
    Elimina permanentemente un movimiento identificado por su índice
    en la lista de movimientos del usuario. Además, revierte automáticamente
    los cambios que este movimiento causó en los saldos de las cuentas.
    
    Operaciones de reversión por tipo de movimiento:
    - Ingreso: Decrementa el saldo de la cuenta destino
    - Gasto: Incrementa el saldo de la cuenta origen
    - Transferencia/Inversión: Incrementa origen y decrementa destino
    
    Args:
        movement_id (int): Índice del movimiento a eliminar
        
    Returns:
        JSON: Mensaje de confirmación de eliminación exitosa
        400: Si no se puede revertir (ej: saldo insuficiente en cuenta destino)
        401: Si no hay sesión activa
        404: Si el usuario o el movimiento no existen
        500: Si hay error al eliminar de la base de datos
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
    
    try:
        # Obtener todos los movimientos del usuario
        movements = current_app.config['DATABASE'].movements_repo.list(user)
        
        # Validar que el índice del movimiento sea válido
        if movement_id < 0 or movement_id >= len(movements):
            return jsonify({"error": "Movement not found"}), 404
        
        # Obtener el movimiento a eliminar antes de eliminarlo
        movement_to_delete = movements[movement_id]
        
        # Revertir los cambios en los saldos de las cuentas
        current_app.config['DATABASE'].revert_account_balances(user, movement_to_delete)
        
        # Eliminar el movimiento en la posición especificada
        movements.pop(movement_id)
        
        # Guardar la lista actualizada de movimientos
        current_app.config['DATABASE'].movements_repo.save(user, movements)
        
        # Retornar confirmación de eliminación exitosa
        return jsonify({'message': 'Movement deleted successfully'}), 200
    except ValueError as ve:
        # Errores de validación de negocio (ej: no se puede revertir por saldo insuficiente)
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Error deleting movement: {str(e)}'}), 500