layui.use(['element','form','table','laytpl','layer'], function () {
    var $form = layui.form, $tpl = layui.laytpl, $layer = layui.layer;

    /*加载树形结构--E*/
    renderTree('.ztree')

    //改变树形结构后提交后台
    function changeTreeNode(id,parentTId,name,type,it) {
        let strArr = ['添加成功！','修改成功！','删除成功'],
            typeArr = ['add','edit','del'];

        $layer.load();

        $.ajax({
            url: "#",
            type: "post",
            data: {id: id, parentId: parentTId, name: name, type: typeArr[type]},
            dataType: "json",
            success: function (rst) {
                if (rst.status) {
                    $layer.closeAll('loading');
                    $layer.msg(msg ? strArr[type] : '修改成功!');
                    //折叠页清空,树的选中状态复位
                    $('.collapse-content').html('');
                    zTreeObj.cancelSelectedNode();
                    if (it) {
                        $(it).parents('.colla-item').removeClass('editable');
                    }
                }
            },
            error: function (err) {
                $layer.closeAll('loading');
                $layer.msg('服务器错误！')
                if (it) {
                    $(it).focus();
                }
            }
        })
    }

    //var tableData;

    /*加载折叠项内容--S*/
    /*$('.collapse-content').on('click','.colla-title',function(e){
        e.stopPropagation();
        if($(this).parents('.colla-item').hasClass('editable')) return;
        $(this).siblings('span').removeClass('active');
        if($(this).parents('.colla-item').hasClass('active')){
            $(this).parents('.colla-item').removeClass('active').removeClass('editable')
            return
        }
        $(this).parents('.colla-item').siblings('.colla-item').removeClass('editable')
        let it = this, dataId = $(it).parents('.colla-item').attr('data-id');
        $('.collapse-content .colla-item').removeClass('active');
        $(it).parents('.colla-item').addClass('active');

        $.ajax({
            url:'../data/eleLibContent.json',
            type:'post',
            data:{
                id: $(it).parent('.colla-item').attr('data-id')
            },
            dataType:'json'
        }).done(function (res) {
            tableData = "";
            window.activeTable = "";
            //$(it).parents('.colla-item').attr('data-id',res.tableId);
            /!*let head = [], html = '';
            for (let i = 0; i < res.cols.length; i++) {
                // html = `<th lay-data="{field:'${res.cols[i].field}',minWidth:100,align:'center'}">${res.cols[i].title}</th>`;
                // $(it).parents('.colla-item').find('.colla-content thead tr').append(html);
                res.cols[i]['align'] = 'center'
                res.cols[i]['minWidth'] = 100
                //head[i]['template'] = ''
            }*!/

            let last = {}, cloneObj = res.data[res.data.length-1];

            for (let key in cloneObj){
                if(cloneObj.hasOwnProperty(key)){
                    if(key=="id") continue
                    last[key] = '+';
                }
            }
            res.data.push(last)
            tableData = res;
            window.activeTable = $table.render({
                elem: $(it).parents('.colla-item').find('table')[0],
                cols:[res.cols],
                data: res.data,
                loading:true,
                id: "table" + res.tableId,
                skin: 'row',
                text:{
                    none: ""
                },
                done:function(){
                    /!*$table.on('edit', function(obj){
                        console.log(obj.tr) //得到当前行元素对象
                        console.log(obj.data) //得到当前行数据
                        //obj.del(); //删除当前行
                        //obj.update(fields) //修改当前行数据
                    })*!/
                }
            })
        })
    })*/
    //头部名称点击
    $('body').on('click','.colla-title',function(e){
        e.stopPropagation();
        let it = this, p = $(it).parents('.colla-item'), gp = $(p).parent();
        if($(p).hasClass('active')){
            $(p).removeClass('active').removeClass('editable')
            $('.colla-icon',it).removeClass('arrow-down').addClass('arrow-right')
            return
        }
        $('.colla-item',gp).removeClass('editable').removeClass('active')
        $(p).toggleClass('active');
        $(it).siblings('span').removeClass('active');
        $('.colla-icon.arrow-down').removeClass('arrow-down').addClass('arrow-right')
        $('.colla-icon',it).addClass('arrow-down')

        $(it).parents('.colla-item').find('.colla-content').html("");
        let dataId = $(it).parents('.colla-item').attr('data-id'),
            selector = $(it).parents('.colla-item').find('.colla-content'),
            url = '../data/eleLibContent.json'

        renderColsDom(dataId,url,selector)
    })


    /*加载折叠项内容--S*/

    //点击右侧编辑
    $('.right-content').on('click','.colla-edit',function(e){
        e.stopPropagation();
        let pEle = $(this).parents('.colla-item');
        let text = $(pEle).find('.input-name').val().trim();
        if($(pEle).hasClass('active')){
            if($(pEle).hasClass('editable')){
                $(pEle).removeClass('editable').find('.title-text').html(text)
                $(this).removeClass('active')
                return;
            }else{
                $(pEle).addClass('editable')
                $(this).addClass('active')
            }
        }else{
            $(this).siblings('.colla-title').click();
            $(this).addClass('active').siblings('.layui-btn').removeClass('active');
            $(pEle).addClass('editable').siblings('.colla-item').removeClass('editable');
        }

        // $(this).parents('.colla-item').removeClass('editable').removeClass('new-created').find('.layui-table-cell .layui-icon-close').remove();

        //let del = '<i class="layui-icon layui-icon-close"></i>';
        //$(this).parents('.colla-item').find('.content-cell').append(del);
        //let str = "edit("+$(ele).find('.layui-border-box').attr('lay-id')+")";
        /*$table.on(str, function(obj){
            console.log(obj.tr) //得到当前行元素对象
            console.log(obj.data) //得到当前行数据
            //obj.del(); //删除当前行
            //obj.update(fields) //修改当前行数据
        })*/
    });
    $(".right-content .collapse-content").on("blur",'.input-name',function(){
        let text = $(this).val().trim();
        let pId = $(this).parents('.collapse-content').attr('data-id'), it = this
        $(this).siblings('.title-text').html(text);
        changeTreeNode("", pId, text,0, it)
    })

    //点击标题的添加项
    $('.collapse-content').on('click','.content-header .more-content',function(e) {
        let it = this
        let pId = $(it).parents('.content-header').attr('data-id');
        selectCondit(pId,it)
    })
    function selectCondit(pId,it){
        $.ajax({
            url:'../data/selectClass.json',
            data:{"pId":pId},
            type:'post',
            dataType:'json',
            success:function(result){
                if(result.status){

                    var getTpl = $('#calssTpl').html()
                    $tpl(getTpl).render(result,function(html){
                        $('.add-select .class-select').html(html)
                    })
                    let obj = {data:[{
                            "id": "",
                            "pId": "",
                            "name": ""
                        }]}
                    var getTpl = $('#collaItems').html()
                    $tpl(getTpl).render(obj,function(html){
                        $('.add-select .selected-render-box').html(html)
                    })
                    $form.render('select');
                }
                $layer.open({
                    type:1,
                    content: $('.add-select'),
                    title:'添加项目',
                    area:["870px","375px"],
                    shadeClose:false,
                    resize:false,
                    move:false,
                    tipsMore:true,
                    offset: '200px',
                    success:function(layero, index){
                        $(layero).attr('data-pId',pId);
                    }
                })
            },error:function(err){
                console.log(err)
            }
        })
    }

    //监听select选择
    $form.on('select(calssIndicators)',function(data){
        console.log(data.elem); //得到select原始DOM对象
        console.log(data.value); //得到被选中的值
        console.log(data.othis); //得到美化后的DOM对象
        $('.selected-render-box').html('');
        let obj = {
            "id":data.value,
            "name":$(data.othis).val()
        }
        $.ajax({
            url:'../data/eleLibColla.json',
            type:'post',
            data:obj,
            dataType:'json'
        }).done(function(rst){
            if(rst.status){
                var getTpl = $('#collaItems').html();
                $tpl(getTpl).render(rst,function(html){
                    $('.add-select .selected-render-box').html(html)
                });
                let ele = $(data.elem).parents('.layui-form').find('.selected-render-box .colla-content')
            }
        }).fail(function(err){
            console.log(err)
        })
    })

    //点击选中列
    $('.collapse-content').on('click','.clloa-add-col',function(e){})

    //点击右侧添加列
    var addNewCols = 1;
    $('.collapse-content').on('click','.clloa-add-col',function(e){
        //e.stopPropagation();
        if(!$(this).parents('.colla-item').hasClass('active')){
            $('.top-tips').addClass('active');
            $(this).siblings('.colla-title').click();
        }else{
            $(this).addClass('active');
            $('.top-tips').addClass('active');
        }
        if($(this).siblings('.colla-edit').hasClass('active')) $(this).siblings('.colla-edit').click();
    })

    $('.top-tips .submit-layer').on('click',function (e) {
        e.preventDefault();
        e.stopPropagation();
        let it = this
        let checked1 = $(it).parents('.layui-form').find('.layui-form-radio>i').eq(0).hasClass('layui-anim-scaleSpring');//是否是自定义
        let checked2 = $(it).parents('.layui-form').find('.layui-form-radio>i').eq(1).hasClass('layui-anim-scaleSpring');//是否是自定义
        $(it).parents('form')[0].reset();
        $(it).parents('.top-tips').removeClass('active');
        if(checked1){
            $layer.open({
                type:1,
                content: $('.addColModel'),
                title:'添加列',
                area:["360px",'auto'],
                shadeClose:false,
                resize:false,
                move:false,
                tipsMore:true,
                offset: '200px',
                cancel:function(index, layero){
                    //$('.addColModel reset-form').click();
                    console.log(layero);
                }
            })
        }else if(checked2){
            selectCondit($(it).parents('.colla-content').data('data-id'),it)
        }

    })
    $('.top-tips .cancel-layer').on('click',function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parents('.top-tips').removeClass('active');
        $('.colla-item.active .clloa-add-col').removeClass('active')
    })


    /*头部+号添加新的*/
    $('.content-tools .add-item').click(function(e){
        e.stopPropagation();
        if($('.collapse-content').children().length == 0) return $layer.msg('请先选择父级项!');
        let item =  $(this).parents('.right-content').find('.colla-item')
        var newItem = {
            data:[{
                "id": "newAdd"+(newCount++),
                "pId": $(item).attr('data-pId'),
                "name": "",
                "lev":$(item).attr('data-lev'),
                "isNewCreated":true
            }]
        }
        let getTpl = $('#collaItems').html();
        $tpl(getTpl).render(newItem,function(html){
            $('.collapse-content').append(html).find('.input-name').focus();
        })

    })


    /*表格重载-S*/
    /*function tableReload(it,newData){
        tableData.cols.push(newData.cols)
        let data = tableData.data;
        for (let i = 0; i < data.length; i++) {
            data[i] = {...data[i],...newData.data}
        }
        tableData.data
        $table.reload("table" + tableData.tableId,{
            elem: $(it).parents('.colla-item').find('table')[0],
            cols:[tableData.cols],
            data: tableData.data,
            loading:true,
            id: "table" + tableData.tableId,
            skin: 'row',
            text:{
                none: ""
            }
        })
    }*/
    /*表格重载-E*/

    /*操作表格删除*/
    $('.collapse-content').on('click','.layui-icon-close',function(e){
        e.stopPropagation();
        let it = this
        if($(it).closest('div').hasClass('content-header')){
            let id = $(it).parents('.content-header').attr('data-id'),
                pId = $(it).parents('.colla-content').attr('data-id'),
                name = $(it).parents('.content-cell').text().trim();
            changeTreeNode(id,pId,name,2)
        }else if($(it).closest('div').hasClass('content-body')){
            let id = $(it).parents('.content-cell').attr('data-id'),
                pId = $(it).parents('.content-body').attr('data-pId'),
                name = $(it).parents('.content-cell').text().trim();
            changeTreeNode(id,pId,name,2)
        }
    })
    /*操作表格增加*/


    //自定义列弹窗追加内容
    var colsCount = 1;
    $('body').on('click','.addColModel .more-content',function(e){
        e.stopPropagation();
        let item = `<input type="text" name="item${colsCount++}" lay-verify="" placeholder="请输入内容" class="layui-input" autocomplete="off">`
        $(this).siblings('.layui-input-inline').append(item);
    })
    //添加自定义列提交
    $form.on('submit(submitCol)',function(data){
        $layer.load()
        var data = {...data.field};
        data['id'] = $('.colla-item.active').attr('data-id')
        data['PId'] = $('.colla-item.active').attr('data-PId')
        let url = "#";
        colSubmit(url,data,"wholeCol")
        return false;
    })

    function colSubmit(url,data,type){
        $.ajax({
            url: url,
            type:'post',
            data:data,
            dataType:'json',
            success:function(res){
                $layer.closeAll('loading')
                if(res.status){
                    $layer.closeAll('page')
                    $layer.msg('保存成功！')
                }
            },
            error:function(err){
                console.log(err)
                $layer.closeAll('loading');
                $layer.msg('服务器错误！')
            }
        })
    }

});

$('.collapse-content').on('click','.del-list-item',function (e) {
    e.stopPropagation();

})

function renderColsDom (id,url,selector){
    $.ajax({
        url: url,
        type:'post',
        data:"id="+id,
        dataType:'json',
    }).done(function (res) {
        if(res.tableId){
            let dom = "", first, second;
            let maxWidth = Math.floor($(it).parents('.colla-item').width() / res.data.length) + 'px'
            for (let i = 0; i < res.data.length; i++) {
                dom += "<div class='content-box' style='max-width:"+ maxWidth +"'>";
                first = "", second = "";
                first += `<div class="content-header"><span class="content-cell" data-id="${res.data[i].id}">${res.data[i].title}</span><span class="layui-icon more-content" title="添加项目"></span></div>`
                second += `<div class="content-body">`;
                if(res.data[i].children.length > 0){
                    for (let j = 0; j < res.data[i].children.length; j++) {
                        second += `<div class="content-cell" data-id="${res.data[i].children[j].id}" data-pid="${res.data[i].id}"><span class="content-text">${res.data[i].children[j].title}</span><i class="layui-icon del-list-item" title="删除此项"></i></div>`
                    }
                }
                first += second + `</div>`;
                dom += first;
                dom += `</div>`
            }
            if(!selector) return `<div class="choose-table">` + dom + `</div>`
            $(selector).html(dom);
        }
    }).fail(function(err){
        console.log(err);
    })

}