from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests
import os

app = Flask(__name__)

# Definindo as variáveis de ambiente
API_BASE_URL = os.getenv("API_BASE_URL" , "http://localhost:5000/api/v1/professor")
API_DATABASE_RESET = os.getenv("API_DATABASE_RESET" , "http://localhost:5000/api/v1/database/reset") 

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para exibir o formulário de cadastro
@app.route('/inserir', methods=['GET'])
def inserir_professor_form():
    return render_template('inserir.html')

# Rota para enviar os dados do formulário de cadastro para a API
@app.route('/inserir', methods=['POST'])
def inserir_professor():
    nome = request.form['nome']
    disciplina = request.form['disciplina']
    email = request.form['email']

    payload = {
        'nome': nome,
        'disciplina': disciplina,
        'email': email
    }

    response = requests.post(f'{API_BASE_URL}/inserir', json=payload)
    
    if response.status_code == 201:
        return redirect(url_for('listar_professores'))
    else:
        return "Erro ao inserir professor", 500

# Rota para listar todos os professores
@app.route('/listar', methods=['GET'])
def listar_professores():
    response = requests.get(f'{API_BASE_URL}/listar')
    professores = response.json()
    return render_template('listar.html', professores=professores)

# Rota para exibir o formulário de edição de professor
@app.route('/atualizar/<int:professor_id>', methods=['GET'])
def atualizar_professor_form(professor_id):
    response = requests.get(f"{API_BASE_URL}/listar")
    #filtrando apenas o professor correspondente ao ID
    professores = [professor for professor in response.json() if professor['id'] == professor_id]
    if len(professores) == 0:
        return "professor não encontrado", 404
    professor = professores[0]
    return render_template('atualizar.html', professor=professor)

# Rota para enviar os dados do formulário de edição de professor para a API
@app.route('/atualizar/<int:professor_id>', methods=['POST'])
def atualizar_professor(professor_id):
    nome = request.form['nome']
    disciplina = request.form['disciplina']
    email = request.form['email']

    payload = {
        'id': professor_id,
        'nome': nome,
        'disciplina': disciplina,
        'email': email
    }

    response = requests.post(f"{API_BASE_URL}/atualizar", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_professores'))
    else:
        return "Erro ao atualizar professor", 500

# Rota para excluir um professor
@app.route('/excluir/<int:professor_id>', methods=['POST'])
def excluir_professor(professor_id):
    #payload = {'id': professor_id}
    payload = {'id': professor_id}

    response = requests.post(f"{API_BASE_URL}/excluir", json=payload)
    
    if response.status_code == 200  :
        return redirect(url_for('listar_professores'))
    else:
        return "Erro ao excluir professor", 500

#Rota para resetar o database
@app.route('/reset-database', methods=['GET'])
def resetar_database():
    response = requests.delete(API_DATABASE_RESET)
    
    if response.status_code == 200  :
        return redirect(url_for('index'))
    else:
        return "Erro ao resetar o database", 500


if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')
