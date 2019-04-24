layui.use(['element','form','table','laytpl','layer'], function () {
    var $ele = layui.element, $form = layui.form, $table = layui.table, $tpl = layui.laytpl, $layer = layui.layer;

    /*加载树形结构--E*/
    let treeUrl = '../data/eleLibTree.json';

    renderTree('#treeDemo',treeUrl);
    let asyncSetting = {
        async: {
            key:{
                title: "name"
            },
            autoParam:["id","name","lev"],
            dataFilter: filter,
            enable: true,
            url: treeUrl,
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
        callback:{
            beforeClick: zTreeBeforeClick,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onRemove: zTreeOnRemove,
            onRename: zTreeOnRename
        },
        edit:{
            enable: true,
            showRemoveBtn:setRemoveBtn,
            showRenameBtn:setRenameBtn
        }
    };
    zTreeObj = $.fn.zTree.init($("#treeDemo"), asyncSetting);

    var textNav;
    function zTreeBeforeClick (treeId, treeNode, clickFlag){
        $('.ztree .node_name').removeClass('selected');
        $(event.target).addClass('selected');
        zTreeObj.selectNode(treeNode,false);
        $('.collapse-content .colla-item').removeClass('active');
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        textNav = treeNode;
        if(zTree.getSelectedNodes().length > 0){
            let node = zTree.getSelectedNodes()[0];
            node['selectedFlag'] = false;
            zTree.updateNode(node);
            removeHoverDom(treeId, node)
        }
        treeNode.selectedFlag = true
    }

    $(".itembox").click(function () {
        if($(this).hasClass('application')){
            if(textNav){
                $(".distionary .title").text(textNav.name);
                $(".distionary .distionary-left").click(function () {
                    window.location.href = '#'
                })
            }else{
                $layer.open({
                    title:'提示',
                    content:'未选中节点',
                    closeBtn:false,
                    skin:'del-confirm',
                    btnAlign:'c'
                })
            }

        }else if($(this).hasClass('copy')){
            if(textNav){
                $layer.open({
                    type:1,
                    content: $('.copyContent'),
                    title:'复制',
                    area:["360px",'auto'],
                    shadeClose:false,
                    resize:false,
                    move:false,
                    tipsMore:true,
                    offset: '300px',
                })
            }else{
                $layer.open({
                    title:'提示',
                    content:'未选中节点',
                    closeBtn:false,
                    skin:'del-confirm',
                    btnAlign:'c'
                })
            }

        }else{

        }
    });

    //添加自定义列提交
    $form.on('submit(submitCol)',function(data){
        $layer.load();
        var data = {...data.field};
        data['id'] = textNav.id;
        data['PId'] = textNav.pid;

        let url = "#";
        colSubmit(url,data,"wholeCol");
        return false;
    });

    function colSubmit(url,data,type){
        $.ajax({
            url: url,
            type:'post',
            data:data,
            dataType:'json',
            success:function(res){
                $layer.closeAll('loading');
                if(res.status){
                    $layer.closeAll('page');
                    $layer.msg('保存成功！')
                }
            },
            error:function(err){
                console.log(err);
                $layer.closeAll('loading');
                $layer.msg('服务器错误！')
            }
        })
    }

});
