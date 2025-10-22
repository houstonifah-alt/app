# main.py
from database import create_connection, create_tables
from models import User, Transaction
from utils import format_currency
import datetime

def add_user(conn, user):
    sql = ''' INSERT INTO users(username,email)
              VALUES(?,?) '''
    cur = conn.cursor()
    cur.execute(sql, (user.username, user.email))
    conn.commit()
    return cur.lastrowid

def add_transaction(conn, transaction):
    date = transaction.date.strftime("%Y-%m-%d %H:%M:%S")
    sql = ''' INSERT INTO transactions(user_id,type,amount,category,date)
              VALUES(?,?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, (transaction.user_id, transaction.type, transaction.amount, transaction.category, date))
    conn.commit()
    return cur.lastrowid

def main():
    conn = create_connection()
    if conn is not None:
        create_tables(conn)
    else:
        print("Error! cannot create the database connection.")
        return

    while True:
        print("\\nBudget App Menu:")
        print("1. Add User")
        print("2. Add Transaction")
        print("3. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            username = input("Enter username: ")
            email = input("Enter email: ")
            user = User(id=None, username=username, email=email)
            user_id = add_user(conn, user)
            print(f"User added with id: {user_id}")
        elif choice == '2':
            user_id = int(input("Enter user id: "))
            type = input("Enter type (income/expense): ")
            amount = float(input("Enter amount: "))
            category = input("Enter category: ")
            transaction = Transaction(amount=amount, category=category, type=type)
            transaction.user_id = user_id
            transaction_id = add_transaction(conn, transaction)
            print(f"Transaction of {format_currency(transaction.amount)} added with id: {transaction_id}")
        elif choice == '3':
            break
        else:
            print("Invalid choice, please try again.")

    if conn:
        conn.close()

if __name__ == "__main__":
    main()
