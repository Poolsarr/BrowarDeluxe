from flask import Flask
from config import Config
from API.auth.auth_routes import auth_bp
from API.batches.batch_routes import batch_bp
from API.inventory.inventory_routes import inventory_bp
from API.recipes.recipe_routes import recipe_bp
from API.users.user_routes import user_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)

# Rejestracja blueprintów
app.register_blueprint(auth_bp)
app.register_blueprint(batch_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(recipe_bp)
app.register_blueprint(user_bp)

@app.route("/")
def home():
    return "Server is running"

if __name__ == "__main__":
    app.run(debug=True)