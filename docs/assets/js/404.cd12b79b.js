(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["404"],{5899:function(t,i){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,i,e){var n=e("1d80"),r=e("5899"),s="["+r+"]",a=RegExp("^"+s+s+"*"),o=RegExp(s+s+"*$"),u=function(t){return function(i){var e=String(n(i));return 1&t&&(e=e.replace(a,"")),2&t&&(e=e.replace(o,"")),e}};t.exports={start:u(1),end:u(2),trim:u(3)}},"8cdb":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("div",{staticClass:"box"},t._l(3,(function(i){return e("div",{key:i,staticClass:"groups animation-ease",on:{webkitTransitionEnd:function(e){return t.endGame(i)}}},t._l(t.round+1,(function(i){return e("ul",{key:i,staticClass:"group-item"},t._l(t.prizes,(function(i){return e("li",{staticClass:"prize-item"},[t._v(t._s(i))])})),0)})),0)})),0),e("div",{on:{click:t.startClick}},[t._v(t._s(t.disClick?"抽奖中...":"点击开始"))])])},r=[],s=(e("e25e"),e("1157")),a=e.n(s),o={data:function(){return{round:8,prizes:[1,2,3],disClick:!1,itemHeight:0,prize_id:""}},mounted:function(){this.itemHeight=a()(".prize-item").outerHeight(),console.log(a()(".prize-item").outerHeight()),a()(".groups").css("height",this.itemHeight*this.prizes.length*(this.round+1))},methods:{startClick:function(){if(!this.disClick){var t=parseInt(Math.random()*this.prizes.length);this.prizd_id=this.prizes[t],this.runGame(t)}},runGame:function(t){this.disClick=!0,this.resetGame();var i=this.itemHeight,e=this.round*a()(".group-item").height();a()(".groups").each((function(n){var r=this;console.log({e:n});var s=(t+1)*i+e;setTimeout((function(){a()(r).addClass("animation-ease").css("transform","translateY(-"+s+"px)")}),300*n)}))},endGame:function(t){3==t&&(alert("恭喜您中了"+this.prizd_id),this.disClick=!1)},resetGame:function(){a()(".groups").removeClass("animation-ease").css("transform","")}}},u=o,c=(e("c1a2"),e("2877")),l=Object(c["a"])(u,n,r,!1,null,"6bb3a608",null);i["default"]=l.exports},c1a2:function(t,i,e){"use strict";var n=e("d861"),r=e.n(n);r.a},d861:function(t,i,e){},e25e:function(t,i,e){var n=e("23e7"),r=e("e583");n({global:!0,forced:parseInt!=r},{parseInt:r})},e583:function(t,i,e){var n=e("da84"),r=e("58a8").trim,s=e("5899"),a=n.parseInt,o=/^[+-]?0[Xx]/,u=8!==a(s+"08")||22!==a(s+"0x16");t.exports=u?function(t,i){var e=r(String(t));return a(e,i>>>0||(o.test(e)?16:10))}:a}}]);
//# sourceMappingURL=404.cd12b79b.js.map