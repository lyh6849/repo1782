from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.http import JsonResponse

import csv
from csv import DictReader
from csv import DictWriter
from csv import writer

from app1782.models import q_bank, a_bank, q_class, a_class

'''



import numpy as np
from numpy import array

import keras
from keras.preprocessing.text import one_hot
from keras.preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences
from keras.models import Sequential
from keras.layers.core import Activation, Dropout, Dense
from keras.layers import Flatten, LSTM
from keras.layers import GlobalMaxPooling1D
from keras.models import Model
from keras.layers.embeddings import Embedding
from keras.layers import Input
from keras.layers.merge import Concatenate

import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import layers
from tensorflow.keras import losses
from tensorflow.keras import preprocessing
from tensorflow.keras.layers.experimental.preprocessing import TextVectorization


import pandas as pd
import matplotlib.pyplot as plt
import os
import re
import shutil
import string
import seaborn as sns
import random
import math

from nltk.corpus import stopwords
from datetime import datetime
from sklearn.model_selection import train_test_split
'''

# Create your views here.
def home (request):  
    #return HttpResponse("Hello World")
    return render(request,'index.html')

def agenda(request):
    val=request.POST
    q_db=q_bank.objects.all().order_by('q_id')
    qc_db=q_class.objects.all().order_by('id')
    ac_db=a_class.objects.all().order_by('id')
    a_db=a_bank.objects.all().order_by('a_id')
    a_db2=a_bank.objects.values('a_id').order_by('a_id')
    #c_db=cc_db.objects.all().order_by('cc_id')
    answer_array=[]
    question_array=[]
    qc_array=[]
    ac_array=[]
    c_array=[]
    for a in a_db:
      answer_array.append([a.id,a.a_id,a.a_value,a.q_id,a.a_class])
    for q in q_db:
      question_array.append([q.id,q.q_id,q.q_value,q.q_type,q.q_class])
    
    #for c in c_db:
    #  c_array.append([c.id,c.cc_id,c.cc_lead_value,c.cc_value])
    for d in qc_db:
      qc_array.append([d.id,d.q_class,d.q_value,d.q_type])
    for e in ac_db:
      ac_array.append([e.id,e.q_class,e.a_class,e.a_value,e.q_class])
    #return render(request,'agenda.html',{'q_db':q_db, 'a_db':a_db, 'c_db':c_db, 'answer_array':answer_array, 'question_array':question_array, 'qc_array':qc_array, 'ac_array':ac_array, 'c_array':c_array})
    return render(request,'agenda.html',{'q_db':q_db, 'a_db':a_db,'answer_array':answer_array, 'question_array':question_array, 'qc_array':qc_array, 'ac_array':ac_array, 'c_array':c_array})

def getQuestions(request):
  input=str(request.POST['input'])
  result=agenda_text_to_predict(input)
  print(agenda_text_to_predict(input))
  print(output_qualify)
  j=0
  percent=0
  best=0
  for i in result:
    if i > percent:
      percent=i
      best=j
    j=j+1
  print(best)
  print(output_list[best])
  return JsonResponse({"questions":result, "q_list":output_qualify})


def initial_open(request):
  target_array_q=[]
  target_array_a=[]
  for i in q_bank.objects.all().order_by('q_id'):
    target_array_q.append([i.q_id,i.q_value,i.q_type,remove_last_n(i.q_id,4)])
  for i in a_bank.objects.all().order_by('a_id'):
    target_array_a.append([i.q_id,i.a_id,i.a_value])
  return JsonResponse({"target_array_q":target_array_q,"target_array_a":target_array_a})

def remove_last_n(aa,n):
    result=""
    count = 0
    while (count < len(aa)-n):   
        result=result+aa[count]
        count = count + 1
    return result