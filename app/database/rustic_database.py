# rustic_database.py
from app.database.repositories.file_user_repository import FileUserRepository
from app.database.repositories.file_account_repository import FileAccountRepository
from app.database.repositories.file_movement_repository import FileMovementRepository
from app.database.serializers.json_serializer import StdJsonSerializer
from app.database.serializers.csv_serializer import StdCsvSerializer

class RusticDatabase:
    def __init__(self, base_path: str):
        json_ser = StdJsonSerializer()
        csv_ser  = StdCsvSerializer()
        self.users_repo     = FileUserRepository(base_path, json_ser)
        self.accounts_repo  = FileAccountRepository(base_path, json_ser)
        self.movements_repo = FileMovementRepository(base_path, csv_ser)

        
    def register_user(self, user: dict) -> None:
        """Register a new user in the database."""
        users = self.users_repo.list()
        if any(u['name'] == user['name'] for u in users):
            raise ValueError(f"User {user['name']} already exists.")
        self.users_repo.add_user_folder(user['name'])
        users.append(user)
        self.users_repo.save(users)

    def register_account(self, user:dict ,account: dict) -> None:
        """Register a new account in the database."""
        accounts = self.accounts_repo.list(user)
        if any(a['name'] == account['name'] for a in accounts):
            raise ValueError(f"Account {account['name']} already exists.")
        accounts.append(account)
        self.accounts_repo.save(user, accounts)

    def register_movement(self, user: dict, movement: dict) -> None:
        """Register a new movement in the database."""
        movements = self.movements_repo.list(user)
        movements.append(movement)
        self.movements_repo.save(user, movements)

    def read_user(self, user_name: str) -> dict | None:
        """Get a user by name."""
        users = self.users_repo.list()
        for user in users:
            if user['name'] == user_name:
                return user
        return None
    
    def read_account(self, user: dict, account_name: str) -> dict:
        """Get an account by name for a specific user."""
        accounts = self.accounts_repo.list(user)
        for account in accounts:
            if account['name'] == account_name:
                return account
        raise ValueError(f"Account {account_name} not found for user {user['name']}.")
    
    def read_movements(self, user: dict) -> list:
        """Get all movements for a specific user."""
        movements = self.movements_repo.list(user)
        return movements
    
    def update_account_balances(self, user: dict, movement: dict) -> None:
        """
        Actualiza los saldos de las cuentas basado en el tipo de movimiento.
        
        Args:
            user: El usuario propietario de las cuentas
            movement: El movimiento que afecta los saldos
            
        Raises:
            ValueError: Si una cuenta requerida no existe o el saldo es insuficiente
        """
        accounts = self.accounts_repo.list(user)
        movement_type = movement.get('type', '')
        amount = float(movement.get('amount', 0))
        origin = movement.get('origin', '')
        destination = movement.get('destination', '')
        
        # Función auxiliar para encontrar una cuenta por nombre
        def find_account(account_name):
            for account in accounts:
                if account['name'] == account_name:
                    return account
            return None
        
        # Procesar según el tipo de movimiento
        if movement_type == 'Ingreso':
            # Para ingresos, incrementar el saldo de la cuenta destino
            if destination:
                dest_account = find_account(destination)
                if not dest_account:
                    raise ValueError(f"Cuenta destino '{destination}' no encontrada")
                dest_account['amount'] = float(dest_account['amount']) + amount
                
        elif movement_type == 'Gasto':
            # Para gastos, decrementar el saldo de la cuenta origen
            if origin:
                orig_account = find_account(origin)
                if not orig_account:
                    raise ValueError(f"Cuenta origen '{origin}' no encontrada")
                
                new_balance = float(orig_account['amount']) - amount
                if new_balance < 0:
                    raise ValueError(f"Saldo insuficiente en cuenta '{origin}'. Saldo actual: {orig_account['amount']}, cantidad solicitada: {amount}")
                
                orig_account['amount'] = new_balance
                
        elif movement_type in ['Transferencia', 'Inversión']:
            # Para transferencias e inversiones, decrementar origen e incrementar destino
            if not origin or not destination:
                raise ValueError(f"Para {movement_type.lower()}s se requieren tanto cuenta origen como destino")
            
            # Buscar cuentas
            orig_account = find_account(origin)
            dest_account = find_account(destination)
            
            if not orig_account:
                raise ValueError(f"Cuenta origen '{origin}' no encontrada")
            if not dest_account:
                raise ValueError(f"Cuenta destino '{destination}' no encontrada")
            
            # Verificar saldo suficiente en origen
            new_orig_balance = float(orig_account['amount']) - amount
            if new_orig_balance < 0:
                raise ValueError(f"Saldo insuficiente en cuenta origen '{origin}'. Saldo actual: {orig_account['amount']}, cantidad solicitada: {amount}")
            
            # Actualizar saldos
            orig_account['amount'] = new_orig_balance
            dest_account['amount'] = float(dest_account['amount']) + amount
        
        # Guardar las cuentas actualizadas
        self.accounts_repo.save(user, accounts)
    
    def revert_account_balances(self, user: dict, movement: dict) -> None:
        """
        Revierte los cambios en los saldos de las cuentas cuando se elimina un movimiento.
        Hace la operación inversa de update_account_balances.
        
        Args:
            user: El usuario propietario de las cuentas
            movement: El movimiento que se va a eliminar y cuyos efectos hay que revertir
            
        Raises:
            ValueError: Si una cuenta requerida no existe o la reversión causaría saldo negativo
        """
        accounts = self.accounts_repo.list(user)
        movement_type = movement.get('type', '')
        amount = float(movement.get('amount', 0))
        origin = movement.get('origin', '')
        destination = movement.get('destination', '')
        
        # Función auxiliar para encontrar una cuenta por nombre
        def find_account(account_name):
            for account in accounts:
                if account['name'] == account_name:
                    return account
            return None
        
        # Procesar según el tipo de movimiento (operaciones inversas)
        if movement_type == 'Ingreso':
            # Para ingresos, revertir significa decrementar el saldo de la cuenta destino
            if destination:
                dest_account = find_account(destination)
                if not dest_account:
                    raise ValueError(f"Cuenta destino '{destination}' no encontrada")
                
                new_balance = float(dest_account['amount']) - amount
                if new_balance < 0:
                    raise ValueError(f"No se puede revertir: saldo insuficiente en cuenta '{destination}'. Saldo actual: {dest_account['amount']}, cantidad a revertir: {amount}")
                
                dest_account['amount'] = new_balance
                
        elif movement_type == 'Gasto':
            # Para gastos, revertir significa incrementar el saldo de la cuenta origen
            if origin:
                orig_account = find_account(origin)
                if not orig_account:
                    raise ValueError(f"Cuenta origen '{origin}' no encontrada")
                
                orig_account['amount'] = float(orig_account['amount']) + amount
                
        elif movement_type in ['Transferencia', 'Inversión']:
            # Para transferencias e inversiones, revertir significa:
            # - incrementar origen (devolver el dinero)
            # - decrementar destino (quitar el dinero recibido)
            if not origin or not destination:
                raise ValueError(f"Para revertir {movement_type.lower()}s se requieren tanto cuenta origen como destino")
            
            # Buscar cuentas
            orig_account = find_account(origin)
            dest_account = find_account(destination)
            
            if not orig_account:
                raise ValueError(f"Cuenta origen '{origin}' no encontrada")
            if not dest_account:
                raise ValueError(f"Cuenta destino '{destination}' no encontrada")
            
            # Verificar que se puede revertir (que destino tenga suficiente saldo)
            new_dest_balance = float(dest_account['amount']) - amount
            if new_dest_balance < 0:
                raise ValueError(f"No se puede revertir: saldo insuficiente en cuenta destino '{destination}'. Saldo actual: {dest_account['amount']}, cantidad a revertir: {amount}")
            
            # Actualizar saldos (operaciones inversas)
            orig_account['amount'] = float(orig_account['amount']) + amount  # Devolver dinero al origen
            dest_account['amount'] = new_dest_balance  # Quitar dinero del destino
        
        # Guardar las cuentas actualizadas
        self.accounts_repo.save(user, accounts)