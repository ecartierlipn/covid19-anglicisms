# Main backend programs

This directory contains the main backend programs to generate all data for néoveille platform exploration :
- ```1.iate_requests.ipynb``` : notebook to build sqlite3 db model for iate covid-19 data (```resources/OP_Covid19_IATE_2872020```) and requests available information on the IATE website (we use the REST API). Data are generated in the ```backend/db/iate-covid19.db``` file.

- ```2.retrieve_contexts_from_jsi.py``` : Python  program to generate contexts (and available metadata) for all lexemes retrieved in the preceding phase. Contexts are retrieved from the JSI Timestamped web corpora through the SketchEngine API and stored into the ```backend/res_contexts``` subdirectory for every lexeme.

- ```3.parse_contexts_save_to_solr.py``` : Python program to parse contexts retrieved so as to populate an Apache Solr collection with detailed information (metadata and detailed description of 5-words left and right contexts (token, pos and lemma).

