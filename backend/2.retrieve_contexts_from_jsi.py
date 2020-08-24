#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 18 17:54:14 2020

# Tout d'abord demandez la génération d'une API_KEY (une clé) dans votre compte SketchEngine : 
# https://www.sketchengine.eu/documentation/api-documentation/#toggle-id-1 (Authentification)

# Pour plus d'infos sur les méthodes disponibles : https://www.sketchengine.eu/documentation/methods-documentation/


@author: emmanuelcartier
"""


import requests, time, json,re, glob
import pandas as pd
import numpy as np
from os import path
import os
import traceback
import pysolr



import mysql.connector
from mysql.connector import Error
import csv

from datetime import datetime
#currentSecond= datetime.now().second
#currentMinute = datetime.now().minute
#currentHour = datetime.now().hour
currentDay = datetime.now().day
currentMonth = datetime.now().month
currentYear = datetime.now().year

# sketchengine api
USERNAME = 'ecartierlipn' #'api_testing'
API_KEY = 'a48ad457b27f47d8a639332d4b91576f'#'YNSC0B9OXN57XB48T9HWUFFLPY4TZ6OE'
base_url = 'https://api.sketchengine.eu/bonito/run.cgi'




# retrieve corpus info from sketchengine
def corpus_info(corpus):
    ''' get corpus info'''
    params = {'struct_attr_stats':1,'gramrels':0,'corpcheck':0,'registry':0,'subcorpora':0}
    params['corpname']=corpus
    try:
        res =  requests.get(base_url + '/corp_info', params=params, auth=(USERNAME, API_KEY)).json()
        #print(res, res.text)
        return res
    except Exception as e:
        print("Error in result for query : [" + base_url + '/corp_info?], params : ' + str(params) + ', error : '+ str(e))

# parameters for view query (sketchengine)
params_query = {
 'format': 'csv', # format de la réponse (attention au 30/03/2020 : métainformations disponibles seulement avec json!)
 'async':0, # mode de réponse (ici on récupère toute la réponse, c'est plus long mais plus facile à gérer)
 #'corpname': 'preloaded/fra_jsi_newsfeed_virt',
 'attrs': 'word,tag,lemma', # informations pour le mot clé
 'ctxattrs': 'word,tag,lemma', # idem pour les mots du contexte
# 'structs':'doc.uri,doc.website,doc.date,doc.source_country',# meta-informations (voir résultats requête précédente corp_info)
 'refs':'=doc.uri,=doc.website,=doc.date,=doc.source_country',# meta-informations (voir résultats requête précédente corp_info)
# will be dynamically assigned : 'q':'q[lc="class"][lc="action"]', # query
 'viewmode':'sen', # on récupère le mode sentence (phrase vs kwic)
 'pagesize':10000, # nbre de résultats maximum
}

# parameters for wordlist query (sketchengine)
params_wordlist = {   
 'format': 'csv', 
 'async':0, 
 'wltype': 'simple',
 'wlattr': 'word',
 'wlnums': 'frq',#',docf,arf',
 'wlminfreq':3,
 'wlsort':'f',
 'wlmaxitems': 1000,
# 'wlpat': dynamic value
 #'pagesize':10000,
}

params_freq = {   
 'format': 'json', 
 'async':0, 
 'fcrit': 'word/0',
 'flimit': 1000,
 'freq_sort': 'freq',
# 'q': dynamic value
 #'pagesize':10000,
}

params_wsketch = {
    #'lemma': item,
    #'lpos': '-v',
    'corpname': 'preloaded/bnc2',
    'format': 'json'
    }

def query_sketchengine(query, params):
  ''' Cette fonction envoie une reqête à sketchengine et retourne la réponse
  voir https://www.sketchengine.eu/documentation/methods-documentation/ pour tous les paramètres
  '''
  try:
    if params['format']=='json':
        res = requests.get(base_url + '/' + query, params=params, auth=(USERNAME, API_KEY), timeout=180).json()
    else:
        res = requests.get(base_url + '/' + query, params=params, auth=(USERNAME, API_KEY), timeout=180)
    if res.status_code==200:
        return res
    else:
        print("Error with query : response : " + str(res.status_code))
        return False
  except Exception as e:
    print("Erreur dans la requête ("+ res.text + "). Message d'erreur : " + str(e))
    print(traceback.format_exc())
    return False

def generate_wordlist(series, wordlist, corpora, dir_res='./res_wordlist/'):
    '''
    generate files with wordlist from query to sketchengine wordlist 

    Parameters
    ----------
    series : TYPE str
        the name of the series.
    wordlist : TYPE list
        list of words/morphems.
    corpora : TYPE dict
        dictionary of corpora to query ({'en': 'preloaded/eng_jsi_newsfeed_virt'}).
    dir_res : TYPE str, optional
        susbdirectory name where to put result file(s). The default is './res_wordlist/'.

    Returns
    -------
    None (files are written in res_wordlist subdirectory)

    '''

    # paramètres de la requête
    params= {}
    for lang, corp in corpora.items(): 
        params['corpname'] = corp
        params.update(params_wordlist)
        corp_fn = params['corpname'].split('/')
        for word in wordlist:
            word1 = re.sub(r'\W','.?',word) # replace non-letter by . (any character)
            params['wlpat'] = '.*' + word1 + '.*'
            filename = dir_res + corp_fn[1] + '.' + series + '.'+ word + "." + params['format']
            if path.exists(filename):
                print("Results already saved - Corpus : " + corp_fn[1] +  ", query :" + params['wlpat'] + ", filename :" + filename)
                continue
            print("SE wordlist query with parameters : " + word + ":"+ params['wlpat'] + ':' + corp)
            res = query_sketchengine('wordlist',params)
            time.sleep(5)
            #print(res.text)
            if res:
                with open(filename, mode="w", encoding="utf-8") as fin:
                    if params['format']=='json':
                        json.dump(res,fin, indent=4)
                    elif params['format'] == 'csv':
                        fin.write(res.text)
                print("Results saved - Corpus : " + corp_fn[1] +  ", query :" + params['wlpat'] + ", filename :" + filename)


def combine_wordlist_results(series, dir_in = './res_wordlist/',dir_out='./res_wordlist_final/'):

    files = glob.glob(dir_in + "*"+ series + "*.csv")
    print(len(files),files)
    # list of dataframes for each word
    df = pd.DataFrame(columns=['word'])
    for fn in files:
        data = re.split(r"\/",fn) # get filename only
        fndata = re.split(r"\.",data[len(data)-1]) # split to retrieve language and series morphem
        #print(fndata)
        lang2 = re.split(r'_', fndata[0])[0]
        if lang2 in lang_corresp.keys():
            lang = lang_corresp[lang2]
        else:
            print("Error with lang value :" + lang2 + '(filename :'+ fn + ')')
            exit()
        #print(lang)
        morph = fndata[1]
        freqfield = "freq_"+lang
        # now read csv file into dataframe
        df1 = pd.read_csv(fn, header=None, 
                          quotechar='"',
                          sep=',', 
                          names=['word',freqfield], 
                          skiprows=3)
        df1 = df1.astype(dtype= {"word":"object",freqfield:"float64"})
        print("*"*50)
        print("df1 : ", fn, df1.info())
        df = pd.merge(df,df1,how="outer",on="word") # outer
        print("*"*50 + "\nCombined df\n" + "*"*50)
        print(df.info())
        print("*"*50)
    
    #df.drop(list(df.filter(regex = '_x')), axis = 1, inplace = True)
    # create freq_<lang> column with highest value from _x and _y columns
    df["freq_fr"] = df[["freq_fr_x", "freq_fr_y"]].max(axis=1)
    df["freq_en"] = df[["freq_en_x", "freq_en_y"]].max(axis=1)
    df["freq_cz"] = df[["freq_cz_x", "freq_cz_y"]].max(axis=1)
    df["freq_pl"] = df[["freq_pl_x", "freq_pl_y"]].max(axis=1)

    df.drop(list(df.filter(regex = '_[xy]')), axis = 1, inplace = True)
    
    # drop outlier values
    df = df[~(df.word.str.contains(r'[\._\']'))]
    df = df[~(df.word.str.contains(r'-.+?-.+?-'))]
    df = df[~(df.word.str.len()>30)]
    #df = df[~(df.word.str.len()>30)]
    #df.columns = df.columns.str.replace(r'_y$', '')
    print(df.info())
    totalfr = dfcorp[dfcorp.lang =='fr'].tokencount.unique()[0]
    totalen = dfcorp[dfcorp.lang =='en'].tokencount.unique()[0]
    totalpl =  dfcorp[dfcorp.lang =='pl'].tokencount.unique()[0]
    totalcz = dfcorp[dfcorp.lang =='cz'].tokencount.unique()[0]
    print(totalfr,totalpl,totalcz,totalen)
    df['morphem'] = series
    df['relfreq_fr']= (df['freq_fr'] / totalfr) * 1000000
    df['relfreq_en']= (df['freq_en'] / totalen ) * 1000000
    df['relfreq_pl']= (df['freq_pl'] / totalpl ) * 1000000
    df['relfreq_cz']= (df['freq_cz'] / totalcz) * 1000000
    #print("final df : ", morph)

    # generate all data
    print(df.info())
    df.fillna(0.0, inplace=True)
    print(df.info())
    print(df)
    df.set_index('word').to_csv(dir_out + 'jsi.all.' + morph + ".csv")


def generate_wordlist_for_contexts(path):
    ''' reading file and generating dictionary of data
    input : file path
    output : dictionary of entries by language, nb of words (useful for SE FUP limit : 100/minute, 900/hour, 2000/day)
    '''
    wordlist = {}
    with open(path, encoding="utf8", mode="r") as fin:
        nb = 0
        for line in fin:
            data = line.strip().split(',')
            if len(data) == 2: ## lang, word
                nb = nb + 1
                # convert word into sketchengine query
                if (len(re.split(r'[\' ]+', data[1]))>2):
                    wordquery = "q" + "".join(['[lc="'+word.replace('-','.?')+ '"]' for word in re.split(r'[\' ]+',data[1]) if len(word)>0])
                    wordquery = wordquery.replace('][','][]?[')
                else:
                    wordquery = "q" + "".join(['[lc="'+word.replace('-','.?')+ '"]' for word in re.split(r'[\' ]+',data[1]) if len(word)>0])
                #print(data)
                wordlist[data[0]] = wordlist.get(data[0],[])
                wordlist[data[0]].append((data[1].strip().replace(" ",'-'),wordquery)) # data[0]
            elif len(data) == 1: # just word => default languages = fr, cz, pl
                nb = nb + 1
                if (len(re.split(r'[\' ]+', data[0]))>2):
                    wordquery = "q" + "".join(['[lc="'+word.replace('-','.?')+ '"]' for word in re.split(r'[\' ]+',data[0]) if len(word)>0])
                    wordquery = wordquery.replace('][','][]?[')
                else:
                    wordquery = "q" + "".join(['[lc="'+word.replace('-','.?')+ '"]' for word in re.split(r'[\' ]+',data[0]) if len(word)>0])
                wordlist['fr'] = wordlist.get('fr',[])
                wordlist['fr'].append((data[0].strip().replace(" ",'-'),wordquery)) # data[0]
                #wordlist['cz'] = wordlist.get('cz',[])
                #wordlist['cz'].append((data[0].strip().replace(" ",'-'),wordquery)) # data[0]
                #wordlist['pl'] = wordlist.get('pl',[])
                #wordlist['pl'].append((data[0].strip().replace(" ",'-'),wordquery)) # data[0]
        return (wordlist, nb)
 

def build_cql_query(word, corpus):
    ''' 
        Generate a cqp expression from a word.
        Examples : covid => [lemma_lc="covid"] within <doc (year="2020") />
        
        Parameters:
            word (str): the word
            corpus(str): the name of the corpus (_virt corpus have to be filtered on the year)
        Output:
            cqp (str) : the cqp string query
    '''
    cqp=''
    words = ['[lc="'+ w + '"]' for w in re.split(r"\s+",word)]
    if re.search(r"_virt", corpus):
        cqp = 'q' + " []{0,2} ".join(words) + ' within <doc (year="2020") />'
    else:
        cqp = 'q' + " []{0,2} ".join(words)
    return cqp
    
def generate_wordlist_contexts_SELECT(series,wordlist, corpora, dir_res):
    for lang, corp in corpora.items():
        for c in corp:
            params_query['corpname'] = c
            corp_fn = params_query['corpname'].split('/')
            cwordlist = wordlist.get(lang,[])
            print("Launching " + str(len(cwordlist)) + " queries / word forms, for language : " + lang)
            for word in cwordlist:
                word2 = word.lower().strip()
                word = word.replace(' ','_')
                params_query['q'] = build_cql_query(word2,params_query['corpname'])
                filename = dir_res + corp_fn[1] + '.' + series + '.'+ word + "." + params_query['format']
                if path.exists(filename):
                    print("results already saved - Corpus : " + corp_fn[1] +  ", query :" + params_query['q'] + ", filename :" + filename)
                    continue
                try:
                    print("SE query with parameters : " + word + ":"+ params_query['q'])
                    res = query_sketchengine('view',params_query)
                    time.sleep(5)
                    if res:	
                        with open(filename, mode="w", encoding="utf-8") as fin:
                            if params_query['format']=='json':
                                json.dump(res,fin, indent=4)
                            elif params_query['format'] == 'csv':
                                fin.write(res.text)
                            print("results saved - Corpus : " + corp_fn[1] +  ", query :" + params_query['q'] + ", filename :" + filename)
                    else:
                        print("No result for this query : " + corp_fn[1] +  ", query :" + params_query['q'])
                except Exception as e:
                    print("Error : " + str(e))
                    print(traceback.format_exc())



# database insertion 
def insert_wordlist_into_db(filename):
	''' insert wordlist from series into db from csv file / json file'''
	try:
		conn = mysql.connector.connect(host=host,
										database=database,
										user=user,
										password=password,
										charset=charset,
										collation=collation,
										autocommit=autocommit
										)
		cursor=conn.cursor()
		if conn.is_connected():
			query_model = '''INSERT IGNORE INTO borrowings_freq 
			(word, morphem, freq_cz, relfreq_cz, freq_en, relfreq_en,freq_fr, relfreq_fr,freq_pl, relfreq_pl) 
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s);'''
			with open(filename, mode='r') as csv_file:
				csv_reader = csv.DictReader(csv_file, delimiter=",")
				for row in csv_reader:
					print(row)
					data = (row['word'], row['morphem'], row['freq_cz'], row['relfreq_cz'], row['freq_en'], row['relfreq_en'],row['freq_fr'], row['relfreq_fr'],row['freq_pl'], row['relfreq_pl'])
					cursor.execute(query_model, data)
				# Make sure data is committed to the database
			conn.commit()

	except mysql.connector.Error as e:
		print("Error : ", e.errno)
		print("State : ",e.sqlstate)
		print("Message : ",e.msg)
		return False

	finally:
		cursor.close()
		conn.close()

def insert_contexts_into_db(filename):
	''' insert contexts into db from csv file / json file'''
	try:
		conn = mysql.connector.connect(host=host,
										database=database,
										user=user,
										password=password,
										charset=charset,
										collation=collation,
										autocommit=autocommit
										)
		cursor=conn.cursor()
		if conn.is_connected():
			query_model = '''INSERT IGNORE INTO borrowings_contextes 
			(l1forme, l1pos, l1lemma, l2forme, l2pos, l2lemma,l3forme, l3pos, l3lemma,l4forme, l4pos, l4lemma,l5forme, l5pos, l5lemma,r1forme, r1pos, r1lemma, r2forme, r2pos, r2lemma,r3forme, r3pos, r3lemma,r4forme, r4pos, r4lemma,r5forme, r5pos, r5lemma,key_word,key_pos,key_lemma,journal, country, url, date, lang, canon_morph, series,sentence) 
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
			with open(filename, mode='r') as csv_file:
				csv_reader = csv.DictReader(csv_file, delimiter="\t")
				for row in csv_reader:
					#print(row['l1forme'])
					data = (row['l1forme'], row['l1pos'], row['l1lemma'], row['l2forme'], row['l2pos'], row['l2lemma'],row['l3forme'], row['l3pos'], row['l3lemma'],row['l4forme'], row['l4pos'], row['l4lemma'],row['l5forme'], row['l5pos'], row['l5lemma'],row['r1forme'], row['r1pos'], row['r1lemma'], row['r2forme'], row['r2pos'], row['r2lemma'],row['r3forme'], row['r3pos'], row['r3lemma'],row['r4forme'], row['r4pos'], row['r4lemma'],row['r5forme'], row['r5pos'], row['r5lemma'],row['key_word'],row['key_pos'],row['key_lemma'],row['journal'], row['country'], row['url'], row['date'], row['lang'], row['canon_morph'], row['series'],row['sentence'])
					cursor.execute(query_model, data)
				# Make sure data is committed to the database
			conn.commit()

	except mysql.connector.Error as e:
		print(e.errno)
		print(e.sqlstate)
		print(e.msg)
		return False

	finally:
		cursor.close()
		conn.close()




# other functions
def get_word_morph_lang_from_df(df):
	# ## preliminary action to insert word-with-contexts into borrowings_description
	
	# get lexemes, series, lang for insertion into borrowings_description
	
	words = []
	for k, grp in df.groupby(['lang','series','canon_morph']):
		#print(type(k),k, grp.size)
		words.append(k)
	
	print(words)
	return words

def insert_words_into_db(words):
	''' insert word into db from csv file / json file'''
	try:
		conn = mysql.connector.connect(host=host,
										database=database,
										user=user,
										password=password,
										charset=charset,
										collation=collation,
										autocommit=autocommit
										)
		cursor=conn.cursor()
		if conn.is_connected():
			query_model = '''INSERT IGNORE INTO borrowings_description 
			(word_lemma, morphem, language) 
			VALUES (%s, %s, %s);'''
			for word in words:
				#print(row['l1forme'])
				data = (word[2], word[1], word[0])
				cursor.execute(query_model, data)
				print("Query : " , cursor.statement, "Result :", cursor.rowcount)
				# Make sure data is committed to the database
			conn.commit()

	except mysql.connector.Error as e:
		print(e.errno)
		print(e.sqlstate)
		print(e.msg)
		return False

	finally:
		cursor.close()
		conn.close()


# main
# parameters
# corpus name generation pattern for all languages:
#'ces' exists but is buggy
# <lang>_jsi_newsfeed_<virt|lastmonth|curmonth>
langs = {'cs':False,'da':False,'de':'deu','en':'eng','es':'spa','fi':'fin','fr':'fra','it':'ita','nl':'nld','is':False,'no':False,'pt':'por'}
corpora = {}
for k in langs.keys():
    if langs[k] is not False:
        res = ('preloaded/' + langs[k] + '_jsi_newsfeed_virt','preloaded/' + langs[k] + '_jsi_newsfeed_lastmonth','preloaded/' + langs[k] + '_jsi_newsfeed_curmonth')
        corpora[k]=res

print(corpora)

# generation of lexemes to be studied by language (from IATE db)
import sqlite3
conn = sqlite3.connect('./db/iate-covid19.db')
c = conn.cursor()
c.execute("SELECT lang, value, query FROM lexemes")
res = c.fetchall()
conn.close()

langs2 = [lang for lang in langs.keys() if not(langs[lang]==False) ]
print(langs2)

# generate wordlist from iate db to requests JSI contexts
wordlist={}
for (lang, value, query) in res:
    if lang in langs2:
        data = wordlist.get(lang,[])
        # just keep max 2 words at the moment
        if len(re.split(r"\W", value))<3:
            data.append(value)
            wordlist[lang] = data

for lang in wordlist:    
    print(lang, ' : ' , len(wordlist[lang]))
    #print(wordlist[lang])

# name of series
series = 'covid_19'

# check of output subdirectories exist and create them if not
#dir_wordlist = './res_wordlist/'
#dir_wordlist_final = './res_wordlist/'
dir_contexts = './res_contexts/'
#os.makedirs(dir_wordlist, exist_ok=True)
#os.makedirs(dir_wordlist_final, exist_ok=True)
os.makedirs(dir_contexts, exist_ok=True)


# get corpus info (to get frequencies)
if path.isfile("corpora.info.csv") == False:
    with open('corpora.info.csv', mode="w", encoding="utf-8") as fin:
        fin.write("rawname,name,corpusinfo,date_compiled,tagsetdoc,lang,tokencount,wordcount,doccount\n")
        for lang in corpora:
            for c in corpora[lang]:
                print("Lauching corpus info query on :" + c)
                res = corpus_info(c)
                #print(res)
                if res:
                    fin.write(c +',' + res['name']+',' + res['info'] + "," + res['compiled']+ ","+ res['tagsetdoc']+","+ lang +","+res['sizes']['tokencount']+","+res['sizes']['wordcount']+","+res['sizes']['doccount']+"\n")
    print("Données corpus enregistrées dans : corpora.info.csv")
# load in dataframe for later use
dfcorp = pd.read_csv('corpora.info.csv')
print(dfcorp.info())



# useless for select project : two much compounds and already lemmatized
# generate word lists from words/morphemes for each language
# generate_wordlist(series,wordlist, corpora, dir_res=dir_wordlist)



# combine word lists for inclusion into phc.borrowings_freq (mysql db) => "jsi.all.series.csv"
#combine_wordlist_results(series, dir_in = dir_wordlist,dir_out=dir_wordlist_final)

#  save data to db (phc.borrowings_freq)
#insert_wordlist_into_db(dir_wordlist_final + 'jsi.all.' + series + '.csv')

# to generate contexts from the resulting file see (as separate process) : jsi.all.generate_contexts.py


## generate contexts for each word from jsi web corpus (sketchengine query)
generate_wordlist_contexts_SELECT(series,wordlist, corpora, dir_res=dir_contexts)

