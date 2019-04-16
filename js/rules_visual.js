$(function(){
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
    $.ajax({
        url:'../data/formulaData.json',
        type:'post',
        data:'',
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


})

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
    console.log(targetNode)
}
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType){
    console.log(targetNode)
    if(!targetNode){
        //console.log("x:"+event.clientX,"Y:"+event.clientY)
        console.log(event)
        if($(event.target).is($('.')))
    }
}
