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

# mysql credentials
host='localhost'
database='phc'
user='root',
password='neoveille',
charset='utf8',
collation='utf8_general_ci',
autocommit=True




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

def parse_contexts(series,dir_files, word_pattern="*"):

    # get list of files
    files = glob.glob(dir_files + "*"+series + '.' + word_pattern + ".csv")
    #print(files, "\n*****************\n")
    if len(files)==0:
        print("No file to parse. exiting function.")
        return (False, False)
    else:
        print(str(len(files)) +  " files to parse")

    #print(files)
    # where list of dataframes will go
    frames = []
    # where SE query will go (in the source file 4 first lines)
    frames_info={}
    # for each file
    for fn in files :
        print("Parsing " + fn)
        # first check you have any result
        num_lines = sum(1 for line in open(fn))
        if num_lines < 5:
            print("No result in this file. Dropping.")
            continue
        df1 = pd.read_csv(fn, header=0, quotechar='"',sep=',', names=['metadata',"contexteG",'keyword',"contexteD"],skiprows=4) # skip 4 first lines as they contain general information on the SE query
        #print("From :", fn , df1.info(), "\n*********************\n")
        print(df1.shape)
        # frame_info
        data = re.split(r"\/",fn) # get filename only
        fndata = re.split(r"\.",data[-1]) # split to retrieve language, morph and lexeme from filename
        print(fndata)
        lang = fndata[0][0:3]
        #series = fndata[1]
        morph = unidecode.unidecode(fndata[2].strip())
        # concept id
        #print("[",morph,"]")
        #print(lexs_concept)
        if morph in lexs_concept:
            df1['id_concept'] = lexs_concept[morph]
            df1['id_concept'] = df1['id_concept'].astype(str)
        else:
            print("*"*20)
            print("No concept id for lexeme : ", morph)
            exit()
            #df1['id_concept'] = 'xxxxx'
        df1['lang']=lang_corresp[lang]
        #df1['canon_morph']=morph.replace('-',' ')
        print(morph)
        df1['series']=series
        frames.append(df1)
        with open(fn) as myfile:
            #head = myfile.readlines()[0:4]
            head = [next(myfile).strip() for x in range(4)]
            frames_info[morph + "-" + series + "-" + lang] = head


    # create main dateframes by concatening dataframes from each file
    df = pd.concat(frames)
    print("\n*********************\n","final df : ")
    print(df.info())
    print("\n*********************\n")

    # save it to csv
    #df.to_csv(series + '.all.df.csv', index=False)
    

    # split metadata column
    # WARNING : check order of info is ok
    df[['url','journal','date','country']] = df.metadata.str.split(',', expand=True, n=3)
    #print(df.url.unique())
    df['journal']= df['url'].replace(to_replace=r"https?://(.+?)/.+$",value=r"\1", regex=True)
    # convert dates
    df['date'] = df['date'].replace(to_replace='===NONE===',value="2020-03-01")
    df['date']= df.date.apply(lambda x : datetime.strptime(x, "%Y-%m-%d").strftime("%Y-%m-%dT%H:%M:%SZ"))
    #print(df.journal.unique())
#    df[['url','journal','date','country']] = df.metadata.str.split(',', expand=True, n=3)

    # remove metadata column
    df.drop(labels=["metadata"],inplace=True,  axis=1)
    print("\n*********************\n","After splitting metadata and removing column metadata")
    print(df.info())
    print("\n*********************\n")


    ############# now split contexteD and contexteR
    # first clean multiple spaces to one
    # first clean strings...
    df.contexteG = df.contexteG.str.replace(' +', ' ')
    df.contexteD = df.contexteD.str.replace(' +', ' ')
    df.contexteD = df.contexteD.str.replace(' /', '/')
    df.contexteG = df.contexteG.str.replace(' /', '/')
    df.contexteG = df.contexteG.str.strip()
    df.contexteD = df.contexteD.str.strip()
    df.contexteD.fillna("")
    df.contexteG.fillna("")
    df.contexteG = df.contexteG.astype(str)
    df.contexteD = df.contexteD.astype(str)
    df.keyword = df.keyword.str.replace(' +', ' ')
    df.keyword = df.keyword.str.replace(' /', '/')
    df.keyword = df.keyword.str.strip().astype(str)

    # build sentence string from contexteG + key_word + contexteD
    df['pos-text'] = df.contexteG + " "+ df.keyword + " " + df.contexteD
    df['sentence'] = df.contexteG.replace(regex=True,to_replace=r"\/.+?(\s+|$)",value=' ') + " <mark>"+ df.keyword.replace(regex=True,to_replace=r"\/.+?(\s+|$)",value=' ') + "</mark> " + df.contexteD.replace(regex=True,to_replace=r"\/.+?(\s+|$)",value=' ')
    df.fillna("", inplace=True, axis=1)
    print("\n*********************\n","After setting sentence, cleaning textual data and filling empty cells")
    print(df.info())
    print("\n*********************\n")


    # left context
    # first reverse string 
    df.contexteG_r = df.contexteG.apply(lambda x: x[::-1])
    print(df.contexteG_r.head(20))
    # then split and expand
    df[['cg1','cg2','cg3','cg4','cg5','cg6']] = df.contexteG_r.str.split(' ', expand=True, n=5)
    # and re-reverse each column value
    df['cg1'] = df['cg1'].apply(lambda x: None if x is None else x[::-1])
    df['cg2'] = df['cg2'].apply(lambda x: None if x is None else x[::-1])
    df['cg3'] = df['cg3'].apply(lambda x: None if x is None else x[::-1])
    df['cg4'] = df['cg4'].apply(lambda x: None if x is None else x[::-1])
    df['cg5'] = df['cg5'].apply(lambda x: None if x is None else x[::-1])
    df.drop("cg6", axis=1, inplace=True)


    # right context
    df[['cd1','cd2','cd3','cd4','cd5','cd6']] = df.contexteD.str.split(' ', expand=True, n=5)
    df.drop("cd6", axis=1, inplace=True)


    # split keyword info
    # first convert multiple word to simple ones
    # effet/NOM/effet  de/PRP/de  serre/NOM/serre => effet_de_serre/NOM_PRP_NOM/effet_de_serre
    def compute_mw(keyword):
        #print(keyword)
        if re.search(r'\s+', keyword) is False :
            return keyword
        keyword = keyword.replace(r"</p><p>",'') # patch
        data = re.split(r"\s+",keyword)
        #print(data)
        words = [re.split(r'/',entry)[0] for entry in data]
        #print(words)
        pos = [re.split(r'/',entry)[1] for entry in data]
        #print(pos)
        lemmas = [re.split(r'/',entry)[2] for entry in data]
        #print(lemmas)
        res = "_".join(words) + '/' + "_".join(pos) + '/' + "_".join(lemmas)
        #print(res)
        #print ("*"*10)
        return(res)
    df['keyword'] = df['keyword'].str.strip()
    df['keyword']=df.keyword.apply(lambda x : compute_mw(x)) 
#    df.loc[(df.keyword.str.contains(' ')),'keyword']=df.keyword.apply(lambda x : compute_mw(x)) 
    #df.loc[(df.keyword.str.contains(' ')),'keyword']=df.morph + "/CPD_NOM/" + df.canon_morph
    df[['key_word','key_pos','key_lemma']] = df.keyword.str.split('/', expand=True)
    df['canon_morph']= df['key_lemma']

    print("\n*********************\n","After splitting keyword")
    print(df.info())
    print("\n*********************\n")
    
    print("\n*********************\n","After splitting contexteD, contexteG and keyword")
    print(df.columns)
    print("\n*********************\n")
    #df.to_csv(series +'.all.splitted.df.csv', index=False)


    ## splitting each word position to extract forme, pos, lemma
    # filling navalues with fake value (//) to enable split
    df.fillna("//", inplace=True, axis=1)
    print("After filling na values", df.info(), "\n*********************\n")
    #print(df[~df.cg4.str.contains(r'/.*/')].cg4.unique())
    
    df[['l1forme','l1pos','l1lemma']] = df.cg1.str.split('/', expand=True, n=2)
    df[['l2forme','l2pos','l2lemma']] = df.cg2.str.split('/', expand=True, n=2)
    df[['l3forme','l3pos','l3lemma']] = df.cg3.str.split('/', expand=True, n=2)
    df[['l4forme','l4pos','l4lemma']] = df.cg4.str.split('/', expand=True, n=2)
    df[['l5forme','l5pos','l5lemma']] = df.cg5.str.split('/', expand=True, n=2)
    
    df[['r1forme','r1pos','r1lemma']] = df.cd1.str.split('/', expand=True, n=2)
    df[['r2forme','r2pos','r2lemma']] = df.cd2.str.split('/', expand=True, n=2)
    df[['r3forme','r3pos','r3lemma']] = df.cd3.str.split('/', expand=True, n=2)
    df[['r4forme','r4pos','r4lemma']] = df.cd4.str.split('/', expand=True, n=2)
    df[['r5forme','r5pos','r5lemma']] = df.cd5.str.split('/', expand=True, n=2)
    df.fillna("", inplace=True, axis=1)
    df.drop(['cg1','cg2','cg3','cg4','cg5','cd1','cd2','cd3','cd4','cd5'], axis=1, inplace=True)
    print("\n*********************\n","After splitting cg1 to cd5")
    print(df.info())
    print("\n*********************\n")

    # uniformizing pos value
    pl_tags = {
        r"^subst.*":"NOM",
        r"^adj.*":"ADJ",
        r"^ppron.*|siebie.*":"PRO",
        r"^num.*":"NUM",
        r"^(fin.*|bedzie.*|aglt.*|praet.*|impt.*|imps.*|inf.*|pcon.*|pant.*|ger.*|pact.*|ppas.*).*":"VERB",
        r"^adv.*":"ADV",
        r"^prep.*":"PREP",
        r"^conj.*|comp.*":"CONJ",
        r"^qub.*":"PART",
        r"^interj":"INTERJ",
        r"^interp.*":"PONCT",
        r"^xxx":"XXX"}
    
    fr_tags = {
        r"ABR":"ABREV",
        r"ADJ":"ADJ",
        r"ADV":"ADV",
        r"DET:ART":"DET",
        r"DET:POS":"DET",
        r"INT":"INTERJ",
        r"KON":"CONJ",
        r"NAM":"NAM",
        r"NOM":"NOM",
        r"NUM":"NUM",
        r"PRO":"PRO",
        r"PRO:DEM":"PRO",
        r"PRO:IND":"PRO",
        r"PRO:PER":"PRO",
        r"PRO:POS":"PRO",
        r"PRO:REL":"PRO",
        r"PRP.*":"PREP",
        r"PRP:det":"PREP_DET",
        r"PUN.*":"PONCT",
        r"SYM":"SYMB",
        r"VER:.+":"VERB",
        r"SENT":'PONCT'
        }

    cz_tags = {
        r"^k1.*":"NOM",
        r"^k2.*":"ADJ",
        r"^k3.*":"PRO",
        r"^k4.*":"NUM",
        r"^k5.*":"VERB",
        r"^k6.*":"ADV",
        r"^k7.*":"PREP",
        r"^k8.*":"CONJ",
        r"^k9.*":"PART",
        r"^k0.*":"INTERJ",
        r"^kA.*":"ABREV",
        r"^kI.*":"PONCT"
        }
    df[['l1pos', 'l2pos','l3pos', 'l4pos', 'l5pos','r1pos','r2pos','r3pos','r4pos','r5pos']] = df[['l1pos', 'l2pos','l3pos', 'l4pos', 'l5pos','r1pos','r2pos','r3pos','r4pos','r5pos']].replace(to_replace =pl_tags, regex=True)
    df[['l1pos', 'l2pos','l3pos', 'l4pos', 'l5pos','r1pos','r2pos','r3pos','r4pos','r5pos']] = df[['l1pos', 'l2pos','l3pos', 'l4pos', 'l5pos','r1pos','r2pos','r3pos','r4pos','r5pos']].replace(to_replace =fr_tags, regex=True)
    df[['l1pos', 'l2pos','l3pos', 'l4pos', 'l5pos','r1pos','r2pos','r3pos','r4pos','r5pos']] = df[['l1pos', 'l2pos','l3pos', 'l4pos', 'l5pos','r1pos','r2pos','r3pos','r4pos','r5pos']].replace(to_replace =cz_tags, regex=True)
    
    # check if remaining not uniformized pos tag
#    uniqueValues = pd.unique(df[['r1pos', 'r2pos','r3pos','r4pos', 'r5pos','l1pos','l2pos','l3pos','l4pos','l5pos']].values.ravel('K'))
#    print(uniqueValues)

    # remove useless columns
    df.drop(labels=["contexteG","contexteD", "keyword"],inplace=True,  axis=1)
    
    print(df.head(1))
    
    # last cleaning
    df[df.columns] = df.apply(lambda x: x.str.strip())
    # check resulting dataframe and save to disk as csv for future use
    print("\n**************** Result : info ***********************")
    print(df.describe())
    print(df.info())

    ## synthesis on series context retrieval
    with open(dir_files + "all."+series+".contexts.info.tsv", mode="w", encoding="utf-8" ) as fin:
        fin.write("Lexeme-Formant-langue\tcorpus\tsubcorpus\tNombre résultat\trequête SE utilisée\n")
        for k in sorted(frames_info.keys()):
            infos = [info.split(",")[1] for info in frames_info[k]]
            fin.write(k + "\t" + "\t".join(infos) + "\n")
    outputdb = dir_files + "all."+series+".contexts.tsv"
    df.to_csv(outputdb,sep="\t", index=False)
    
    # solr df
    #lang, series, url	journal	date	country	sentence	key_word	key_pos	key_lemma	canon_morph	l1forme	l1pos	l1lemma	l2forme	l2pos	l2lemma	l3forme	l3pos	l3lemma	l4forme	l4pos	l4lemma	l5forme	l5pos	l5lemma	r1forme	r1pos	r1lemma	r2forme	r2pos	r2lemma	r3forme	r3pos	r3lemma	r4forme	r4pos	r4lemma	r5forme	r5pos	r5lemma

    df2 = df[['lang','url','date','journal','country','sentence','pos-text', 'key_word','id_concept']].copy(deep=True)
    df2.rename(columns={"journal": "source", "sentence": "contents", "key_word": "oov"}, inplace=True)
    df2['oov']= df2.oov.replace(to_replace='_',value=' ')
    outputsolr = dir_files + "all."+series+".contexts.solr.tsv"
    df2.to_csv(outputsolr,sep="\t", index=False)


    return (outputdb, df2,df)



# database insertion 
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


# apache solr deletion of data
def delete_all_documents(solr):
    
    ''' delete all docs in solr collection'''
    try:
        resp = solr.delete(q='*:*',commit=True)
        print(resp)
        return True
    except Exception as e:
        print("Error updating document to Apache Solr :" + str(e))
        return False


# apache solr insertion of data
def add_data_to_solr(solr, jsondata):
    ''' update doc in solr with linguisic analysis'''
    try:
        resp = solr.add(jsondata, commit=True)
        print(resp)
        return True
    except Exception as e:
        print("Error updating document to Apache Solr :" + str(e))
        return False

def get_SOLR_collection_info(solr_host,solr_collection):
    ''' get solr collection info with pysolr'''
    try:
        solr = pysolr.Solr(solr_host+ solr_collection, search_handler='/schema/fields', use_qt_param=False)
        resp = solr._send_request('get', '/schema/fields')
        print(resp)
        json_resp = json.loads(resp)
        print(json_resp)
        #for field in json_resp['fields']:
        #    print(field)
    except Exception as e:
        print("Error searching schema info -  Apache Solr :" + str(e))

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
# corpus generation pattern for all languages:
#'ces' exists but is buggy
# <lang>_jsi_newsfeed_<virt|lastmonth|curmonth>
langs = {'cs':False,'da':False,'de':'deu','en':'eng','es':'spa','fi':'fin','fr':'fra','it':'ita','nl':'nld','is':False,'no':False,'pt':'por'}
lang_corresp = {'deu':'de','eng':'en','spa':'es','fin':'fi','fra':'fr','ita':'it','nld':'nl','por':'pt'}

corpora = {}
for k in langs.keys():
    if langs[k] is not False:
        res = ('preloaded/' + langs[k] + '_jsi_newsfeed_virt','preloaded/' + langs[k] + '_jsi_newsfeed_lastmonth','preloaded/' + langs[k] + '_jsi_newsfeed_curmonth')
        corpora[k]=res

print(corpora)



#wordlist = ['corona','covid']
series = 'covid_19'


#exit()

# check of subdirectories exist and create them if not
dir_contexts = './res_contexts/'
os.makedirs(dir_contexts, exist_ok=True)

# loading lexemes_id-concept data
import pickle, unidecode
lex_id = pickle.load(open('lexemes_concept.pickle', mode='rb'))
#print(lex_id)
lexs_concept={}
for k in lex_id.keys():
    #if re.match(r"Anä",k):
    #    print("[",k,"]")
    k2 = k.strip()
    k2 = k.replace(" ",'_')
    k2 = unidecode.unidecode(k2)
    lexs_concept[k2]= lex_id[k]
print(lexs_concept)
#exit()


# parse output files from sketchengine and generate output file / dataframe
#(outputdb,dfsolr,df) = parse_contexts(series,dir_contexts)#,'*COVID*'
#exit()
# save data to apache solr collection
# Apache Solr parameters
solr_host = 'https://tal.lipn.univ-paris13.fr/solr8/'
solr_collection = 'covid19'
# schema 
solr_schema = solr_host + solr_collection + '/schema/fields?wt=json'
# get solr schema info
#get_SOLR_collection_info(solr_host,solr_collection)
# launch solr instance and check sanity
try :
    solr =  pysolr.Solr(solr_host + solr_collection, always_commit=True)
    solr.ping()
    print("connection to solr is ok.")
    # get solr schema info
    #get_SOLR_collection_info(solr_host,solr_collection)

except Exception as e:
    print("No Connection to Apache Solr Server. Check information (given is : " + solr_host + '). Error : ' + str(e))

# delete all documents from collection
print("cleaning solr collection")
delete_all_documents(solr)
# save data to apache solr
# read solr tsv file
outputsolr = dir_contexts + "all."+series+".contexts.solr.tsv"
print("reading solr tsv file")
for chunk in pd.read_csv(outputsolr,sep="\t", chunksize=100000):
    print("saving 100000 lines chunk to solr")
    datadict = chunk.to_dict(orient="records")
    add_data_to_solr(solr,datadict)
    


# version with return data from parse_contexts (useless if file too huge)
#print('Adding ' + str(len(datadict)) + ' documents')
#add_data_to_solr(solr, datadict)



exit()


# save data to db (phc.borrowings_contexts)
insert_contexts_into_db(outputdb)

# save data to db (phc.borrowings_description)
words = get_word_morph_lang_from_df(df)
insert_words_into_db(words)