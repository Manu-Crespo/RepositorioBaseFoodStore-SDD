import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

# Test
pw = "Test1234!"
h = hash_password(pw)
print(f"Hash: {h}")
print(f"Verify Correct: {verify_password(pw, h)}")
print(f"Verify Wrong: {verify_password('wrong', h)}")
