/**
 * [designSize]  设计稿尺寸 750px
 * 
 * [scaleSize]   换算比例 1rem = 100
 *  这里填100
 * 
 * 实际fontsize / 理论 fontsize = 实际屏幕width / 理论屏幕width
 * 实际fontsize = 实际屏幕width / 理论屏幕width *理论 fontsize 
 *  */
export function viewAdaptive(designSize=750,scaleSize=100) {
    var docView = document.documentElement || document.getElementbyTagName('html')[0];
    var docViewFn = function () {
        var docViewWidth = docView.getBoundingClientRect().width;
        let setFs = docViewWidth /designSize *scaleSize;
        docView.style.fontSize = setFs + "px";
        let realFs = parseInt(window.getComputedStyle(docView).fontSize);
        if(Math.abs(realFs - setFs)>= 1){
            //计算基准比例
            setFs = setFs *setFs / realFs;
            docView.setAttribute('style','font-size:'+setFs+'px!important;');
        }
    };
    window.addEventListener('resize',function(){
        setTimeout(docViewFn,300);
    });
    docViewFn();
}