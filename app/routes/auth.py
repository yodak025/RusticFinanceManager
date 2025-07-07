"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                           RUTAS DE AUTENTICACIÓN                            ║
║                                                                              ║
║  Este módulo maneja todas las operaciones relacionadas con la autenticación ║
║  de usuarios: inicio de sesión, registro y consulta de perfil.              ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

from flask import Blueprint, current_app
from flask import request, jsonify

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN DEL BLUEPRINT
# ═══════════════════════════════════════════════════════════════════════════════

auth_bp = Blueprint('auth', __name__)


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS DE AUTENTICACIÓN
# ═══════════════════════════════════════════════════════════════════════════════

@auth_bp.post('/login')
def login():
    """
    Iniciar sesión de usuario existente
    
    Valida las credenciales del usuario y establece una cookie de sesión
    si el usuario existe en la base de datos.
    
    Returns:
        JSON: Datos del usuario y cookie de sesión establecida
        404: Si el usuario no existe
        400: Si faltan datos requeridos
    """
    # Obtener datos del cuerpo de la petición
    data = request.get_json()
    
    # Validar que se proporcione el nombre de usuario
    if not data or 'username' not in data:
        return jsonify({'error': 'Username is required'}), 400
    
    # Buscar usuario en la base de datos
    user = current_app.config['DATABASE'].read_user(data['username'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Crear respuesta con datos del usuario y establecer cookie de sesión
    response = jsonify(user)
    response.set_cookie('username', user["name"])
    return response


@auth_bp.post('/register')
def register():
    """
    Registrar un nuevo usuario en el sistema
    
    Crea una nueva cuenta de usuario con valores predeterminados y establece
    una cookie de sesión automáticamente tras el registro exitoso.
    
    Returns:
        JSON: Datos del nuevo usuario creado
        409: Si el usuario ya existe
        400: Si faltan datos requeridos
    """
    # Obtener datos del cuerpo de la petición
    data = request.get_json()
    
    # Validar que se proporcione el nombre de usuario
    if not data or 'username' not in data:
        return jsonify({'error': 'Username is required'}), 400
    
    # Verificar si el usuario ya existe en el sistema
    existing_user = current_app.config['DATABASE'].read_user(data['username'])
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409
    
    # Crear nuevo usuario con valores iniciales predeterminados
    new_user = {
        "name": data['username'],           # Nombre del usuario
        "localIncome": 0,                   # Ingresos locales iniciales
        "localExpenses": 0,                 # Gastos locales iniciales
        "total": 0                          # Balance total inicial
    }
    
    # Registrar el nuevo usuario en la base de datos
    current_app.config['DATABASE'].register_user(new_user)
    
    # Crear respuesta con datos del usuario y establecer cookie de sesión
    response = jsonify(new_user)
    response.set_cookie('username', new_user["name"])
    return response
    

@auth_bp.get('/me')
def me():
    """
    Obtener información del perfil del usuario autenticado
    
    Retorna los datos financieros básicos del usuario que tiene
    la sesión activa basándose en la cookie de autenticación.
    
    Returns:
        JSON: Información financiera del usuario (ingresos, gastos, total)
        401: Si no hay cookie de sesión válida
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
    
    # Retornar información financiera básica del usuario
    return jsonify({
        "localIncome": user.get("localIncome", None),      # Ingresos locales
        "localExpenses": user.get("localExpenses", None),  # Gastos locales
        "total": user.get("total", None)                   # Balance total
    })