from flask import Flask, render_template, jsonify
import mysql.connector

app = Flask(__name__)

# Databaseforbindelse
def get_db_connection():
    return mysql.connector.connect(
        host="",
        user="",
        password="",  
        database=""
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashbord')
def dashboard():
    return render_template('dashbord.html')

@app.route('/fler_svar')
def fler_svar():
    return render_template('fler_svar.html')

# API-endepunkt for flervalgsspill
@app.route('/api/fler_svar')
def hent_fler_svar():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM questions")
    spørsmål = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(spørsmål)

if __name__ == '__main__':
    app.run(debug=True)
