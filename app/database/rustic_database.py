
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

    def read_user(self, user_name: str) -> dict:
        """Get a user by name."""
        users = self.users_repo.list()
        for user in users:
            if user['name'] == user_name:
                return user
        raise ValueError(f"User {user_name} not found.")
    
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