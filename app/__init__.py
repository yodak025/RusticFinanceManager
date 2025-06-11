from flask import Flask

def create_app():
    app = Flask(__name__)

    app.config.from_object("app.config.Config")

    # TODO: Blueprints
    from app.routes import auth_bp, accounts_bp, movements_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(accounts_bp, url_prefix='/accounts')
    app.register_blueprint(movements_bp, url_prefix='/movements')

    return app
