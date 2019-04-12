$(function () {
    var table_a = null;
    let height = $('.right-content').height() - $('.dataTables_info').height() - $('.dataTables_scrollHead').height()
    CONSTANT.DATA_TABLES.DEFAULT_OPTION.scrollY = height;
    CONSTANT.DATA_TABLES.DEFAULT_OPTION.scrollCollapse = true;
    CONSTANT.DATA_TABLES.DEFAULT_OPTION.fixedHeader = true;

    colmuns = [
        {
            data: "name",
            render: function (data, type, row) {
                return '<span class="rules-name" data-id="' + row.id + '">' + data + '</span>'
            }
        }, {
            data: "formula",
            render: function (data, type, row) {
                return '<div class="rules-formula">' + data + '</div>'
            }
        }, {
            data: 'synopsis',
            render: function (data, type, row) {
                return '<p class="synopsis">' + data + '</p>'
            }
        }, {
            data: 'time',
            render: function (data, type, row) {
                return '<p class="rules-create-time">' + data + '</p>'
            }
        }, {
            data: null,
            render: function (data, type, row) {
                return '<div class="rules-operation" data-id="' + row.id + '"><span class="layui-btn btn-edit">编辑</span><span class="layui-btn btn-del">删除</span>'
            }
        }
    ]
    let table_url = '../data/rulesLib.json'

    tableshow($("#showRulesLib"), colmuns, table_a, table_url, $('.btn-del'), userManage, "undefined");
})


function callbacka(ele, tablee) {
    layui.use(['form', 'layer', 'upload'], function () {
        let $form = layui.form, $layer = layui.layer
        if ($(ele).hasClass('rules-name')) {//点击名称显示信息
            $layer.open({
                type: 1,
                content: $('.rules-lib-layer'),
                title: '查看规则',
                shadeClose: false,
                skin: 'show-only',
                resize: false,
                move: false,
                area: ['500px', '310px'],
                tipsMore: true,
                success: function (layero, index) {
                    $form.val("rules-lib", {
                        "id":$(ele).attr('data-id')
                        ,"name": $(ele).text()
                        , "formula": $(ele).parents('td').nextAll().find('.rules-formula').text()
                        , "synopsis": $(ele).parents('td').nextAll().find('.synopsis').text()
                        , "time": $(ele).parents('td').nextAll().find('.rules-create-time').text()
                    })
                    $('.layui-input,.layui-textarea', layero).attr('readonly', true);
                },
                cancel: function (index, layero) {
                    $('.rules-lib-layer form')[0].reset()
                    $('.layui-input,.layui-textarea', layero).attr('readonly', false);
                }
            })
        } else if ($(ele).hasClass('btn-edit')) {//编辑按钮
            $layer.open({
                type: 1,
                content: $('.rules-lib-layer'),
                title: '编辑规则',
                skin: 'edit-rules',
                shadeClose: false,
                resize: false,
                move: false,
                area: ['500px', '350px'],
                tipsMore: false,
                success: function (layero, index) {
                    $('.layui-input[name="time"],.layui-textarea', layero).attr('readonly', true);
                    let obj = {
                        "id":$(ele).attr('data-id')
                        ,"name": $(ele).parents('td').prevAll().find('.rules-name').text()
                        , "formula": $(ele).parents('td').prevAll().find('.rules-formula').text()
                        , "synopsis": $(ele).parents('td').prevAll().find('.synopsis').text()
                        , "time": $(ele).parents('td').prevAll().find('.rules-create-time').text()
                    }
                    $form.val("rules-lib", obj)
                    sessionStorage.setItem('rules-name', obj.name)
                    sessionStorage.setItem('rules-synopsis', obj.synopsis)
                },
                cancel: function (index, layero) {
                    $('.rules-lib-layer form')[0].reset()
                    $('.layui-input,.layui-textarea', layero).attr('readonly', false);
                    sessionStorage.removeItem('rules-name')
                    sessionStorage.removeItem('rules-synopsis')
                }
            })
        } else if ($(ele).hasClass('btn-del')) {
            delConfirm('是否删除当前行?', delFunc(ele))
        }
        $form.verify({
            username: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                    return '用户名不能有特殊字符';
                }
                if(/(^\_)|(\__)|(\_+$)/.test(value)){
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if(/^\d+\d+\d$/.test(value)){
                    return '用户名不能全为数字';
                }
            }

            //我们既支持上述函数式的方式，也支持下述数组的形式
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            ,pass: [
                /^[\S]{6,12}$/
                ,'密码必须6到12位，且不能出现空格'
            ],
            twoWord:function(vale,item){
                if(vale.length < 2){
                    return '字数不得少于2位'
                }
            }
        });
    })

}

function delFunc(ele) {
    let id = $(ele).parents('.rules-operation').attr('data-id')
    $.ajax({
        url: "#",
        data: "id=" + id,
        type: 'post',
        dataType: 'json',
        success: function (res) {
            if (res.success) {
                $(ele).parents('tr').remove();
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

$('body').on('click', '.edit-rules .cancel-layer', function (e) {
    e.stopPropagation();
    $('.edit-rules .layui-input[name="name"]').val(sessionStorage.getItem('rules-name'));
    $('.edit-rules .layui-input[name="synopsis"]').val(sessionStorage.getItem('rules-synopsis'));
})

layui.use(['form', 'layer', 'upload'], function () {
    let $form = layui.form, $layer = layui.layer, $upload = layui.upload
    var uploadInst = "";
    //点击增加一行
    $('.add-item').click(function (e) {
        $layer.open({
            type: 1,
            content: $('.rules-lib-layer'),
            title: '添加规则',
            skin: 'add-rules',
            shadeClose: false,
            resize: false,
            move: false,
            area: ['500px', '460px'],
            tipsMore: false,
            success: function (layero, index) {
                uploadInst = $upload.render({
                    elem: '#uploadArea',
                    url: '#',
                    bindAction:'#uploadItem',
                    auto:false,
                    accept:'images',
                    choose: function (obj) {
                        //预读本地文件示例，不支持ie8
                        obj.preview(function (index, file, result) {
                            $('#demo1').attr('src', result); //图片链接（base64）
                        });

                    },
                    before:function(obj){
                        console.log(obj);
                    },
                    done: function (res) {
                        //如果上传失败
                        if (res.code > 0) {
                            return layer.msg('上传失败');
                        }
                        //上传成功
                    },
                    error: function () {
                        //演示失败状态，并实现重传
                        var demoText = $('#demoText');
                        demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                        demoText.find('.demo-reload').on('click', function () {
                            uploadInst.upload();
                        });
                    }
                })
            },
            cancel: function (index, layero) {
                $('.rules-lib-layer form')[0].reset()
                $('.layui-input,.layui-textarea', layero).attr('readonly', false);
            }
        })
    })
    $('body').on('click', '.add-rules .cancel-layer', function (e) {
        e.stopPropagation();
        $('.rules-lib-layer form')[0].reset()
        $('.add-rules .layui-upload-img').prop('src',"");
        $('#demoText').html('')
    })

    $form.on('submit(submitRules)', function(data){
        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        if($(data.form).parents('.layui-layer-page').hasClass('edit-rules')){//编辑提交
            $.ajax({
                url:'#',
                type:'post',
                data:data.field,
                dataType: "json",
                success:function(res){
                    if(res.success){
                        $layer.msg('修改成功！')
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        }else if($(data.form).parents('.layui-layer-page').hasClass('add-rules')){//添加提交
            $.ajax({
                url:'#',
                type:'post',
                data:data.field,
                dataType: "json",
                success:function(res){
                    if(res.success){
                        $layer.msg('添加成功！')
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        }

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
})
