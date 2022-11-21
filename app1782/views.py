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
#from keras.layers.embeddings import Embedding
from keras.layers import Input
#from keras.layers.merge import Concatenate

import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import layers
from tensorflow.keras import losses
from tensorflow.keras import preprocessing
from tensorflow.keras.layers.experimental.preprocessing import TextVectorization


import pandas as pd
#import matplotlib.pyplot as plt
import os
import re
import shutil
import string
#import seaborn as sns
import random
import math

from nltk.corpus import stopwords
from datetime import datetime
#from sklearn.model_selection import train_test_split


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

def find_highest_three(array):
  m=sorted(array,reverse=True)
  n=0
  a_1=-1
  a_2=-1
  a_3=-1
  for i in array:
    if i ==m[0]:
      a_1=n
    elif i==m[1]:
      a_2=n
    elif i== m[2]:
      a_3=n
    n=n+1
  return a_1,a_2,a_3

def predict(input_data):
  output_list_271=[]
  for i in os.listdir("dream_data/train"):
    output_list_271.append(i)
  predict_array=model_748.predict(vectorize_layer(tf.expand_dims(input_data,-1)))[0]
  return output_list_271[find_highest_three(predict_array)[0]], output_list_271[find_highest_three(predict_array)[1]], output_list_271[find_highest_three(predict_array)[2]]

def predict_2(request):
  input_data=request.POST['input']
  output_list_271=[]
  print(input_data)
  input_data=id_to_predict_input(input_data)
  print(input_data)
  for i in os.listdir("dream_data/train"):
    output_list_271.append(i)
  predict_array=model_748.predict(vectorize_layer(tf.expand_dims(input_data,-1)))[0]
  print(output_list_271[find_highest_three(predict_array)[0]], output_list_271[find_highest_three(predict_array)[1]], output_list_271[find_highest_three(predict_array)[2]])
  print(class_to_value_converter(output_list_271[find_highest_three(predict_array)[0]]), class_to_value_converter(output_list_271[find_highest_three(predict_array)[1]]), class_to_value_converter(output_list_271[find_highest_three(predict_array)[2]]))
  return redirect('/')

def predict_3(request):
  input_data=request.POST['input']
  output_list_271=[]
  print(input_data)
  print("HHHHHHHHHHHH")
  for i in os.listdir("dream_data/train"):
    output_list_271.append(i)
  predict_array=model_748.predict(vectorize_layer(tf.expand_dims(input_data,-1)))[0]
  print(predict_array)
  print(output_list_271[find_highest_three(predict_array)[0]], output_list_271[find_highest_three(predict_array)[1]], output_list_271[find_highest_three(predict_array)[2]])
  print(class_to_value_converter(output_list_271[find_highest_three(predict_array)[0]]), class_to_value_converter(output_list_271[find_highest_three(predict_array)[1]]), class_to_value_converter(output_list_271[find_highest_three(predict_array)[2]]))
  return redirect('/')


def q_class_to_value(x):
  q_value_721=""
  if x=="none":
    q_value_721="none"
  for i in q_class.objects.all():
    if i.q_class==x:
      q_value_721=i.q_value
  return q_value_721

def update_data_set(text,label):
  pcp=0
  alarm=0
  etc=0
  label=int(label)
  if label==1:
    pcp=1
    alarm=0
    etc=1
  elif label==2:
    pcp=0
    alarm=1
    etc=1
  elif label==3:
    pcp=0
    alarm=0
    etc=1
  else: 
    pcp=0
    alarm=0
    etc=0

  row_contents = ["",text,pcp,alarm,etc]
  with open("data/train_ED_candidate.csv",'a',newline='') as fd:
    writer_object = writer(fd)  
    writer_object.writerow(row_contents)
    fd.close()

def find_highest(array):
  i=0
  n=0
  m=-100
  for j in array:
    if j>m:
      m=j
      i=n
    n=n+1
  return i 


def ajax_updator(request):
  text=request.POST['text_input']
  label=request.POST['label_input']
  update_data_set(text,label)
  return JsonResponse({"text": text, "label": label})

def edit_q_create_new_qc(request):
  new_qc=""
  last_qc_815=""
  q_type_815=""
  q_class_815=""
  for i in q_bank.objects.all():
    if i.q_id==request.POST['q_id']:
      q_type_815=i.q_type
      q_class_815=i.q_class
  for i in q_class.objects.all().order_by('q_class'):
    last_qc_815=i.q_class
  new_qc=remove_last_n(last_qc_815,3)+number_to_3_digits(int(select_last_n(last_qc_815,3))+1)
  target=q_class(q_value=request.POST['q_value'], q_class=new_qc, q_type=q_type_815)
  target.save()
  ans_numb_815=1
  for i in a_bank.objects.all().order_by("a_id"):
    if i.q_id==request.POST['q_id']:
      target=a_class(a_value=i.a_value, q_class=new_qc, a_class=new_qc+"a"+number_to_3_digits(ans_numb_815))
      target.save()
      target=get_object_or_404(a_bank,a_id=i.a_id)
      target.a_class=new_qc+"a"+number_to_3_digits(ans_numb_815)
      target.save()
      ans_numb_815=ans_numb_815+1
  for i in q_bank.objects.all():
    if i.q_id==request.POST['q_id']:
      target=get_object_or_404(q_bank,id=i.id)
      target.q_value=request.POST['q_value']
      target.q_class=new_qc
      target.save()
  return redirect('/')
  
def edit_q_apply_exst_qc(request):
  q_class_153=""
  for i in q_bank.objects.all():
    if i.q_id==request.POST['q_id']:
      q_class_153=i.q_class
  target=get_object_or_404(q_class,q_class=q_class_153)
  target.q_value=request.POST['q_value']
  target.save()
  target=get_object_or_404(q_bank,q_id=request.POST['q_id'])
  target.q_value=request.POST['q_value']
  target.save()
  same_q_class=[]
  for i in q_bank.objects.all():
    if i.q_class==q_class_153:
      same_q_class.append(i.q_id)
      target=get_object_or_404(q_bank,id=i.id)
      target.q_value=request.POST['q_value']
      target.save()
  return JsonResponse({'same_q_class':same_q_class})

def add_a_create_new_qc(request):
  new_qc=""
  q_value_751=""
  q_type_751=""
  last_qc_751=""
  for i in q_class.objects.all().order_by('q_class'):
    last_qc_751=i.q_class
  new_qc=remove_last_n(last_qc_751,3)+number_to_3_digits(int(select_last_n(last_qc_751,3))+1)
  for i in q_bank.objects.all():
    if i.q_id==request.POST['q_id']:
      target=get_object_or_404(q_bank,id=i.id)
      q_value_751=i.q_value
      q_type_751=i.q_type
      target.q_class=new_qc
      target.save()
  new_ac_numb=1
  for i in a_bank.objects.all().order_by('a_id'):
    if i.q_id==request.POST['q_id']:
      target=get_object_or_404(a_bank,id=i.id)
      target.a_class=new_qc+"a"+number_to_3_digits(new_ac_numb)
      target.save()
      target=a_class(q_class=new_qc, a_class=new_qc+"a"+number_to_3_digits(new_ac_numb), a_value=i.a_value)
      target.save()
      new_ac_numb=new_ac_numb+1

  target=q_class(q_class=new_qc,q_type=q_type_751, q_value=q_value_751)
  target.save()
  target=a_bank(a_id=request.POST['a_id'], a_class=new_qc+"a"+number_to_3_digits(new_ac_numb), q_id=request.POST['q_id'], a_value=request.POST['a_value'])
  target.save()
  target=a_class(a_class=new_qc+"a"+number_to_3_digits(new_ac_numb), a_value=request.POST['q_id'],q_class=new_qc)
  target.save()
  return redirect('/')


  
def edit_a_create_new_qc(request):
  new_qc=""
  q_value_513=""
  q_type_513=""
  last_qc_513=""
  for i in q_class.objects.all().order_by('q_class'):
    last_qc_513=i.q_class
  new_qc=remove_last_n(last_qc_513,3)+number_to_3_digits(int(select_last_n(last_qc_513,3))+1)
  for i in q_bank.objects.all():
    if i.q_id==request.POST['q_id']:
      target=get_object_or_404(q_bank,id=i.id)
      q_value_513=i.q_value
      q_type_513=i.q_type
      target.q_class=new_qc
      target.save()
  for i in a_bank.objects.all().order_by('a_id'):
    if i.a_id==request.POST['a_id']:
      target=get_object_or_404(a_bank,id=i.id)
      target.a_value=request.POST['a_value']
      target.save()
  new_ac_numb=1
  for i in a_bank.objects.all().order_by('a_id'):
    if i.q_id==request.POST['q_id']:
      target=get_object_or_404(a_bank,id=i.id)
      target.a_class=new_qc+"a"+number_to_3_digits(new_ac_numb)
      target.save()
      target=a_class(q_class=new_qc, a_class=new_qc+"a"+number_to_3_digits(new_ac_numb), a_value=i.a_value)
      target.save()
      new_ac_numb=new_ac_numb+1
  target=q_class(q_class=new_qc, q_value=q_value_513, q_type=q_type_513)
  target.save()
  return redirect('/')
  
def edit_a_apply_exst_qc(request):
  a_class_725=""
  same_class_id=[]
  for i in a_bank.objects.all():
    if i.a_id==request.POST['a_id']:
      a_class_725=i.a_class
  target=get_object_or_404(a_class,a_class=a_class_725)
  target.a_value=request.POST['a_value']
  target.save()
  for i in a_bank.objects.all():
    if i.a_class==a_class_725:
      target=get_object_or_404(a_bank,id=i.id)
      target.a_value=request.POST['a_value']
      target.save()
      same_class_id.append(i.a_id)
  return JsonResponse({'same_class_id':same_class_id})

def new_ac(q_id_178):
  for i in a_bank.objects.all():
    if i.q_id==q_id_178:
      last_a_class_178=i.a_class
  new_ac=remove_last_n(last_a_class_178,3)+number_to_3_digits(int(select_last_n(last_a_class_178,3))+1)
  return new_ac


def collapse_cc(request):
  target_array=[]
  for i in q_bank.objects.all():
    if len(i.q_id)==12:
      target_array.append(i.q_id)
  return JsonResponse({"target_array":target_array})

def add_a_apply_exst_qc(request):
  a_class_178=""
  a_value_178=request.POST['a_value']
  q_id_178=remove_last_n(request.POST['a_id'],4)
  same_class_id=[]
  same_class_pair=[]
  for i in q_bank.objects.all():
    if i.q_class==id_to_class_converter(q_id_178):
      same_class_id.append(i.q_id)
  target=a_class(a_class=new_ac(q_id_178),a_value=a_value_178,q_class=id_to_class_converter(q_id_178))
  target.save()
  for i in same_class_id:
    for j in a_bank.objects.all().order_by('a_id'):
      if j.q_id==i:
        last_a_id_178=j.a_id
    new_a_id_178=remove_last_n(last_a_id_178,3)+number_to_3_digits(int(select_last_n(last_a_id_178,3))+1)
    target=a_bank(a_id=new_a_id_178,a_value=a_value_178,q_id=i,a_class=new_ac(i))
    target.save()
    same_class_pair.append([i,new_a_id_178])
  return JsonResponse({'same_class_pair':same_class_pair})
 




def q_value_update(request):
  q_value=request.POST['q_value']
  cf = pd.read_csv(AGENDA_Q_DATA)
  df = cf.values
  duplicate_check=0
  row_numb=-1
  dup_location=-1
  for i in df:
    row_numb=row_numb+1
    if i[1] == q_id:
        duplicate_check=1
        dup_location=row_numb
  if duplicate_check==1:
    cf.loc[dup_location, 'qa']=q_value
    cf.to_csv(AGENDA_Q_DATA, index=False)

def texttext(text):
  text=str(text)
  array=[]
  array.append(text)
  sequence=tokenizer.texts_to_sequences(array)  
  sequence=pad_sequences(sequence, maxlen=max_length, padding=padding_type, truncating=trunc_type)
  return model.predict(np.expand_dims(sequence[0], 0))[0]

def text_to_predict(text):
  text=str(text)
  array=[]
  array.append(text)
  sequence_mass=tokenizer_mass.texts_to_sequences(array)  
  sequence_mass=tf.keras.preprocessing.sequence.pad_sequences(sequence_mass, maxlen=max_len)
  #model.predict(np.expand_dims(sequence_mass[0], 0))[0]
  print(str(model.predict(np.expand_dims(sequence_mass[0], 0), train=False)))
  return_array2=[]
  return return_array2
  '''
  return_array=[]
  for i in model.predict(np.expand_dims(sequence_mass[0], 0))[0]:
    return_array.append(round(i,2))
  for j in return_array:
    return_array2.append(round(j*100,0))
  '''  
  

def classifier(request):
  output=request.POST['ajax_input']
  center=request.POST['ajax_center']
  number=request.POST['line_count']

  text=output
  output=str(text_to_predict(output))
  print(number+center)
  return JsonResponse({"example": output,"example2":text,"center":center})
  #return model.predict(np.expand_dims(test_text[0], 0))[0][0]

def home (request):  
    return render(request,'index.html')

def home2(request):
    val=request.POST
    q_db=question_db.objects.all().order_by('q_id')
    a_db=answer_db.objects.all().order_by('a_id')
    a_db2=answer_db.objects.values('a_id').order_by('a_id')
    return render(request,'test.html',{'q_db':q_db, 'a_db':a_db, 'result':val})

def home4(request):
  cc_array=[]
  a_db=a_bank.objects.all().order_by('a_id')
  for a in a_db:
    if len(a.a_id)==4 and a.q_id=="q001":
      cc_array.append([a.a_value])
  return render(request,'questionnaire.html',{"cc_array":cc_array})


def auto_ajax(request):
  target_array_qc=[]
  target_array_ac=[]
  for i in q_class.objects.all().order_by('q_class'):
    target_array_qc.append([i.q_class,i.q_value])
  for i in a_class.objects.all().order_by('a_class'):
    target_array_ac.append([i.a_class,i.a_value,i.q_class])
  return JsonResponse({"target_array_qc":target_array_qc,"target_array_ac":target_array_ac})

def select_2(request):
  children=[]
  qb=q_bank.objects.all()
  parent_a_id=request.POST['a_id']
  copy_a_id=request.POST['a_id']

  for i in qb:
    if remove_last_n(i.q_id,4)==parent_a_id:
      children.append(i.q_id)
  while len(children)==0 and len(copy_a_id)>0:
    for i in qb: 
      if len(children)==0 and remove_last_n(i.q_id,4)==remove_last_n(copy_a_id,8) and int(select_last_n(i.q_id,3))>int(select_last_n(remove_last_n(copy_a_id,4),3)):
        children.append(i.q_id)
  q_id=remove_last_n(request.POST['a_id'],4)
  for i in q_bank.objects.all():
    if i.q_id==q_id:
      q_type=i.q_type
    if remove_last_n(i.q_id,4)==request.POST['a_id']:
      children.append(i.q_id)
  siblings=[]
  for i in a_bank.objects.all():
    if i.q_id==q_id and i.a_id!=request.POST['a_id']:
      siblings.append(i.a_id)
  
  print(request.POST['a_id'])
  print(q_type)
  print(siblings)
  return JsonResponse({"q_type":q_type,"siblings":siblings,"children":children})


  
def next_questionnaire(request):
  
  q_list=[]
  q_details=[]
  a_details=[]
  siblings=[]
  siblings_children=[]

  qb=q_bank.objects.all().order_by('q_id')
  ab=a_bank.objects.all().order_by('a_id')
  a_id=request.POST['a_id']

  parent_a_id=a_id
  copy_a_id=parent_a_id
  q_id=remove_last_n(a_id,4)

  for i in q_bank.objects.all():
    if i.q_id==q_id:
      q_type=i.q_type

  for i in qb:
    if remove_last_n(i.q_id,4)==parent_a_id:
      q_list.append(i.q_id)
  while len(q_list)==0 and len(copy_a_id)>0:
    for i in qb: 
      if len(q_list)==0 and remove_last_n(i.q_id,4)==remove_last_n(copy_a_id,8) and int(select_last_n(i.q_id,3))>int(select_last_n(remove_last_n(copy_a_id,4),3)):
        q_list.append(i.q_id)
    copy_a_id=remove_last_n(copy_a_id,8)
  print(q_list)
  for i in q_list:
    for j in qb:
      if j.q_id==i:
        q_details.append([j.q_id,j.q_value,j.q_type])
    for j in ab:
      if j.q_id==i:
        a_details.append([i,j.a_id,j.a_value])
  print(a_details)
  for i in a_bank.objects.all():
    if i.q_id==q_id and i.a_id!=a_id:
      siblings.append(i.a_id)
  
  for i in siblings:
    copy_a_id=parent_a_id
    for i in qb:
      if remove_last_n(i.q_id,4)==parent_a_id and element_exst_check(siblings_children,i.q_id)==-1:
        siblings_children.append(i.q_id)
    while len(q_list)==0 and len(copy_a_id)>0:
      for i in qb: 
        if len(q_list)==0 and remove_last_n(i.q_id,4)==remove_last_n(copy_a_id,8) and int(select_last_n(i.q_id,3))>int(select_last_n(remove_last_n(copy_a_id,4),3)) and element_exst_check(siblings_children,i.q_id)==-1:
          siblings_children.append(i.q_id)
      copy_a_id=remove_last_n(copy_a_id,8)
  return JsonResponse({"q_list":q_list,"q_details":q_details,"a_details":a_details,"siblings":siblings,"siblings_children":siblings_children, "q_type":q_type})

def cc_list_maker(request):
  cc_list=[]
  for j in a_bank.objects.all().order_by('a_id'):
    if j.q_id=="q001":
      cc_list.append([j.a_id,j.a_value])
  return JsonResponse({"cc_list":cc_list})

def branch_copy(request):
  input_id_7516=request.POST['a_id']
  parent_id_7516=request.POST['parent_id_7516']
  print("We got "+str(input_id_7516))
  q_7516=[]
  a_7516=[]
  n=len(input_id_7516)
  for a in a_bank.objects.all().order_by('a_id'):
    if(len(a.a_id)>=n):
      if (first_n(a.a_id,n)==input_id_7516):
        a_7516.append([parent_id_7516+remove_first_n(a.a_id,n),a.a_value,a.a_class])
        print(a.a_id)
  for a in q_bank.objects.all().order_by('q_id'):
    if(len(a.q_id)>=n):
      
      if (first_n(a.q_id,n)==input_id_7516):
        q_7516.append([parent_id_7516+remove_first_n(a.q_id,n),a.q_value,a.q_type,a.q_class])
        print(a.q_id)
  return JsonResponse({"q_7516":q_7516,"a_7516":a_7516})


def letstart(request):
  q_details=[]
  a_details=[]
  cc_list=[]
  for i in q_bank.objects.all().order_by('q_id'):
    if i.q_id=="q000":
      q_details.append([i.q_id,i.q_value,i.q_type])
  for j in a_bank.objects.all().order_by('a_id'):
    if j.q_id=="q000":
      a_details.append(["q000",j.a_id,j.a_value])
  return JsonResponse({"q_details":q_details,"a_details":a_details})

def last_element_in_array(array):
  if len(array)==0:
    result=""
  elif len(array)>0:
    result=array[len(array)-1]
  return result

def find_last_children(request):
  qc=request.POST['q_class']
  ac_db=a_class.objects.all().order_by('a_class')
  last_child_numb=0
  for i in ac_db:
    if (i.q_class==qc):
      if(int(i.a_class[-3:])>last_child_numb):
        last_child_numb=int(i.a_class[-3:])
  return JsonResponse({"last_child_numb":last_child_numb})

def delete_a_from_data_2(request):
  print("here")

  id_151=request.POST['id_151']
  used_151=1
  for i in a_bank.objects.all():
    if i.a_id==id_151:
      used_151=used_151+1
  if used_151==1:
    target=get_object_or_404(a_bank,a_id=id_151)
    target.delete()
    target=get_object_or_404(a_class,a_id=id_151)
    target.delete()
  return JsonResponse({"used":used_151})
     
def class_used_counter(request):
  qc=request.POST['q_class']
  ac=request.POST['a_class']
  a_db=a_bank.objects.all().order_by('a_id')
  q_db=q_bank.objects.all().order_by('q_id')
  q_count=0
  a_count=0
  #print("ajax working")
  for i in q_db:
    if(i.q_class==qc):
      q_count=q_count+1
      #print("got you!qqq")
  for i in a_db:
    if(i.a_class==ac):
      a_count=a_count+1
      #print("got you!aaa")
  return JsonResponse({"q_count":q_count,'a_count':a_count})

def class_used_counter_by_id(request):
  q_id_151=request.POST['q_id']
  a_id_151=request.POST['a_id']
  a_db=a_bank.objects.all().order_by('a_id')
  q_db=q_bank.objects.all().order_by('q_id')
  qc=""
  ac=""
  #qc_db=q_class.objects.all().order_by('q_class')
  #ac_db=a_class.objects.all().order_by('a_class')
  q_count=0
  a_count=0
  #print("ajax working")
  for i in q_db:
    if(i.q_id==q_id_151):
      qc=i.q_class
  for i in q_db:
    if(i.q_class==qc):
      q_count=q_count+1
      #print("got you!qqq")
  for i in a_db:
    if(i.a_id==a_id_151):
      ac=i.a_class
  for i in a_db:
    if(i.a_class==ac):
      a_count=a_count+1
      #print("got you!aaa")
  return JsonResponse({"q_count":q_count,'a_count':a_count})

def readFile(fileName):
  fileObj = open(fileName, "r") #opens the file in read mode
  words = fileObj.read().splitlines() #puts the file into an array
  fileObj.close()
  return words

def new_qc(request):
  last_qc=""
  for i in q_class.objects.all().order_by('q_class'):
    last_qc=i.q_class
  return JsonResponse({"last_qc":last_qc})

def mass_classifier(request):
    mass_text=request.POST['input']
    mass_text=mass_text.split('\n')
    length=len(mass_text)
    output=[]
    text=[]
    k=0
    for i in mass_text:
      k=k+1
      if len(i)>3:
        kkk=0
        print(str(k)+str(text_to_predict(i))+str(datetime.now()))
        #text.append(i)
        #output.append(text_to_predict(i))
        #print(str(k)+"/"+str(length)+" "+str(datetime.now())+"  "+str(text_to_predict(i))+": "+i)

    pcp=[]
    alarm=[]
    etc=[]
    #for i in output:
      #pcp.append(i[0])
      #alarm.append(i[1])
      #etc.append(i[2])
    return JsonResponse({"text":text,"pcp":pcp,"alarm":alarm,"etc":etc})

def exst_q_select(request):
  parent_id=""
  q_id=""
  q_value=""
  q_type=""
  a_array_382=[]
  qc_db=q_class.objects.all()
  ac_db=a_class.objects.all().order_by('a_class')
  for i in qc_db:
    if i.q_class==request.POST['q_class']:
      q_value=i.q_value
      q_type=i.q_type
  for i in ac_db:
    if i.q_class==request.POST['q_class']:
      a_array_382.append([i.a_value,i.a_class])
  return JsonResponse({"a_array_382":a_array_382,"q_value":q_value,"q_type":q_type})

def id_to_class_converter(id_256):
  class_256=""
  for i in a_bank.objects.all():
    if i.a_id==id_256:
      class_256=i.a_class
  for i in q_bank.objects.all():
    if i.q_id==id_256:
      class_256=i.q_class
  return class_256

def class_to_value_converter(class_256):
  value_256=""
  for i in a_bank.objects.all():
    if i.a_class==class_256:
      value_256=i.a_value
  for i in q_bank.objects.all():
    if i.q_class==class_256:
      value_256=i.q_value
  return value_256

def id_to_class_array_converter(array):
  class_array=[]
  for i in array:
    class_array.append(id_to_class_converter(i))
  return class_array

def id_to_value_converter(id_256):
  value_256=""
  for i in a_bank.objects.all():
    if i.a_id==id_256:
      value_256=i.a_value
  for i in q_bank.objects.all():
    if i.q_id==id_256:
      value_256=i.q_value
  return value_256

def id_to_value_array_converter(array):
  v_array=[]
  for i in array:
    v_array.append(id_to_value_converter(i))
  return v_array

def subtract_element(array,a):
  new_array=[]
  for i in array:
    if i != a:
      new_array.append(i)
  return new_array

def add_element(array,element):
  result_array=[]
  for i in array:
    result_array.append(i)
  result_array.append(element)
  return result_array

def element_exst_check(array,element):
  result = -1
  for i in array:
    if i == element:
      result=1
  return result

def last_element(array):
  return array[len(array)-1]

def order_arranger(a,b):
  superior=1
  if len(a)>len(b):
    length=len(b)
  elif len(b)>=len(a):
    length=len(a)
  i=0
  r=i%4
  while (i<length):
    if r!=0: 
      if int(a[i])>int(b[i]):
        superior=-1
    i=i+1
  return superior

def remove_first_n(a,n):
    result=""
    i=n
    while (i<len(a)):
        result=result + a[i]
        i=i+1
    return result

def first_n(aa,n):
  result=""
  count=0
  while (count<n):
    result=result+aa[count]
    count=count+1
  return result

def last_n(aa,n):
    result=""
    count=len(aa)-n
    while (count < len(aa)):
        result=result+aa[count]
        count = count + 1
    return result

def select_last_n(aa,n):
    result=""
    count=len(aa)-n
    while (count < len(aa)):
        result=result+aa[count]
        count = count + 1
    return result

def number_to_3_digits(n):
  aa=select_last_n("0000"+str(n),3)
  return aa 

def ac_insert(request):
  new_ac=a_class(q_class=request.POST['q_class'], a_class=request.POST['a_class'], a_value=request.POST['a_value'])
  new_ac.save()
  return redirect('/')

def qc_insert(request):
  new_qc=q_class(q_class=request.POST['q_class'], q_value=request.POST['q_value'], q_type=request.POST['q_type'])
  new_qc.save()
  return redirect('/')

def q_insert(request):
    q_db = q_bank(q_id=request.POST['q_id'], q_value=request.POST['q_value'], q_type=request.POST['q_type'],q_class=request.POST['q_class'])
    q_db.save()
    return redirect('/')
 
def cc_insert(request):
    cc_db_insert = cc_db(cc_id="", cc_lead_value="", cc_value=request.POST['c_value'])
    cc_db_insert.save()
    return redirect('/')
 
def a_insert(request):
    a_db = a_bank(a_id=request.POST['a_id'], a_value=request.POST['a_value'], q_id=request.POST['q_id'],a_class=request.POST['a_class'])
    a_db.save()
    return redirect('/')
 
def q_delete(request):
    target=get_object_or_404(q_bank, q_id=request.POST['q_id'])
    target.delete()
    return redirect('/')
 
def a_delete(request):
    target=get_object_or_404(a_bank,a_id=request.POST['a_id'])
    target.delete()
    return redirect('/')
 
def ac_delete(request):
    target=get_object_or_404(a_class,a_class=request.POST['a_class'])
    target.delete()
    return redirect('/')

def a_dbl_del_by_id(request):
  ac=""
  for i in a_bank.objects.all().order_by('a_id'):
    if i.a_id==request.POST['a_id']:
      ac=i.a_class
      target = get_object_or_404(a_bank, id=i.id)
      target.delete()
  for i in a_class.objects.all().order_by('a_class'):
    if i.a_class==ac:
      target=get_object_or_404(a_class,id=i.id)
      target.delete()
  return redirect('/')

def q_dbl_del_by_id(request):
  qc=""
  for i in q_bank.objects.all().order_by('q_id'):
    if i.q_id==request.POST['q_id']:
      qc=i.q_class
      target = get_object_or_404(q_bank, q_id=request.POST['q_id'])
      target.delete()
  for i in q_class.objects.all().order_by('q_class'):
    if i.q_class==qc:
      target=get_object_or_404(q_class,id=i.id)
      target.delete()
  return redirect('/')

def qc_delete(request):
    target=get_object_or_404(q_class,q_class=request.POST['q_class'])
    target.delete()
    return redirect('/')

def test_function(request):
    print("working")
    return redirect('/')

def to_data(request):
    val=request.POST
    return render(request,'to_data.html',{'result':val})
 
def createQuestion(request):
    context={}
    return render(request,'index.html',context)
 
def a_value_update(request):
    a_use_count=0
    ac_523=""
    a_value_612=request.POST['a_value']
    for i in a_bank.objects.all().order_by('a_id'):
      if i.a_id==request.POST['a_id']:
        ac_523=i.a_class
    for i in a_bank.objects.all():
      if i.a_class==ac_523:
        a_use_count=a_use_count+1

    if a_use_count==1:
      for i in a_bank.objects.all():
        if i.a_class==ac_523:
          print(ac_523)
      target = get_object_or_404(a_bank, a_class=ac_523)
      target.a_value = a_value_612
      target.save()
      target=get_object_or_404(a_class,a_class=ac_523)
      target.a_value=a_value_612
      target.save()
    return JsonResponse({'a_use_count':a_use_count})  
 
def q_value_update_ajax(request):
  q_count_852=0
  qc_852=""
  for i in q_bank.objects.all():
    if i.q_id==request.POST['q_id']:
      qc_852=i.q_class
  for i in q_bank.objects.all():
    if i.q_class==qc_852:
      q_count_852=q_count_852+1
  if q_count_852==1:
    target=get_object_or_404(q_bank,q_id=request.POST['q_id'])
    target.q_value=request.POST['q_value']
    target.save()
    target=get_object_or_404(q_class,q_class=qc_852)
    target.q_value=request.POST['q_value']
    target.save()
  return JsonResponse({'q_use_count':q_count_852})   

def q_type_update(request):
    instance = get_object_or_404(q_bank, q_id=request.POST['q_id'])
    instance.q_type=request.POST['question_type']
    instance.save()
    q_db=q_bank.objects.all().order_by('q_id')
    qc=""
    for i in q_db:
      if i.q_id==request.POST['q_id']:
        qc=i.q_class
    instance_c = get_object_or_404(q_class, q_class=qc)
    instance_c.q_type=request.POST['question_type']
    instance_c.save()
    same_type_q_id=[]
    for i in q_db:
      if i.q_class==qc:
        same_type_q_id.append(i.q_id)
        instance2 = get_object_or_404(q_bank, id=i.id)
        instance2.q_type=request.POST['question_type']
        instance2.save()
    return JsonResponse({'same_type_q_id':same_type_q_id})
 
def question_suggest(request):
    a_db = answer_db(a_id="test", q_value="test", q_id="test")
    a_db.save()
    return redirect('/')
 
def predict_input(x):
    input=""
    original_id=x
    add_id=original_id
    while len(add_id)>0:
        a1 = re.findall("([aq\d]*)([aq])(\d\d\d$)", add_id)
        n1= int(a1[0][2])
        if a1[0][1]=="q":
            q=re.findall("{\'q_value\': \'([a-z,A-Z,\.,\s]+)\'}", str(question_db.objects.values('q_value').get(q_id=add_id)))[0]
            input=q+" "+input
            if n1>1:
                n1=n1-1
                add_id= a1[0][0]+a1[0][1]+f'{n1:03}'
            elif n1==1:
                add_id= a1[0][0]
        elif a1[0][1]=="a":
            a=re.findall("{\'a_value\': \'([a-z,A-Z,\.,\s]+)\'}", str(answer_db.objects.values('a_value').get(a_id=add_id)))[0]
            input=a+" "+input
            n1=n1-1
            add_id= a1[0][0]
    return input
 
def residual_delete(request):
  q_id=request.POST['q_id']
  a_id=request.POST['a_id']
  #q_id=re.findall("{\'q_id\': \'([a-z,A-Z,\.,\s]+)\'}", str(answer_db.objects.values('q_id').get(id=a_id)))[0]
  n=question_db.objects.filter(q_id=q_id).count()
  if n==0:
    target=get_object_or_404(answer_db,id=a_id)
    target.delete()
    return redirect('/')

def residual_delete2(request):
  q_id=request.POST['q_id']
  a_id=request.POST['a_id']
  #q_id=re.findall("{\'q_id\': \'([a-z,A-Z,\.,\s]+)\'}", str(answer_db.objects.values('q_id').get(id=a_id)))[0]
  n=answer_db.objects.filter(a_id=a_id).count()
  if n==0:
    if len(a_id)>3:
      target=get_object_or_404(question_db,id=q_id)
      target.delete()
  return redirect('/')

def dup_q_delete(request):
  input_id=request.POST['id']
  target=get_object_or_404(question_db,id=input_id)
  target.delete()
  return redirect('/')
    
def dup_a_delete(request):
  input_id=request.POST['id']
  target=get_object_or_404(answer_db,id=input_id)
  target.delete()
  return redirect('/')

def first_n_array(array,n):
    i=0
    result=[]
    while i<n:
        result.append(array[i])
        i=i+1
    return result

def array_to_string(array):
  string_391=""
  for i in array: 
    if string_391=="":
      string_391=str(i)
    else:
      string_391=string_391+" "+str(i)
  return string_391

def id_to_predict_input(x):
  input_array=[]
  while len(x)>=8:
    input_array.append(id_to_class_converter(x))
    x=remove_last_n(x,8)
  reverse_array=[]
  j=0
  while j<len(input_array):
    reverse_array.append(input_array[len(input_array)-1-j])
    j=j+1
  return array_to_string(reverse_array)

def id_to_string(x):
  input_array=[]
  while len(x)>=8:
    input_array.append(x)
    x=remove_last_n(x,8)
  reverse_array=[]
  j=0
  while j<len(input_array):
    reverse_array.append(input_array[len(input_array)-1-j])
    j=j+1
  return array_to_string(reverse_array)


def id_to_value_string(x):
  input_array=[]
  while len(x)>=8:
    input_array.append(id_to_value_converter(x))
    x=remove_last_n(x,8)
  reverse_array=[]
  j=0
  while j<len(input_array):
    reverse_array.append(input_array[len(input_array)-1-j])
    j=j+1
  return array_to_string(reverse_array)

def string_to_array(x):
  result_array=[]
  next_str=""
  for i in x: 
    print(i)
    if i==" ":
      result_array.append(next_str)
      next_str=""
    else:
      next_str=next_str+i
    print(next_str)
  return result_array


def add_row_to_csv(file_271,row_content_271):
  with open (file_271,'a',newline='') as a_271:
    writer_271=csv.writer(a_271,delimiter=',')
    writer_271.writerow(row_content_271)


def db_to_scenario_simple():
  f=open("scenario_class.csv",'w')
  f.truncate()
  f.close()
  q_bank_data=[]
  for i in a_bank.objects.all().order_by("a_id"):
    last_ans=0
    a_id_457=i.a_id
    for j in q_bank.objects.all().order_by("q_id"):
      if remove_last_n(j.q_id,4)==a_id_457 and last_ans==0:
        last_ans=1
        new_row=[id_to_string(a_id_457), id_to_predict_input(a_id_457), id_to_value_string(a_id_457),j.q_class,j.q_value,j.q_id]
    while last_ans==0 and len(a_id_457)>8:
      for j in q_bank.objects.all().order_by("q_id"):
        if remove_last_n(j.q_id,4)==remove_last_n(a_id_457,8) and int(select_last_n(j.q_id,3))>int(select_last_n(remove_last_n(a_id_457,4),3)):
          last_ans=1
          new_row=[id_to_string(a_id_457), id_to_predict_input(a_id_457), id_to_value_string(a_id_457),j.q_class,j.q_value,j.q_id]
      if last_ans==0:
        a_id_457=remove_last_n(a_id_457,8)
    if last_ans==0:
      new_row=[id_to_string(a_id_457),id_to_predict_input(a_id_457), id_to_value_string(a_id_457),"qc999","NA","NA"]
    add_row_to_csv('scenario_class.csv',new_row)







def db_to_scenario():
  f=open("scenario_class.csv",'w')
  f.truncate()
  f.close()

  if not os.path.exists("scenario"):
    os.makedirs("scenario")
  elif os.path.exists("scenario"):
    shutil.rmtree("scenario")
  combine=[]
  cc_list=[]
  for i in a_bank.objects.all():
    if len(i.a_id)==8 and first_n(i.a_id,4)=="q001":
      cc_list.append(i.a_id)
  for p in cc_list:
    output=p
    same_cc_id=[]
    scenario_array=[]
    input_array=[]
    out_id=output
    first_id=first_n(out_id,8)
    scenario_array=[[first_id]]
    for i in a_bank.objects.all().order_by("a_id"):
      if first_n(i.a_id,8)==first_id:
        same_cc_id.append(i.a_id)

    h=1
    final_length=0
    while h<999:
      #print("Round "+str(h)+", scenarrio_array length: "+str(len(scenario_array)))
      i_a=0
      
      for i in scenario_array:
        i_a=i_a+1
        last_element_in_i=i[len(i)-1]
        absolute_last_element=i[len(i)-1]
        interim_3=[]
        interim_j=[]
        interim_j_2=[]
        interim_j_3=[]
        for j in same_cc_id:
          if len(j)==len(last_element_in_i)+8 and first_n(j,len(last_element_in_i))==last_element_in_i:
            interim_j.append(j)
        if len(interim_j)>0:
          k=1
          next_q_id=first_n(remove_first_n(interim_j[0],len(last_element_in_i)),4)
          for y in interim_j:
            if first_n(remove_first_n(y,len(last_element_in_i)),4)==next_q_id:
              interim_3=add_element(interim_3,add_element(i,y))
              interim_j_3.append(y)
          with open ('scenario_class.csv','a',newline='') as a_185:
            writer_185=csv.writer(a_185,delimiter=',')
            writer_185.writerow([array_to_string(i), array_to_string(id_to_class_array_converter(i)), array_to_string(id_to_value_array_converter(i)),id_to_class_converter(str(last_element(i))+next_q_id),id_to_value_converter(str(last_element(i))+next_q_id)])
          scenario_array=subtract_element(scenario_array,i)
          for u in interim_3:
            scenario_array.append(u)
        if len(interim_j)==0:
          t=0
          while len(last_element_in_i) > 0 and t==0:
            for n in same_cc_id:
              if remove_last_n(n,8) == last_element_in_i and len(absolute_last_element)>=len(n) and int(first_n(last_n(n,7),3)) > int(first_n(last_n(first_n(absolute_last_element,len(n)),7),3)):
                interim_j.append(n)
                next_q_id=first_n(last_n(interim_j[0],8),4)
                for v in interim_j:
                  if first_n(last_n(v,8),4) != next_q_id:
                    interim_j = subtract_element(interim_j, v)
            if len(interim_j)>0:
              for o in interim_j:
                interim_3=add_element(interim_3,add_element(i,o))

              with open ('scenario_class.csv','a',newline='') as a_185:
                writer_185=csv.writer(a_185,delimiter=',')
                writer_185.writerow([array_to_string(i), array_to_string(id_to_class_array_converter(i)),array_to_string(id_to_value_array_converter(i)),id_to_class_converter(remove_last_n(o,4)),id_to_value_converter(remove_last_n(o,4))])
              scenario_array=subtract_element(scenario_array,i)
              for u in interim_3:
                scenario_array.append(u)
              t=1
            if len(interim_j)==0:
              last_element_in_i=remove_last_n(last_element_in_i,8)
              if len(last_element_in_i)==0:
                t=1
              #print("t:"+str(t))
      if final_length!=len(scenario_array):
        final_length=len(scenario_array)
        h=h+1
      elif final_length==len(scenario_array):
        for m in scenario_array:
          with open ('scenario_class.csv','a',newline='') as a_185:
            writer_185=csv.writer(a_185)
            writer_185.writerow([array_to_string(m), array_to_string(id_to_class_array_converter(m)),array_to_string(id_to_value_array_converter(m)),"qc999","None"])
        combine.append(scenario_array)
        h=1000
    
    mei=0
    for i in scenario_array:
    
      mei=mei+1
      myFile =open("scenario/"+str(mei)+".txt",'w')
      myFile.write(array_to_string(i))
      myFile.close()

def dense_counter():
  dense_list=[]
  with open ('scenario_class.csv','r') as c:
      read=csv.reader(c,delimiter=",")
      for i in read:
          if element_exst_check(dense_list,i[2])==-1:
              dense_list.append(i[2])
  return len(dense_list)
'''
def train_data_generator():
  dense_list=[]
  dense_list_count=[]
  a_152=[]
  
  if not os.path.exists("dream_data"):
    os.makedirs("dream_data")
    os.makedirs("dream_data/train")
    os.makedirs("dream_data/test")
  elif os.path.exists("dream_data"):
    shutil.rmtree("dream_data")
    os.makedirs("dream_data/train")
    os.makedirs("dream_data/test")

  with open ('scenario_class.csv','r') as c:
      read=csv.reader(c,delimiter=",")
      for i in read:
          if element_exst_check(dense_list,i[3])==-1:
            dense_list.append(i[3])
            dense_list_count.append(i[3],1)
          else:
            for j in dense_list_count:
              if j[0]==i[3]:
                j[1]=j[1]+1
          a_152.append([i[1],i[3]])
  random.shuffle(a_152)

  for i in dense_list:
    os.makedirs("dream_data/train/"+i)
    os.makedirs("dream_data/test/"+i)

  data_count=0
  for i in a_152:
    if data_count/len(a_152)<0.9:
      myFile=open("dream_data/train/"+str(i[1])+"/"+str(data_count)+".txt",'w')
      myFile.write(i[0])
      myFile.close()
    else: 
      myFile=open("dream_data/test/"+str(i[1])+"/"+str(data_count)+".txt",'w')
      myFile.write(i[0])
      myFile.close()
    data_count=data_count+1
    for i in os.listdir("dream_data/train"):
      print(len(os.listdir("dream_data/train/"+i)))
'''
def train_data_generator():
  dense_list=[]
  dense_value=[]
  dense_value_count=[]
  dense_count=[]
  intput_output_data=[]
  min_number=0
  max_number=0
  delete_list=[]
  overload_list=[]
  if not os.path.exists("dream_data"):
    os.makedirs("dream_data")
    os.makedirs("dream_data/train")
    os.makedirs("dream_data/test")
  elif os.path.exists("dream_data"):
    shutil.rmtree("dream_data")
    os.makedirs("dream_data/train")
    os.makedirs("dream_data/test")

  with open ('scenario_class.csv','r') as c:
    read=csv.reader(c,delimiter=",")
    for i in read:
      if element_exst_check(dense_value,i[3])==-1:
        dense_value.append(i[3])
        dense_value_count.append([i[3],1])
      else:
        for j in dense_value_count:
          if j[0]==i[3]:
            j[1]=j[1]+1
      intput_output_data.append([i[1],i[3]])
    for i in dense_value_count:
      dense_count.append(i[1])
    dense_count=sorted(dense_count)
    min_number=dense_count[int(len(dense_count)/2)]/5
    max_number=dense_count[int(len(dense_count)/2)]*2
  for i in dense_value_count:
    if i[1]<min_number:
      delete_list.append(i[0])
    elif i[1]>max_number:
      overload_list.append(i[0])
  random.shuffle(intput_output_data)
  print(len(intput_output_data))
  new_input_output_data=[]

  for i in intput_output_data:
    if element_exst_check(delete_list,i[1])==-1:
      new_input_output_data.append(i)
  intput_output_data=new_input_output_data

  new_input_output_data=[]
  new_data_insert_value_count=[]
  for i in dense_value:
    new_data_insert_value_count.append([i,0])
  for i in intput_output_data:
    used_so_far_count=0
    for j in new_data_insert_value_count:
      if j[0]==i[1]:
        used_so_far_count=j[1]
        j[1]=j[1]+1
        if used_so_far_count<max_number:
          new_input_output_data.append(i)
  intput_output_data=new_input_output_data
  print(len(intput_output_data))

  for i in dense_value:
    if element_exst_check(delete_list,i)==-1:
      dense_list.append(i)
  
  for i in dense_list:
    os.makedirs("dream_data/train/"+i)
    os.makedirs("dream_data/test/"+i)

  data_count=0
  for i in intput_output_data:
    if data_count/len(intput_output_data)<0.9:
      myFile=open("dream_data/train/"+str(i[1])+"/"+str(data_count)+".txt",'w')
      myFile.write(i[0])
      myFile.close()
    else: 
      myFile=open("dream_data/test/"+str(i[1])+"/"+str(data_count)+".txt",'w')
      myFile.write(i[0])
      myFile.close()
    data_count=data_count+1

def combine():
  
  combine=[]
  cc_list=[]
  for i in a_bank.objects.all():
    if len(i.a_id)==8 and first_n(i.a_id,4)=="q001":
      cc_list.append(i.a_id)
  for p in cc_list:
    output=p
    same_cc_id=[]
    scenario_array=[]
    input_array=[]
    out_id=output
    first_id=first_n(out_id,8)
    scenario_array=[[first_id]]
    for i in a_bank.objects.all().order_by("a_id"):
      if first_n(i.a_id,8)==first_id:
        same_cc_id.append(i.a_id)

    h=1
    final_length=0
    while h<999:
      #print("Round "+str(h)+", scenarrio_array length: "+str(len(scenario_array)))
      i_a=0
      for i in scenario_array:
        i_a=i_a+1
        last_element_in_i=i[len(i)-1]
        absolute_last_element=i[len(i)-1]
        interim_3=[]
        interim_j=[]
        interim_j_2=[]
        interim_j_3=[]
        for j in same_cc_id:
          if len(j)==len(last_element_in_i)+8 and first_n(j,len(last_element_in_i))==last_element_in_i:
            interim_j.append(j)
        if len(interim_j)>0:
          k=1
          next_q_id=first_n(remove_first_n(interim_j[0],len(last_element_in_i)),4)
          for y in interim_j:
            if first_n(remove_first_n(y,len(last_element_in_i)),4)==next_q_id:

              interim_3=add_element(interim_3,add_element(i,y))
              interim_j_3.append(y)
          scenario_array=subtract_element(scenario_array,i)
          for u in interim_3:
            scenario_array.append(u)
        if len(interim_j)==0:
          t=0
          while len(last_element_in_i) > 0 and t==0:
            for n in same_cc_id:
              if remove_last_n(n,8) == last_element_in_i and len(absolute_last_element)>=len(n) and int(first_n(last_n(n,7),3)) > int(first_n(last_n(first_n(absolute_last_element,len(n)),7),3)):
                interim_j.append(n)
                next_q_id=first_n(last_n(interim_j[0],8),4)
                for v in interim_j:
                  if first_n(last_n(v,8),4) != next_q_id:
                    interim_j = subtract_element(interim_j, v)
            if len(interim_j)>0:
              for o in interim_j:
                interim_3=add_element(interim_3,add_element(i,o))
              scenario_array=subtract_element(scenario_array,i)
              for u in interim_3:
                scenario_array.append(u)
              t=1
            if len(interim_j)==0:
              last_element_in_i=remove_last_n(last_element_in_i,8)
              if len(last_element_in_i)==0:
                t=1
              #print("t:"+str(t))
      if final_length!=len(scenario_array):
        final_length=len(scenario_array)
        h=h+1
      elif final_length==len(scenario_array):
        h=1000
    mei=0
  return combine, scenario_array

def func_001(array,element):
  exst=-1
  numb="element doesn't exist"
  for i in array: 
    if i[0]==element: 
      exst=1
      numb=i[1]
  return exst, numb

def final_train():
  all_level_combine=[]
  for i in combine()[0]:
    c=0
    while c<len(i):
      if element_exst_check(all_level_combine,first_n_array(i,c+1))==-1:
        if c==len(i)-1:
          all_level_combine.append([first_n_array(i,c+1),"none"])
        else :
          all_level_combine.append([first_n_array(i,c+1),remove_last_n(i[c+1],4)])
      c=c+1
  input_np=[]
  for i in all_level_combine:
    string_convert=""
    for j in i[0]:
      string_convert=string_convert+" "+j
    input_np.append([string_convert])
  output_np=[]
  output_np_list=[]
  output_np_number=1

 
  for i in all_level_combine:
    if func_001(output_np_list,i[1])[0]==-1:
      output_np_list.append([i[1],output_np_number])
      output_np.append(output_np_number)
      output_np_number=output_np_number+1  
    elif func_001(output_np_list,i[1])[0]==1:
      output_np.append(func_001(output_np_list,i[1])[1])

  
  b=0
  val_input=[]
  val_output=[]
  while b<len(input_np)/5:
    k=random.choice(range(0, len(input_np)))
    val_input.append(input_np[k])
    val_output.append(output_np[k])
    b=b+1
  dense=len(output_np_list)
  return input_np,output_np, val_input, val_output, dense
  #return input_np, output_np

def train_janice():
  dense=dense_counter()
  seed = 42
  embedding_dim = 16
  batch_size = 1
  max_features = 5000
  sequence_length = 30
  AUTOTUNE = tf.data.experimental.AUTOTUNE
  epochs = 300

  raw_train_ds = tf.keras.utils.text_dataset_from_directory(
      'dream_data/train', 
      batch_size=batch_size, 
      validation_split=0.2, 
      subset='training', 
      seed=seed)

  raw_val_ds = tf.keras.utils.text_dataset_from_directory(
      'dream_data/train', 
      batch_size=batch_size, 
      validation_split=0.2, 
      subset='validation', 
      seed=seed)

  raw_test_ds = tf.keras.utils.text_dataset_from_directory(
      'dream_data/test', 
      batch_size=batch_size)

  vectorize_layer = TextVectorization(
      max_tokens=max_features,
      output_mode='int',
      output_sequence_length=sequence_length)

  #text_ds = total_dataset.map(lambda x, y: x)
  #vectorize_layer.adapt(text_ds)

  train_text = raw_train_ds.map(lambda x, y: x)
  vectorize_layer.adapt(train_text)

  def vectorize_text(text, label):
    text2 = tf.expand_dims(text, -1)
    return vectorize_layer(text2), label

  text_batch, label_batch = next(iter(raw_train_ds))
  first_review, first_label = text_batch[0], label_batch[0]

  train_ds = raw_train_ds.map(vectorize_text)
  val_ds = raw_val_ds.map(vectorize_text)
  test_ds = raw_test_ds.map(vectorize_text)

  AUTOTUNE = tf.data.AUTOTUNE

  train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
  val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
  test_ds = test_ds.cache().prefetch(buffer_size=AUTOTUNE)

  
  model_748 = tf.keras.Sequential([
    layers.Embedding(max_features + 1, embedding_dim),
    layers.Dropout(0.2),
    layers.GlobalAveragePooling1D(),
    layers.Dropout(0.2),
    layers.Dense(len(os.listdir("dream_data/train")))])

  model_748.summary()

  model_748.compile(loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                optimizer='adam',
                metrics=['accuracy'])
  
  loss, accuracy = model_748.evaluate(test_ds)

  checkpoint_path_748 = "save_ML/cp.ckpt"
  checkpoint_dir = os.path.dirname(checkpoint_path_748)

  cp_callback_748 = tf.keras.callbacks.ModelCheckpoint(checkpoint_path_748,
                                                  save_weights_only=True,
                                                  verbose=1)

  callbacks_748 = [
      tf.keras.callbacks.EarlyStopping(patience=5, monitor='val_loss'),
      tf.keras.callbacks.TensorBoard(log_dir='./logs'),
      cp_callback_748
  ]

  #model.fit(x_train, y_train, validation_split=0.1, batch_size=16, epochs=15, callbacks=callbacks, verbose=1)
  #model.fit(x_train, y_train, validation_split=0.2, batch_size=batch_size, epochs=2, verbose=1)

  history = model_748.fit(train_ds, validation_data=val_ds, epochs=epochs, callbacks=callbacks_748)
  #model_748.load_weights(checkpoint_path_748)



def ai_question_generator(request):
  a_id_185=request.POST['a_id_185']
  ai_generated_q=[]
  predict_q=predict(id_to_predict_input(a_id_185))
  print(a_id_185)
  for i in q_class.objects.all().order_by('q_class'):
    if i.q_class==predict_q[0] or i.q_class==predict_q[1] or i.q_class==predict_q[2]:
      ai_generated_q.append([i.q_class,i.q_value,i.q_type])
  ai_generated_a=[]
  for i in a_class.objects.all().order_by('a_class'):
    if i.q_class==predict_q[0] or i.q_class==predict_q[1] or i.q_class==predict_q[2]:
      ai_generated_a.append([i.a_class,i.q_class,i.a_value])
  print(ai_generated_q)

  return JsonResponse({"ai_generated_q":ai_generated_q, "ai_generated_a": ai_generated_a})

def home3(request):
    val=request.POST
    q_db=question_db.objects.all().order_by('q_id')
    a_db=answer_db.objects.all().order_by('a_id')
    a_db2=answer_db.objects.values('a_id').order_by('a_id')
    c_db=cc_db.objects.all().order_by('cc_id')
    answer_array=[]
    question_array=[]
    c_array=[]

    for a in a_db:
      answer_array.append([a.id,a.a_id,a.a_value,a.q_id])
    for q in q_db:
      question_array.append([q.id,q.q_id,q.q_value,q.question_type])
    for c in c_db:
      c_array.append([c.id,c.cc_id,c.cc_lead_value,c.cc_value])
    return render(request,'training.html',{'q_db':q_db, 'a_db':a_db, 'c_db':c_db, 'answer_array':answer_array, 'question_array':question_array, 'c_array':c_array})
  
def home5(request):
    val=request.POST
    q_db=question_db.objects.all().order_by('q_id')
    a_db=answer_db.objects.all().order_by('a_id')
    a_db2=answer_db.objects.values('a_id').order_by('a_id')
    c_db=cc_db.objects.all().order_by('cc_id')
    answer_array=[]
    question_array=[]
    c_array=[]
    for a in a_db:
      answer_array.append([a.id,a.a_id,a.a_value,a.q_id])
    for q in q_db:
      question_array.append([q.id,q.q_id,q.q_value,q.question_type])
    for c in c_db:
      c_array.append([c.id,c.cc_id,c.cc_lead_value,c.cc_value])
    return render(request,'cc_db_arrange.html',{'q_db':q_db, 'a_db':a_db, 'c_db':c_db, 'answer_array':answer_array, 'question_array':question_array, 'c_array':c_array})
 
def cc_value_update(request):
    instance = get_object_or_404(cc_db, cc_value=request.POST['c_value'])
    instance.cc_lead_value=request.POST['c_lead_value']
    instance.cc_id=request.POST['c_id']
    instance.save()
    return redirect('/')

def pad(x,n):
  return str(x).zfill(n)

def if_exist(array,value):
  r=0
  for i in array:
    if i==value:
      r=1
  return r

def cases(id):
  q_db=question_db.objects.all().order_by('q_id')
  a_db=answer_db.objects.all().order_by('a_id')
  input2=[""]
  a_id2=id
  loop_id2=a_id2
  o=0
  while len(loop_id2)>0:
    o=o+1
    id_div2=re.findall("([aq,\d]*)([aq])(\d\d\d$)",loop_id2)[0]
    if id_div2[1]=="a":
      for y in a_db:
        if y.a_id == loop_id2:
          q=0
          while q<len(input2):
            input2[q]=y.a_value+" "+input2[q]
            q=q+1
      loop_id2=id_div2[0]
    elif id_div2[1]=="q":
      if loop_id2==a_id2[slice(len(loop_id2))]:
        if int(id_div2[2])==0:
          loop_id2=id_div2[0]
        else:
          for m in q_db:
            if m.q_id == loop_id2:
              input_length=len(input2) 
              q=0
              while q<input_length:
                input2[q]=m.q_value+" "+input2[q]
                input2.append(input2[q])
                q=q+1
              input2[slice(input_length)]
          z=int(id_div2[2])-1
          loop_id2=id_div2[0]+'q'+pad(z,3)
      else:
        if int(id_div2[2])==0:
          loop_id2=id_div2[0]
        else: 
          up_question="undefined"
          for e in q_db:
            if loop_id2 == e.q_id:
              up_question= e.q_value
          array_add=[]
          for j in a_db:

            if j.q_id==loop_id2:
              q=0
              while q<len(input2):
                array_add.append(up_question+" "+j.a_value+" "+input2[q])
                q=q+1
          if len(array_add)>0:
            input2=array_add
          z=int(id_div2[2])-1
          loop_id2=id_div2[0]+'q'+pad(z,3)
  return input2

def agenda_text_to_predict(text):
  text=str(text)
  array=[]
  array.append(text)
  sequence=Tokenizer.texts_to_sequences(array)  
  sequence=tf.keras.preprocessing.sequence.pad_sequences(sequence, maxlen=max_len2)
  model2.predict(np.expand_dims(sequence[0], 0))[0]
  return_array=[]
  for i in model2.predict(np.expand_dims(sequence[0], 0))[0]:
    return_array.append(round(i,2))
  return_array2=[]
  for j in return_array:
    return_array2.append(round(j*100,0))
  return return_array2     

def multiclass(request):
  input=str(request.POST['input'])
  result=agenda_text_to_predict(input)
  print(agenda_text_to_predict(input))
  print(output_list)
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
  return JsonResponse({"output":str(output_list[best])})

def re_train(request):
  in_list = request.POST.getlist('in_list[]')
  out_list=request.POST.getlist('out_list2[]')
  class_list=request.POST.getlist('class_list[]')
  agenda_tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=max_words, lower=True)
  agenda_tokenizer.fit_on_texts(in_list)
  sequence = agenda_tokenizer.texts_to_sequences(in_list)
  return JsonResponse({})

def random_sort(array1,array2):
  combined=[]
  y=len(array1)
  for i in range(y):
    combined.append([array1[i],array2[i]])
  random.shuffle(combined)
  array1_n=[]
  array2_n=[]
  for i in combined:
    array1_n.append(i[0])
    array2_n.append(i[1])
  return array1_n, array2_n

def delete_a_apply_exst_qc(request):
  id_271=request.POST['id_271']
  target_array=[]

  for i in a_bank.objects.all().order_by('a_id'):
    if i.a_id==id_271:
      target_ac=i.a_class
  for i in a_bank.objects.all():
    if i.a_class==target_ac:
      target=get_object_or_404(a_bank,id=i.id)
      target.delete()
      target_array.append(i.a_id)
  target=get_object_or_404(a_class,a_class=target_ac)
  target.delete()
  print(target_array)
  return JsonResponse({"target_array":target_array})
def add_a_common_save(request):
  q_id_914=remove_last_n(request.POST['a_id_914'],4)
  a_value_914=request.POST['a_value_914']
  q_class_914=id_to_class_converter(q_id_914)
  used_914=0
  for i in q_bank.objects.all():
    if i.q_class==id_to_class_converter(q_id_914):
      used_914=used_914+1
  if used_914<2:
    for i in a_class.objects.all().order_by('a_class'):
      if i.q_class==q_class_914:
        last_ac_914=i.a_class
    new_ac_914=remove_last_n(last_ac_914,3)+pad(int(select_last_n(last_ac_914,3))+1,3)
    target=a_class(a_class=new_ac_914,a_value=a_value_914,q_class=q_class_914)
    target.save()
    target=a_bank(a_value=a_value_914,a_id=request.POST['a_id_914'],q_id=q_id_914,a_class=new_ac_914)
    target.save()
  return JsonResponse({"used_914":used_914})


def delete_a_create_new_qc(request):
  id_283=request.POST['id_283']
  for i in q_class.objects.all().order_by('q_class'):
    last_qc_513=i.q_class
  new_qc=remove_last_n(last_qc_513,3)+number_to_3_digits(int(select_last_n(last_qc_513,3))+1)
  for i in q_bank.objects.all():
    if i.q_id==remove_last_n(id_283,4):
      target=get_object_or_404(q_bank,id=i.id)
      q_value_283=i.q_value
      q_type_283=i.q_type
      target.q_class=new_qc
      target.save()
  target=q_class(q_class=new_qc, q_value=q_value_283, q_type=q_type_283)
  target.save()
  for i in a_bank.objects.all().order_by('a_id'):
    if i.a_id==id_283:
      target=get_object_or_404(a_bank,id=i.id)
      target.delete()
  new_ac_numb=1
  for i in a_bank.objects.all().order_by('a_id'):
    if i.q_id==remove_last_n(id_283,4):
      target=get_object_or_404(a_bank,id=i.id)
      target.a_class=new_qc+"a"+number_to_3_digits(new_ac_numb)
      target.save()
      target=a_class(q_class=new_qc, a_class=new_qc+"a"+number_to_3_digits(new_ac_numb), a_value=i.a_value)
      target.save()
      new_ac_numb=new_ac_numb+1
  return redirect('/')







#여기부터 아래가 챠트리뷰 AI. 망치면 디지는거

TRAIN_DATA = "data/train_ED.csv"
TEST_DATA = "data/test_txt_file.txt"
AGENDA_Q_DATA = "data/agenda_q.csv"
AGENDA_A_DATA = "data/agenda_a.csv"

# Using readlines()
file1 = open(TEST_DATA, 'r')
Lines = file1.readlines()
test_text=[]
count = 0

# Strips the newline character
for line in Lines:
    count += 1
    test_text +=[line]

GLOVE_EMBEDDING = "embedding/glove.6B.100d.txt"

with open(TRAIN_DATA) as file:
  csv_reader=DictReader(file)
  data=list(csv_reader)

train = pd.read_csv(TRAIN_DATA)
train["text"].fillna("fillna")
test_text_copy=test_text

x_train = train["text"].str.lower()
y_train = train[["pcp","alarm","etc"]].values


file = pd.read_csv(AGENDA_Q_DATA)
q_file = file[["id","qid","qa","type"]].values
#if exist checker here 

max_words = 10000
embed_size = 100
tokenizer_mass = tf.keras.preprocessing.text.Tokenizer(num_words=max_words, lower=True)
tokenizer_mass.fit_on_texts(x_train)
#tokenizer_mass.fit_on_texts(test_array)
#tokenizer_mass.fit_on_texts(test_array2)
#print(x_train)
x_train = tokenizer_mass.texts_to_sequences(x_train)
#print(x_train)
#test_text = tokenizer.texts_to_sequences(test_text)

max_len=0
for i in x_train:
  if len(i) > max_len:
    max_len=len(i)
x_train = tf.keras.preprocessing.sequence.pad_sequences(x_train, maxlen=max_len)
#print(x_train)

#test_text = tf.keras.preprocessing.sequence.pad_sequences(test_text, maxlen=max_len)

embeddings_index = {}
with open(GLOVE_EMBEDDING, encoding='utf8') as f:
    for line in f:
        values = line.rstrip().rsplit(' ')
        word = values[0]
        embed = np.asarray(values[1:], dtype='float32')
        embeddings_index[word] = embed
word_index = tokenizer_mass.word_index
#print(word_index)

num_words = min(max_words, len(word_index) + 1)
embedding_matrix = np.zeros((num_words, embed_size), dtype='float32')

j=1
for word, i in word_index.items():
    if i >= max_words:
        continue
    if j == 1:
      j = 2
    embedding_vector = embeddings_index.get(word)
    if j==2:
      j=3
    if embedding_vector is not None:
        embedding_matrix[i] = embedding_vector

input = tf.keras.layers.Input(shape=(max_len,))
x = tf.keras.layers.Embedding(num_words, embed_size, weights=[embedding_matrix], trainable=False)(input)
x = tf.keras.layers.Bidirectional(tf.keras.layers.GRU(128, return_sequences=True, dropout=0.1, recurrent_dropout=0.1))(x)
x = tf.keras.layers.Conv1D(64, kernel_size=3, padding="valid", kernel_initializer="glorot_uniform")(x)
avg_pool = tf.keras.layers.GlobalAveragePooling1D()(x)
max_pool = tf.keras.layers.GlobalMaxPooling1D()(x)
x = tf.keras.layers.concatenate([avg_pool, max_pool])
preds = tf.keras.layers.Dense(3, activation="sigmoid")(x)
model = tf.keras.Model(input, preds)

#model.summary()
model.compile(loss='binary_crossentropy', optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), metrics=['accuracy'])

checkpoint_path = "training_1/cp.ckpt"
checkpoint_dir = os.path.dirname(checkpoint_path)

cp_callback = tf.keras.callbacks.ModelCheckpoint(checkpoint_path,
                                                 save_weights_only=True,
                                                 verbose=1)

callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=5, monitor='val_loss'),
    tf.keras.callbacks.TensorBoard(log_dir='./logs'),
    cp_callback
]

#model.fit(x_train, y_train, validation_split=0.1, batch_size=16, epochs=15, callbacks=callbacks, verbose=1)
#model.fit(x_train, y_train, validation_split=0.2, batch_size=batch_size, epochs=2, verbose=1)
model.load_weights(checkpoint_path)
