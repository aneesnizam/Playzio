from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(150), nullable=False)
    name = db.Column(db.String(150))
    photo_url = db.Column(db.Text)
    email = db.Column(db.String(150))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email', '')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    new_user.name = f"user{secrets.token_hex(4)}"  # Default name

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "username": new_user.username,
        "name": new_user.name,
        "email": new_user.email
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = secrets.token_hex(16)

    return jsonify({
        "message": "Login successful",
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "photo_url": user.photo_url,
        "token": token
    }), 200

@app.route('/api/user/update', methods=['PUT'])
def update_user():
    data = request.get_json()
    username = data.get('username')
    name = data.get('name')
    photo_url = data.get('photo_url')
    email = data.get('email')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if name and name != user.name:
        if User.query.filter(User.username != username, User.name == name).first():
            return jsonify({"error": "Name already taken"}), 400
        user.name = name

    if photo_url:
        user.photo_url = photo_url

    if email:
        user.email = email

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "name": user.name,
        "photo_url": user.photo_url,
        "email": user.email
    }), 200

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username parameter is required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "name": user.name if user.name else f"user{user.id}",
        "photo_url": user.photo_url,
        "email": user.email if user.email else "noemail@example.com"
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    port = int(os.environ.get('PORT', 5000))  # Use Render's port
    app.run(host='0.0.0.0', port=port, debug=True)
