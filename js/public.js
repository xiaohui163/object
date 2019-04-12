var scroll = function () {
    var stop = $('.collapse-content').scrollTop();
    if (stop >= 200) {
        $('.layui-fixbar-top').show()
    } else {
        $('.layui-fixbar-top').hide()
    }
};
//Top显示控制
var timer;
$('.collapse-content').on('scroll', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
        scroll();
    }, 100);
});
scroll();

$('.layui-fixbar').find('li').on('click', function () {
    var othis = $(this), type = othis.attr('lay-type');
    if (type === 'top') {
        $('.collapse-content').animate({
            scrollTop: 0
        }, 300);
    }
});

$('body').on('click','.reset-form',function(e){
    e.stopPropagation();
    $(this).closest('form')[0].reset();
})


/*加载树形结构--S*/
let zTreeObj;
function renderTree(dom,multi) {
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
            //addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: (multi ? true : false)
        },
        callback:{
            beforeClick: zTreeBeforeClick,
            onClick: zTreeOnClick,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onNodeCreated: zTreeOnNodeCreated,
            onRemove: zTreeOnRemove,
            onRename: zTreeOnRename

        },
        edit:{
            enable: true,
            showRemoveBtn:setRemoveBtn,
            showRenameBtn:setRenameBtn
        }
    };
    zTreeObj = $.fn.zTree.init($(dom), asyncSetting);
}

function filter(treeId, parentNode, responseData){
    if(responseData.status){
        return responseData.data
    }
}
function showTitle (treeId, treeNode) {
    return treeNode.name.length >= 7;
}
function setFontCss(treeId,treeNode){

        return {
            color: "rgba(53,53,57,0.7)"
        }

}
function zTreeBeforeClick (treeId, treeNode, clickFlag){
    if(treeNode.lev == 1) return false
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    if(zTree.getSelectedNodes().length > 0){
        let node = zTree.getSelectedNodes()[0]
        node['selectedFlag'] = false
        zTree.updateNode(node)
        removeHoverDom(treeId, node)
    }
    treeNode.selectedFlag = true
    //return (treeNode.lev != 1) && ()
}
function zTreeOnClick(event, treeId, treeNode) {
    $('.ztree .node_name').removeClass('selected')
    $(event.target).addClass('selected');
    zTreeObj.selectNode(treeNode,false);
    $('.collapse-content .colla-item').removeClass('active');
    var sObj = $("#" + treeNode.tId + "_span");
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        zTree.addNodes(treeNode, {id:('newAdd' + (newCount++)), pId:treeNode.id, name:"new node" + (newCount++)});
        return false;
    });
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
                    $('.collapse-content').html(html).attr('data-id',treeNode.id)
                })
            })
        }
    })
    $('.collapse-content .colla-item[data-id='+treeNode.id+']').addClass('active');
};
function beforeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}
function beforeRename(treeId, treeNode, newName) {
    //let selectedNode = zTreeObj.getSelectedNodes()
    if (newName.length == 0) {
        setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            zTree.cancelEditName();
            alert("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}
var newCount = 0;
/*function addHoverDom(treeId, treeNode) {
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
};*/
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};
function setRemoveBtn(treeId, treeNode) {
    return treeNode.selectedFlag;
}
function setRenameBtn(treeId, treeNode) {
    return treeNode.selectedFlag;
}
function zTreeOnNodeCreated(event, treeId, treeNode) {
    event.stopPropagation();
    if(String(treeNode.id).startsWith('newAdd')){
        alert(treeNode.tId + ", " + treeNode.name + ", "+treeNode.pId);
        changeTreeNode(treeNode.id,treeNode.pId,treeNode.name,0)
    }
};
function zTreeOnRemove(event, treeId, treeNode) {
    event.stopPropagation();
    alert(treeNode.tId + ", " + treeNode.name);
    changeTreeNode(treeNode.id,treeNode.pId,treeNode.name,2)
}
function zTreeOnRename(event, treeId, treeNode, isCancel) {
    event.stopPropagation();
    alert(treeNode.tId + ", " + treeNode.name);
    changeTreeNode(treeNode.id,treeNode.pId,treeNode.name,1)
}
//规则库右侧三角
$('.more-right').click(function(e){
    e.stopPropagation();
    if($(this).hasClass('active')){
        $(this).removeClass('active')
    }else{
        $(this).addClass('active')
    }
});
$('.layui-nav dd').click(function (e) {
    e.stopPropagation();
    $('.rules .more-right').removeClass('active');
    $('.rules').addClass('layui-this')
})
$('.layui-nav-item').click(function(e){
    //e.stopPropagation();
    $('.more-right').removeClass('active');
})
function delConfirm(msg,func) {
    layui.use('layer', function () {
        let $layer = layui.layer
        $layer.confirm(msg,{
            title:false,
            closeBtn:false,
            btn:['确认','取消'],
            skin:'del-confirm',
            area:['192px','112px'],
            btnAlign:'center'
        },function(index){
            func
        },function(index){
            $layer.close(index)
        })
    })
}

var CONSTANT = {
    DATA_TABLES: {
        DEFAULT_OPTION: { //DataTables初始化选项
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "",
                "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页",
                    "sJump": "跳转"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            },
            "ordering": false,
            "dom": "ft<'row-fluid'<'fl'i> <'fl'l><'fr'p>>",
            "lengthMenu": [10, 20, 30],
            autoWidth: false, //禁用自动调整列宽
            stripeClasses: [], //为奇偶行加上样式，兼容不支持CSS伪类的场合
            order: [], //取消默认排序查询,否则复选框一列会出现小箭头
            processing: false, //隐藏加载提示,自行处理
            serverSide: true, //启用服务器端分页
            searching: false, //禁用原生搜索
            bLengthChange: false
        },

        COLUMN: {
            CHECKBOX: { //复选框单元格
                className: "td-checkbox",
                "orderable": false,
                width: "30px",
                data: null,
                render: function(data, type, row, meta) {
                    return '<input type="checkbox" class="iCheck">';
                }
            }
        },
        RENDER: { //常用render可以抽取出来，如日期时间、头像等
            ELLIPSIS: function(data, type, row, meta) {
                data = data || "";
                return '<span title="' + data + '">' + data + '</span>';
            }
        }
    }
};

var userManage = {
    getQueryCondition: function(data) {
        console.log(data);
        var param = {};
        if(data.order && data.order.length && data.order[0]) {
            var sqlName = data.columns[data.order[0].column].data;
            console.log(sqlName);
            param.orderColumn = sqlName;
            param.orderDir = data.order[0].dir;
        }
        //组装分页参数
        param.startIndex = data.start;
        param.pageSize = data.length;
        param.draw = data.draw;
        return param;
    },
    editItemInit:function(item){

    },
    deleteItem:function(item){

    }
};

function tableshow(ele, inputcolumns, tableele, url, deleteDom, userManage, delUrl) {
    var $table = ele;
    tableele = $table.dataTable($.extend(true, {}, CONSTANT.DATA_TABLES.DEFAULT_OPTION, {
        ajax: function(data, callback, settings) {
            //封装请求参数
            var param = userManage.getQueryCondition(data);
            $.ajax({
                type: "GET",
                url: url,
                cache: false, //禁用缓存
                data: param, //传入已封装的参数
                dataType: "json",
                success: function(result) {
                    //异常判断与处理
                    if(result.errorCode) {
                        alert("查询失败");
                        return;
                    }
                    //封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.total; //总记录数
                    returnData.recordsFiltered = result.total; //后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.pageData;
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    callback(returnData);

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    layui.use('layer',function () {
                        layui.layer.msg("查询失败");
                    })
                }
            });
        },
        "destroy": true,
        columns: inputcolumns,

        destroy: true,
        "drawCallback": function(settings) {
            //drawcallback(ele, tableele);
            //清空全选状态
            ele.find(":checkbox[name='cb-check-all']").prop('checked', false);

            if(ele.hasClass("select-table")) {
                selecttablecallback(ele, tableele);
            };

            if(ele.hasClass("select-file")) {
                selectfilecallback(ele, tableele);
            };

            //渲染完毕后的回调
            ele.find("td span").unbind("click");
            ele.find("td span").click(function(event) {
                event.stopPropagation();
                callbacka($(this), tableele);
            })
        }
    })).api();

    ele.on("change", ":checkbox", function() {
        if($(this).is("[name='cb-check-all']")) {
            $(":checkbox", ele).prop("checked", $(this).prop("checked"));
            ele.find("tr").removeClass("active");
            ele.find("tbody input").change();

        } else {
            //一般复选
            var checkbox = $("tbody :checkbox", ele);
            $(":checkbox[name='cb-check-all']", ele).prop('checked', checkbox.length == checkbox.filter(':checked').length);
            ele.find("tr").removeClass("active");
        }
    });

    if(deleteDom != "undefined") {
        deleteDom.unbind("click")
        deleteDom.click(function() {

            var arrItemId = [];
            ele.find("tbody :checkbox:checked").each(function(i) {
                var item = tableele.row($(this).closest('tr')).data();

                if(!!item.oid) {
                    arrItemId.push(item.oid);
                } else {
                    arrItemId.push(item.id);
                }
            });
            console.log(arrItemId);

            if(arrItemId && arrItemId.length) {
                layer.confirm('确定要删除吗?', {
                    btn: ['确定', '取消']
                }, function(index) {
                    $.ajax({
                        url: delUrl,
                        type: "post",
                        traditional: true,
                        data: {
                            arr: JSON.stringify(arrItemId)
                        },
                        dataType: "json",
                        success: function(data) {
                            if(data != "haschild") {
                                layer.msg("删除成功!");
                                tableele.ajax.reload();
                                layer.close(index);
                            }
                            //delFun(data);
                        }
                    })
                });
            } else {
                layer.msg('请先选中要操作的行');
            }
        });
    }

    // 搜索按钮触发效果
    ele.find(".tablesearch").click(function() {
        tableele.draw();
    });

    ele.find(".upsearch").unbind("keyup");
    ele.find(".upsearch").keyup(function(){
        $(this).closest("tr").find(".tablesearch").trigger("click");
    })

    $table.on("click", ".btn-edit", function() {
        //编辑按钮
        var item = tableele.row($(this).closest('tr')).data();
        userManage.editItemInit(item);
    }).on("click", ".btn-del", function() {
        //删除按钮
        var item = tableele.row($(this).closest('tr')).data();
        userManage.deleteItem(item);
    });
}


function scrollTable(height) {
    return {
        DATA_TABLES: {
            DEFAULT_OPTION: { //DataTables初始化选项
                language: {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "",
                    "sInfoPostFix": "",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                },
                "scrollCollapse": true,
                "scrollY": height,
                "ordering": true,
                "dom": "ft<'row-fluid'<'fl'i> <'fl'l><'fr'p>>",
                autoWidth: false, //禁用自动调整列宽
                processing: false, //隐藏加载提示,自行处理
                serverSide: false, //启用服务器端分页
                searching: false, //禁用原生搜索
                bLengthChange: false
            },

            COLUMN: {
                CHECKBOX: { //复选框单元格
                    className: "td-checkbox",
                    "orderable": false,
                    width: "30px",
                    data: null,
                    render: function(data, type, row, meta) {
                        return '<input type="checkbox" class="iCheck">';
                    }
                }
            },
            RENDER: { //常用render可以抽取出来，如日期时间、头像等
                ELLIPSIS: function(data, type, row, meta) {
                    data = data || "";
                    return '<span title="' + data + '">' + data + '</span>';
                }
            }
        }
    };
}


layui.use('form',function () {
    var $form = layui.form
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
        },
        noEmpty: function (vale,item) {
            if($('.from',item) == 0){
                return '指向要素指标不能少于一个'
            }
        }
    });
})
