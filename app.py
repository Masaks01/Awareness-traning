from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.after_request
def apply_csp(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self';"
    return response

def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not session.get("logged_in"):
            return redirect(url_for("index"))
        return f(*args, **kwargs)
    return wrapper

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="awerness_app"
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashbord')  
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/sosial_manipulasjon')
@login_required
def social_engineering():
    return render_template('multiple_choice.html')

@app.route('/dra_og_slipp')
@login_required
def drag_and_drop():
    return render_template('drag_and_drop.html')

@app.route('/Sveip_trusselen_vekk')
@login_required
def swipe_the_threat():
    return render_template('safe_or_not.html')

@app.route('/resultat')
@login_required
def result():
    return render_template('result.html')

@app.route('/retningslinjer')
@login_required
def routines():
    return render_template('routines.html')

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"status": "error", "message": "Brukernavn og passord kreves"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    try:
        hashed = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s)", (username, hashed))
        db.commit()
        return jsonify({"status": "success"})
    except mysql.connector.IntegrityError:
        return jsonify({"status": "error", "message": "Brukernavnet finnes allerede"}), 409
    finally:
        cursor.close()
        db.close()

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    db.close()

    if user and check_password_hash(user['password_hash'], password):
        session["logged_in"] = True
        session["username"] = username
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Feil brukernavn eller passord"}), 401

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/api/sosial_manipulasjon')
@login_required
def api_social_engineering():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM social_manipulation")
    questions = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(questions)

@app.route('/api/dra_og_slipp')
@login_required
def api_drag_and_drop():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM drag_statements")
    links = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(links)

@app.route('/api/Sveip_trusselen_vekk')
@login_required
def api_swipe_the_threat():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM phishing_samples ORDER BY RAND()")
    samples = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(samples)

@app.route('/api/progresjon', methods=['POST'])
@login_required
def api_save_progress():
    data = request.json
    username = session.get("username")
    module = data.get("module_name")
    completed = data.get("completed", False)

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO user_progress (username, module_name, completed)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            completed = VALUES(completed),
            last_updated = CURRENT_TIMESTAMP
    """, (username, module, completed))
    db.commit()
    cursor.close()
    db.close()
    return {"status": "OK"}

@app.route('/api/progresjon/<username>')
@login_required
def api_get_progress(username):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT module_name, completed FROM user_progress WHERE username = %s", (username,))
    progress = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(progress)

@app.route('/api/mark_completed', methods=['POST'])
@login_required
def mark_completed():
    data = request.json
    username = session.get("username")
    module_name = data.get("module_name")

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO user_progress (username, module_name, completed)
        VALUES (%s, %s, TRUE)
        ON DUPLICATE KEY UPDATE completed = TRUE
    """, (username, module_name))
    db.commit()
    cursor.close()
    db.close()
    return {"status": "OK"}

if __name__ == '__main__':
    app.run(debug=True)
