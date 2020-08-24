#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul 29 09:12:01 2020

@author: emmanuelcartier
"""
import pysolr, json, requests, pprint
pp = pprint.PrettyPrinter(indent=4)


def get_SOLR_collection_info(solr_host,solr_collection):
    ''' get solr collection info with pysolr'''
    try:
        solr = pysolr.Solr(solr_host+ solr_collection, search_handler='/schema/fields', use_qt_param=False)
        resp = solr._send_request('get', '/schema/fields')
        #print(resp)
        json_resp = json.loads(resp)
        print(json_resp)
        for field in json_resp['fields']:
            print(field['name'], field['type'])
            if 'multiValued' in field:
                print('multiValued')
    except Exception as e:
        print("Error searching schema info -  Apache Solr :" + str(e))

def add_data_to_solr(solr, jsondata):
    ''' update doc in solr with linguisic analysis'''
    try:
        resp = solr.add(jsondata, commit=True)
        print(resp)
        return True
    except Exception as e:
        print("Error updating document to Apache Solr :" + str(e))
        return False

def update_to_SOLR(solr, res):
    ''' update doc in solr with linguisic analysis'''
    try:
        resp = solr.add([res],fieldUpdates={'pos-text':'set','neologismes':'set'}, commit=True)
        print(resp)
        return True
    except Exception as e:
        print("Error updating document to Apache Solr :" + str(e))
        return False


    
def delete_solr_data(solr):
    try:
        resp = solr.delete(q='*:*')
        print (resp)
        return True
    except Exception as e:
        print("Error deleting data -  Apache Solr :" + str(e))
    
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


def get_unique_values(solr_host, solr_collection, field):
    try:
        resp = requests.get(solr_host+ solr_collection+'/terms?terms.fl=' + field + '&terms.limit=10000')
        return resp.json()
        #solr2 = pysolr.Solr(solr_host+ solr_collection, search_handler='/terms', use_qt_param=False)
        #res = solr2.search({'terms.fl':field,'terms.limit':10000})
        #return res
    
    except Exception as e:
        print("Error :" + str(e))
        return False

# Apache Solr parameters
solr_host = 'https://tal.lipn.univ-paris13.fr/solr8/'
solr_collection = 'covid19'
# schema 
solr_schema = solr_host + '/' + solr_collection + '/schema/fields?wt=json'
# launch solr instance and check sanity
solr =  pysolr.Solr(solr_host+ solr_collection, always_commit=True)
try : 
    solr.ping()
    print("connection to solr is ok.")
    # get solr schema info
    get_SOLR_collection_info(solr_host,solr_collection)
    #delete_solr_data(solr)
    res = get_unique_values(solr_host, solr_collection, 'id_concept')
    concept_ids = res['terms']['id_concept'][0::2]
    #print(concept_ids, type(concept_ids))
    #exit()
    for id in concept_ids:
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
    
