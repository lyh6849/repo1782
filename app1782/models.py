from django.db import models

# Create your models here.

class train_test_data(models.Model):
    text= models.CharField(max_length=1000)
    pcp= models.CharField(max_length=10)
    alarm= models.CharField(max_length=10)
    result= models.CharField(max_length=10)
    etc= models.CharField(max_length=10)
    class Meta:
        db_table="train_test_data"
        

class question_db(models.Model):
    q_id= models.CharField(max_length=200)
    q_value = models.CharField(max_length=400)
    question_type = models.CharField(max_length=30)
    class Meta:
        db_table = "question_db"

class answer_db(models.Model):
    a_id= models.CharField(max_length=60)
    a_value = models.CharField(max_length=400)
    q_id = models.CharField(max_length=60)
    class Meta:
        db_table = "answer_db"

class question_suggest(models.Model):
    a_id= models.CharField(max_length=60)
    q_id= models.CharField(max_length=200)
    q_value = models.CharField(max_length=400)
    class Meta:
        db_table = "question_suggest"
 
class agenda(models.Model):
    p_id= models.CharField(max_length=10)
    prob_free= models.CharField(max_length=300)
    prob_category = models.CharField(max_length=300)
    class Meta:
        db_table = "agenda"

class train(models.Model):
    id = models.IntegerField(primary_key=True)
    note=models.CharField(max_length=2000)
    output=models.CharField(max_length=10)
    class Meta:
        db_table="train"
 
class cc_db(models.Model):
    id = models.AutoField(primary_key=True)
    cc_id=models.CharField(max_length=2000)
    cc_lead_value=models.CharField(max_length=2000)
    cc_value=models.CharField(max_length=2000)

class q_class(models.Model):
    id = models.AutoField(primary_key=True)
    q_class=models.CharField(max_length=500)
    q_value = models.CharField(max_length=500)
    q_type = models.CharField(max_length=600)

class a_class(models.Model):
    id = models.AutoField(primary_key=True)
    a_class=models.CharField(max_length=500)
    q_class=models.CharField(max_length=500)
    a_value = models.CharField(max_length=500)

class q_bank(models.Model):
    id = models.AutoField(primary_key=True)
    q_id=models.CharField(max_length=500)
    q_value = models.CharField(max_length=500)
    q_type = models.CharField(max_length=600)
    q_class=models.CharField(max_length=500)

class a_bank(models.Model):
    a_id= models.CharField(max_length=600)
    a_value = models.CharField(max_length=400)
    q_id = models.CharField(max_length=600)
    a_class=models.CharField(max_length=500)
