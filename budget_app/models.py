# models.py
import datetime

class User:
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email

class Transaction:
    def __init__(self, amount, category, type):
        self.id = None
        self.user_id = None
        self.amount = amount
        self.category = category
        self.type = type
        self.date = datetime.datetime.now()
