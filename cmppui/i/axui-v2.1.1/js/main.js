/*
 *Last modified: 2022-07-16 10:25:30
 *Url: https://www.axui.cn
*/
let admin = document.querySelector('.ax-demo-admin'),
    close = admin.querySelector('.ax-close-nav'),
    header = admin.querySelector('.ax-nav-header'),
    overlay = admin.querySelector('.ax-nav-overlay'),
    nav = admin.querySelector("nav"),
    closeArr = nav.querySelectorAll('.ax-close-nav,.ax-mask'),
    mobileHide = true;
//节点数组是伪数组，先转成普通数组，在push
closeArr = [...closeArr];
closeArr.push(admin.querySelector('.ax-nav-overlay'))
    //初始化
if (['phone', 'pad'].includes(axClient())) {
    nav.classList.add("ax-nav-fold");
} else {
    if (axCookie.get("closeNav") === 'fold') {
        nav.classList.add("ax-nav-fold");
    } else {
        nav.classList.remove("ax-nav-fold");
    }
}

//点击展开和关闭菜单并设置cookie
closeArr.forEach(function(item) {

    item.onclick = function() {

        if (nav.classList.contains("ax-nav-fold")) {
            nav.classList.remove("ax-nav-fold");
            if (!['phone', 'pad'].includes(axClient())) {
                axCookie.set('closeNav', '');
            }
        } else {
            nav.classList.add("ax-nav-fold");
            if (!['phone', 'pad'].includes(axClient())) {
                axCookie.set('closeNav', 'fold');
            }
        }

        //遮罩显示和隐藏
        if (overlay.classList.contains('ax-hide')) {
            overlay.classList.remove('ax-hide');
            overlay.classList.add('ax-correction', 'ax-show');
            if (['phone', 'pad'].includes(axClient())) {
                header.style.overflow = 'hidden';
            }
        } else {
            overlay.classList.remove('ax-show');
        }


    }
});

//监控遮罩状态
function overlayHide() {
    if (!overlay.classList.contains('ax-show') && !overlay.classList.contains('ax-hide')) {
        overlay.classList.remove('ax-correction');
        overlay.classList.add('ax-hide');
    }
}
overlay.addEventListener("transitionend", overlayHide);
//解决菜单回缩存在的BUG
if (['phone', 'pad'].includes(axClient())) {
    function navHide() {
        if (nav.classList.contains('ax-nav-fold')) {
            header.style.overflow = 'visible';
        }
    }
    nav.addEventListener("transitionend", navHide);
}
//使用右侧标题导航
let article = document.querySelector('#article');
let blockNav = document.querySelector('#blockNav');
scrollnav.init(article, {
    insertTarget: blockNav,
});