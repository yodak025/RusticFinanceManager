from flask import Blueprint

accounts_bp = Blueprint('accounts', __name__)

@accounts_bp.get('/')
def index():
    # TODO - Implementar la lógica para mostrar la lista de cuentas
    return "Accounts List Page"

@accounts_bp.get('/<int:account_id>')
def account_detail(account_id):
    # TODO - Implementar la lógica para mostrar los detalles de una cuenta específica
    return f"Account Detail Page for account ID: {account_id}"

@accounts_bp.post('/')
def create_account():
    # TODO - Implementar la lógica para crear una nueva cuenta
    return "Create Account Page", 201