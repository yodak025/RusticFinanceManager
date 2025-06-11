import os
from typing import List, Dict, Any
from .interfaces import MovementRepository
from app.database.serializers.csv_serializer import CsvSerializer

class FileMovementRepository(MovementRepository):
    def __init__(self, db_path: str, serializer: CsvSerializer):
        self.db_path = db_path
        self.serializer = serializer

    def list(self, user: Dict[str, Any]) -> List[Dict[str, Any]]:
        path = os.path.join(self.db_path, f"user-{user['name']}", "movements.csv")
        return self.serializer.load(path)

    def save(self, user: Dict[str, Any], moves: List[Dict[str, Any]]) -> None:
        path = os.path.join(self.db_path, f"user-{user['name']}", "movements.csv")
        self.serializer.dump(moves, path)