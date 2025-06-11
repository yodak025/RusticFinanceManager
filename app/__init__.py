from flask import Flask
from database.rustic_database import RusticDatabase
from os import path


def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.Config")

    app.config["DATABASE"] = RusticDatabase(
        path.join(path.dirname(__file__), "database/data"))

    # TODO: Blueprints
    from app.routes import auth_bp, accounts_bp, movements_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(accounts_bp, url_prefix='/accounts')
    app.register_blueprint(movements_bp, url_prefix='/movements')

    return app
