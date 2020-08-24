# Database models for IATE covid-19 data

This directory contains all the data generated from IATE db with ```../1.iate_requests.ipynb``` (ie sqlite3 database : ```iate-covid19.db```), as well as utilities to convert it to mysql database : 
- ```sqlite2sql.sh``` (main shell script dumping sqlite3 db and converting syntax elements from sqlite to mysql/mariadb), 
- ```convert_sqlite2mysql.py``` (python program to convert from sqlite3 syntax to mysql / mariadb. Already launched in the shell script). 

As a convenience, we provide generated data from the sqlite 3 db : - ```iate-covid19.db.sql``` (dump of sqlite 3 db), 
- ```iate-covid19.db.mysql.sql``` (generated from the previous to mysql after conversion according to python file).

It is possible that the last file cannot be directly imported to mysql/mariadb. Please check text fields and auto_increment features.