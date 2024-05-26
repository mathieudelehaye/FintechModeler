from scripts.variability_assesser import VariabilityAssesser

from flask import Flask, request, jsonify

app = Flask(__name__)
app.json.sort_keys = False

@app.route('/variability', methods=['GET'])
def variability():
    start_month = request.args.get('start_month')
    end_month = request.args.get('end_month')
    stock_name = request.args.get('stock_name')

    if not start_month:
        start_month = 6
    else:
        # int required by read_stock_price
        start_month = int(start_month)
    
    if not end_month:
        end_month = 0
    else:
        # int required by read_stock_price
        end_month = int(end_month)

    if not stock_name:
        stock_name = 'AAPL'

    assesser = VariabilityAssesser(stock_name)
    assesser.read_stock_price(start_month, end_month)

    average_variability = assesser.compute_variability()

    data = {
        'start_month': start_month,
        'end_month': end_month,
        'stock_name': stock_name,
        'averageVariability': average_variability
    }

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
