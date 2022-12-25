function collapse_parent(){
    if ($(".a_parent").width()>200){
        $(".a_parent").css({"width":"4vw","left":"71vw"})
    } else {
        $(".a_parent").css({"width":"80vw","left":"10vw"})
    }
}

function collapse_cc(){
    $.ajax({
        type:'post',
        url:'collapse_cc',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            if (collpase_cc==1){
                for (i=0;i<response.target_array.length;i++){
                    $("#"+response.target_array[i]).removeClass("hide")
                    $("#"+response.target_array[i]).addClass("hide")
                    collpase_cc=0
                }
            }   else if(collpase_cc==0){
                for (i=0;i<response.target_array.length;i++){
                    $("#"+response.target_array[i]).removeClass("hide")
                    collpase_cc=1
                }
            }
        }
    })
}

function find_by_qid(qi,n){
    q_value='not found'
    for (i=0;i<question_array.length;i++){
        if(question_array[i][1]==qi){
            q_value=question_array[i][n]
        }
    }
    return q_value
}

function find_by_qc(qc,n){
    q_value="not found"
    for (i=0;i<qc_array.length;i++){
        if(qc_array[i][1]==qc){
            q_value=qc_array[i][n]
        }
    }
    return q_value
}

function find_by_ac(ac,n){
    a_value="not found"
    for (i=0;i<ac_array.length;i++){
        if(ac_array[i][1]==ac){
            a_value=ac_array[i][n]
        }
    }
    return a_value
}

function exst_q_select(qc){
    parent_a_id=$("#"+qc).parent().parent().parent().attr("id");
    parent_q_id=$("#"+qc).parent().parent().attr("id");
    $("#"+parent_q_id).remove()
    $.ajax({
        type:'post', 
        url:'exst_q_select',
        data:{
            q_class: qc,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(response){
            
            q_generate(parent_a_id,parent_q_id,response.q_value,response.q_type) 
            q_insert_ajax(parent_q_id,response.q_value,response.q_type,qc)
            ans_numb=1
            for (j=0;j<response.a_array_382.length;j++){
                a_insert_ajax(parent_q_id+"a"+pad(ans_numb,3),response.a_array_382[j][0],parent_q_id,response.a_array_382[j][1])
                a_generate(parent_q_id,parent_q_id+"a"+pad(ans_numb,3),response.a_array_382[j][0],response.a_array_382[j][0],3)
                ans_numb++
            }
        }
    })
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function collapse(){
    $(event.target).parent().parent().children(".primary").toggleClass("hide")
    $(event.target).toggleClass("fa-sort-down")
    $(event.target).toggleClass("fa-caret-right")
}

function cases(id){
    input2=[""]
    a_id2=id
    //a_id2=answer_array[i][1]
    loop_id2=a_id2
    o=0
    while (loop_id2.length >0){
        o=o+1
        id_div2=loop_id2.match(/([aq,\d]*)([aq])(\d\d\d$)/)
        if (id_div2[2]=="a"){
            for (j=0;j<answer_array.length;++j){
                if(answer_array[j][1]==loop_id2){
                    for (q=0;q<input2.length;++q){
                        input2[q]=answer_array[j][2]+" "+input2[q]
                    }
                }
            }
            loop_id2=id_div2[1]
        } else if (id_div2[2]=='q') {
            if (loop_id2==a_id2.slice(0,loop_id2.length)){
                if(id_div2[3]==0){
                    loop_id2=id_div2[1]
                } else {
                    for (m=0;m<question_array.length;++m){
                        if(question_array[m][1]==loop_id2){
                            input_length=input2.length
                            for (q=0;q<input_length;++q){
                                input2[q]=question_array[m][2]+" "+input2[q]
                                input2.push(input2[q])
                            }
                            input2.splice(0,input_length)
                        }
                    }
                    z=id_div2[3]-1
                    loop_id2=id_div2[1]+'q'+pad(z,3)
                }
            } else {
                if(id_div2[3]==0){
                    loop_id2=id_div2[1]
                } else {
                    up_question="undefined"
                    for (e=0;e<question_array.length;++e){
                        if(loop_id2==question_array[e][1]){
                            up_question=question_array[e][2]
                        }
                    }
                    array_add=[]

                    for (j=0;j<answer_array.length;++j){
                        if(answer_array[j][3]==loop_id2){
                            for (q=0;q<input2.length;++q){
                                array_add.push(up_question+" "+answer_array[j][2]+" "+input2[q])
                            }
                        }
                    }
                    if(array_add.length>0){
                        input2=array_add
                    }
                    z=id_div2[3]-1
                    loop_id2=id_div2[1]+'q'+pad(z,3)
                }
            }
        }
    }
    return input2
}

function remove_last_n(element,n){
    result=""
    for (i=0;i<element.length-n;i++){
        result=result+element[i]
    }
    return result
}

function re_train(){
    in_out_list=[]
    class_list=[]
    in_list=[]
    out_list=[]
    for (i=0; i<answer_array.length; ++i){
        output=[]
        for (w=0;w<question_array.length;++w){
            if(output.length==0){
                for(t=1;t<5;++t){
                    if(question_array[w][1]==answer_array[i][1]+"q"+pad(t,3)){
                        output.push(question_array[w][2]);
                        if (jQuery.inArray(question_array[w][2],class_list)==-1) {
                            class_list.push(question_array[w][2]);
                        }
                        t=5;
                    }
                }
            }
        }
        if(output.length==0){
            original_answer_id=answer_array[i][1]
            for(mm=0;mm<4;++mm){
                if(output.length==0&&original_answer_id.length>5){
                    all_match=original_answer_id.match(/([aq,\d]*)(q)(\d\d\d)(a)(\d\d\d$)/)
                    parent_q_id=all_match[1]+all_match[2]
                    parent_q_numb=original_answer_id.match(/([aq,\d]*)(q)(\d\d\d)(a)(\d\d\d$)/)[3]
                    for (t=1;t<8;++t){
                        for (w=0;w<question_array.length;++w){
                            if(question_array[w][1]==parent_q_id+pad(parseInt(parent_q_numb)+t,3)){
                                output.push(question_array[w][2]);
                                if (jQuery.inArray(question_array[w][2],class_list)==-1) {
                                    class_list.push(question_array[w][2]);
                                }
                                t=8
                            }
                        }
                    }
                }
                original_answer_id=all_match[1]
            }
        }

        for (k=0;k<cases(answer_array[i][1]).length;++k){
            in_out_list.push([in_out_list.length+1,answer_array[i][1],cases(answer_array[i][1])[k],output])
            in_list.push(cases(answer_array[i][1])[k])
            out_list.push(output)
        }
    }
    new_out_list=[]
    for (ii=0;ii<out_list.length;++ii){
        new_out_list.push(String(out_list[ii]))
        //$(".up_body").append(ii+"<BR>")

    }


    $.ajax({
        type: "POST",
        url: "re_train",
        data:{
            in_list: in_list,
            out_list2: new_out_list,
            class_list: class_list,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function woeifjwe(){
    $.ajax({
        type: "POST",
        url: "predict_2",
        data:{
            input: $("#fowiegowigejwe").val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function woeifjwe_class(){
    $.ajax({
        type: "POST",
        url: "predict_3",
        data:{
            input: $("#fowiegowigejwe_3").val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function submit_test(){
    $q_id = $('#q_id').val();
    $q_value = $('#q_value').val();
    $question_type = $('#question_type').val();
        
    if($q_id == "" || $q_value == "" || $question_type == ""){
        alert("Please complete field");
    }else{
        $.ajax({
            type: "POST",
            url: "insert",
            data:{
                q_id: $q_id,
                q_value: $q_value,
                question_type: $question_type,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(){
                alert('Save Data');
                $('#q_id').val('');
                $('#q_value').val('');
                $('#question_type').val('');
                window.location = "/";
            }
        });
    }
}

function new_answer(){
    var auto_clarify=$(event.target).parent().children("div").attr("class");
    if(auto_clarify=="auto"){
        var children_number=$(event.target).parent().children("div").children("div").length;
        var last_answer_id=$(event.target).parent().children("div").children("div").last().attr("id");

    } else if (auto_clarify!="auto") {
        var children_number=$(event.target).parent().children("div").length;
        var last_answer_id=$(event.target).parent().children("div").last().attr("id");
        
    }
    var parent_id=$(event.target).parent().attr("id");
    $("#print_here").append("last answer id: "+last_answer_id+"<BR>")
    $("#print_here").append(children_number+"<BR>")
    $("#print_here").append(auto_clarify+"<BR>")

    if (children_number>0){
        let an = last_answer_id.match(/(^[a-zA-Z0-9._%+-]*)(\D)(\d+)$/);
        var next_answer_number=+an[3]+1;
        var next_answer_number=('000'+next_answer_number).slice(-3);
        var next_a_id=an[1]+an[2]+next_answer_number
        if(auto_clarify=="auto"){
            $("#"+parent_id).children("div").append("<div id=\""+next_a_id+"\" style=\"margin-left:10px\"> - <input type=\"text\" name=\""+next_a_id+"\"></div>")
        } else if (auto_clarify!="auto") {
            $("#"+parent_id).append("<div id=\""+next_a_id+"\" style=\"margin-left:10px\"> - <input type=\"text\" name=\""+next_a_id+"\"></div>")
        }
    } else {
        //$().append(parent_id)
        var next_a_id = parent_id+"a001"
        $("#"+parent_id).append("<div id=\""+parent_id+"a001\" style=\"margin-left:10px\"> - <input type=\"text\" name=\""+parent_id+"a001\"></div>")
    }
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"new_question()\">+Q</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"d_delete()\">Del</button>")
}

function d_delete(){
    var id=$(event.target).parent().attr("id");
    $("#"+id).remove();
}

function delete_branch(){
    id_1242=$(event.target).parent().attr("id")
    $.ajax({
        type:'post',
        url:'delete_branch',
        data: {
            id_1242:id_1242,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success:function(response){
            for(i_1242=0;i_1242<response.delete_1242.length;i_1242++){
                $("#"+response.delete_1242[i_1242]).remove()
            }
        }
    })
}

function delete_a_create_new_qc(){
    id_283=$(event.target).parent().attr("id")
    button_id_283=id_283+"_delete_button_1"
    $.ajax({
        type:'post',
        url:'delete_a_create_new_qc',
        data:{
            id_283:id_283, 
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(){
            $("#"+id_283).remove()
        }
    })
}

function del_a(){
    q_id_151=$(event.target).parent().parent().attr("id")
    a_id_151=$(event.target).parent().attr("id")
    button_id_151=a_id_151+"_delete_button"
    $.ajax({
        type:'post',
        url:"del_a",
        data:{
            id_151:q_id_151,
            a_id_151:a_id_151,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            if(response.used==1){
                $("#"+response.a_id).remove()
            } else if (response. used >1){
                $("#"+button_id_151).replaceWith("<button type=\'button\' id=\""+button_id_151+"_1\" onclick=\'delete_a_create_new_qc()\'>-</button><button onclick=\'delete_a_apply_exst_qc()\' id=\""+button_id_151+"_2\" type=\'button\'>---</button>")
            }
        }
    })
}

function delete_a_apply_exst_qc(){
    id_271=$(event.target).parent().attr("id")
    button_id_283=id_271+"_delete_button_2"
    $.ajax({
        type:'post',
        url:'delete_a_apply_exst_qc',
        data:{
            id_271:id_271,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success:function(response){
            for(i=0;i<response.target_array.length;i++){
                $("#"+response.target_array[i]).remove()
            }
        }
    })
}

function test_func(){
    $.ajax({
        type: "POST",
        url: "test_def",
        data:{
            q_id: "test",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            alert(response.result)
        }
    });
}

function delete_from_data(){
    root_id=$(event.target).parent().attr("id")
    answer_id_array=[]
    answer_count_289=$("#"+root_id).children(".primary").length
    for (i=0;i<answer_count_289;i++){
        a_id_468=$("#"+root_id).children(".primary").eq(i).attr('id')
        answer_id_array.push(a_id_468)
    }
    $.ajax({
        type:'post',
        url:"class_used_counter_by_id",
        data:{
            a_id:root_id,
            q_id:root_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){  
            if(root_id[root_id.length-4]=="a"){
                if(response.a_count<2){
                    a_dbl_del_by_id(root_id)
                    $("#"+root_id).remove()
                } else if (response.a_count>1){
                    a_delete_ajax(root_id)
                    $("#"+root_id).remove()
                }
            } else if(root_id[root_id.length-4]=="q"){
                if(response.q_count==0){
                    $("#"+root_id).replaceWith("error: class is used for 0")
                }
                else if(response.q_count==1){
                    q_dbl_del_by_id(root_id)
                    for (i=0;i<answer_count_289;i++){
                        a_dbl_del_by_id(answer_id_array[i])
                    }
                    $("#"+root_id).remove()
                } else if (response.q_count>1){
                    q_delete_ajax(root_id)
                    for (i=0;i<answer_count_289;i++){
                        a_delete_ajax(answer_id_array[i])
                    }
                    $("#"+root_id).remove()
                }
            }
        }
    })
}

function edit_q_apply_exst_qc(){
    q_id=$(event.target).parent().attr('id')
    q_value=$("#"+q_id+"_input").val()
    $.ajax({
        type: "POST",
        url: "edit_q_apply_exst_qc",
        data:{
            q_id: q_id,
            q_value: q_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            $("#"+q_id+"_input").replaceWith("<span id=\""+q_id+"_value\" ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+q_value+"\">"+q_value+"</span>")
            for (i=0;i<response.same_q_class.length;i++){
                $("#"+response.same_q_class[i]+"_value").replaceWith("<span id=\""+q_id+"_value\" ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+q_value+"\">"+q_value+"</span>")
            }
            $("#"+q_id+"_edit_save_1").remove()
            $("#"+q_id+"_edit_save_2").remove()
        }
    });
}

function qc_delete_ajax(clas) {
    $.ajax({
        type: "POST",
        url: "qc_delete",
        data:{
            q_class: clas,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function ac_delete_ajax(clas) {
    $.ajax({
        type: "POST",
        url: "ac_delete",
        data:{
            a_class: clas,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}


function q_delete_ajax(id) {
    $.ajax({
        type: "POST",
        url: "q_delete",
        data:{
            q_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function a_dbl_del_by_id(id){
    $.ajax({
        type: "POST",
        url: "a_dbl_del_by_id",
        data:{
            a_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }
    });
}

function q_dbl_del_by_id(id){
    $.ajax({
        type: "POST",
        url: "q_dbl_del_by_id",
        data:{
            q_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }
    });
}

function show_id(){
    id =$(event.target).parent().attr("id");
    $(event.target).replaceWith(id)
}

function use_exst_q(){
    $(event.target).siblings("div").remove();
    $(event.target).siblings("button#select_button").remove();
    var input=$(event.target).val();
    var new_q_id =$(event.target).parent().attr("id");
    duplicate_checker_array=['t']
    for (i=0; i<qc_array.length;i++){
        if(qc_array[i][2].slice(0,input.length).toLowerCase()==input.toLowerCase()){

        }
    }
}

function first_letter_upper(x){
    result=""
    result=result+x[0].toUpperCase()
    result=result+x.slice(1)
    return result
}

function auto_ajax(){
    $(event.target).siblings("div").remove();
    $(event.target).siblings("br").remove();
    $(event.target).siblings("button#select_button").remove();
    $('.exst_q_container').remove();
    $(event.target).parent().append("<div class=\'exst_q_container\'><div class=\'non_exst_q_container\'></div></div>")
    exist=0
    var input_124=$(event.target).val();
    var new_q_id =$(event.target).parent().attr("id");
    $.ajax({
        type:'post',
        url:'auto_ajax',
        data:{
            input_5125:input_124,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            $('.exst_q_container').empty();
            for (i=0;i<response.target_array_qc.length;i++){
                $(".exst_q_container").append("<div class=\'exst_q_suggest\' id=\'"+response.target_array_qc[i][0]+"\' onclick=\"exst_q_select(\'"+response.target_array_qc[i][0]+"\')\">"+response.target_array_qc[i][1]+"<BR></div>")    
            }
            for (j=0;j<response.target_array_ac.length;j++){
                $("#"+response.target_array_ac[j][2]).append("- "+response.target_array_ac[j][1]+"<br>")
            }
        }
    })
}

function branch_copy_3(){
    branch_copy($("#wegwwge2y").val(),$("#edit_panel_6846").val())
}
function branch_copy_2(){
    branch_copy($(event.target).prev("input").val(),$(event.target).parent().attr("id"))
}

function branch_copy(id_7516,parent_id_7516){
    $.ajax({
        type:"post",
        url:"branch_copy",
        data:{
            a_id:id_7516,
            parent_id_7516:parent_id_7516,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            id_length=4
            cycle_stop=0
            while  (cycle_stop<999){
                counter_7516=0
                for (i_7516=0;i_7516<response.q_7516.length;i_7516++){
                    if(response.q_7516[i_7516][0].length==id_length+parent_id_7516.length){
                        counter_7516=1
                        current_q=response.q_7516[i_7516]
                        q_generate(remove_last_n(current_q[0],4),current_q[0],current_q[1],current_q[2])
                        q_insert_ajax(current_q[0],current_q[1],current_q[2],current_q[3])
                    }
                }
                //0=a_id;1=a_value;2=a_class
                for (i_7516=0;i_7516<response.a_7516.length;i_7516++){
                    if(response.a_7516[i_7516][0].length==parent_id_7516.length+id_length+4){
                        current_a=response.a_7516[i_7516]
                        a_generate(remove_last_n(current_a[0],4),current_a[0],current_a[1],current_a[3],current_a[4])
                        a_insert_ajax_2(current_a[0],current_a[1],remove_last_n(current_a[0],4),current_a[2],current_a[3],current_a[4],current_a[5])
                    }
                }
                if (counter_7516==0){
                    cycle_stop=1000
                } else {
                    id_length=id_length+8
                }
            }
        }
    })
}

function select(){
    var new_class=$(event.target).val()
    var q_id=$(event.target).parent("div").attr("id")
    var clone = $("."+new_class).children().clone(true)
    $(event.target).siblings("div").remove()
    $(event.target).siblings("#select_button").remove()
    $(event.target).siblings("br").remove()
    $(event.target).remove()
    $("#"+q_id).append(clone);
}

function yes_no(){
    var q_id=$(event.target).parent().attr("id")
    $(event.target).parent().append("<div id=\""+q_id+"a001\" style=\"margin-left:10px\"> - <input id=\""+q_id+"a001_input\" type=\"text\" name=\""+q_id+"a001\" value=\"yes\"></div>")
    $("#"+q_id+"a001").append("<button type=\"button\" onclick=\"new_question()\">+Q</button>")
    $("#"+q_id+"a001").append("<button type=\"button\" onclick=\"a_ajax()\">Save</button>")
    $("#"+q_id+"a001").append("<button type=\"button\" onclick=\"d_delete()\">Del</button>")
    $(event.target).parent().append("<div id=\""+q_id+"a002\" style=\"margin-left:10px\"> - <input id=\""+q_id+"a002_input\" type=\"text\" name=\""+q_id+"a002\" value=\"no\"></div>")
    $("#"+q_id+"a002").append("<button type=\"button\" onclick=\"new_question()\">+Q</button>")
    $("#"+q_id+"a002").append("<button type=\"button\" onclick=\"a_ajax()\">Save</button>")
    $("#"+q_id+"a002").append("<button type=\"button\" onclick=\"d_delete()\">Del</button>")
}

function dbl_click(){
    var aorq=$(event.target).parent().attr("id").match(/[aq,\d]*([aq])\d\d\d$/)[1]
    let yes= event.target.textContent
    if( aorq=="a"){
        var a_id=$(event.target).parent().attr("id");
        $(event.target).replaceWith( "<input type=\"text\" value=\""+yes+"\" id=\""+a_id+"_input\" name=\""+a_id+"\"><button id=\""+a_id+"_edit_save\" type=\"button\" onclick=\"a_value_update_ajax()\">Save</button>" );
    } else if (aorq=="q"){
        var q_id=$(event.target).parent().attr("id");
        $(event.target).replaceWith( "<input type=\"text\" value=\""+yes+"\" id=\""+q_id+"_input\" name=\""+q_id+"\"><button id=\""+q_id+"_edit_save\"type=\"button\" onclick=\"q_value_update_ajax()\">Save</button>" );
    }
}

function q_type_update_ajax(){
    var q_id=$(event.target).parent().attr("id");
    var input_id=q_id+"_q_type";
    var question_type=$(event.target).val()
    $.ajax({
        type:'post',
        url:'q_type_update',
        data:{
            q_id: q_id,
            question_type: question_type,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(response){
            for (i=0;i<response.same_type_q_id.length;i++){
                $("body").append("#"+response.same_type_q_id[i]+"_q_type_"+question_type+"<BR>")
                $("#"+response.same_type_q_id[i]+"_q_type_"+question_type).prop("checked", true);
            }
        }
    })
}

function q_value_update_ajax(){
    var q_id=$(event.target).parent().attr("id");
    var q_value=$("#"+q_id+"_input").val()
    button_id=q_id+"_edit_save"
    $.ajax({
        type:'POST',
        url:'q_value_update_ajax',
        data:{
            q_id: q_id,
            q_value: q_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(response){
            if (response.q_use_count==0){
                $("#"+q_id+"_input").replaceWith("Error: a_use_count 0")
            } else if (response.q_use_count==1){
                $("#"+q_id+"_input").replaceWith( "<span ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+q_value+"\">"+q_value+"</span>" );
            } else if (response.q_use_count > 1){
                $("#"+button_id).replaceWith("<button type=\'button\' id=\""+button_id+"_1\" onclick=\'edit_q_create_new_qc()\'>+</button><button onclick=\'edit_q_apply_exst_qc()\' id=\""+button_id+"_2\" type=\'button\'>+++</button>")
            } else {
                $("#"+q_id+"_input").replaceWith("Error: "+response.q_use_count)
            }
        }
    })
}

function a_value_update_ajax(){
    var a_id=$(event.target).parent().attr("id");
    var a_value=$("#"+a_id+"_input").val()
    button_id=a_id+"_edit_save"
    $.ajax({
        type:'post',
        url:'a_value_update',
        data:{
            a_id: a_id,
            a_value: a_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(response){
            if (response.a_use_count==0){
                $("#"+a_id+"_input").replaceWith("Error: a_use_count 0"+a_id)
            } else if (response.a_use_count==1){
                $("#"+a_id+"_input").replaceWith( "<span ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+a_value+"\">"+a_value+"</span>" );
            } else if (response.a_use_count > 1){
                $("#"+button_id).replaceWith("<button type=\'button\' id=\""+button_id+"_1\" onclick=\'edit_a_create_new_qc()\'>+</button><button onclick=\'edit_a_apply_exst_qc()\' id=\""+button_id+"_2\" type=\'button\'>+++</button>")
            } else {
                $("#"+a_id+"_input").replaceWith("Error: "+response.a_use_count)
            }
        }
    })
}

function a_delete_ajax(id) {
    $.ajax({
        type:'post',
        url:'a_delete',
        data:{
            a_id: id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(data){
        }
    }); 
}

function new_question(){
    var a_id=$(event.target).parent().attr("id");
    var a_count=$(event.target).parent().children(".primary").length;
    if(a_count==0){
        var q_id=a_id+"q001";
    } else {
        var last_q_id=$(event.target).parent().children(".primary").last().attr("id");
        let an = last_q_id.match(/(^[a-zA-Z0-9._%+-]*)(\D)(\d+)$/);
        var next_q_number=+an[3]+1;
        var next_q_number=('000'+next_q_number).slice(-3);
        var q_id=an[1]+an[2]+next_q_number;
    }
    new_question_info_set(a_id,q_id)
}
function new_new_question(){

}

function new_question_info_set(a_id,q_id){
    $("#"+a_id).append("<div id=\""+q_id+"\" style=\"margin:15px\"></div>")
    $("#"+q_id).append("Q)<input type=\"text\" id=\""+q_id+"_input\" name=\""+q_id+"\" list=\"q_list\" onkeyup=\"auto_ajax()\">")
    $("#"+q_id).append("<button type=\"button\" onclick=\"add_a_to_exst_q()\">+A</button>")
    $("#"+q_id).append("<button type=\"button\" onclick=\"erase()\">New_A</button>")
    $("#"+q_id).append("<button type=\"button\" onclick=\"add_q()\">Save</button>")
    $("#"+q_id).append("<button type=\"button\" onclick=\"d_delete()\">Del</button>")
    $("#"+q_id).append("<button type=\"button\" onclick=\"yes_no()\">Y/N</button>")
    $("#"+q_id).append("<input type=\"text\" class=\'f09h2304h\' id=\'"+q_id+"_type\'placeholder=\'TYPE\' value=\'off\'></input>")
}

function erase(){
    $(event.target).siblings("div").remove()
    $(event.target).siblings("br").remove()
    $(event.target).siblings("button#select_button").remove()
}

function q_insert_ajax(q_id,q_value,q_type,q_class){
    $.ajax({
        type: "POST",
        url: "q_insert",
        data:{
            q_id: q_id,
            q_value: q_value,
            q_type: q_type,
            q_class: q_class,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(){
        }
    })
}

function a_insert_ajax(a_id,a_value,q_id,a_class){
    $.ajax({
        type: "POST",
        url: "a_insert",
        data:{
            a_id: a_id,
            a_value: a_value,
            q_id: q_id,
            a_class: a_class,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(){
        }
    })
}

function a_insert_ajax_2(a_id,a_value,q_id,a_class,a_note,a_lvl,a_parent){
    $.ajax({
        type: "POST",
        url: "a_insert_ajax_2",
        data:{
            a_id: a_id,
            a_value: a_value,
            q_id: q_id,
            a_class: a_class,
            a_note: a_note,
            a_lvl: a_lvl,
            a_parent: a_parent,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(){
        }
    })
}

function ac_insert_ajax(q_class,a_class,a_value){
    $.ajax({
        type: "POST",
        url: "ac_insert",
        data:{
            q_class: q_class,
            a_class: a_class,
            a_value: a_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function qc_insert_ajax(q_class,q_value,q_type){
    $.ajax({
        type: "POST",
        url: "qc_insert",
        data:{
            q_class: q_class,
            q_value: q_value,
            q_type: q_type,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
        }
    });
}

function new_qc(){
    last_qc=qc_array[qc_array.length-1][1]
    last_qc=last_qc.slice(-3)
    return "qc"+String(pad(Number(last_qc)+1,3))
}

function last_number_plus_one(id){
    return id.substring(0,id.length-3)+pad(Number(id.slice(-3))+1,3)
}

function add_qc_smq(){
    if($("#smq_textarea").val().length==0){
        $("#smq_textarea").val($(event.target).val())
    } else {
        $("#smq_textarea").val($("#smq_textarea").val()+","+$(event.target).val())
    }
}

function q_generate_smq(){
    qc_to_generate=$("#smq_textarea").val()
    parent_a_id=$(event.target).parent().parent().parent().attr("id")
    $.ajax({
        type:'post',
        url:'q_generate_smq',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            list:qc_to_generate,
            a_id:parent_a_id
        },success:function(response){
            $("#qc_select_window").remove()
            q_list=response.new_q_list
            a_list=response.new_a_list
            for (i_3732=0;i_3732<response.new_q_list.length;i_3732++){
                q_generate(parent_a_id,q_list[i_3732][0],q_list[i_3732][1],q_list[i_3732][2])
            }
            for (i_3732=0;i_3732<response.new_a_list.length;i_3732++){
                a_generate(a_list[i_3732][2],a_list[i_3732][0],a_list[i_3732][1],a_list[i_3732][1],3)
            }
        }
    })
}
function q_generate_smq_2(){
    $.ajax({
        type:'post',
        url:'q_generate_smq',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            list:$("#smq_textarea").val(),
            a_id:$("#edit_panel_6846").val()
        },success:function(response){
            $("#qc_select_window").remove()
            q_list=response.new_q_list
            a_list=response.new_a_list
            for (i_3732=0;i_3732<response.new_q_list.length;i_3732++){
                q_generate($("#edit_panel_6846").val(),q_list[i_3732][0],q_list[i_3732][1],q_list[i_3732][2])
                $("<span>"+q_list[i_3732][1]+"<br></span>").insertBefore($("#w09we0gh"))

            }
            for (i_3732=0;i_3732<response.new_a_list.length;i_3732++){
                a_generate(a_list[i_3732][2],a_list[i_3732][0],a_list[i_3732][1],a_list[i_3732][1],3)
            }
        }
    })
}

function exit_smq(){
    $("#qc_select_window").remove()
}

function select_multiple_qc(){
    $("#qc_select_window").remove()
    $("#"+$(event.target).parent().attr("id")).append("<div id=\'qc_select_window\'></div>")
    $("#qc_select_window").append("<div class=\'smq_container\' id=\'smq_container\'></div>")
    $("#smq_container").append("<button type=\'button\' onclick=\'q_generate_smq()\'>Create</button>")
    $("#smq_container").append("<button type=\'button\' onclick=\'exit_smq()\'>Exit</button>")
    $("#qc_select_window").append("<textarea class=\'smq_text\' id=\"smq_textarea\"></textarea>")
    $.ajax({
        type:"post",
        url:"select_multiple_qc",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success:function(response){
            qc_97y3=response.qc
            ac_98y3=response.ac
            for (i_6467=0;i_6467<response.qc.length;i_6467++){
                $("#qc_select_window").append("<button class=\'smq_button\'type=\'button\' onmouseout=\'hide_q_class()\'onmouseover=\"show_q_class()\"onclick=\'add_qc_smq()\' value=\'"+qc_97y3[i_6467][0]+"\'>"+qc_97y3[i_6467][0]+"</button>")
                $("#qc_select_window").append("<div class=\'smq_show_class hide\' id=\""+response.qc[i_6467][0]+"_show_class\"><p class=\"weogijweg\">"+response.qc[i_6467][1]+"</p></div>")
            }
            for (i_6467=0;i_6467<ac_98y3.length;i_6467++){
                $("#"+remove_last_n(ac_98y3[i_6467][0],4)+"_show_class").append("<div class=\'smq_answer_show\'>"+ac_98y3[i_6467][1]+"</div>")
            }
        }
    })
}

function select_multiple_qc_2(){
    $("#qc_select_window").remove()
    $("<div id=\'qc_select_window\'></div>").insertBefore($("#w09we0gh3"))
    $("#qc_select_window").append("<div class=\'smq_container\' id=\'smq_container\'></div>")
    $("#smq_container").append("<button type=\'button\' onclick=\'q_generate_smq_2()\'>Create</button>")
    $("#smq_container").append("<button type=\'button\' onclick=\'exit_smq()\'>Exit</button>")
    $("#qc_select_window").append("<textarea class=\'smq_text\' id=\"smq_textarea\"></textarea>")
    $.ajax({
        type:"post",
        url:"select_multiple_qc",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success:function(response){
            qc_97y3=response.qc
            ac_98y3=response.ac
            for (i_6467=0;i_6467<response.qc.length;i_6467++){
                $("#qc_select_window").append("<button class=\'smq_button\'type=\'button\' onmouseout=\'hide_q_class()\'onmouseover=\"show_q_class()\"onclick=\'add_qc_smq()\' value=\'"+qc_97y3[i_6467][0]+"\'>"+qc_97y3[i_6467][0]+"</button>")
                $("#qc_select_window").append("<div class=\'smq_show_class hide\' id=\""+response.qc[i_6467][0]+"_show_class\"><p class=\"weogijweg\">"+response.qc[i_6467][1]+"</p></div>")
            }
            for (i_6467=0;i_6467<ac_98y3.length;i_6467++){
                $("#"+remove_last_n(ac_98y3[i_6467][0],4)+"_show_class").append("<div class=\'smq_answer_show\'>"+ac_98y3[i_6467][1]+"</div>")
            }
        }
    })
}

function q_generate(parent_id,q_id,q_value,on_off){
    $("#"+parent_id).append("<div class=\'primary question_w0890\' id=\""+q_id+"\" ></div>")
    $("#"+q_id).append("<b>Q</b><span id=\""+q_id+"_value\" onclick=\"edit_panel_open()\"style=\"display:inline;\" value=\""+q_value+"\">"+first_letter_upper(q_value)+"</span>")
/*
    $("#"+q_id).append("<button type=\"button\" onclick=\"add_a_to_exst_q()\">+A</button>")
    $("#"+q_id).append("<button type=\"button\" onclick=\"delete_from_data()\">Del</button>")
    $("#"+q_id).append("<div class=\'collapse_container\' onclick=\'collapse()\'><i class=\"collapse_button fa-solid fa-sort-down\" ></i></div>")
    $("#"+q_id).append("<input type=\"text\" class=\'f09h2304h\' id=\'"+q_id+"_type\' placeholder=\'TYPE\' ondblclick=\'change_q_type()\'value=\'"+on_off+"\'></input>")
*/
}
function a_edit_panel_open(){
    $("#edit_panel_id").remove()
    id_inowien=$(event.target).parent().attr("id")
    $("#"+id_inowien).append("<div class=\'edit_panel_class\' id=\'edit_panel_id\'></div>")
    $("#edit_panel_id").append("<textarea id=\'edit_panel_2815\'class=\'woiefjwoefasf\' value=\'"+$(event.target).attr("value")+"\'>"+$(event.target).attr("value")+"</textarea>")
    $("#edit_panel_id").append("<textarea id=\'edit_panel_2816\'class=\'woiefjwoefasf\' placeholder=\'a_note\'></textarea>")
    $("#edit_panel_id").append("<input type=\'text\' id=\'edit_panel_1529\'class=\'woiefjwoef\' placeholder=\'a_class\'></input>")
    $("#edit_panel_id").append("<input type=\'text\' id=\'edit_panel_6846\'class=\'woiefjwoef\' placeholder=\'a_id\' value=\'"+id_inowien+"\'></input>")
    $("#edit_panel_id").append("<input type=\'text\' id=\'edit_panel_8136\'class=\'woiefjwoef\' placeholder=\'a_lvl\'></input>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'add_q_20592()\' id=\'w09we0gh\'>Manual</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'ai_question_generator_2()\' id=\'w09we0gh2\'>AI</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'select_multiple_qc_2()\' id=\'w09we0gh3\'>QC</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'branch_input_open()\' id=\'w09we0gh4\'>Branch</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'delete_q_02962()\'>Delete</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328 he08rh2\'onclick=\'close_edit_panel()\'>Exit</button>")
    //$("#edit_panel_2816").remove()

    $.ajax({
        type:'post',
        url:'a_edit_panel_open',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            a_id_902:id_inowien

        }, success:function(response){
            $("#edit_panel_1529").val(response.a_class)
            $("#edit_panel_8136").val(response.a_lvl)
            $("#edit_panel_2816").val(response.a_note)
            //$("#edit_panel_2816").replaceWith("<textarea id=\'edit_panel_2816\'class=\'woiefjwoefasf\' value=\'"+response.a_note+"\'placeholder=\'a_note\'>"+response.a_note+"</textarea>")
            for (i_262151=0;i_262151<response.q_id_list.length;i_262151++){
                $("<span>"+response.q_id_list[i_262151]+"<br></span>").insertBefore($("#w09we0gh"))
            }
        }
    })
}
function branch_input_open(){
    $("#wegwwge2y").remove()
    $("#swga32").remove()
    $("<input id=\'wegwwge2y\' class=\'woiefjwoef\' placeholder=\'q_value\'></input>").insertBefore($(event.target))
    $("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'branch_copy_3()\' id=\'swga32\'>Bring Branch</button>").insertBefore($(event.target))
}
function add_q_20592(){
    $("#owiejgw0e9").remove()
    $("#owiejgw0e92").remove()
    $("#owiejgw0e93").remove()
    $("<input id=\'owiejgw0e9\' class=\'woiefjwoef\' placeholder=\'q_value\'></input>").insertBefore($(event.target))
    $("<input id=\'owiejgw0e92\' class=\'woiefjwoef\' placeholder=\'q_type\'></input>").insertBefore($(event.target))
    $("<button id=\'owiejgw0e93\'type=\'button\' class=\'wgewgewgw328\'onclick=\'add_new_q_91721()\'>Save</button>").insertBefore($(event.target))
}
function add_new_q_91721(){
    $.ajax({
        type:'post',
        url:'add_new_q_91721',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_value_97912:$("#owiejgw0e9").val(),
            q_type_97912:$("#owiejgw0e92").val(),
            a_id_891285:$("#edit_panel_6846").val()
        
        }, success:function(response){
            $("<span>"+response.q_value+"<br></span>").insertBefore($("#w09we0gh"))
            q_generate(response.a_id,response.q_id,response.q_value,response.q_type)
            $("#owiejgw0e9").remove()
            $("#owiejgw0e92").remove()
            $("#owiejgw0e93").remove()
        }

    })
}
function edit_panel_open(){
    $("#edit_panel_id").remove()
    id_inowien=$(event.target).parent().attr("id")
    $("#"+id_inowien).append("<div class=\'edit_panel_class\' id=\'edit_panel_id\'></div>")
    $("#edit_panel_id").append("<textarea id=\'edit_panel_2816\'class=\'woiefjwoefasf\' value=\'"+$(event.target).attr("value")+"\'>"+$(event.target).attr("value")+"</textarea>")
    $("#edit_panel_id").append("<input type=\'text\' id=\'edit_panel_1529\'class=\'woiefjwoef\' placeholder=\'q_class\'></input>")
    $("#edit_panel_id").append("<input type=\'text\' id=\'edit_panel_6846\'class=\'woiefjwoef\' placeholder=\'q_id\' value=\'"+id_inowien+"\'></input>")
    $("#edit_panel_id").append("<input type=\'text\' id=\'edit_panel_8136\'class=\'woiefjwoef\' placeholder=\'q_type\'></input>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328whw\'onclick=\'new_class()\' id=\'owijgw12g\'>Q</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328whw\'onclick=\'save_q_0295()\' id=\'iosh98h2\'>QQ</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'add_a_20592()\' id=\'w09we0gh\'>Add [A]</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'delete_q_02962()\'>Delete</button>")
    $("#edit_panel_id").append("<button type=\'button\' class=\'wgewgewgw328 he08rh2\'onclick=\'close_edit_panel()\'>Exit</button>")
    $.ajax({
        type:'post',
        url:'edit_panel_info_1850',
        data:{
            q_id_902:id_inowien,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, success:function(response){
            $("#edit_panel_1529").val(response.q_class)
            $("#edit_panel_8136").val(response.q_type)
            for (i_262151=0;i_262151<response.a_id_list.length;i_262151++){
                $("<span>"+response.a_id_list[i_262151]+"<br></span>").insertBefore($("#w09we0gh"))
            }
        }
    })
}

function save_q_0295(){
    $.ajax({
        type:'post',
        url:'save_q_0295',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_value_98hw:$("#edit_panel_2816").val(),
            q_type_98hw:$("#edit_panel_8136").val(),
            q_id_98hw:$("#edit_panel_6846").val(),
            q_class_98hw:$("#edit_panel_1529").val(),
        }, success:function(response){
            $("#edit_panel_id").remove()
            qc_list_70889=response.same_qc_list
            for (i_542=0;i_542<qc_list_70889.length;i_542++){
                $("#"+qc_list_70889[i_542]+"_value").replaceWith("<span id=\""+qc_list_70889[i_542]+"_value\" onclick=\"edit_panel_open()\" style=\"display:inline;\" value=\""+response.q_value_698+"\">"+response.q_value_698+"</span>")
            }
        }
    })
}


function delete_q_02962(){
    q_id_081152=$(event.target).parent().parent().attr("id")
    $.ajax({
        type:'post',
        url:'delete_q_02962',
        data:{
            q_id_902:q_id_081152,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, success:function(response){
            $("#"+response.q_id_80141).remove()
        }
    })
}
function new_class(){
    $.ajax({
        type:'post', 
        url:'new_class',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, success:function(response){
            $("#iosh98h2").remove()
            $("#owijgw12g").replaceWith("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'save_new_class()\' id=\'owijgw12g\'>Create new</button>")
            $("#edit_panel_1529").val(response.new_qc)
        }
    })
}
function new_class_add_a(){
    $.ajax({
        type:'post', 
        url:'new_class_add_a',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_class_87925:$("#edit_panel_1529").val(),
            q_id_87925:$("#edit_panel_6846").val(),
            a_value_87925:$("#oiwjg0290h").val(),
            a_lvl_87925:$("#oiwjg0290h2").val(),
            a_note_87925:$("#oiwjg0290h3").val()
        }, success:function(response){
            a_generate(response.q_id_81240,response.a_id_92841,response.a_value_985142,response.a_note_928351,response.a_lvl_108121)
            $("<span>"+response.a_value_985142+"<br></span>").insertBefore("#oiwjg0290h")
            $("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'add_a_20592()\' id=\'w09we0gh\'>Add [A]</button>").insertBefore("#oiwjg0290h")
            $("#edit_panel_1529").val(response.new_class_09202)
            $("#owijgw12g").remove()
            $("#iosh98h2").remove()
            $("#oiwjg0290h").remove()
            $("#oiwjg0290h2").remove()
            $("#oiwjg0290h3").remove()
        }
    })
}
function old_class_add_a(){
    $.ajax({
        type:'post', 
        url:'old_class_add_a',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_class_87925:$("#edit_panel_1529").val(),
            q_id_87925:$("#edit_panel_6846").val(),
            a_value_87925:$("#oiwjg0290h").val(),
            a_lvl_87925:$("#oiwjg0290h2").val(),
            a_note_87925:$("#oiwjg0290h3").val()
        }, success:function(response){
            pair_13090=response.pair_92358
            for (i_982953=0;i_982953<response.pair_92358.length;i_982953++){
                //$("#edit_panel_id").append(pair_13090[i_982953])
                a_generate(pair_13090[i_982953][0],pair_13090[i_982953][1],pair_13090[i_982953][2],pair_13090[i_982953][3],pair_13090[i_982953][4])
                a_valeu_892852=pair_13090[i_982953][2]
            }
            $("<span>"+a_valeu_892852+"<br></span>").insertBefore("#oiwjg0290h")
            $("<button type=\'button\' class=\'wgewgewgw328\'onclick=\'add_a_20592()\' id=\'w09we0gh\'>Add [A]</button>").insertBefore("#oiwjg0290h")
            $("#owijgw12g").remove()
            $("#iosh98h2").remove()
            $("#oiwjg0290h").remove()
            $("#oiwjg0290h2").remove()
            $("#oiwjg0290h3").remove()
        }
    })
}
function save_new_class(){
    $.ajax({
        type:'post',
        url:'save_new_class',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_value_98hw:$("#edit_panel_2816").val(),
            q_type_98hw:$("#edit_panel_8136").val(),
            q_id_98hw:$("#edit_panel_6846").val(),
            q_class_98hw:$("#edit_panel_1529").val(),
        }, success:function(response){
            $("#edit_panel_id").remove()
            $("#"+response.q_id+"_value").replaceWith("<span id=\""+response.q_id+"_value\" onclick=\"edit_panel_open()\" style=\"display:inline;\" value=\""+response.q_value+"\">"+response.q_value+"</span>")
        }
    })
}

function close_edit_panel(){
    $("#edit_panel_id").remove()
}
function open_input(){
    $("<input type=\'text\'>").insertBefore($(event.target))
    $(event.target).replaceWith("<button type=\"button\" onclick=\"branch_copy_2();\">++Q</button>")
}

function a_generate(parent_id,a_id,a_value,a_note,a_lvl){
    $("#"+parent_id).append("<div class=\"primary\"id=\""+a_id+"\" style=\"margin-left:10px\">- <span id=\""+a_id+"_value\" onclick=\'a_edit_panel_open()\'style=\"display:inline;\" value=\""+a_value+"\">"+first_letter_upper(a_value)+"</span></div>")
    $("#"+a_id).append("<div class=\'collapse_container\' onclick=\'collapse()\'><i class=\"collapse_button fa-solid fa-sort-down\" ></i></div>")
    /*
    $("#"+a_id).append("<button type=\"button\" onclick=\"new_question()\">+Q</button>")
    $("#"+a_id).append("<button type=\"button\" onclick=\"ai_question_generator()\">AI</button>")
    $("#"+a_id).append("<button type=\"button\" onclick=\"del_a()\" id=\""+a_id+"_delete_button\">Del</button>")
    $("#"+a_id).append("<button type=\"button\" onclick=\"open_input()\">++Q</button>")
    $("#"+a_id).append("<button type=\"button\" onclick=\"show_id()\">#</button>")
    $("#"+a_id).append("<button type=\"button\" onclick=\"select_multiple_qc()\">QC</button>")
    
    if (String(a_note).length==0){
        $("#"+a_id).append("<span class=\"a_note\" id=\""+a_id+"_note\"onclick=\"note_editor()\"> NA </span>")
    } else {
        $("#"+a_id).append("<span class=\"a_note\" id=\""+a_id+"_note\"onclick=\"note_editor()\">"+a_note+"</span>")
    }
    
    $("#"+a_id).append("<select class=\"a_lvl\" id=\'"+a_id+"_lvl\' onchange=\'lvl_editor()\'></select>")
    select_lvl(a_id,a_lvl)
    if (String(a_lvl).length==0 || a_lvl==null ){
        $("#"+a_id).append("<span class=\"a_lvl\" id=\""+a_id+"_lvl\"onclick=\"lvl_editor()\"> NA </span>")
        $("#"+a_id+"_lvl").append("<option id=\'"+a_id+"_NA\'value=\"NA\" selected>NA</option>")
    }
    */
}

function select_type(q_id,q_type){
    for (i_6121=0;i_6121<q_type_array.length;i_6121++){
        type_97152=q_type_array[i_6121]
        if (type_97152==q_type){
            $("#"+q_id+"_type").append("<option id=\""+q_id+"_"+i_6121+"\" value=\""+type_97152+"\" selected>"+type_97152+"</option>")
        } else{
            $("#"+q_id+"_type").append("<option id=\""+q_id+"_"+i_6121+"\" value=\""+type_97152+"\" onclick=\'type_editor()\'>"+type_97152+"</option>")
        }
    }
}

function change_q_type(){
    new_type_298352=$(event.target).val()
    parent_q_id=$(event.target).parent().attr("id")
    $.ajax({
        type:'post',
        url:'change_q_type',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            new_type_fg0n9s:new_type_298352,
            parent_q_id_0he0:parent_q_id
        }, success:function(response){
            $("#"+parent_q_id).val(response.new_type)
            if(response.exist=="no"){
                alert("We've created a new type")
            }
        }
    })
}

function select_lvl(a_id,a_lvl){
    for (i_6121=0;i_6121<10;i_6121++){
        if (i_6121==a_lvl){
            $("#"+a_id+"_lvl").append("<option id=\""+a_id+"_"+i_6121+"\" value=\""+i_6121+"\" selected>"+i_6121+"</option>")
        } else{
            $("#"+a_id+"_lvl").append("<option id=\""+a_id+"_"+i_6121+"\" value=\""+i_6121+"\" onclick=\'lvl_editor()\'>"+i_6121+"</option>")
        }
    }
}

function parent_editor(){
    a_id_1514=$(event.target).parent().attr("id")
    $("body").append("<div class=\'input_container\'id=\'input_edit_container_"+a_id_1514+"\'></div>")
    $("#input_edit_container_"+a_id_1514).append("<textarea id=\"input_edit_"+a_id_1514+"\"></textarea><button onclick=\'update_parent(\""+a_id_1514+"\")\'>Done</button>")
}

function type_editor(){
    new_type=document.querySelector("#"+$(event.target).attr("id")).value
    q_id_1513=$(event.target).parent().attr("id")
    $(event.target).children("option").remove()
    $.ajax({
        type:'post',
        url:'type_editor',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_id:q_id_1513, 
            new_type_754:new_type
        }, success:function(response){
            select_type(response.q_id,response.new_type)
        }
    })
}

function lvl_editor(){
    new_lvl=document.querySelector("#"+$(event.target).attr("id")).value
    a_id_1513=$(event.target).parent().attr("id")
    $(event.target).children("option").remove()
    $.ajax({
        type:'post',
        url:'lvl_editor',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            a_id:a_id_1513, 
            new_lvl_754:new_lvl
        }, success:function(response){
            select_lvl(response.a_id,response.new_lvl)
        }
    })
}

function note_editor(){
    a_id_1512=$(event.target).parent().attr("id")
    exist_note=document.getElementById(a_id_1512+"_note").innerHTML
    $.ajax({
        type:'post',
        url:'note_editor',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            a_id_1512:a_id_1512
        },success:function(response){
            $("body").append("<div class=\'input_container\'id=\'input_edit_container_"+a_id_1512+"\'></div>")
            wwiaawep="#input_edit_container_"+a_id_1512
            $(wwiaawep).append("<textarea id=\"input_edit_"+a_id_1512+"\" >"+exist_note+"</textarea>")
            $(wwiaawep).append("<button class=\"close_container\" onclick=\'close_container()\'>Exit</button>")

            if(response.used_count==1){
                $(wwiaawep).append("<button onclick=\'update_note(\""+a_id_1512+"\")\'>Done</button>")
            } else{
                $(wwiaawep).append("<button onclick=\'update_note(\""+a_id_1512+"\")\'> + </button>")
                $(wwiaawep).append("<button onclick=\'update_note_multiple(\""+a_id_1512+"\")\'>+++</button>")
            }
        }
    })
}

function close_container(){
    $(event.target).parent().remove()
}

function update_parent(x){
    new_parent=$(event.target).siblings("textarea").val()
    $.ajax({
        type:"post",
        url:"update_parent",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            a_id:x,
            a_parent:new_parent
        },success:function(response){
            $(".input_container").remove()
            $("#"+x+"_parent").replaceWith("<span class=\"a_parent\" id=\""+x+"_parent\"onclick=\"parent_editor()\">"+response.completed+"</span>")
        }
    })
}

function update_note_multiple(aaa){
    $.ajax({
        type:"post",
        url:"update_note_multiple",
        data:{
            a_id_2731:aaa,
            textarea:$(event.target).siblings("textarea").val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        }, success:function(response){
            $(".input_container").remove()
            for (i_3463=0;i_3463<response.id_list.length;i_3463++){
                $("#"+response.id_list[i_3463]+"_note").replaceWith("<span class=\"a_note\" id=\""+response.id_list[i_3463]+"_note\"onclick=\"note_editor()\">"+response.note+"</span>")
            }
        }
    })
}

function update_lvl(x){
    new_lvl=$(event.target).siblings("textarea").val()
    $.ajax({
        type:"post",
        url:"update_lvl",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            a_id:x,
            a_lvl:new_lvl
        },success:function(response){
            $(".input_container").remove()
            $("#"+x+"_lvl").replaceWith("<span class=\"a_lvl\" id=\""+x+"_lvl\"onclick=\"lvl_editor()\">"+response.completed+"</span>")
        }
    })
}

function update_note(x){
    new_note=$(event.target).siblings("textarea").val()
    $.ajax({
        type:"post",
        url:"update_note",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            a_id:x,
            a_note:new_note
        },success:function(response){
            $(".input_container").remove()
            $("#"+x+"_note").replaceWith("<span class=\"a_note\" id=\""+x+"_note\"onclick=\"note_editor()\">"+response.completed+"</span>")
        }
    })
}

function create_new_qc_for_new_a(){
    last_sibling_q_id=$(event.target).parent().parent().parent().parent().children("div").last().attr('id')
    up_a_id=$(event.target).parent().attr('id')
    up_q_id=up_a_id.substring(0,up_a_id.length-4)
    up_up_a=$(event.target).parent().parent().parent().parent().parent().parent()    
    up_up_a_id=$(event.target).parent().parent().parent().parent().parent().parent().attr('id')            
    up_up_a.append("<div id=\'"+last_number_plus_one(last_sibling_q_id)+"\'>test</div>")
    new_q_id_for_create=last_number_plus_one(last_sibling_q_id)
    q_generate(up_a_id.substring(0,up_a_id.length-8),new_q_id_for_create,find_by_qid(up_a_id.substring(0,up_a_id.length-4),2),find_by_qid(up_a_id.substring(0,up_a_id.length-4),3))
    new_qc_for_create=new_qc()
    q_insert_ajax(new_q_id_for_create,find_by_qid(up_a_id.substring(0,up_a_id.length-4),2),find_by_qid(up_a_id.substring(0,up_a_id.length-4),3),new_qc_for_create)
    qc_insert_ajax(new_qc_for_create,find_by_qid(up_a_id.substring(0,up_a_id.length-4),2),find_by_qid(up_a_id.substring(0,up_a_id.length-4),3))
    old_qc=find_by_qid(up_a_id.substring(0,up_a_id.length-4),4)
    answer_count=1
    for (i=0;i<ac_array.length;i++){
        if(ac_array[i][1]==old_qc){
            new_a_id_for_create=new_q_id_for_create+"a"+pad(answer_count,3)
            a_generate(new_q_id_for_create,new_a_id_for_create,ac_array[i][3],"null","null")
            a_insert_ajax(new_a_id_for_create,ac_array[i][3],new_q_id_for_create,new_qc_for_create)
            ac_insert_ajax(new_qc_for_create,new_qc_for_create+"a"+pad(answer_count,3),ac_array[i][3])
            answer_count++
        }
    }
    new_a_id_for_create=new_q_id_for_create+"a"+pad(answer_count,3)
    a_generate(new_q_id_for_create,new_q_id_for_create+"a"+pad(answer_count,3),$(event.target).siblings("input").val(),"null","null")
    a_insert_ajax(new_a_id_for_create,$(event.target).siblings("input").val(),new_q_id_for_create,new_qc_for_create)
    ac_insert_ajax(new_qc_for_create,new_qc_for_create+"a"+pad(answer_count,3),$(event.target).siblings("input").val())
    for (i=0;i<answer_array.length;i++){
        if(answer_array[i][3]==up_q_id){
            a_delete_ajax(answer_array[i][1])
        }
    }
    q_delete_ajax(up_q_id)
    $("#"+up_q_id).remove()
}  

function add_a_create_new_qc(){
    q_id=$(event.target).parent().parent().attr('id')
    a_id=$(event.target).parent().attr('id')
    a_value=$("#"+a_id+"_input").val()
    a_lvl_914=$("#"+a_id+"_lvl").val()
    a_note_914=$("#"+a_id+"_note").val()
    a_parent_914=$("#"+a_id+"_parent").val()
    $.ajax({
        type:'POST',
        url:'add_a_create_new_qc',
        data:{
            q_id:q_id,
            a_id:a_id,
            a_value:a_value,
            a_lvl_914:a_lvl_914,
            a_parent_914:a_parent_914,
            a_note_914:a_note_914,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            $("#"+a_id).remove()
            a_generate(q_id,a_id,a_value,response.a_note,response.a_lvl)
        }
    })
}

function edit_a_create_new_qc(){
    q_id=$(event.target).parent().parent().attr('id')
    a_id=$(event.target).parent().attr('id')
    a_value=$("#"+a_id+"_input").val()
    $.ajax({
        type:'POST',
        url:'edit_a_create_new_qc',
        data:{
            q_id:q_id,
            a_id:a_id,
            a_value:a_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
            $("#"+a_id+"_input").replaceWith( "<span ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+a_value+"\">"+a_value+"</span>" );
            $("#"+a_id+"_edit_save_1").remove()
            $("#"+a_id+"_edit_save_2").remove()
        }
    })
} 

function edit_q_create_new_qc(){
    q_id=$(event.target).parent().attr('id')
    q_value=$("#"+q_id+"_input").val()
    $.ajax({
        type:'POST',
        url:'edit_q_create_new_qc',
        data:{
            q_id:q_id,
            q_value:q_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(){
            $("#"+q_id+"_input").replaceWith( "<span ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+q_value+"\">"+q_value+"</span>" );
            $("#"+q_id+"_edit_save_1").remove()
            $("#"+q_id+"_edit_save_2").remove()
        }
    })
} 

function edit_a_apply_exst_qc(){
    q_id=$(event.target).parent().parent().attr('id')
    a_id=$(event.target).parent().attr('id')
    a_value=$("#"+a_id+"_input").val()
    $.ajax({
        type:"POST",
        url:"edit_a_apply_exst_qc",
        data:{
            q_id:q_id,
            a_id:a_id,
            a_value:a_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            for (i=0;i<response.same_class_id.length;i++){
                $("#"+response.same_class_id[i]+"_value").replaceWith("<span id=\""+a_id+"_value\" ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+a_value+"\">"+a_value+"</span>")
            }
            $("#"+a_id+"_input").replaceWith( "<span ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+a_value+"\">"+a_value+"</span>" );
            $("#"+a_id+"_edit_save_1").remove()
            $("#"+a_id+"_edit_save_2").remove()
        }
    })
}

function edit_a_apply_exst_qc(){
    q_id=$(event.target).parent().parent().attr('id')
    a_id=$(event.target).parent().attr('id')
    a_value=$("#"+a_id+"_input").val()
    $.ajax({
        type:"POST",
        url:"edit_a_apply_exst_qc",
        data:{
            q_id:q_id,
            a_id:a_id,
            a_value:a_value,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            for (i=0;i<response.same_class_id.length;i++){
                $("#"+response.same_class_id[i]+"_value").replaceWith("<span id=\""+a_id+"_value\" ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+a_value+"\">"+a_value+"</span>")
            }
            $("#"+a_id+"_input").replaceWith( "<span ondblclick=\"dbl_click()\"style=\"display:inline;\" value=\""+a_value+"\">"+a_value+"</span>" );
            $("#"+a_id+"_edit_save_1").remove()
            $("#"+a_id+"_edit_save_2").remove()
        }
    })
}

function add_a_apply_exst_qc(){
    q_id=$(event.target).parent().parent().attr('id')
    a_id=$(event.target).parent().attr('id')
    a_value=$("#"+a_id+"_input").val()
    a_lvl_914=$("#"+a_id+"_lvl").val()
    a_note_914=$("#"+a_id+"_note").val()
    a_parent_914=$("#"+a_id+"_parent").val()
    $.ajax({
        type:"POST",
        url:"add_a_apply_exst_qc",
        data:{
            q_id:q_id,
            a_id:a_id,
            a_value:a_value,
            a_lvl_914:a_lvl_914,
            a_parent_914:a_parent_914,
            a_note_914:a_note_914,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            $("#"+a_id).remove()
            for (i=0;i<response.same_class_pair.length;i++){
                a_generate(response.same_class_pair[i][0],response.same_class_pair[i][1],response.a_value_178,response.a_note_914,response.a_lvl_914)
            }

        }
    })
}

function add_a_common_save(){
    q_id_914=$(event.target).parent().parent().attr("id")
    a_id_914=$(event.target).parent().attr("id")
    a_value_914=$("#"+a_id_914+"_input").val()
    a_lvl_914=$("#"+a_id_914+"_lvl").val()
    a_note_914=$("#"+a_id_914+"_note").val()
    button_id_914=a_id_914+"_button"
    $.ajax({
        type:'post',
        url:"add_a_common_save",
        data:{
            a_id_914:a_id_914,
            button_id_914:button_id_914,
            a_value_914:a_value_914,
            a_lvl_914:a_lvl_914,
            a_note_914:a_note_914,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            if(response.used_914<2){
                $("#"+a_id_914).remove();
                a_generate(q_id_914,a_id_914,a_value_914,response.a_note_914,response.a_lvl_9144)
            } else {
                $("#"+button_id_914).replaceWith("<button type=\'button\' id=\""+button_id_914+"_1\" onclick=\'add_a_create_new_qc()\'>+</button><button onclick=\'add_a_apply_exst_qc()\' id=\""+button_id_914+"_2\" type=\'button\'>+++</button>")
            }
        }
    })
}

function add_a_to_one_q(){
    a_id_471=$(event.target).parent().attr('id')
    new_a_value=$(event.target).siblings("input[name="+a_id_471+"]").val();
    q_id_471=a_id_471.substring(0,a_id_471.length-4)
    used_count=0
    parent_q_class=find_by_qid(q_id_471,4)
    for(i=0;i<question_array.length;i++){
        if(question_array[i][4]==parent_q_class){
            used_count++
        }
    }
    $.ajax({
        type:'post',
        url:"class_used_counter",
        data:{
            a_class:"",
            q_class:parent_q_class,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){  
            //console.log(response.last_child_numb);
            response.q_count
            if(response.q_count==0){
                alert("Something's wrong, can't find the qid with such qclass")
            } else if (response.q_count==1){
                $("#"+$(event.target).parent().attr('id')).remove()
                $.ajax({
                    type:'post',
                    url:"find_last_children",
                    data:{
                        q_class:parent_q_class,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
                    },
                    success:function(response){  
                        parent_q_class+"a"+pad(response.last_child_numb+1,3)
                        new_a_class=parent_q_class+"a"+pad(response.last_child_numb+1,3)
                        $("#"+a_id_471).remove()
                        a_generate(q_id_471,a_id_471,new_a_value,"null","null")
                        ac_insert_ajax(parent_q_class,new_a_class,new_a_value)
                        a_insert_ajax(a_id_471,new_a_value,q_id_471,new_a_class)
                    }
                })
            } else if (response.q_count>1){
                $(event.target).after("<button type=\'button\' onclick=\'create_new_qc_for_new_a()\'>+</button><button type=\'button\' >+++</button>")
                $(event.target).remove()

            } 
        }
    })
}

function add_a_20592(){
    q_id_808253=$(event.target).parent().parent().attr('id')
    $("<input type=\'text\' class=\'lkd09j2poj\'id=\'oiwjg0290h\' onkeyup=\'a_to_note2()\'></input>").insertBefore($("#w09we0gh"))
    $("<input type=\'text\' class=\'lkd09j2poj\'id=\'oiwjg0290h2\' value=\'3\'></input>").insertBefore($("#w09we0gh"))
    $("<input type=\'text\' class=\'lkd09j2poj\'id=\'oiwjg0290h3\'></input>").insertBefore($("#w09we0gh"))
    $("<button type=\'button\' class=\'wgewgewgw328whw\'onclick=\'new_class_add_a()\' id=\'owijgw12g\'>A</button>").insertBefore($("#w09we0gh"))
    $("<button type=\'button\' class=\'wgewgewgw328whw\'onclick=\'old_class_add_a()\' id=\'iosh98h2\'>AA</button>").insertBefore($("#w09we0gh"))
    $("#w09we0gh").remove()
}
function add_a_to_exst_q(){
    children_number=$(event.target).parent().parent().children(".primary").length;
    last_answer_id=$(event.target).parent().parent().children(".primary").last().attr("id");
    parent_id=$(event.target).parent().parent().attr("id");
    if (children_number>0){
        let an = last_answer_id.match(/(^[a-zA-Z0-9._%+-]*)(\D)(\d+)$/);
        var next_answer_number=+an[3]+1;
        var next_answer_number=('000'+next_answer_number).slice(-3);
        var next_a_id=an[1]+an[2]+next_answer_number
        $("#"+parent_id).append("<div class=\'primary\' id=\""+next_a_id+"\" style=\"margin-left:10px\"> - <input id=\""+next_a_id+"_input\" onkeyup=\"a_to_note()\" type=\"text\" name=\""+next_a_id+"\"></div>")
    } else {
        var next_a_id = parent_id+"a001"
        $("#"+parent_id).append("<div class=\'primary\' id=\""+parent_id+"a001\" style=\"margin-left:10px\"> - <input id=\""+next_a_id+"_input\" onkeyup=\"a_to_note()\" type=\"text\" name=\""+parent_id+"a001\"></div>")
    }
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"new_question()\">+Q</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"add_a_common_save()\" id=\""+next_a_id+"_button\">Save</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"d_delete()\">Del</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"branch_copy()\">++Q</button>")
    $("#"+next_a_id).append("<input class=\"a3a32y\" type=\"text\" id=\""+next_a_id+"_lvl\"value=\'3\'></input>")
    $("#"+next_a_id).append("<input class=\"a3t131\" type=\"text\" id=\""+next_a_id+"_note\"></input>")
}

function a_to_note(){
    $("#"+$(event.target).parent().attr("id")+"_note").val($(event.target).val())
}

function a_to_note2(){
    $("#oiwjg0290h3").val($("#oiwjg0290h").val())
}


function new_answer(){
    if($(event.target).parent().children(".non_exst_q_container").length==0){
        $(event.target).parent().append("<div class=\'non_exst_q_container\'></div>")
    }
    var children_number=$(event.target).parent().children(".primary").length;
    var last_answer_id=$(event.target).parent().children(".primary").last().attr("id");
    var parent_id=$(event.target).parent().attr("id");
    
    $("body").append("last answer id: "+last_answer_id+"<BR>")
    $("body").append(children_number+"<BR>")

    if (children_number>0){
        let an = last_answer_id.match(/(^[a-zA-Z0-9._%+-]*)(\D)(\d+)$/);
        var next_answer_number=+an[3]+1;
        var next_answer_number=('000'+next_answer_number).slice(-3);
        var next_a_id=an[1]+an[2]+next_answer_number
        $(".non_exst_q_container").append("<div id=\""+next_a_id+"\" style=\"margin-left:10px\"> - <input type=\"text\" name=\""+next_a_id+"\"></div>")
    } else {
        var next_a_id = parent_id+"a001"
        $(".non_exst_q_container").append("<div id=\""+parent_id+"a001\" style=\"margin-left:10px\"> - <input id=\""+next_a_id+"_input\" type=\"text\" name=\""+parent_id+"a001\"></div>")
    }
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"new_question()\">+Q</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"add_a_to_one_q()\">Save</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"d_delete()\">Del</button>")
    $("#"+next_a_id).append("<button type=\"button\" onclick=\"branch_copy()\">++Q</button>")
}
    
function add_q(){
    self=$(event.target)
    q_id=self.parent().attr('id')
    q_value=$("#"+q_id+"_input").val()
    q_type=$("#"+q_id+"_type").val()
    new_a_number=$("#"+q_id).children(".primary").length
    answer_array_688=[]
    for (i=0;i<new_a_number;i++){
        a_id_617=$(event.target).parent().children(".primary").eq(i).attr('id')
        a_value_617=$(event.target).parent().children(".primary").eq(i).children("input[name="+a_id_617+"]").val()
        a_note_617=$(event.target).parent().children(".primary").eq(i).children("#"+a_id_617+"_note").val()
        a_lvl_617=$(event.target).parent().children(".primary").eq(i).children("#"+a_id_617+"_lvl").val()
        a_parent_617=$(event.target).parent().children(".primary").eq(i).children("#"+a_id_617+"_parent").val()
        answer_array_688.push([a_id_617,a_value_617,a_note_617,a_lvl_617,a_parent_617])
    }
    $.ajax({
        type: "POST",
        url: "new_qc",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(response){
            lqc=response.last_qc
            q_class="qc"+pad(Number(lqc.substring(lqc.length-3,lqc.length))+1,3)
            $("#"+q_id).remove()
            q_generate(q_id.substring(0,q_id.length-4),q_id,q_value,q_type)
            q_insert_ajax(q_id,q_value,q_type,q_class)
            qc_insert_ajax(q_class,q_value,q_type)
            for (i=0;i<new_a_number;i++){
                a_generate(q_id,answer_array_688[i][0],answer_array_688[i][1],answer_array_688[i][2],answer_array_688[i][3])
                ac_insert_ajax(q_class,q_class+"a"+pad(i+1,3),answer_array_688[i][1])
                a_insert_ajax_2(answer_array_688[i][0],answer_array_688[i][1],q_id,q_class+"a"+pad(i+1,3),answer_array_688[i][2],answer_array_688[i][3],answer_array_688[i][4])
                
            }
        }
    })
}

function some_function(){
    $("#id2").append("test")
}


function a_generate_2(q_id_1521,a_id_1521,a_value_1521){
    if (a_value_1521=="input"){
        $(q_id_1521).append("<div class=\"answer selected\" id=\""+a_id_1521+"\" value=\""+a_value_1521+"\"> <input class=\'soifjwoe\' id=\'"+a_id_1521+"_input\' type=\'text\'></input></div>")

    } else {
        $(q_id_1521).append("<div class=\"answer \" id=\""+a_id_1521+"\" onclick=\"select_copy(\'"+a_id_1521+"\');next_question_is();\" value=\""+a_value_1521+"\"><i class=\"fa-regular fa-square\"></i> "+first_letter_upper(a_value_1521)+"</div>")
    }

    
}
function cc_id_to_value_converter(id_2153){
    for (i_2153=0;i_2153<cc_id_pair.length;i_2153++){
        if (cc_id_pair[i_2153][0]==id_2153){
            value_2153=cc_id_pair[i_2153][1]
        }
    }
    return value_2153
}

function q_generate_2(a,b,c,q_type){
    sub_func_183="<div class=\"question \" id=\""+b+"\" onclick=\"\" value=\""+c+"\"><div class=\'q_title\' onclick=\'remove_hide();\'>"+first_letter_upper(c)+"?"
        if(q_type=="on"){
            if(b=="q001"){
                $(a).append(sub_func_183+"</span></div>")
            } else {
                $(a).append(sub_func_183+" (Select all)</div></div>")
            }
        } else {
            $(a).append(sub_func_183+"</div></div>")
        }
        $("#"+b).children("span").fadeIn(2000)
        $("#"+b).children("span").removeClass("hide")
        $("#"+b).children("span").css("display","")

}

function a_replace_to_unselected(a_id_6115,a_value_6115){
    $("#"+a_id_6115).replaceWith("<div class=\"answer\" id=\""+a_id_6115+"\" onclick=\"select_copy(\'"+a_id_6115+"\');\" value=\""+a_value_6115+"\"><i class=\"fa-regular fa-square\"></i> "+first_letter_upper(a_value_6115)+"</div>")
}
function a_replace_to_selected(a_id_6115,a_value_6115){
    $("#"+a_id_6115).replaceWith("<div class=\"answer selected\" id=\""+a_id_6115+"\" onclick=\"unselect_2(\'"+a_id_6115+"\');\" value=\""+a_value_6115+"\"><i class=\"fa-regular fa-square-check\"></i> "+first_letter_upper(a_value_6115)+"</div>")
}

function select_copy(a_id_6192){
    a_id_7619=a_id_6192 //get a_id 
    q_id=$("#"+a_id_7619).parent().attr("id") //get parent q_id
    q_value=$("#"+q_id).attr("value") //get parent q_value
    a_value=$("#"+a_id_7619).attr("value") //get a_value
    selected_siblings_id=[] //make an array to push ids of selected answers
    for (i_367=0;i_367<$("#"+a_id_7619).siblings(".selected").length;i_367++){
        selected_siblings_id.push($("#"+a_id_7619).siblings(".selected").eq(i_367).attr("id"))
    } //collect sected a's ids in sected_siblings_id array
    $.ajax({//get every information connected to a_id
        type:'post',
        url:'next_questionnaire',
        data:{
            a_id:a_id_7619,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            a_replace_to_selected(a_id_7619,a_value)
            if(response.q_type=="off"){
                //$("#"+q_id).children(".answer").slideUp(1000)
                $("#"+q_id).children(".answer").addClass("hide")
            } 
            /*
            if(q_type_909h=="on"){
                if(q_id!="q001"){
                    count_1521=$("#"+a_id_7619).siblings(".selected").length+1
                    if(count_1521==1){
                        $("<span class=\"answer_to_q\" id=\""+a_id_7619+"_span\"> "+a_value+";</span>").insertBefore($("#"+q_id).children(".answer").first())
                    } else{
                        $("<span class=\"answer_to_q\" id=\""+a_id_7619+"_span\"> "+a_value+";</span>").insertAfter($("#"+q_id).children(".answer_to_q").last())
                    }
                } else {
                    count_1521=$("#"+a_id_7619).siblings(".selected").length+1
                } 
            } else if(q_type_909h=="off"){
                for(i_175=0;i_175<selected_siblings_id.length;i_175++){
                    unselect_2(selected_siblings_id[i_175])
                }
                $("<span class=\"answer_to_q\" id=\'"+a_id_7619+"_span\'> "+a_value+"</span>").insertBefore($("#"+a_id_7619).parent().children(".answer").first())
            } 
            */
            for (i_7124=0;i_7124<response.q_details.length;i_7124++){
                q_id_618=response.q_details[i_7124][0]
                q_value_618=response.q_details[i_7124][1]
                q_type_618=response.q_details[i_7124][2]
                printed_q_list.push(q_id_618)
                if (array_element_counter(printed_q_list,response.q_details[i_7124][0])==1){
                    //$("#"+q_id).append("<div class=\"question\" id=\""+q_id_618+"\" value=\""+q_value_618+"\">"+q_value_618+"</div>")
                    if(q_id_618.length>4){
                        q_generate_2("#"+remove_last_n(q_id_618,8),q_id_618,q_value_618,response.q_details[i_7124][2])
                    } else {
                        q_generate_2("body",q_id_618,q_value_618,response.q_details[i_7124][2])
                    }

                    if (q_type_618=="cc"){
                        search_bar(q_id_618)
                        next_question_button(q_id_618)
                    } else if(q_type_618=="on"){
                        for (j=0;j<response.a_details.length;j++){
                            if (response.a_details[j][0]==q_id_618){
                                a_generate_2("#"+q_id_618,response.a_details[j][1],response.a_details[j][2])
                            }
                        }                            
                        next_question_button(q_id_618)
                    }  else if(q_type_618=="onset"){
                        onset_q_set(q_id_618)
                        for (j=0;j<response.a_details.length;j++){
                            if (response.a_details[j][0]==q_id_618){
                                a_generate_2("#"+q_id_618,response.a_details[j][1],response.a_details[j][2])
                            }
                        }                            
                        next_question_button(q_id_618)
                    } else {
                        for (j=0;j<response.a_details.length;j++){
                            if (response.a_details[j][0]==q_id_618){
                                a_generate_2("#"+q_id_618,response.a_details[j][1],response.a_details[j][2])
                                //$("#"+q_id_618).append("<div class=\"answer\" id=\""+response.a_details[j][1]+"\" onclick=\"select();\" value=\""+response.a_details[j][2]+"\">"+response.a_details[j][2]+"</div>")
                            }
                        }
                    }
                } 
            }


            next_question_is()

            if(response.q_type=="off"){
                note_write_type_specific("general",response.a_id, response.note, response.lvl)
            } else if(response.q_type=="onset"){
                note_write_type_specific(response.q_type,response.a_id, response.note, response.lvl)
            }
        }
    })
}   
function note_write_type_specific(type,a_id,note,lvl){
    if (type=="general"){
    } else if(type=="onset"){
        note=$("#"+a_id+"_input").val()
    }
    if (lvl==1){note_write_1(a_id,note)}
    else if (lvl==2){note_write_2(a_id,note)}
    else if (lvl==3){note_write_3(a_id,note)}
}

function onset_q_set(location){
    button_09hieroi=["unclear"]
    $("#"+location).append("<input type=\'text\' class=\'oihwpoegwe\' id=\'"+location+"_onset_number\' placeholder=\'2-3\' onkeyup=\'onset_to_input()\'></input>")
    $("#"+location).append("<input type=\'text\'class=\'oihwpoegwe\' id=\'"+location+"_onset_scale\' placeholder=\'days\'onkeyup=\'onset_to_input()\'></input> ago")
    $("#"+location).append("<div class=\'onset_set_container\'></div>")
    for (i_800=0;i_800<button_09hieroi.length;i_800++){
        $("#"+location).children(".onset_set_container").append("<button type=\'button\'onclick=\'button_to_onset()\' value=\'"+button_09hieroi[i_800]+"\'>"+button_09hieroi[i_800]+"</button>")
    }
}
function button_to_onset(){
    button_input=$(event.target).val()
    $(event.target).parent().parent().children(".answer").children("input").val(button_input)
}

function onset_to_input(){
    q_id_98howg=$(event.target).parent().attr("id")
    combined_onset=$("#"+q_id_98howg+"_onset_number").val()+" "+$("#"+q_id_98howg+"_onset_scale").val()+" ago"
    $(event.target).parent().children(".answer").children("input").val(combined_onset)
}
function select(){select_copy($(event.target).attr("id"))}

function remove_hide(){
    remove_hide_target($(event.target).parent().attr("id"))
    //$(event.target).siblings(".answer").toggleClass("hide")
    //$(event.target).siblings(".close_button").toggleClass("hide")
    //$(event.target).children(".answer_to_q").remove()
    //next_question_is()
}
function remove_hide_target(some_id){
    $("#"+some_id).children(".q_title").siblings(".answer").toggleClass("hide")
    $("#"+some_id).children(".q_title").siblings(".close_button").toggleClass("hide")
    //$(event.target).children(".answer_to_q").remove()
    next_question_is()
}
function next(){
    alert($(event.target).parent().attr("id"))
    target=$(event.target).parent().position().top
    $("html,body").animate({scrollTop: target},{duration:0})     
}

function search_bar(q_id){
    $.ajax({
        type:'post',
        url:'cc_list_maker',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            $("<input type=\"text\" id=\"cc_input\"class=\"input_bar\" placeholder=\'+\' autocomplete=\"off\"   onkeyup=\"cc_search()\" name=\"cc_search\" ></input><div id=\"matching_cc\"></div>").insertAfter($("#"+q_id).children(".q_title"))
            //$("<button type=\"button\" onclick=\"cc_select();\"class=\"btn\"> + </button>").insertAfter($("#cc_input"))
        }
    })
}
function next_question_button(location){
    $("#"+location).append("<button class=\'close_button\'type\'button\' onclick=\'close_above_a();next_question_is();\'>Next Question</button>")
}
function close_above_a(){
    $(event.target).siblings(".answer").addClass("hide")
    $(event.target).addClass("hide")
    selected=[]
    i_1521=0
    while (i_1521<$(event.target).siblings(".selected").length){
        selected.push($(event.target).siblings(".selected").eq(i_1521).attr("id"))
        i_1521=i_1521+1
    }
    next_question_is()
    a_type=$(event.target).siblings(".answer").eq(0).attr("value")
    if (a_type=="input"){
        a_id_3261=$(event.target).siblings(".answer").attr("id")
        $.ajax({
            type:'post',
            url:'close_above_a_input',
            data:{
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                a_id_3261:a_id_3261,
                a_value_3261:$("#"+a_id_3261+"_input").val(),
            },success:function(response){
                note_write(response.a_id,response.note, response.lvl)
            }
        })
    } else {
        $.ajax({
            type:'post',
            url:'close_above_a',
            data:{
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                selected:array_to_string(selected),
            },
            success:function(response){
                if(response.lvl==1){
                    note_write(response.a_id,array_to_string(response.note), response.lvl)
                } else {
                    for (i_151124=0;i_151124<response.note.length;i_151124++){
                        note_write(response.a_id[i_151124],response.note[i_151124],response.lvl)
                    }
                }
            }
        })        
    }
}
function note_write(a_id,note,lvl){
    note_write_type_specific("general",a_id,note,lvl)
}

function note_write_1(a_id,note){
    if(remove_last_n(a_id,4).length==0){
        $(".note").append("<div class=\'lvl_1\' id=\'"+a_id+"\'>["+note+"]</div>")
    }
}

function note_write_2(a_id,note){
    $(".note").append("<div class=\'lvl_2\' onclick=\"copy_text()\" id=\'"+a_id+"\'>"+note+"\n</div>")

}

function note_write_3(a_id,note){

    $("#"+remove_last_n(a_id,4)).append("<div class=\'lvl_3\' id=\'"+a_id+"\'>"+note+"</div>")
}
function copy_text() {
    note_id=$(event.target).attr("id")
    copy_content=document.getElementById(note_id);
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(copy_content);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy");
    /*
    
    alert($(event.target).select())
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    */
}

function cc_select(){
    for (i_1583=0;i_1583<cc_list.length;i_1583++){
        if(cc_list[i_1583][1]==$("#cc_input").val()){
            select_copy(cc_list[i_1583][0])
        }
    }
}
function array_to_string(array){
    string=""
    for (i_3843=0;i_3843<array.length;i_3843++){
        if(i_3843==0){
            string=array[i_3843]
        } else {
            string=string+","+array[i_3843]
        }
    }
    return string
}
function cc_select_from_list(){
    //alert($(event.target).attr("id"))
    select_copy($(event.target).attr("id"))
    $(event.target).siblings(".interim_answer").remove()
}

function cc_search(){
    $(".interim_answer").remove()
    search_value=$(event.target).val()
    for (i_9174=0;i_9174<cc_list.length;i_9174++){
        if(search_value.length>0 &&RegExp(search_value.toLowerCase()).test(cc_list[i_9174][1].toLowerCase())){
            //$("#matching_cc").append("<div class=\"answer\" id=\""+cc_list[i_9174][0]+"\" onclick=\"select();\" value=\""+cc_list[i_9174][1]+"\">"+cc_list[i_9174][1]+"</div>")
            $("<div class=\"answer interim_answer\" id=\""+cc_list[i_9174][0]+"\" onclick=\"to_the_input(\'"+cc_list[i_9174][1]+"\');cc_select_from_list();\" value=\""+cc_list[i_9174][1]+"\">"+cc_list[i_9174][1]+"</div>").insertAfter($("#cc_input"))
        }
    }
}
function add_more_cc(){
    if ($("#q001").length==1){
        remove_hide_target('q001')
    } else {
        select_copy("q000a003")
    }
}

function disppear(){
    $(event.target).remove()
}
function to_the_input(tt){
    //$("#cc_input").replaceWith("<input type=\"text\" id=\"cc_input\"class=\"input_bar\" onkeyup=\"cc_search()\" name=\"cc_search\" value=\""+tt+"\"></input>")
    $("#cc_input").val('')
}

function unselect(){unselect_2($(event.target).attr("id"))}

function select_first_n(text_2719,n){
    result=""
    for (i_2719=0;i_2719<n;i_2719++){
        result=result+text_2719[i_2719]
    }
    return result
}

function unselect_2(id_471){
    $("#"+id_471+"_note").remove()
    $("#"+id_471+"_span").remove()
    value_471=$("#"+id_471).attr("value")
    $("#"+id_471).children(".question").length
    if(id_471.length==8 && remove_last_n(id_471,4)=="q001"){
        $(event.target).remove()
    } else {
        a_replace_to_unselected(id_471,value_471)
        //$("#"+id_471).replaceWith("<div class=\"answer\" id=\""+id_471+"\" onclick=\"select();\" value=\""+value_471+"\">"+value_471+"</div>")
    }
    q_id=$("#"+id_471).parent().attr("id")
    $.ajax({
        type:'post',
        url:'next_questionnaire',
        data:{
            a_id:id_471,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(response){
            if (response.q_type="off"){
                //$("#"+id_471).siblings(".answer").removeClass("hide")
            }
            remove_candidate=[]
            for (i=0;i<response.q_details.length;i++){
                q_id_471=response.q_details[i][0]
                printed_q_list=array_element_remover(printed_q_list,q_id_471)
                if (array_element_counter(printed_q_list,q_id_471)==0){
                    $("#"+q_id_471).remove()
                    $("#"+q_id_471+"_note").remove()
                    for (j_2486=0;j_2486<printed_q_list.length;j_2486++){
                        if(select_first_n(printed_q_list[j_2486],q_id_471.length)==q_id_471){
                            remove_candidate.push(printed_q_list[j_2486])
                        }
                    }
                }
            }
            for (i_5194=0;i_5194<remove_candidate.length;i_5194++){
                printed_q_list=array_element_remover(printed_q_list,remove_candidate[i_5194])
            }
        }
    })
}

function array_element_exst_check(array,element){
    result=0
    for (i=0;i<array.length;i++){
        if (array[i]==element){
            result=1
        }
    }
    return result
}

function remove_first_n(element,n){
    result=""
    for (i=0;i<element.length;i++){
        if (i>=n){
            result=result+element[i]
        }
    }
    return result
}

function remove_last_n(element,n){
    result=""
    for (i=0;i<element.length-n;i++){
        result=result+element[i]
    }
    return result
}

function remove_last_1(element){
    result=""
    for(i=0;i<element.length-1;i++){
        result=result+element[i]
    }
    return result
}

function array_element_counter(array,element){
    result=0
    for (i_619=0;i_619<array.length;i_619++){
        if (array[i_619]==element){
            result++
        }
    }
    return result
}

function array_element_remover(array_451,element_451){
    j_451=0
    b_451=1
    new_array_451=[]
    while(j_451<array_451.length){
        if (array_451[j_451]==element_451 && b_451==1){
            b_451=0
        } else {
            new_array_451.push(array_451[j_451])
        }
        j_451++
    }
    return new_array_451
}

function first_letter_upper(x){
    result=""
    if (x.length>0){
        result=result+x[0].toUpperCase()
        result=result+x.slice(1)
    } else{
        result='empty'
    }
    return result
}
function sub_func_821(){
    $(".next_question_shine").append("<div class=\"vertical_bar\" onclick=\"collapse_expand()\"></div>")
}

function sub_func_846(){
    $(".next_question_shine").animate({
        opacity:"100%"
    },1000,function(){
    })
}
function next_question_is_by_id(id_3634){

}
function next_question_is(){
    $(".vertical_bar").remove()
    next_question_id="none"
    $(".next_question_shine").removeClass("next_question_shine")
    $(".question").removeClass("next_question_shine")
    $(".cc_mark").remove()
    i_319=0
    for (j_319=0;j_319<$(".question").length;j_319++){
        answer_hide_count=$(".question").eq(j_319).children(".answer.hide").length
        //$("body").append($(".question").eq(j_319).attr("id")+"answer_hide_count is "+answer_hide_count+" and i_319 is "+i_319+"<BR>")
        //if (answer_hide_count==0 && i_319==0 &&$(".question").eq(j_319).attr("id")!="q001"){
        if (answer_hide_count==0 && i_319==0){

            i_319=1
            next_question_id=$(".question").eq(j_319).attr("id")

            $("#"+next_question_id).addClass("next_question_shine")
            sub_func_821()                
            //$("body").append("next question id is "+next_question_id+"<BR>")
            if(select_first_n(next_question_id,4)=="q001"&&next_question_id.length>=12){
                //$("#"+next_question_id).append("<div class=\'cc_mark\'>["+$("#"+select_first_n(next_question_id,8)).attr("value")+select_first_n(next_question_id,8)+"]</div>")
                $("#"+next_question_id).append("<div class=\'cc_mark\'>["+cc_id_to_value_converter(select_first_n(next_question_id,8))+"]</div>")
            }
        }
    }
    if (next_question_id=="none"){
        if($(".the_end").length==0){
            $("body").append("<div class=\'next_question_shine the_end\'></div>")
            $(".the_end").append("<div class=\"the_end_text\">THE END</div>")
            $(".the_end").append("<div class=\"the_end_text\" onclick=\"collapse_expand();\">Review</div>")
            $(".the_end").append("<i class=\"fa-solid fa-plus plus_icon\" onclick=\"add_more_cc();\"></i>")
        } else{
            $(".the_end").addClass("next_question_shine")
        }
        sub_func_821()
    }
    sub_func_846()
    //$(".next_question_shine").append("<div class=\'vertical_bar\' onclick=\'shine_collapse()\'")
}

function collapse_expand(){
    if ($(".next_question_shine").position().left==0){
        $( ".next_question_shine" ).animate({
            left: "95vw",
          }, 1000, function() {
            // Animation complete.
          });
    } else {
        $( ".next_question_shine" ).animate({
            left: "0vw",
          }, 1000, function() {
            // Animation complete.
          });
    }
    //alert($(window).width())
    //alert($("body").position().left)
    if($("body").position().left<0){
        $("body").animate({
            left:"0vw"
        }, 1000, function(){
        })
    } else {
        $("body").animate({
            left:"-95vw"
        }, 1000, function(){
        }) 
    }

}

function qa_ajax(){
    q_id= $(event.target).parent().attr("id");
    question_type=$(event.target).siblings("input[name="+q_id+"_q_type]:checked").val();
    q_value= $("#"+q_id+"_input").val();
    $.ajax({
        type: "POST",
        url: "q_insert",
        data:{
            q_id: q_id,
            q_value: q_value,
            q_type: question_type,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(){
            $("#"+q_id+"_input").replaceWith(q_value);
        }
    })
    a_count=$(event.target).parent().children("div").length
    for(i=0;i<a_count;++i){
        window["a_id"+i]=$(event.target).parent().children("div").eq(i).attr("id")
        window["a_value"+i]=$("#"+window["a_id"+i]+"_input").val();
        d=$("#"+window["a_id"+i]+"_input").val();
        $.ajax({
            type: "POST",   
            url: "a_insert",
            data:{
                a_id: window["a_id"+i],
                a_value: window["a_value"+i],
                q_id: q_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            }, 
            success: function(){
                
            }
        })
        $("#"+window["a_id"+i]+"_input").replaceWith(window["a_value"+i]);
    }
}

function q_ajax(){
    var current_q_id= $(event.target).parent().attr("id");
    var test=$(event.target).siblings("input[name="+current_q_id+"_q_type]:checked").val();
    var current_q_input= current_q_id+"_input";
    var current_q_type= current_q_id+"_q_type";
    var current_value= $("#"+current_q_input).val();
    $.ajax({
        type: "POST",
        url: "q_insert",
        data:{
            q_id: current_q_id,
            q_value: current_value,
            q_type: test,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(){
            $("#"+current_q_input).replaceWith(current_value);
        }
    })
}

function a_ajax(){
    var current_a_id= $(event.target).parent().attr("id");
    var current_q_id= $(event.target).parent().parent().attr("id");
    var current_a_input= current_a_id+"_input";
    var current_value= $("#"+current_a_input).val();
    $.ajax({
        type: "POST",
        url: "a_insert",
        data:{
            a_id: current_a_id,
            a_value: current_value,
            q_id: current_q_id,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success: function(){
            $("#"+current_a_input).replaceWith(current_value);
        }
    })
}

function d_delete(){
    var id=$(event.target).parent().attr("id");
    $("#"+id).remove();
}

function input_maker(loop_id){
    input=""
    while (loop_id.length > 0){
        id_div=loop_id.match(/([aq,\d]*)([aq])(\d\d\d$)/)
        if (id_div[2]=='a'){
                for (j=0;j<answer_array.length;++j){
                if(answer_array[j][1]==loop_id){
                    input=answer_array[j][2]+" "+input
                    //$("body").append("answer_arrayj1="+answer_array[j][1]+"<BR>loop_id is:"+loop_id+"<BR>");
                }
            }
            loop_id=id_div[1]
                
        } else if (id_div[2]=='q') {
            for (m=0;m<question_array.length;++m){
                if(question_array[m][1]==loop_id){
                    input=question_array[m][2]+" "+input
                }
            }
            if(id_div[3]==0){
                loop_id=id_div[1]
            } else {
                z=id_div[3]-1
                loop_id=id_div[1]+'q'+pad(z,3)
            }
        }
    }
    return input
}

function sorter(q_array,score){
    var sorted=[]
    for (w=0;w<5;w++){
        k=0
        p=0
        for (i=0;i<score.length;++i){
            if (score[i]>=p){
                p=score[i]
                k=i
            }
        }
        sorted.push(q_array[k])
        score.splice(k,1)
        q_array.splice(k,1)
    }
    return sorted
}   

function ai_question(){
    var a_id=$(event.target).parent().parent().attr("id");
    var list_id=$(event.target).parent().attr("id");
    a_input=input_maker(a_id)
    var a_count=$(event.target).parent().parent().children("div").length;
    $.ajax({
        type:'post',
        url: "{% url 'getQuestions'%}",
        data:{
            input: a_input,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

        },
        success:function(response){
            console.log(response.questions);
            sorted=sorter(response.q_list,response.questions)
            $("#"+list_id).append("<div class=\"list\"></div>")
                for (e=0; e<sorted.length;++e){
                    $("#"+list_id).children("div.list").append("<div class=\"ai_list\" onclick=\"ai_question_generator(\'"+sorted[e]+"\');\">"+sorted[e]+"</div>")
                    }
                },
            
        error: function(response){
            $(event.target).append("error")
        }
    })
    
}

function ai_question_generator(){
    a_id_185=$(event.target).parent().attr("id")
    a_id_186=$(event.target).parent().attr("id")
    sub_q_number=$("#"+a_id_185).children(".primary").length
    while (sub_q_number>0){
        a_id_186=$("#"+a_id_186).children(".primary").last().attr("id")
        sub_q_number=$("#"+a_id_186).children(".primary").length
    }
    a_count_185=$(event.target).parent().children(".primary").length;
    last_q_id=$(event.target).parent().children(".primary").last().attr("id");
    $.ajax({
        type:"POST",
        url:"ai_question_generator",
        data:{
            a_id_185:a_id_186,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){

            if(a_count_185==0){
                var q_id=a_id_185+"q001";
            } else {
                let an = last_q_id.match(/(^[a-zA-Z0-9._%+-]*)(\D)(\d+)$/);
                var next_q_number=+an[3]+1;
                var next_q_number=('000'+next_q_number).slice(-3);
                var q_id=an[1]+an[2]+next_q_number;
            }
            new_question_info_set(a_id_185,q_id)
            $("#"+q_id).append("<div class=\'exst_q_container\'><div class=\'non_exst_q_container\'></div></div>")
            for(j=0;j<response.ai_generated_q.length;j++){
                //$(".exst_q_container").append("<div class=\'exst_q_suggest\' id=\'"+response.ai_generated_q[j][0]+"\' onclick=\"\")\">"+response.ai_generated_q[j][1]+"<BR></div>")    
                $(".exst_q_container").append("<div class=\'exst_q_suggest\' id=\'"+response.ai_generated_q[j][0]+"\' onclick=\"exst_q_select(\'"+response.ai_generated_q[j][0]+"\')\">["+first_letter_upper(response.ai_generated_q[j][1])+"]<BR></div>")    

            }
            for (r=0;r<response.ai_generated_a.length;r++){
                $("#"+response.ai_generated_a[r][1]).append("- "+first_letter_upper(response.ai_generated_a[r][2])+"<br>")

            }
        }
    })
}

function ai_question_generator_2(){
    $.ajax({
        type:"POST",
        url:"ai_question_generator",
        data:{
            a_id_185:$("#edit_panel_6846").val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },
        success: function(response){
            select_multiple_qc_2()
            result_qcs=""
            for (i_87659=0;i_87659<response.ai_generated_q.length;i_87659++){
                if(i_87659==0){
                    result_qcs=response.ai_generated_q[i_87659][0]
                } else {
                    result_qcs=result_qcs+","+response.ai_generated_q[i_87659][0]
                }
            }
            $("#smq_textarea").val(result_qcs)
        }

    })
}

function show_q_class(){
    $("#"+$(event.target).val()+"_show_class").removeClass("hide")
}

function hide_q_class(){
    $("#"+$(event.target).val()+"_show_class").addClass("hide")

}

function if_exst(array,element){
    result=0
    for (i_791=0;i_791<array.length;i_791++){
        if (array[i_791]==element){
            result=1
        }
    }
    return result 
}

function db_to_scenario_simple_ajax(){
    $.ajax({url:'db_to_scenario_simple_ajax'})
}       

function db_csv_number_equalizer(){
    $.ajax({url:'db_csv_number_equalizer'})
}       

function train_data_generator_ajax(){
    $.ajax({url:'train_data_generator_ajax'})
}       

function train_janice_ajax(){
    $.ajax({url:'train_janice_ajax'})
}  

function agenda(){
    $.ajax({
        type:'POST',
        url:'initial_open',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        }, 
        success:function(response){
            for (i=0;i<response.target_array_q.length;++i){
                if(response.target_array_q[i][0].length==4){
                    
                    q_generate("form",response.target_array_q[i][0],response.target_array_q[i][1],response.target_array_q[i][2])
                } else {
                    q_generate(response.target_array_q[i][3],response.target_array_q[i][0],response.target_array_q[i][1],response.target_array_q[i][2])
                }
                
                for (j=0;j<response.target_array_a.length;++j){
                    
                    if(response.target_array_a[j][0]==response.target_array_q[i][0]){
                        a_generate(response.target_array_a[j][0],response.target_array_a[j][1],response.target_array_a[j][2],response.target_array_a[j][3], response.target_array_a[j][4])
                    }
                }
            }
        }
    })
}

collpase_cc=1
q_list = []  
q_lead_list=[]
q_type_array=[]
a_list=[]
pair_array=[]
q_id_array=[]
printed_q_list=[]


function new_q_id(){
    $("#data_table").empty()
    $("#data_table").append("<input type=\'text\' class=\'sgzezwh\'id=\'q_id_oiwsdf\' placeholder=\'q_id\'></input>")
    $("#data_table").append("<input type=\'text\' class=\'zwshezwh\'id=\'q_c_q_id_oiwsdf\'placeholder=\'q_class\'></input>")
    $("#data_table").append("<button type=\'button\' class=\'sdfqeh\' onclick=\"add_new_q_bank()\">Add</button>")
}
function add_new_q_bank(){
    $.ajax({
        type:'post',
        url:'add_new_q_bank', 
        data:{
            new_q_id_oiotwet:$("#q_id_oiwsdf").val(),
            new_q_id_oiotwet:$("#q_c_q_id_oiwsdf").val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        }, success:function(response){
            $("#q_id_oiwsdf").val("")
            $("#q_c_q_id_oiwsdf").val("")
            alert("Successfully added "+response.q_id_boier+" to the q_bank")
        }
    })
}
function q_sequence(){
    $("#data_table").empty()
    $("#data_table").append("<input type=\'text\' class=\'soskdjdi\'id=\'parent_a\'></input>")
    $("#data_table").append("<button type=\'button\' class=\'oqwiegogej\' onclick=\"load_ext_seq()\">Load Q</button>")
    $("#data_table").append("<textarea class=\'sojdsdfi2\'id=\'children_q_before\'></textarea>")
    $("#data_table").append("<textarea class=\'sojdsdfi2\'id=\'children_q_after\'></textarea>")
    $("#data_table").append("<button type=\'button\' class=\'sdfqeh\' onclick=\"upload_new_seq()\">Apply</button>")
}
function upload_new_seq(){
    $.ajax({
        type:'post',
        url:'upload_new_seq',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            parent_a:$("#parent_a").val(),
            old_seq:$("#children_q_before").val(),
            new_seq:$("#children_q_after").val()
        }
    })
}
function load_ext_seq(){
    parent_a=$("#parent_a").val()
    $.ajax({
        type:"post",
        url:"load_ext_seq",
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            parent_a_215:parent_a
        },success:function(response){
            list_8soher=""
            for (i_wsrwi3=0;i_wsrwi3<response.list.length;i_wsrwi3++){
                list_8soher=list_8soher+response.list[i_wsrwi3]+"\n"
            }
            $("#children_q_before").val(list_8soher)
            $("#children_q_after").val(list_8soher)
        }
    })
}
function new_qac_set(){
    $("#data_table").empty()
    $("#data_table").append("<textarea class=\'weg0920\' id=\'qc_8915\'></textarea>")
    $("#data_table").append("<textarea class=\'weg0920\' id=\'ac_8915\'></textarea>")
    $("#data_table").append("<input type=\'text\' class=\'weg09202\' id=\'qt_8915\' value=\'off\'></textarea>")
    $("#data_table").append("<button type=\'button\' onclick=\"add_new_qac_set()\">Submit</button>")
}
function add_new_qac_set(){
    q_98yge0r9=$("#qc_8915").val()
    q_98yge0r5=$("#ac_8915").val()
    q_w0i8hg02=$("#qt_8915").val()
    $("#qc_8915").val("")
    $("#ac_8915").val("")
    $("#qt_8915").val("")
    $.ajax({
        type:'post',
        url:'add_new_qac_set', 
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_value_687:q_98yge0r9,
            q_type_687:q_w0i8hg02,
            a_value_687:q_98yge0r5
        },success:function(response){
        }
    })
}
function q_square_list(){
    $.ajax({
        type:'post',
        url:'q_square_list',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
        },success:function(response){
            $("#data_table").empty()
            q_class_3843=response.q_class
            a_class_3843=response.a_class
            for (i_3843=0;i_3843<q_class_3843.length;i_3843++){
                $("#data_table").append("<div class=\'db_square_q\' draggable=\"true\" id=\'"+q_class_3843[i_3843][0]+"\'><h3>"+q_class_3843[i_3843][0]+")"+q_class_3843[i_3843][1]+"</h3></div>")
                $("#"+q_class_3843[i_3843][0]).append("<button type=\'button\' onclick=\'del_square()\'>Del</button>")
            }
            for (i_3843=0;i_3843<a_class_3843.length;i_3843++){
                $("#"+remove_last_n(a_class_3843[i_3843][0],4)).append("<div class=\'db_square_a\' id=\'"+a_class_3843[i_3843][0]+"\'>"+a_class_3843[i_3843][1]+"</div>")
            }        


        } 
    })
}
function del_square(){
    target_id=$(event.target).parent().attr("id")
    $.ajax({
        type:'post',
        url:'del_square',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            q_class_to_delete:target_id
        }, success:function(response){
            $("#"+response.q_class_to_delete).remove()
        }
    })

}
function a_class_load(){
    $.ajax({
        type:'post',
        url:'a_class_load',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

        }, success:function(response){
            $("#data_table").empty()
            $("table").remove()
            $(".data_table").append("<table></table>")
            return_data=response.return_data
            for (i=0;i<return_data.length;i++){
                $("table").append("<tr class=\"class_"+return_data[i][0]+"\"></tr>")
                for (j=0;j<return_data[i].length;j++){
                    $(".class_"+return_data[i][0]).append("<th onclick=\"th_function(\'a_class\')\" id=\""+return_data[i][j]+"\">"+return_data[i][j]+"</th>")
                }
            }
        }
    })
}

function remove_last_n(element,n){
    result=""
    for (i=0;i<element.length-n;i++){
        result=result+element[i]
    }
    return result
}

function q_class_load(){
    $.ajax({
        type:'post',
        url:'q_class_load',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

        }, success:function(response){
            $("#data_table").empty()

            $("table").remove()
            $(".data_table").append("<table></table>")
            return_data=response.return_data
            for (i=0;i<return_data.length;i++){
                $("table").append("<tr class=\"class_"+return_data[i][0]+"\"></tr>")
                for (j=0;j<return_data[i].length;j++){
                    $(".class_"+return_data[i][0]).append("<th onclick=\"th_function(\'q_class\')\" id=\""+return_data[i][j]+"\">"+return_data[i][j]+"</th>")
                }
            }
        }
    })
}
function a_bank_load(){
    $.ajax({
        type:'post',
        url:'a_bank_load',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

        }, success:function(response){
            $("#data_table").empty()

            $("table").remove()
            $(".data_table").append("<table></table>")
            return_data=response.return_data
            for (i=0;i<return_data.length;i++){
                $("table").append("<tr class=\"class_"+return_data[i][0]+"\"></tr>")
                for (j=0;j<return_data[i].length;j++){
                    $(".class_"+return_data[i][0]).append("<th onclick=\"th_function(\'a_bank\')\" id=\""+return_data[i][j]+"\">"+return_data[i][j]+"</th>")
                }
            }
        }
    })
}
function q_bank_load(){
    $.ajax({
        type:'post',
        url:'q_bank_load',
        data:{
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

        }, success:function(response){
            $("#data_table").empty()
            $("table").remove()
            $(".data_table").append("<table></table>")
            return_data=response.return_data
            for (i=0;i<return_data.length;i++){
                $("table").append("<tr class=\"class_"+return_data[i][0]+"\"></tr>")
                for (j=0;j<return_data[i].length;j++){
                    $(".class_"+return_data[i][0]).append("<th onclick=\"th_function(\'q_bank\')\" id=\""+return_data[i][j]+"\">"+return_data[i][j]+"</th>")
                }
            }

        }
    })
}
function th_function(x){
    $("#ipsepgoje").remove()
    $(event.target).append("<button id=\'ipsepgoje\' type=\'button\' onclick=\'delete_this_id(\""+x+"\")\'>Del</button>")
}
function delete_this_id(x){
    target_id_0noiwge=$(event.target).parent().attr('id')
    $.ajax({
        type:'post',
        url:"delete_this_id",
        data:{
            data_type:x,
            target_id:target_id_0noiwge,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()

        }, success:function(response){
            $(".class_"+response.target).remove()
        }
    })
}