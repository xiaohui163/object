
$(function(){

    var jsplumb = new PJP.JsPlumb();

    let asyncSetting = {
        async: {
            key:{
                title: "name"
            },
            autoParam:["id","name"],
            dataFilter: filter,
            enable: true,
            url: "../data/eleLibTree.json",
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
            selectedMulti: true
        },
        edit:{
            drag: {
                isCopy:true,
                isMove:true
            },
            enable:true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        callback:{
            beforeClick: zTreeBeforeClick,
            onClick: function (event, treeId, treeNode) {
                $(event.target).toggleClass('selected');
            },
            beforeDrag:zTreeBeforeDrag,
            onDrag:zTreeOnDrag,
            beforeDrop: zTreeBeforeDrop,
            onDrop:zTreeOnDrop
        }
    };
    zTreeObj = $.fn.zTree.init($("#treeDemo"), asyncSetting);

    layui.use(['form','laytpl'],function(){
        var $form = layui.form, $tpl = layui.laytpl;

        $.ajax({
            url:'../data/selectClass.json',
            type:'post',
            data:"",
            dataType:"json",
            success:function(res){
                if(res.status){
                    var getTpl = $('#searchCalssTpl').html()
                    $tpl(getTpl).render(res, function(html){
                        $('.selector').html(html);
                        $form.render('select','searchFuncClass')
                    });
                }
            }
        })
        //搜索框提交
        $form.on('submit(searchFunAct)',function(data){
            $form.render()
            let param = {...data.field},//param传入的参数有class(下拉菜单的选项值，默认zh 综合)，text（搜索框填的值,必填）
                url ='../data/formulaData.json';
            functionList(url,param);
            return false
        })
    })

    /*$('.search').keyup(function(e){
        if(e.key == 13){

        }
    })*/
    //函数栏渲染
    function functionList(url,param){
        $.ajax({
            //url:'../data/formulaData.json',
            url:url,
            type:'post',
            data:param,
            dataType:'json',
            success:function(res){
                layui.use('laytpl',function(){
                    var laytpl = layui.laytpl
                    var getTpl = $('#searchListTpl').html()
                    laytpl(getTpl).render(res, function(html){
                        $('.search-list').html(html);
                    });
                })
            }
        })
    }

    function zTreeBeforeDrag(treeId, treeNodes){
        if(treeNodes[0].lev == 1){
            return false
        }else{
            return true
        }
    }
    function zTreeOnDrag(event,treeId,treeNodes) {

    }
    function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
        console.log(event)
        if($(event.target).closest('#treeDemo').hasClass('ztree')){
            return false
        }
    }
    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType){
        if($(event.target).is($('#chart-container'))){

            $.ajax({
                url:'../data/get_edit_node.json',
                type:'post',
                data:'id='+treeNodes.id,
                dataType:'json',
                success:function(res){
                    if(res.status){
                        if($('.chart-design #'+res.data.BlockId).length > 0){
                            return layui.layer.msg('该项已存在!')
                        }
                        res.data['BlockX'] = event.offsetX;
                        res.data['BlockY'] = event.offsetY;
                        //插件jsplub实例化

                        jsplumb.createChart(res.data);
                    }
                }
            })
            console.log("x:"+event.clientX,"Y:"+event.clientY)
        }else{
            return false
        }
    }

})
