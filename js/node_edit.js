var PUnits = {};
PUnits.getGUID = function () {

    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }

    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};


$(function () {
    let dataObj = {
        "BlockX": 306,
        "BlockY": 112,
        "BlockTitle": "流程图表题二",
        "BlockItems": [
            {
                "id": "49578360-b079-a244-57ff-78aaacaa2205item1",
                "name": "属性一"
            },
            {
                "id": "49578360-b079-a244-57ff-78aaacaa2205item2",
                "name": "属性二"
            }
        ]
    }
    var jsplumb = new PJP.JsPlumb();

    //***********************************元素拖动控制部分************************************

    $('#dragTree').click(function(e){
        //拖动后的渲染...
        console.log('拖动树形结构节点了')
        jsplumb.createChart(dataObj);
    })

});
