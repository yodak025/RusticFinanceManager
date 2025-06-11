import os
from typing import List, Dict, Any
from .interfaces import UserRepository
from app.database.serializers.json_serializer import JsonSerializer

class FileUserRepository(UserRepository):
    def __init__(self, db_path: str, serializer: JsonSerializer):
        self.path = os.path.join(db_path, "users.json")
        self.serializer = serializer
        
        # Comprobar si users.json existe, si no inicializarlo
        if not os.path.exists(self.path):
            self.serializer.dump([], self.path)

    def list(self) -> List[Dict[str, Any]]:
        # devuelve directamente la lista de dicts leída del JSON
        result = self.serializer.load(self.path)
        
        if not isinstance(result, list):
            raise TypeError(f"Expected list from JSON file, got {type(result).__name__}")
        
        # Verificar que cada elemento es un diccionario
        for i, item in enumerate(result):
            if not isinstance(item, dict):
                raise TypeError(f"Expected dict at index {i}, got {type(item).__name__}")
        
        return result

    def save(self, users: List[Dict[str, Any]]) -> None:
        # espera lista de dicts con clave "name"
        self.serializer.dump(users, self.path)

    def add_user_folder(self, user_name: str) -> None:
        # Crea un directorio para el usuario si no existe
        user_folder = os.path.join(os.path.dirname(self.path), f"user-{user_name}")
        if not os.path.exists(user_folder):
            os.makedirs(user_folder)
            print(f"User folder created: {user_folder}")
        else:
            print(f"User folder already exists: {user_folder}")
        
        # Crear archivo accounts.json con array vacío si no existe
        accounts_file = os.path.join(user_folder, "accounts.json")
        if not os.path.exists(accounts_file):
            self.serializer.dump([], accounts_file)
            print(f"Accounts file created: {accounts_file}")
        
        # Crear archivo movements.csv con header row si no existe
        movements_file = os.path.join(user_folder, "movements.csv")
        if not os.path.exists(movements_file):
            with open(movements_file, 'w', newline='') as csvfile:
                csvfile.write("type,date,amount,description,origin,destination,tags\n")
            print(f"Movements file created: {movements_file}")