$(function(){
    let height = $('.right-content').height() - $('.dataTables_info').height() - $('.dataTables_scrollHead').height()
    CONSTANT.DATA_TABLES.DEFAULT_OPTION.scrollY = height;
    CONSTANT.DATA_TABLES.DEFAULT_OPTION.scrollCollapse = true;
    CONSTANT.DATA_TABLES.DEFAULT_OPTION.fixedHeader = true;

    let colmuns = [
        {
            data: "name",
            render: function (data, type, row) {
                return '<span class="rules-name" data-id="' + row.id + '">' + data + '</span>'
            }
        }, {
            data: "indicators",
            render: function (data, type, row) {
                let dom = `<div class='indicators'><span class="indicators-from">${data.from}</span>--<span class="indicators-to">${data.to}</span></div>`

                return dom
            }
        }, {
            data: null,
            render: function (data, type, row) {
                return '<div class="rules-operation" data-id="' + row.id + '"><span class="layui-btn btn-edit">编辑</span><span class="layui-btn btn-del">删除</span>'
            }
        }
    ]
    let table_url = '../data/rules_relation.json', table_a = null;

    tableshow($("#showRulesLib"), colmuns, table_a, table_url, $('.btn-del'), userManage, "undefined");

})
function callbacka(ele, tablee) {
    layui.use(['form','layer'],function() {
        var $ele = layui.element, $form = layui.form, $table = layui.table, $tpl = layui.laytpl,
            $layer = layui.layer;

        if ($(ele).hasClass('rules-name')) {//点击名称显示信息
            $layer.open({
                type: 1,
                content: $('.rules-relation-layer'),
                title: '查看关系',
                shadeClose: false,
                skin: 'show-only',
                resize: false,
                move: false,
                area: ['500px', 'auto'],
                tipsMore: true,
                success: function (layero, index) {
                    $form.val("relation-lib", {
                        "id": $(ele).attr('data-id')
                        , "name": $(ele).text()
                        , "formula-from0": $(ele).parents('td').nextAll().find('.indicators-from').text()
                        , "formula-to0": $(ele).parents('td').nextAll().find('.indicators-to').text()
                    })
                    $('.layui-input', layero).attr('readonly', true);
                },
                cancel: function (index, layero) {
                    $('.rules-relation-layer form')[0].reset()
                    $('.layui-input', layero).attr('readonly', false);
                }
            })
        } else if ($(ele).hasClass('btn-edit')) {//点击编辑按钮
            $.ajax({
                url:'../data/edit_relation.json',
                data:'id'+$(ele).attr('data-id'),
                type:'post',
                dataType:'json',
                success:function(res){
                    if(res.status){
                        let formDom = "", fromCount = 0, toCount = 0
                        for (let i = 0; i < res.data.from.length; i++) {
                            formDom += `<input type="text" name="formula-from${formCount++}" data-id="${res.data.from[i].id}" placeholder="请选择" autocomplete="off" class="layui-input from" value="${res.data.from[i].name}">`
                        }
                        for (let j = 0; j < res.data.to.length; j++) {
                            `<input type="text" name="formula-to${toCount++}" data-id="${res.data.to[i].id}" placeholder="请选择" autocomplete="off" class="layui-input to" value="${res.data.to[i].name}">`
                        }
                        $layer.open({
                            type: 1,
                            content: $('.rules-relation-layer'),
                            title: '编辑关系',
                            shadeClose: false,
                            skin: 'edit-relation',
                            resize: false,
                            move: false,
                            area: ['500px', 'auto'],
                            tipsMore: true,
                            success: function (layero, index) {
                                $form.val("relation-lib", {
                                    "id": $(ele).attr('data-id')
                                    , "name": $(ele).parents('td').prevAll().find('.rules-name').text()
                                })
                                $('.layui-input', layero).attr('readonly', false);
                            },
                            cancel: function (index, layero) {
                                $('.rules-relation-layer form')[0].reset()
                                $('.fromA .from',layero).not('[name="formula-from0"]').remove()
                                $('.toB .to',layero).not('[name="formula-to0"]').remove()
                            }
                        })
                    }
                }
            })

        }
    })
}

layui.use(['form', 'layer', 'upload'], function () {
    let $form = layui.form, $layer = layui.layer, $upload = layui.upload
    var uploadInst = "";
    //点击增加一行
    $('.add-item').click(function (e) {
        $layer.open({
            type: 1,
            content: $('.rules-relation-layer'),
            title: '添加规则关系',
            skin: 'add-relation',
            shadeClose: false,
            resize: false,
            move: false,
            area: ['500px', 'auto'],
            tipsMore: true,
            success: function (layero, index) {

            },
            cancel: function (index, layero) {
                $('.rules-relation-layer form')[0].reset()
                $('.fromA .from',layero).not('[name="formula-from"]').remove()
                $('.toB .to',layero).not('[name="formula-to"]').remove()
            }
        })
    })
    $('body').on('click', '.add-rules .cancel-layer', function (e) {
        e.stopPropagation();
        $('.rules-lib-layer form')[0].reset()
        $('fromA .from').not('[name="formula-from0"]').remove()
        $('toB .to').not('[name="formula-to0"]').remove()
    })

    //添加关系
    let formCount = 0, toCount = 0
    $('body').on('click','.rules-relation-layer .more-content',function(e){
        e.stopPropagation();
        let dom;
        if($(this).next('input').attr('name') == 'formula-from') {
            dom = `<input type="text" name="formula-from${formCount++}"  placeholder="请选择" autocomplete="off" class="layui-input from">`
        } else {
            dom = `<input type="text" name="formula-to${toCount++}"  placeholder="请选择" autocomplete="off" class="layui-input to">`
        }
        $(this).parents('.layui-input-block').append(dom)
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
