from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

# --- FUNGSI MATEMATIKA DASAR ---P

def is_prime(n):
    """Cek apakah bilangan n adalah prima."""
    if n < 2: return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0: return False
    return True

def gcd(a, b):
    """Mencari Faktor Persekutuan Terbesar (FPB)."""
    while b:
        a, b = b, a % b
    return a

def mod_inverse(e, phi):
    """Mencari invers modular (d) menggunakan Extended Euclidean Algorithm."""
    def extended_gcd(a, b):
        if a == 0:
            return b, 0, 1
        else:
            g, y, x = extended_gcd(b % a, a)
            return g, x - (b // a) * y, y

    g, x, y = extended_gcd(e, phi)
    if g != 1:
        raise Exception('Modular inverse tidak ditemukan')
    else:
        return x % phi

# --- LOGIKA UTAMA RSA ---

def generate_keys_logic(p, q):
    steps = []
    
    # Validasi Input
    if not is_prime(p) or not is_prime(q):
        return None, "Nilai p dan q harus bilangan prima!"
    if p == q:
        return None, "Nilai p dan q tidak boleh sama!"

    # 1. Hitung n
    n = p * q
    steps.append(f"Hitung Modulus (n): n = p × q = {p} × {q} = {n}")

    # 2. Hitung Totient phi(n)
    phi = (p - 1) * (q - 1)
    steps.append(f"Hitung Totient φ(n): (p-1) × (q-1) = {p-1} × {q-1} = {phi}")

    # 3. Pilih Public Exponent (e)
    # Kita cari e yang relatif prima dengan phi (biasanya mulai dari 3 atau 65537)
    e = 65537
    # Jika e >= phi atau tidak coprime, cari nilai e terkecil mulai dari 3
    if e >= phi or gcd(e, phi) != 1:
        e = 3
        while e < phi:
            if gcd(e, phi) == 1:
                break
            e += 2
    
    steps.append(f"Pilih Public Exponent (e): Dipilih e = {e} karena GCD({e}, {phi}) = 1 (Relatif Prima)")

    # 4. Hitung Private Exponent (d)
    try:
        d = mod_inverse(e, phi)
    except:
        return None, "Gagal menghitung private key (d)"
        
    steps.append(f"Hitung Private Exponent (d): (d × {e}) mod {phi} = 1. Didapat d = {d}")
    steps.append(f"Validasi Kunci: ({d} × {e}) mod {phi} = {(d*e)%phi} (Harus bernilai 1)")
    
    # Ringkasan Kunci
    steps.append(f"🔑 Public Key Terbentuk: (e={e}, n={n})")
    steps.append(f"🔑 Private Key Terbentuk: (d={d}, n={n})")

    return {
        'n': n,
        'phi': phi,
        'e': e,
        'd': d,
        'public_key': f"({e}, {n})",
        'private_key': f"({d}, {n})",
        'steps': steps
    }, None

def encrypt_logic(plaintext, e, n):
    steps = []
    ciphertext = []
    
    steps.append(f"Mulai Enkripsi: Pesan '{plaintext}' menggunakan Public Key (e={e}, n={n})")

    for i, char in enumerate(plaintext):
        # Konversi char ke ASCII
        m = ord(char)
        # Rumus RSA: c = m^e mod n
        c = pow(m, e, n)
        ciphertext.append(c)
        
        # Format langkah agar rapi di kartu
        steps.append(f"Char '{char}' (ASCII {m}) → Hitung: {m}^{e} mod {n} = {c}")

    steps.append(f"✅ Selesai: Ciphertext = {' '.join(map(str, ciphertext))}")
    return ciphertext, steps

def decrypt_logic(ciphertext_list, d, n):
    steps = []
    plaintext_chars = []
    
    cipher_str = ' '.join(map(str, ciphertext_list))
    steps.append(f"Mulai Dekripsi: Ciphertext '{cipher_str}' menggunakan Private Key (d={d}, n={n})")

    for c in ciphertext_list:
        # Rumus RSA: m = c^d mod n
        m = pow(c, d, n)
        char = chr(m)
        plaintext_chars.append(char)
        
        # Format langkah agar rapi di kartu
        steps.append(f"Cipher {c} → Hitung: {c}^{d} mod {n} = {m} (ASCII '{char}')")

    result_text = "".join(plaintext_chars)
    steps.append(f"✅ Selesai: Plaintext = '{result_text}'")
    return result_text, steps

# --- FLASK ROUTES ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_keys', methods=['POST'])
def generate_keys_route():
    try:
        data = request.json
        p = int(data.get('p'))
        q = int(data.get('q'))
        
        result, error = generate_keys_logic(p, q)
        
        if error:
            return jsonify({'error': error}), 400
            
        return jsonify(result)
    except Exception as err:
        return jsonify({'error': str(err)}), 500

@app.route('/encrypt', methods=['POST'])
def encrypt_route():
    try:
        data = request.json
        plaintext = data.get('plaintext')
        e = int(data.get('e'))
        n = int(data.get('n'))
        
        if not plaintext:
             return jsonify({'error': 'Plaintext kosong'}), 400

        ciphertext, steps = encrypt_logic(plaintext, e, n)
        
        return jsonify({
            'ciphertext': ciphertext,
            'steps': steps
        })
    except Exception as err:
        return jsonify({'error': str(err)}), 500

@app.route('/decrypt', methods=['POST'])
def decrypt_route():
    try:
        data = request.json
        ciphertext = data.get('ciphertext') # Ini list of integers
        d = int(data.get('d'))
        n = int(data.get('n'))

        if not ciphertext:
             return jsonify({'error': 'Ciphertext kosong'}), 400
        
        plaintext, steps = decrypt_logic(ciphertext, d, n)
        
        return jsonify({
            'plaintext': plaintext,
            'steps': steps
        })
    except Exception as err:
        return jsonify({'error': str(err)}), 500

if __name__ == '__main__':
    app.run(host = '0.0.0.0', debug=True, port=5001)