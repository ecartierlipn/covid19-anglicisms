# covid19-anglicisms
A pilot study on covid-19 vocabulary innovations from the point of view of anglicisms and their use in European Languages.

This Github repository contains all data and programs enabling to explore lexemes and contexts linked to the covid-19 crisis. Its main goal is to explore lexical innovations made in English (and more precisely global English) and how every European language deals with these words : borrowings, local variants and potential concurrency.

The main lexical units are imported from the IATE database (https://data.europa.eu/euodp/en/data/dataset/covid-19-multilingual-terminology-on-iate), 28 July 2020 version (458 entries), then from every term we retrieve web-based news sites contexts from the JSI Timestamped monitor web corpora (https://www.sketchengine.eu/jozef-stefan-institute-newsfeed-corpus/) in nine languages (Czech, Dutch, English, Finnish, French, German, Italian, Spanish, Portuguese), parse them to study their features and features evolution through corpora (usage frequency from 2020/01/01, contextual profile, contexts metadata features : language, country, website) with the help of the Néoveille project frontend (http://www.neoveille.org).

Programs are detailed in the ```backend``` and ```frontend``` subdirectories and documented in the respective ```readme.md``` files. We also provide data (IATE database in sqlite format, contexts from JSI for every concept - lexicalizations) for further studies. See ```backend/data```. You can browse the frontend platform here : https://tal.lipn.univ-paris13.fr/neoveille/html/covid19/html/index.php

Analysis of the data is under way by linguists. Please check later for additional information.

## Installation

Just clone the repository with a clone command:

```
git clone https://github.com/ecartierlipn/covid19-anglicisms
```


## Prerequisites

To get all the functionalities working, you just need a python 3.4+ and Jupyter Lab working environment. To get the frontend working, you need a web server installed with php 7+ enabled and an Apache Solr 8+ working. Please check the readme files in the ```backend``` and ```frontend``` subdirectories.
Please also check the web platform here : https://tal.lipn.univ-paris13.fr/neoveille/html/covid19/html/index.php.

## Usage
You first need to generate all data with the programs included in the backend subdirectory : 
- 1.iate_requests.ipynb : to retrieve concepts, lexemes and other information from the IATE database;
- 2.retrieve_contexts_from_jsi.py : to retrieve contexts from the JSI Timestamped web corpora;
- 3.parse_contexts_save_to_solr.py : to parse the contexts and save them to Apache Solr collection.

Then you should install the frontend (see readme file in this subdirectory). then edit, browse and explore the data.


## Main components

### IATE database

IATE (‘Interactive Terminology for Europe’) is the EU's terminology database. It has been used in the EU institutions and agencies since summer 2004 for the collection, dissemination and management of EU-specific terminology.

They maintain a covid-19 terminology and freely provide snapshots of it : https://data.europa.eu/euodp/en/data/dataset/covid-19-multilingual-terminology-on-iate.
We use the 28 July 2020 version (458 entries).

IATE terminology is composed of two main description layers: 
- concepts layer (Language-independent Level) : this is the main layer, identifying the concept id and : its domain(s) from the EuroVoc thesaurus and an indication of conceptual relations to other concepts (cross-references);
- lexicalizations layer organized by language (Language-dependent Level and term level) : language code, definition of the concept in the given language, list of lexicalizations (terms in IATE parlance) with their type (term, abbrev, phrase, formula, short form, lookup form), reference contexts.

Please see complete description here (chapter 4) : https://iate.europa.eu/assets/IATE_Handbook_public.pdf

We do not use all available information for every covid-19-related concepts, but only the following (we give an example for the concept *3589305* lexicalized in English as *COVID-19 pandemic*, see https://iate.europa.eu/entry/result/3589305) :

Layer | Feature | Explanation | Example
------------ | ------------- | ------------- | -------------
Concepts| id | the concept id | 3589305
Concepts| domain | the concept domain(s) in the EuroVoc thesaurus | epidemic [ SOCIAL QUESTIONS > health > illness ]
Concepts| relations | the relations of this concept to other concepts (cross-references) | is narrower than: 36453 pandemic, is successor of: 3589181 COVID-19 outbreak
|||
Lexical Units | value | the lexeme itself | global coronavirus outbreak
Lexical Units | language | the language of the lexeme | en
Lexical Units | type | the type of the lexeme | term
Lexical Units | concept_id | the concept id | 3589305
Lexical Units | context and context reference | a (reference?) context and its references | I’m handing over to the team in Australia now. Thanks so much for joining me. Here are the developments in the global coronavirus outbreak this evening (Nicola Slawson, 'Record rise in Italy Covid-19 death toll, Irish PM says stay home for two weeks – as it happened' (30.3.2020), The Guardian.)

Please note that :
- we take the English definition of the concepts to make them more clearer.
- we merge the language-dependent level and the term level, as this distinction is not useful for the present research.

Please see ```backend/data/sql/readme.md``` for description of the sql model of the IATE covid-19 data.

### JSI Timestamped web corpora

Please see https://www.sketchengine.eu/jozef-stefan-institute-newsfeed-corpus/ for description of these corpora. 

### Neoveille Data Editing and Exploration Platform

The Néoveille Plaform has been tuned to handle all the data :
- lexical entries : all entries of the IATE database can be browsed and edited;
- contexts : contexts from the JSI corpora have been downloaded from the SketchEngine API and stored into an Apache Solr collection; additional contexts can be added. A multifeature Visual Exploration can be done on this data.

## Contributors

Emmanuel CARTIER (emmanuel.cartier@lipn.univ-paris13.fr).

## Acknowledgements

IATE

JSI Timestamped corpora

SketchEngine
