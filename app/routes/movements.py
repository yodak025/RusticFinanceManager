from flask import Blueprint

movements_bp = Blueprint('movements', __name__)

# Array de diccionarios con los movimientos del ejemplo
movements_example = [
    {
        "type": "Ingreso",
        "amount": 1000,
        "date": "2023-10-01",
        "description": "Salary for September",
        "tags": ["salary", "income"]
    },
    {
        "type": "Gasto",
        "amount": 200,
        "date": "2023-10-02",
        "description": "Groceries",
        "tags": ["food", "groceries"]
    },
    {
        "type": "Transferencia",
        "amount": 500,
        "date": "2023-10-03",
        "description": "Transfer to savings account",
        "origin": "Checking Account",
        "destination": "Savings Account",
        "tags": ["transfer", "savings"]
    },
    {
        "type": "Inversión",
        "amount": 300,
        "date": "2023-10-04",
        "description": "Investment in mutual funds",
        "tags": ["investment", "mutual funds"]
    }
]

@movements_bp.get('')
def list_movements():
    # Devolver lista de índices disponibles
    return {"movements": list(range(len(movements_example)))}

@movements_bp.get('/<int:movement_id>')
def movement_detail(movement_id):
    # Validar que el índice esté dentro del rango
    if movement_id < 0 or movement_id >= len(movements_example):
        return {"error": "Movement not found"}, 404
    
    # Devolver el movimiento correspondiente al índice
    return {"movement": movements_example[movement_id]}

@movements_bp.post('/')
def create_movement():
    # TODO - Implementar la lógica para crear un nuevo movimiento
    return "Create Movement Page", 201

@movements_bp.delete('/<int:movement_id>')
def delete_movement(movement_id):
    # TODO - Implementar la lógica para eliminar un movimiento específico
    return f"Movement with ID {movement_id} deleted", 204