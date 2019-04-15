$(function(){
    $.ajax({
        url:"../data/loginInfo.json",
        type:'post',
        data:"",
        dataType:'json',
        success:function (res) {
            if(res.status){
                if($('.layui-header .user-login-state').length == 0){
                    let dom = `<div class="user-login-state">`+
                        `<span class="user-pic"><img src="${res.data.imgUrl}" alt="用户头像"></span>`+
                        `<p class="user-name">您好，<span data-id="${res.data.userID}">${res.data.userName}</span></p>`+
                        `<em class="layui-btn user-pannel-down"></em>`+
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
                    $('.layui-header .user-name span').attr('data-id',res.data.userID).html(res.data.userName)
                }
            }
        },
        error:function(err){
            console.log(err)
        }
    })
})

$('.layui-header').on('click','.user-pannel-down',function(e){
    e.stopPropagation();
    let it = this
    $(it).toggleClass('active')
})
$(document).click(function(e){
    if($(e.target).closest('.person_menu').length == 0){
        $('.user-login-state .user-pannel-down').removeClass('active')
    }
})
