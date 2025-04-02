from flask import Flask, render_template, jsonify, request
import mysql.connector

app = Flask(__name__)

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
def dashboard():
    return render_template('dashboard.html')

@app.route('/sosial_manipulasjon')
def social_engineering():
    return render_template('multiple_choice.html')

@app.route('/dra_og_slipp')
def drag_and_drop():
    return render_template('drag_and_drop.html')

@app.route('/Sveip_trusselen_vekk')
def swipe_the_threat():
    return render_template('safe_or_not.html')

@app.route('/resultat')
def result():
    return render_template('result.html')

@app.route('/api/sosial_manipulasjon')
def api_social_engineering():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM social_manipulation")
    questions = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(questions)

@app.route('/api/dra_og_slipp')
def api_drag_and_drop():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM drag_statements")
    links = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(links)

@app.route('/api/Sveip_trusselen_vekk')
def api_swipe_the_threat():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM phishing_samples ORDER BY RAND()")
    samples = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(samples)

@app.route('/api/progresjon', methods=['POST'])
def api_save_progress():
    data = request.json
    username = data.get("username")
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
def api_get_progress(username):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT module_name, completed FROM user_progress WHERE username = %s", (username,))
    progress = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(progress)

if __name__ == '__main__':
    app.run(debug=True)
