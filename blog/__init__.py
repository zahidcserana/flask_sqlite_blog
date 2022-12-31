"""Initialize app."""
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    """Construct the core app object."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object("config.Config")

    # Initialize Plugins
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        from . import auth, routes, blog

        # Register Blueprints
        app.register_blueprint(routes.main_bp)
        app.register_blueprint(auth.auth_bp)
        app.register_blueprint(blog.blog_bp)

        # Create Database Models
        db.create_all()

        return app
