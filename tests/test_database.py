# tests/test_database.py
import unittest
import os
import sqlite3
from budget_app.database import create_connection, create_tables

class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.db_file = "test_budget.db"
        self.conn = create_connection(self.db_file)

    def tearDown(self):
        if self.conn:
            self.conn.close()
        if os.path.exists(self.db_file):
            os.remove(self.db_file)

    def test_create_connection(self):
        self.assertIsNotNone(self.conn)
        self.assertIsInstance(self.conn, sqlite3.Connection)

    def test_create_tables(self):
        create_tables(self.conn)
        cursor = self.conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        self.assertIsNotNone(cursor.fetchone())
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'")
        self.assertIsNotNone(cursor.fetchone())

if __name__ == '__main__':
    unittest.main()
