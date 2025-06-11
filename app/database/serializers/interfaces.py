# serializers/interfaces.py
from abc import ABC, abstractmethod
from typing import Any

class JsonSerializer(ABC):
    @abstractmethod
    def load(self, path: str):
        pass

    @abstractmethod
    def dump(self, obj, path: str):
        pass

class CsvSerializer(ABC):
    @abstractmethod
    def load(self, path: str)-> list[dict[str | Any, str | Any]]:
        pass

    @abstractmethod
    def dump(self, rows: list, path: str) :
        pass