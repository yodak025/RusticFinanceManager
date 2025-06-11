from flask import Flask

app = Flask(__name__)

def fibonacci(n):
    """Calculate the nth Fibonacci number using recursion"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/greet/<name>')
def greet(name):
    return f'Hello, {name.capitalize()}!'

@app.route('/fibonacci/<int:n>')
def get_fibonacci(n):
    if n < 0:
        return f'Error: Please provide a non-negative number. You provided: {n}'
    elif n > 35:
        return f'Error: Number too large (>{35}). This would take too long to compute recursively.'
    
    result = fibonacci(n)
    return f'The {n}th Fibonacci number is: {result}'
