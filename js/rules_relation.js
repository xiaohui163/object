$(function(){
    var height = $('.right-content').height() - $('.dataTables_info').height() - $('.dataTables_scrollHead').height();
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
var fromCount = 0, toCount = 0, rulesCount = 0
function callbacka(ele, tablee) {
    layui.use(['form','layer'],function() {
        var $form = layui.form, $layer = layui.layer;

        if ($(ele).hasClass('rules-name')) {//点击名称显示信息
            $.ajax({
                url:'../data/edit_relation.json',
                data:'id'+$(ele).attr('data-id'),
                type:'post',
                dataType:'json',
                success:function(res) {
                    if (res.status) {
                        renderRulesRelation(res);
                        $layer.open({
                            type: 1,
                            content: $('.rules-relation-layer'),
                            title: '查看关系',
                            shadeClose: false,
                            skin: 'show-only',
                            resize: false,
                            move: false,
                            area: ['500px', 'auto'],
                            tipsMore: false,
                            offset: '200px',
                            success: function (layero, index) {
                                $form.val("relation-lib", {
                                    "id": $(ele).attr('data-id')
                                    , "name": $(ele).text()
                                    , "formula-from0": $(ele).parents('td').nextAll().find('.indicators-from').text()
                                    , "formula-to0": $(ele).parents('td').nextAll().find('.indicators-to').text()
                                })
                                $('.layui-input[name="name"]', layero).attr('readonly', true);
                            },
                            cancel: function (index, layero) {
                                $('.rules-relation-layer form')[0].reset()
                                $('.layui-input[name="name"]', layero).attr('readonly', false);
                                fromCount = 0, toCount = 0, rulesCount = 0
                            }
                        })
                    }
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
                        renderRulesRelation(res);
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
                            offset: '200px',
                            success: function (layero, index) {
                                $form.val("relation-lib", {
                                    "id": $(ele).attr('data-id')
                                    , "name": $(ele).parents('td').prevAll().find('.rules-name').text()
                                })
                                $('.layui-input[name="name"]', layero).attr('readonly', false);
                            },
                            cancel: function (index, layero) {
                                $('.rules-relation-layer form')[0].reset()
                                $('.rules-relation-layer .formula-realtion .layui-input-block').remove()
                                $('.relation-rules .layui-input-block input').remove()
                                $layer.closeAll('page')
                                fromCount = 0, toCount = 0, rulesCount = 0
                            }
                        })
                    }
                }
            })
        }else if($(ele).hasClass('btn-del')){
            //删除当前行
            delFunc.ele = ele
            delFunc.url = '#'
            delFunc.param = {
                id:$(ele).attr('data-id')
            }

            delConfirm('是否删除当前行？',delFunc)
        }
    })
}

function chooseRulesCallback(ele,tablee){
    layui.use(['form','layer'],function() {
        var $form = layui.form, $layer = layui.layer;
        if (['rules-name','rules-formula','synopsis','rules-create-time'].indexOf($(ele)[0].classList[0]) != -1){
            let nameTd =  $(ele).closest('tr').find('.rules-name'),
                ruleObj = {
                    id:$(nameTd).attr('data-id'),
                    name: $(nameTd).text().trim()
                },
                chooseInp = $(ele).parents('.layui-layer-content').attr('data-name')
            $layer.close($layer.index)
            $('.relation-rules').find('.layui-input.rule[name="'+ chooseInp +'"]').val(ruleObj.name).attr('data-id',ruleObj.id)
        }
    })
}

layui.use(['form', 'layer', 'upload'], function () {
    let $form = layui.form, $layer = layui.layer, $upload = layui.upload
    var uploadInst = "";
    //点击增加一行
    $('.add-item').click(function (e) {
        if($('.formula-realtion .layui-input-block').length == 0){
            let freomDom = '<div class="layui-input-block">'+
                '<div class="layui-form-mid">form</div>'+
                '<div class="layui-input-inline fromA">'+
                '<input type="text" name="formula-from'+(fromCount++)+'" readonly data-id="" placeholder="请选择" autocomplete="off" class="layui-input from" value="" required>'+
                '</div>'+
                '<div class="layui-form-mid" style="margin-left: 4px;">to</div>'+
                '<div class="layui-input-inline toB">'+
                '<input type="text" name="formula-to'+(toCount++)+'" readonly data-id="" placeholder="请选择" autocomplete="off" class="layui-input to" value="">'+
                '</div>'+
                '</div>'
            $('.formula-realtion').append(freomDom)
        }
        if($('.relation-rules .layui-input-block input').length == 0){
            let ruleDom = '<input type="text" name="rules'+(rulesCount++)+'" readonly data-id="" placeholder="请选择" autocomplete="off" class="layui-input rule" value="">'
            $('.relation-rules .layui-input-block').append(ruleDom)
        }
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
            offset: '200px',
            success: function (layero, index) {

            },
            cancel: function (index, layero) {
                $('.rules-relation-layer form')[0].reset()
                $('.rules-relation-layer .formula-realtion .layui-input-block').remove()
                $('.relation-rules .layui-input-block input').remove()
                fromCount = 0, toCount = 0, rulesCount = 0
            }
        })
    })
    $('body').on('click', '.rules-relation-layer .cancel-layer', function (e) {
        e.stopPropagation();
        $('.rules-relation-layer form')[0].reset()
        $('.rules-relation-layer .formula-realtion .layui-input-block').remove()
        $('.relation-rules .layui-input-block input').remove()
        $layer.closeAll('page');
        fromCount = 0, toCount = 0, rulesCount = 0
    })

    //添加关系
    $('body').on('click','.rules-relation-layer .more-content',function(e){
        e.stopPropagation();
        let dom;
        if($(this).parents('.layui-form-item').hasClass('formula-realtion')) {
            dom = `<div class="layui-input-block">`+
                `<div class="layui-form-mid">form</div>`+
                `<div class="layui-input-inline fromA">`+
                `<input type="text" name="formula-from${fromCount++}" readonly data-id="" placeholder="请选择" autocomplete="off" class="layui-input from" value="" required>`+
                `</div>`+
                `<div class="layui-form-mid" style="margin-left: 4px;">to</div>`+
                `<div class="layui-input-inline toB">`+
                `<input type="text" name="formula-to${toCount++}" readonly data-id="" placeholder="请选择" autocomplete="off" class="layui-input to" value="">`+
                `</div>`+
                `</div>`
            $(this).parents('.layui-form-item').append(dom)
        } else {
            dom = `<input type="text" name="rules${rulesCount++}" readonly data-id="" placeholder="请选择" autocomplete="off" class="layui-input rule" value="">`
            $(this).siblings('.layui-input-block').append(dom)
        }
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
                        $layer.close($layer.index)
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
                        $layer.close($layer.index)
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

    $('body').on('click','.add-relation .layui-input,.edit-relation .layui-input',function (e) {
        e.stopPropagation();
        let it = this, dataName = $(it).attr('name'), url = ""
        if($(it).parents('.layui-form-item').hasClass('formula-realtion')){
            url = "../data/eleLibTree.json"
        }else if($(it).parents('.layui-form-item').hasClass('relation-rules')){
            url = "../data/rulesLib.json"
        }
        if($(it).hasClass('from')||$(it).hasClass('to')){
            $layer.open({
                type: 1,
                content: $('#chooseFromTpl').html(),
                title: '选择要素指标',
                skin: 'choose-formula',
                shadeClose: false,
                resize: false,
                move: false,
                area: ['870px', '475px'],
                tipsMore: true,
                offset: '200px',
                success: function (layero, index) {
                    $('.layui-layer-content',layero).attr('data-name',dataName)
                    let asyncSetting = {
                        async: {
                            key:{
                                title: "name"
                            },
                            autoParam:["id","name"],
                            dataFilter: filter,
                            enable: true,
                            url: url,
                            type: "post",
                        },
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: "id",
                                pIdKey: "pId",
                                rootPId: 0
                            }
                        },
                        view:{
                            showLine: false,
                            showTitle: showTitle,
                            fontCss: setFontCss,
                            selectedMulti: false
                        },
                        callback:{
                            beforeClick:beforeDo,
                            onClick: ztreeChooseELe
                        }
                    };
                    zTreeObj = $.fn.zTree.init($('#chooseFromTree'), asyncSetting);
                },
            })
        }else if($(it).hasClass('rule')){
            //let dom = renderColsDom("",url,true);
            let dom = "<div class='choose-rules'><table id='chooseRulesTable'>" +
                "<thead>" +
                "<tr>" +
                "<th>名称</th>\n" +
                "<th>公式</th>\n" +
                "<th>内容</th>\n" +
                "<th>创建时间</th>" +
                "</tr>" +
                "</thead>" +
                "</table></div>"
            $layer.open({
                type: 1,
                content: dom,
                title: '选择关联规则',
                skin: 'choose-relation-rules',
                shadeClose: false,
                resize: false,
                move: false,
                area: ['870px', '475px'],
                tipsMore: true,
                offset: '200px',
                success: function (layero, index) {
                    $('.layui-layer-content', layero).attr('data-name', dataName)
                    var table_a = null;
                    let height = $('.right-content').height() - $('.dataTables_info').height() - $('.dataTables_scrollHead').height()
                    CONSTANT.DATA_TABLES.DEFAULT_OPTION.scrollY = height;
                    CONSTANT.DATA_TABLES.DEFAULT_OPTION.scrollCollapse = true;
                    CONSTANT.DATA_TABLES.DEFAULT_OPTION.fixedHeader = true;
                    colmuns = [
                        {
                            data: "name",
                            render: function (data, type, row) {
                                return '<p class="rules-name rules-relation-td" data-id="' + row.id + '">' + data + '</p>'
                            }
                        }, {
                            data: "formula",
                            render: function (data, type, row) {
                                return '<div class="rules-formula rules-relation-td">' + data + '</div>'
                            }
                        }, {
                            data: 'synopsis',
                            render: function (data, type, row) {
                                return '<p class="synopsis rules-relation-td">' + data + '</p>'
                            }
                        }, {
                            data: 'time',
                            render: function (data, type, row) {
                                return '<p class="rules-create-time rules-relation-td">' + data + '</p>'
                            }
                        }
                    ]
                    let table_url = '../data/rulesLib.json'

                    tableshow($("#chooseRulesTable"), colmuns, table_a, table_url, $('.btn-del'), userManage, "undefined");
                }
            })
        }
    })


    //from-to弹窗表格选中
    $('body').on('click','.choose-table .content-cell',function(e){
        e.stopPropagation();
        let it = this, dataName = $(it).parents('.layui-layer-content').attr('data-name'),
        obj = {
            name: $(it).text().trim(),
            id: $(it).attr('data-id')
        }
        if($(it).parent().hasClass('content-body')){
            obj.name = $(it).parent().siblings('.content-header').find('.content-cell').text().trim() + '-' +obj.name
        }
        $layer.close($layer.index);
        $('.formula-realtion').find('.layui-input[name="'+dataName+'"]').val(obj.name).attr('data-id',obj.id)
    })


})

function renderRulesRelation(res) {
    let formDom = "", rulesDom = ""
    for (let i = 0; i < res.data.from.length; i++) {
        formDom += `<div class="layui-input-block">`+
            `<div class="layui-form-mid">form</div>`+
            `<div class="layui-input-inline fromA">`+
            `<input type="text" name="formula-from${fromCount++}" readonly data-id="${res.data.from[i].id}" placeholder="请选择" autocomplete="off" class="layui-input from" value="${res.data.from[i].name}" required>`+
            `</div>`+
            `<div class="layui-form-mid" style="margin-left: 4px;">to</div>`+
            `<div class="layui-input-inline toB">`+
            `<input type="text" name="formula-to${toCount++}" readonly data-id="${res.data.to[i].id}" placeholder="请选择" autocomplete="off" class="layui-input to" value="${res.data.to[i].name}">`+
            `</div>`+
            `</div>`
    }
    for (let k = 0; k < res.data.rules.length; k++) {
        rulesDom += `<input type="text" name="rules${rulesCount++}" readonly data-id="${res.data.to[k].id}" placeholder="请选择" autocomplete="off" class="layui-input rule" value="${res.data.rules[k].name}">`
    }
    $('.rules-relation-layer .formula-realtion .layui-input-block').remove()
    $('.rules-relation-layer .formula-realtion').append(formDom)
    $('.relation-rules .layui-input-block input').remove()
    $('.relation-rules .layui-input-block').append(rulesDom);
}

function ztreeChooseELe(event, treeId, treeNode) {
    $.ajax({
        url:'../data/eleLibColla.json',
        data:{
            id: treeNode.id
        },
        type:'post',
        dataType: 'json'
    }).done(function(res){
        if(res.status){
            var getTpl = $('#collaItems').html();
            layui.use('laytpl', function () {
                var $tpl = layui.laytpl;
                $tpl(getTpl).render(res, function (html) {
                    $('.chooseFrom .choose-table').html(html).attr('data-id',treeNode.id)
                })
            })
        }
    })
}


function beforeDo (treeId, treeNode, clickFlag){
    /*if(treeNode.lev == 1){
        return false
    }*/
}
