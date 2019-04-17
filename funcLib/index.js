layui.use(['element','form','table','laytpl','layer'], function () {
    var $ele = layui.element, $form = layui.form, $table = layui.table, $tpl = layui.laytpl, $layer = layui.layer;

    /*加载树形结构--E*/
    let asyncSetting = {
        async: {
            key:{
                title: "name"
            },
            autoParam:["id","name","lev"],
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
        callback:{
            beforeClick: function (event, treeId, treeNode) {
                if(treeNode.lev == 1)return false
            },
            onClick: function (event, treeId, treeNode) {
                $('.ztree .node_name').removeClass('selected');
                $(event.target).addClass('selected');
                zTreeObj.selectNode(treeNode,false);
                $('.collapse-content .colla-item').removeClass('active');

                let data = {
                    data:[treeNode]
                }
                if(treeNode.lev !== 1){
                    var getTpl = $('#describeContent').html();
                    $tpl(getTpl).render(data, function(html){
                        $('.describe-left').html(html)
                    })
                }

            }
        }
    };
    zTreeObj = $.fn.zTree.init($("#treeDemo"), asyncSetting);

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

    // 获取函数描述
    function serchText(){
        let name = $(".search").val();
        $.ajax({
            url:'../data/selectClass.json',
            data:{ name: name },
            type:'post',
            dataType:'json',
            success:function(result){
                var getTpl = $('#describeContent').html();
                $tpl(getTpl).render(result,function(html){
                    $('.describe-left').html(html)
                })
            },error:function(err){
                console.log(err)
            }
        })
    }
    $("#searchCon").click(function () {
        serchText();
    });
    $('.search').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            //回车执行查询
            serchText()
        }
    });

    // 获取常用函数数据
    function functionGain(pId){
        $.ajax({
            url:'../data/selectClass.json',
            data:{"pId":pId},
            type:'post',
            dataType:'json',
            success:function(result){
                if(result.status){

                    var getTpl = $('#commonFunction').html()
                    $tpl(getTpl).render(result,function(html){
                        $('.common-func').html(html)
                    })
                }
            },error:function(err){
                console.log(err)
            }
        })
    }

});