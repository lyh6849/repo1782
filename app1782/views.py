from django.shortcuts import render
from django.http import HttpResponse
'''
from django.shortcuts import redirect, get_object_or_404

from django.views.decorators.http import require_POST
from django.http import JsonResponse

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

import csv
from csv import DictReader
from csv import DictWriter
from csv import writer

import pandas as pd
import matplotlib.pyplot as plt
import os
import re
import shutil
import string
import seaborn as sns
import random
import math

from MLclassify.models import q_bank, a_bank, q_class, a_class, train_test_data, question_db, answer_db, question_suggest, agenda, train, cc_db
from nltk.corpus import stopwords
from datetime import datetime
from sklearn.model_selection import train_test_split
'''

# Create your views here.
def home (request):  
    return HttpResponse("Hello World")
    #return render(request,'index.html')
