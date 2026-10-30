
import random
import string
def generate_username():
    return "user_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=8))

def generate_email():
    return generate_username() + "@example.com"
def generate_password():
    return "".join(random.choices(string.ascii_letters + string.digits, k=12))
def generate_data():
    return {
        "username": generate_username(),
        "email": generate_email(),
        "password": generate_password(),
        "role": random.choice(["developer", "client"]),
    }
