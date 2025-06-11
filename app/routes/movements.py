from flask import Blueprint

movements_bp = Blueprint('movements', __name__)

@movements_bp.get('/')
def list_movements():
    # TODO - Implementar la lógica para mostrar la lista de movimientos
    return "Movements List Page"

@movements_bp.get('/<int:movement_id>')
def movement_detail(movement_id):
    # TODO - Implementar la lógica para mostrar los detalles de un movimiento específico
    return f"Movement Detail Page for movement ID: {movement_id}"

@movements_bp.post('/')
def create_movement():
    # TODO - Implementar la lógica para crear un nuevo movimiento
    return "Create Movement Page", 201

@movements_bp.delete('/<int:movement_id>')
def delete_movement(movement_id):
    # TODO - Implementar la lógica para eliminar un movimiento específico
    return f"Movement with ID {movement_id} deleted", 204