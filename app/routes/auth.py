from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

@auth_bp.get('/login')
def login():
    # TODO - Implementar la lógica de inicio de sesión
    return "Login Page"

@auth_bp.get('/me')
def me():
    # TODO - Implementar la lógica para obtener información del usuario
    return {"localIncome": 1000, "localExpenses": 500, "total": 500}