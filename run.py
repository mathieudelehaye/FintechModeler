from scripts.variability_assesser import VariabilityAssesser

from flask import Flask, request, jsonify

app = Flask(__name__)
app.json.sort_keys = False

@app.route('/variability', methods=['GET'])
def variability():
    start_month = request.args.get('start_month')
    end_month = request.args.get('end_month')
    stock_name = request.args.get('stock_name')

    data = {
        'start_month': start_month,
        'end_month': end_month,
        'stock_name': stock_name
    }

    return jsonify(data)


@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify(message="Hello, World!")

if __name__ == '__main__':
    app.run(debug=True)
