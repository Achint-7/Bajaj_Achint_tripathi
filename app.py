from flask import Flask, request, jsonify

app = Flask(__name__)

# Hardcoded user information (modify as needed)
user_id = "achint_tripathi2021@vitstudent.ac.in_21BDS0190"
email = "achint.tripathi2021@vitstudent.ac.in"

@app.route('/bfhl', methods=['POST', 'GET'])
def handle_request():
    if request.method == 'POST':
        try:
            data = request.get_json()
            numbers = []
            alphabets = []
            highest_lowercase_alphabet = []

            for item in data['data']:
                if isinstance(item, str):
                    alphabets.append(item)
                    highest_lowercase_alphabet.append(chr(max(ord(c) for c in alphabets if c.islower())))  # Efficiently find highest lowercase char
                elif isinstance(item, int):
                    numbers.append(item)
                else:
                    raise ValueError('Invalid data type in input')

            response = {
                "is_success": True,
                "user_id": user_id,
                "email": email,
                "numbers": numbers,
                "alphabets": sorted(alphabets),  # Sort alphabets for consistency
                "highest_lowercase_alphabet": highest_lowercase_alphabet
            }
            return jsonify(response)
        except (KeyError, ValueError) as e:
            return jsonify({"is_success": False, "error": str(e)}), 400  # Bad Request

    elif request.method == 'GET':
        return jsonify({"operation_code": 1}), 200  # OK

if __name__ == '__main__':
    app.run(debug=True)