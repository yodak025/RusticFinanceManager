import json
from .interfaces import JsonSerializer

class StdJsonSerializer(JsonSerializer):
    def load(self, path: str):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def dump(self, obj, path: str):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(obj, f, indent=2)