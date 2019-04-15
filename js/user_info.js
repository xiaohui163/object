$(function(){
    $.ajax({
        url:"#",
        type:'post',
        data:"",
        dataType:'josn',
        success:function (res) {
            if(res.status){
                if($('.layui-header .user-login-state').length == 0){
                    let dom = `<div class="user-login-state">`+
                        `<span class="user-pic"><img src="${res.data.imgUrl}" alt="用户头像"></span>`+
                        `<p class="user-name">您好，<span data-id="${res.data.id}">${res.data.userName}</span></p>`+
                        `<em></em>`+
                        `<div class="person_menu">`+
                        `<span class="arrow"></span>`+
                        `<ul class="person_menu_ul">`+
                        `<li><a href="#">修改密码</a></li>`+
                        `<li><a href="#">切换帐户</a></li>`+
                        `<li><a href="#">退出</a></li>`+
                        `</ul></div></div>`
                    $('.layui-header').append(dom)
                } else {
                    $('.layui-header .user-pic img').prop('src',res.data.imgUrl)
                    $('.layui-header .user-name span').attr('data-id',res.data.id).html(res.data.userName)
                }
            }
        }
    })
})
