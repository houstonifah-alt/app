# models.py
import datetime

class User:
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email

class Transaction:
    def __init__(self, id, user_id, type, amount, category, date=datetime.datetime.now()):
        self.id = id
        self.user_id = user_id
        self.type = type  # 'income' or 'expense'
        self.amount = amount
        self.category = category
        self.date = date
