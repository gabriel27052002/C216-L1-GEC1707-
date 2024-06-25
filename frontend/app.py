from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests
import os

app = Flask(__name__)

# Definindo as variáveis de ambiente
API_BASE_URL = os.getenv("API_BASE_URL" , "http://localhost:5000/api/v1/livro")
API_DATABASE_RESET = os.getenv("API_DATABASE_RESET" , "http://localhost:5000/api/v1/database/reset") 

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para exibir o formulário de cadastro
@app.route('/inserir', methods=['GET'])
def inserir_livro_form():
    return render_template('inserir.html')

# Rota para enviar os dados do formulário de cadastro para a API
@app.route('/inserir', methods=['POST'])
def inserir_livro():
    autor = request.form['autor']
    nome_livro = request.form['nome_livro']
    categoria = request.form['categoria']

    payload = {
        'autor': autor,
        'nome_livro': nome_livro,
        'categoria': categoria
    }

    response = requests.post(f'{API_BASE_URL}/inserir', json=payload)
    
    if response.status_code == 201:
        return redirect(url_for('listar_livros'))
    else:
        return "Erro ao inserir livro", 500

# Rota para listar todos os livros
@app.route('/listar', methods=['GET'])
def listar_livros():
    response = requests.get(f'{API_BASE_URL}/listar')
    livros = response.json()
    return render_template('listar.html', livros=livros)

# Rota para exibir o formulário de edição de livro
@app.route('/atualizar/<int:livro_id>', methods=['GET'])
def atualizar_livro_form(livro_id):
    response = requests.get(f"{API_BASE_URL}/listar")
    #filtrando apenas o livro correspondente ao ID
    livros = [livro for livro in response.json() if livro['id'] == livro_id]
    if len(livros) == 0:
        return "livro não encontrado", 404
    livro = livros[0]
    return render_template('atualizar.html', livro=livro)

# Rota para enviar os dados do formulário de edição de livro para a API
@app.route('/atualizar/<int:livro_id>', methods=['POST'])
def atualizar_livro(livro_id):
    autor = request.form['autor']
    nome_livro = request.form['nome_livro']
    categoria = request.form['categoria']

    payload = {
        'id': livro_id,
        'autor': autor,
        'nome_livro': nome_livro,
        'categoria': categoria
    }

    response = requests.post(f"{API_BASE_URL}/atualizar", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_livros'))
    else:
        return "Erro ao atualizar livro", 500

# Rota para excluir um livro
@app.route('/excluir/<int:livro_id>', methods=['POST'])
def excluir_livro(livro_id):
    #payload = {'id': livro_id}
    payload = {'id': livro_id}

    response = requests.post(f"{API_BASE_URL}/excluir", json=payload)
    
    if response.status_code == 200  :
        return redirect(url_for('listar_livros'))
    else:
        return "Erro ao excluir livro", 500

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
