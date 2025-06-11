import os
from typing import List, Dict, Any
from .interfaces import AccountRepository
from app.database.serializers.json_serializer import JsonSerializer

class FileAccountRepository(AccountRepository):
    def __init__(self, db_path: str, serializer: JsonSerializer):
        self.db_path = db_path
        self.serializer = serializer

    def list(self, user: Dict[str, Any]) -> List[Dict[str, Any]]:
        path = os.path.join(self.db_path, f"user-{user['name']}", "accounts.json")
        result = self.serializer.load(path)
        
        if not isinstance(result, list):
            raise TypeError(f"Expected list, got {type(result).__name__}")
        
        return result

    def save(self, user: Dict[str, Any], accounts: List[Dict[str, Any]]) -> None:
        path = os.path.join(self.db_path, f"user-{user['name']}", "accounts.json")
        self.serializer.dump(accounts, path)