from dataclasses import dataclass

@dataclass
class Metadata:
    description: str
    tags: list[str]
