import csv
from .interfaces import CsvSerializer

class StdCsvSerializer(CsvSerializer):
    def load(self, path: str):
        with open(path, newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def dump(self, rows: list, path: str):
        if not rows: return
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)