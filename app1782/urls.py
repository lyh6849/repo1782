from django.urls import path
from . import views

urlpatterns = [
    path ('',views.home, name='home'),
    path ('questionnaire',views.home4, name="home4"),

    path ('agenda',views.agenda, name="agenda"),
    path('initial_open', views.initial_open, name='initial_open'),

    path ('getQuestions',views.getQuestions,name='getQuestions'),

    path ('q_insert',views.q_insert,name='q_insert'),
    path ('a_insert',views.a_insert,name='a_insert'),
    path ('mass_classifier',views.mass_classifier,name='mass_classifier'),
    path('a_insert', views.a_insert, name='a_insert'),
    path('q_insert', views.q_insert, name='q_insert'),
    path('ac_insert', views.ac_insert, name='ac_insert'),
    path('qc_insert', views.qc_insert, name='qc_insert'),
    path('q_type_update', views.q_type_update, name='q_type_update'),
    path('q_value_update', views.q_value_update, name='q_value_update'),
    path('a_value_update', views.a_value_update, name='a_value_update'),
    path('q_value_update_ajax', views.q_value_update_ajax, name='q_value_update_ajax'),
    path('edit_q_create_new_qc', views.edit_q_create_new_qc, name='edit_q_create_new_qc'),
    path('add_a_create_new_qc', views.add_a_create_new_qc, name='add_a_create_new_qc'),
    path('delete_a_create_new_qc', views.delete_a_create_new_qc, name='delete_a_create_new_qc'),
    path('edit_q_apply_exst_qc', views.edit_q_apply_exst_qc, name='edit_q_apply_exst_qc'),
    path('add_a_apply_exst_qc', views.add_a_apply_exst_qc, name='add_a_apply_exst_qc'),
    path('q_delete', views.q_delete, name='q_delete'),
    path('a_delete', views.a_delete, name='a_delete'),
    path('ac_delete', views.ac_delete, name='ac_delete'),
    path('qc_delete', views.qc_delete, name='qc_delete'),
    path('re_train', views.re_train, name='re_train'),
    path('cc_insert', views.cc_insert, name='cc_insert'),
    path('multiclass', views.multiclass, name='multiclass'),
    path('find_last_children', views.find_last_children, name='find_last_children'),
    path('class_used_counter', views.class_used_counter, name='class_used_counter'),
    path('class_used_counter_by_id', views.class_used_counter_by_id, name='class_used_counter_by_id'),
    path('new_qc', views.new_qc, name='new_qc'),
    path('a_dbl_del_by_id', views.a_dbl_del_by_id, name='a_dbl_del_by_id'),
    path('q_dbl_del_by_id', views.q_dbl_del_by_id, name='q_dbl_del_by_id'),
    path('exst_q_select', views.exst_q_select, name='exst_q_select'),
    path('edit_a_create_new_qc', views.edit_a_create_new_qc, name='edit_a_create_new_qc'),
    path('edit_a_apply_exst_qc', views.edit_a_apply_exst_qc, name='edit_a_apply_exst_qc'),
    path('delete_a_apply_exst_qc', views.delete_a_apply_exst_qc, name='delete_a_apply_exst_qc'),
    path('add_a_common_save', views.add_a_common_save, name='add_a_common_save'),
    path('ai_question_generator', views.ai_question_generator, name='ai_question_generator'),
    path('predict', views.predict, name='predict'),
    path('predict_2', views.predict_2, name='predict_2'),
    path('predict_3', views.predict_3, name='predict_3'),
    path('delete_a_from_data_2', views.delete_a_from_data_2, name='delete_a_from_data_2'),
    path('collapse_cc', views.collapse_cc, name='collapse_cc'),
    path('auto_ajax', views.auto_ajax, name='auto_ajax'),
    path('next_questionnaire', views.next_questionnaire, name='next_questionnaire'),
    path('select_2', views.select_2, name='select_2'),
    path('letstart', views.letstart, name='letstart'),
    path('cc_list_maker', views.cc_list_maker, name='cc_list_maker'),
    path('branch_copy', views.branch_copy, name='branch_copy'),
    path('one_line_classify', views.one_line_classify, name='one_line_classify'),

    path('dup_q_delete', views.dup_q_delete, name='dup_q_delete'),
    path('dup_q_delete', views.dup_a_delete, name='dup_a_delete'),
    path('residual_delete', views.residual_delete, name='residual_delete'),
    path('residual_delete2', views.residual_delete2, name='residual_delete2'),

    path ('classifier',views.classifier,name='classifier'),
    path ('ajax_updator',views.ajax_updator,name='ajax_updator'),

    path ('cc_value_update',views.cc_value_update,name='cc_value_update')
    ]
'''    

    path ('test',views.home2, name="home2"),
    path ('train',views.home3, name="home3"),
    path ('cc_db',views.home5, name="home5"),

    '''


