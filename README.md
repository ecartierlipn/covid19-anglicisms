# covid19-anglicisms
A pilot study on covid-19 vocabulary innovations from the point of view of anglicisms and their use in European Languages.

This Github repository contains all data and programs enabling to explore lexemes and contexts linked to the covid-19 crisis. Its main goal are to explore lexical innovations made in English (and more precisely global English) and how every European languages deal with these words : borrowings, local variants and potential concurrency.

The main lexical units are imported from the IATE database (https://data.europa.eu/euodp/en/data/dataset/covid-19-multilingual-terminology-on-iate), 28 July 2020 version (458 entries), then from every term we retrieve web-based news sites contexts from the JSI Timestamped monitor web corpora (https://www.sketchengine.eu/jozef-stefan-institute-newsfeed-corpus/) in nine languages (Czech, Dutch, English, Finnish, French, German, Italian, Spanish, Portuguese), parse them to study their features and features evolution through corpora (usage frequency from 2020/01/01, contextual profile, contexts metadata features : language, country, website) with the help of the Néoveille project frontend (http://www.neoveille.org).

Programs are detailed in the ```backend``` and ```frontend``` subdirectories and documented the respective ```readme.md``` files. We also provide data (IATE database in sqlite format, contexts from JSI for every concept - lexicalizations) for further studies. See ```backend/data```. You can browse the frontend platform here : https://tal.lipn.univ-paris13.fr/neoveille/html/covid19/html/index.php

Analysis of the data is under way by linguists. Please check later for additional information.

## Installation

Just clone the repository with a clone command:

```
git clone https://github.com/ecartierlipn/covid19-anglicisms
```


## Prerequisites

To get all the functionalities working, you just need a python 3.4+ and Jupyter Lab working environment. To get the frontend working, you need a web server installed with php 7+ enabled. Please check the readme files in the ```backend``` and ```frontend``` subdirectories.
Please also check the web platform here : https://tal.lipn.univ-paris13.fr/neoveille/html/covid19/html/index.php.

## Main components

### IATE database

### JSI Timestamped web corpora

### Neoveille Data Editing and Exploration Platform

The Néoveille Plaform has been tuned to handle all the data :
- lexical entries : all entries of the IATE database can be browsed and edited;
- contexts : contexts from the JSI corpora have been downloaded from the SketchEngine API and stored into an Apache Solr collection; additional contexts can be added. A multifeature visual Exploration can be done on this data.

## Contributors


## Acknowledgements

