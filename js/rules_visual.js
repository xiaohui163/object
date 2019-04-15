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
        callback:{
            beforeClick: function (event, treeId, treeNode) {
                if(treeNode.lev == 1)return false
            },
            onClick: function (event, treeId, treeNode) {
                $(event.target).toggleClass('selected');
            }
        }
    };
    zTreeObj = $.fn.zTree.init($("#treeDemo"), asyncSetting);
})
