#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 18 17:54:14 2020

# Tout d'abord demandez la génération d'une API_KEY (une clé) dans votre compte SketchEngine : 
# https://www.sketchengine.eu/documentation/api-documentation/#toggle-id-1 (Authentification)

# Pour plus d'infos sur les méthodes disponibles : https://www.sketchengine.eu/documentation/methods-documentation/


@author: emmanuelcartier
"""


import requests, time, json,re, glob,sys, unidecode
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
    filelist = []
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
                    filelist.append(filename)
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
                        filelist.append(filename)
                    else:
                        print("No result for this query : " + corp_fn[1] +  ", query :" + params_query['q'])
                except Exception as e:
                    print("Error : " + str(e))
                    print(traceback.format_exc())
    return filelist

def parse_contexts(series,dir_files, filelist):

    # get list of files from filelist argument
    #files = glob.glob(dir_files + "*"+series + '.' + word_pattern + ".csv")
    #print(files, "\n*****************\n")
    if len(filelist)==0:
        print("No file to parse. exiting function.")
        return (False, False)
    else:
        print(str(len(filelist)) +  " files to parse")

    #print(files)
    # where list of dataframes will go
    frames = []
    # where SE query will go (in the source file 4 first lines)
    frames_info={}
    # for each file
    for fn in filelist :
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

def query_solr(solr, query, params):
   '''
   Query Solr with given query and parameters
   '''
   try:
       res = solr.search(query, **params)
       #print(res)
       return res
   except Exception as e:
        print("Error updating document to Apache Solr :" + str(e))
        return False

# main

# parameters
concept_file = sys.argv[1]
db = './db/iate-covid19.db'
if len(sys.argv) != 3:
	print("No argument passed for concept file and sqlite db paths. Defaulting to : Concept file : ", concept_file, " and db : ", db)
else:
	concept_file = sys.argv[1]
	db = sys.argv[2]
	print("Concept file : ", concept_file, " Db file : ", db)

# corpus name generation pattern for all languages:
#'ces' exists but is buggy
# <lang>_jsi_newsfeed_<virt|lastmonth|curmonth>
langs = {'cs':False,'da':False,'de':'deu','en':'eng','es':'spa','fi':'fin','fr':'fra','it':'ita','nl':'nld','is':False,'no':False,'pt':'por'}
langs2 = [lang for lang in langs.keys() if not(langs[lang]==False) ]
lang_corresp = {'deu':'de','eng':'en','spa':'es','fin':'fi','fra':'fr','ita':'it','nld':'nl','por':'pt'}

corpora = {}
for k in langs.keys():
    if langs[k] is not False:
        res = ('preloaded/' + langs[k] + '_jsi_newsfeed_virt','preloaded/' + langs[k] + '_jsi_newsfeed_lastmonth','preloaded/' + langs[k] + '_jsi_newsfeed_curmonth')
        corpora[k]=res

print(corpora)

# Apache Solr parameters
solr_host = 'https://tal.lipn.univ-paris13.fr/solr8/'
solr_collection = 'covid19'


# generation of lexemes to be studied by language (from IATE db)
# reading file containing concept_ids
concepts_ids = {}
with open(concept_file, mode='r') as fin:
	for line in fin:
		concepts_ids[line.strip()]=1

# loading lexemes_id-concept data
print("Concepts ids : ",concepts_ids)
lexs_concept={}
wordlist={}

# for each concept_id get lexemes
for id in concepts_ids:
	#print(id)
	import sqlite3
	conn = sqlite3.connect(db)
	c = conn.cursor()
	c.execute("SELECT lang, value, id_concept FROM lexemes where id_concept=" + id)
	res = c.fetchall()
	conn.close()

	# generate wordlist from iate db to requests JSI contexts
	for (lang, value, id_concept) in res:
		if lang in langs2:
			data = wordlist.get(lang,[])
			#k2 = value.strip()
			#k2 = k.replace(" ",'_')
			#k2 = unidecode.unidecode(k2)
			#print(value,k2)
			lexs_concept[unidecode.unidecode(value.replace(" ",'_'))]=id_concept
			data.append(value)
			wordlist[lang] = data

print("word list : ",wordlist)
print("Lexemes - id_concept",lexs_concept)

series = 'covid_19'
# check of output subdirectories exist and create them if not
dir_contexts = './res_contexts/'
os.makedirs(dir_contexts, exist_ok=True)

#exit()
## generate contexts for each word from jsi web corpus (sketchengine query)
filelist = generate_wordlist_contexts_SELECT(series,wordlist, corpora, dir_res=dir_contexts)

# parse output files from sketchengine and generate output file / dataframe
(outputdb,dfsolr,df) = parse_contexts(series,dir_contexts, filelist)

# read solr tsv file and save to solr
# launch solr instance and check sanity
try :
    solr =  pysolr.Solr(solr_host + solr_collection, always_commit=True)
    solr.ping()
    print("connection to solr is ok.")
    # get solr schema info
    #get_SOLR_collection_info(solr_host,solr_collection)

except Exception as e:
    print("No Connection to Apache Solr Server. Check information (given is : " + solr_host + '). Error : ' + str(e))


outputsolr = dir_contexts + "all."+series+".contexts.solr.tsv"
print("reading solr tsv file")
for chunk in pd.read_csv(outputsolr,sep="\t", chunksize=100000):
    print("saving 100000 lines chunk to solr")
    datadict = chunk.to_dict(orient="records")
    add_data_to_solr(solr,datadict)

# generate json file for each concept
try : 
    for id in concepts_ids:
        # get all results from given query and save it to json file : two query : one to get number of hits, the other to get all results
        params = {'wt':'json','rows':1,'fl':'date,lang,country,source,url,contents,oov,id_concept'}
        query= 'id_concept:' + id
        print("retrieving contexts for id_concept : " + id)
        res = query_solr(solr,query,params)
        hits = res.hits
        print(hits, " results")
        if hits > 0:
            params['rows']= hits
            res = query_solr(solr,query,params)
            with open('./solr/' + id + '.json', 'w') as fout:
                json.dump(res.docs , fout)
            print("results saved in : " + './solr/' + id + '.json')
        else:
            print("No result for id concept : " + id)

except Exception as e:
    print("Problem with Apache Solr Server. Check error message : " + str(e))

# just reset concept_file
fout = open(concept_file, mode='w')
fout.close()
 
