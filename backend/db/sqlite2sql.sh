sqlite3 iate-covid19.db .dump > iate-covid19.db.sql
cat iate-covid19.db.sql | python convert_sqlite2mysql.py > iate-covid19.db.mysql.sql
