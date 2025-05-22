import tomllib
import os
import json
from pathlib import Path
from dataclasses import dataclass, asdict

@dataclass
class Package:
    author: str
    name: str
    description: str
    version: str

class NPM:
    name: str
    version: str
    main: str
    license: str

class Wally:
    authors: list[str]
    name: str
    description: str
    version: str
    license: str = "MIT"
    registry: str
    exclude: list[str]
    include: list[str]
    realm: str

# Default Values
DEFAULT_WALLY_REGISTRY = "https://github.com/UpliftGames/wally-index"
DEFAULT_WALLY_REALM = "shared"
DEFAULT_WALLY_EXCLUDE = ["**"]
DEFAULT_WALLY_INCLUDE = ["./..", "./../*"]
DEFAULT_LICENSE = "MIT"

def get_npm_package_link():
    print("gyat")

def get_wally_package_link():
    print("gyat2")

# Main Entry Point
def publish_library(dir):
    data_file_path = dir / "data.toml"
    
    if not os.path.exists(data_file_path):
        return

    package = None
    with open(data_file_path, "rb") as file:
        package = Package(**tomllib.load(file)["package"])

    npm = NPM()
    wally = Wally()

    # Write NPM to .json

    # Write Wally to .toml

    # Run Publish on Wally

    # Run Publish on NPM
    print(wally.license)

    # json.dumps(asdict(package))


#with open(file_path2, "w") as f:
#    print(os.path.exists(file_path2))


file_path = Path(__file__).parent.parent / "libraries" / "Test"
publish_library(file_path)