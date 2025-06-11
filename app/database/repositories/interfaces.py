from abc import ABC, abstractmethod
from typing import List, Dict, Any

class UserRepository(ABC):
    @abstractmethod
    def list(self) -> List[Dict[str, Any]]: ...
    @abstractmethod
    def save(self, users: List[Dict[str, Any]]) -> None: ...

class AccountRepository(ABC):
    @abstractmethod
    def list(self, user: Dict[str, Any]) -> List[Dict[str, Any]]: ...
    @abstractmethod
    def save(self, user: Dict[str, Any], accounts: List[Dict[str, Any]]) -> None: ...

class MovementRepository(ABC):
    @abstractmethod
    def list(self, user: Dict[str, Any]) -> List[Dict[str, Any]]: ...
    @abstractmethod
    def save(self, user: Dict[str, Any], moves: List[Dict[str, Any]]) -> None: ...