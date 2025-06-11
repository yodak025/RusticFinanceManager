import csv
from .interfaces import CsvSerializer

class StdCsvSerializer(CsvSerializer):
    def load(self, path: str):
        with open(path, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
            for row in rows:
                if 'tags' in row and row['tags']:
                    row['tags'] = row['tags'].split('#')
                elif 'tags' in row:
                    row['tags'] = []
            return rows

    def dump(self, rows: list, path: str):
        if not rows: 
            # Read original headers if file exists
            try:
                with open(path, "r", newline="", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    fieldnames = reader.fieldnames or []
            except FileNotFoundError:
                fieldnames = []
            
            with open(path, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
            return
            
        # Create a copy of rows to avoid modifying the original data
        processed_rows = []
        for row in rows:
            processed_row = row.copy()
            if 'tags' in processed_row and isinstance(processed_row['tags'], list):
                processed_row['tags'] = '#'.join(processed_row['tags'])
            processed_rows.append(processed_row)
        
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=processed_rows[0].keys())
            writer.writeheader()
            writer.writerows(processed_rows)