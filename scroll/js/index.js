(function () {
    let container = document.querySelector('body');
    let yOffset = 0; //window.pageYOffset 변수(현재 스크롤값)
    let prevScrollHeight = 0; //현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 높이값의 합
    let currentScene = 0; //현재 활성화된 씬(section)
    let enterNewScene = false;//새로운 섹션이 시작되는 순간 true
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;
    /* sceneInfo[3] */
    const bagItem = document.querySelector('.product__cont--item:first-child');
    let move = container.offsetWidth - (bagItem.offsetHeight * 10);

    bagItem.style.transform = `translateX(${move}px)`;
    /* //sceneInfo[3] */
    
    const sceneInfo = [
        { // 0
            type:'sticky',
            heightNum:7, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--0'),
                msgT:document.querySelector('.top__msg--tit'),
                msgBox:document.querySelector('.top__msg--slide'),
                msgA:document.querySelector('.top__msg--slide li:nth-child(1)'),
                msgB:document.querySelector('.top__msg--slide li:nth-child(2)'),
                msgC:document.querySelector('.top__msg--slide li:nth-child(3)'),
                canvas: document.querySelector('#top__canvas--tape'),
                context: document.querySelector('#top__canvas--tape').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 335, // 이미지가 335장
                imageSequence: [0, 334, { start: 0, end: 0.8 }], // 이미지 인덱스 
                canvas_opacity: [1, 0, { start: 0.92, end: 0.99 }],
                msgT_opacity: [1, 0, { start: 0.1, end: 0.16 }],
                msgA_opacity: [0, 1, { start: 0.16, end: 0.23 }],
                msgB_opacity: [0, 1, { start: 0.38, end: 0.45 }],
                msgC_opacity: [0, 1, { start: 0.60, end: 0.67 }],
                msgA_trans: [30, 0, { start: 0.16, end: 0.23 }],
                msgB_trans: [30, 0, { start: 0.38, end: 0.45 }],
                msgC_trans: [30, 0, { start: 0.60, end: 0.67 }],
                msgBox_trans_1: [280, 140, { start: 0.28, end: 0.33 }],
                msgBox_trans_2: [140, 0, { start: 0.50, end: 0.55 }],
                msgBox_trans_3: [0, 120, { start: 0.72, end: 0.77 }],
                msgBox_opacity: [1, 0, { start: 0.8, end: 0.9 }],
            }
        },
        { // 1
            type:'sticky',
            heightNum:5, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--1'),
                content:document.querySelector('.history__cont'),
                txtAll:document.querySelectorAll('.history__cont--txt li'),
                txt1:document.querySelector('.history__cont--txt li:nth-child(1)'),
                txt2:document.querySelector('.history__cont--txt li:nth-child(2)'),
                txt3:document.querySelector('.history__cont--txt li:nth-child(3)'),
                txt4:document.querySelector('.history__cont--txt li:nth-child(4)'),
                txt5:document.querySelector('.history__cont--txt li:nth-child(5)'),
                txt6:document.querySelector('.history__cont--txt li:nth-child(6)'),
            },
            values: {
                cont_opacity_in: [0, 1, { start: 0, end: 0.15 }],
                cont_opacity_out: [1, 0, { start: 0.85, end: 0.97 }],
            }
        },
        { // 2
            type:'sticky',
            heightNum:10, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--2'),
                content:document.querySelector('.process__cont'),
                // listAll:document.querySelectorAll('.process__cont--list'),
                list1:document.querySelector('.process__cont--tit li:nth-child(1)'),
                list2:document.querySelector('.process__cont--tit li:nth-child(2)'),
                list3:document.querySelector('.process__cont--tit li:nth-child(3)'),
                list4:document.querySelector('.process__cont--tit li:nth-child(4)'),
                list5:document.querySelector('.process__cont--tit li:nth-child(5)'),
                list6:document.querySelector('.process__cont--tit li:nth-child(6)'),
                list7:document.querySelector('.process__cont--tit li:nth-child(7)'),
            },
            values: {
                cont_opacity: [1, 0, { start: 0.9, end: 0.99 }],

                list1_trans_out: [0, -70, { start: 0.1, end: 0.15 }],
                list1_opacity_out: [1, 0, { start: 0.17, end: 0.2 }],

                list2_trans_in: [70, 0, { start: 0.2, end: 0.2625 }],
                list2_opacity_in: [-0.1, 1, { start: 0.2, end: 0.2225 }],
                list2_trans_out: [0, -70, { start: 0.2625, end: 0.325 }],
                list2_opacity_out: [1, 0, { start: 0.295, end: 0.325 }],

                list3_trans_in: [70, 0, { start: 0.325, end: 0.3875 }],
                list3_opacity_in: [-0.1, 1, { start: 0.325, end: 0.3425 }],
                list3_trans_out: [0, -70, { start: 0.3875, end: 0.45 }],
                list3_opacity_out: [1, 0, { start: 0.42, end: 0.45 }],

                list4_trans_in: [70, 0, { start: 0.45, end: 0.5125 }],
                list4_opacity_in: [-0.1, 1, { start: 0.45, end: 0.4725 }],
                list4_trans_out: [0, -70, { start: 0.5125, end: 0.575 }],
                list4_opacity_out: [1, 0, { start: 0.545, end: 0.575 }],

                list5_trans_in: [70, 0, { start: 0.575, end: 0.6375 }],
                list5_opacity_in: [-0.1, 1, { start: 0.575, end: 0.5975 }],
                list5_trans_out: [0, -70, { start: 0.6375, end: 0.7 }],
                list5_opacity_out: [1, 0, { start: 0.67, end: 0.7 }],

                list6_trans_in: [70, 0, { start: 0.7, end: 0.7625 }],
                list6_opacity_in: [-0.1, 1, { start: 0.7, end: 0.7225 }],
                list6_trans_out: [0, -70, { start: 0.7625, end: 0.825 }],
                list6_opacity_out: [1, 0, { start: 0.795, end: 0.825 }],

                list7_trans_in: [70, 0, { start: 0.825, end: 0.8875 }],
                list7_opacity_in: [-0.1, 1, { start: 0.825, end: 0.8475 }],
            }
        },
        { // 3
            type:'sticky',
            heightNum:5, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--3'),
                trio1:document.querySelector('.product__title--trio li:nth-child(1)'),
                trio2:document.querySelector('.product__title--trio li:nth-child(2)'),
                trio3:document.querySelector('.product__title--trio li:nth-child(3)'),
                bag1:document.querySelector('.product__cont--item:first-child'),
                bag2:document.querySelector('.product__cont--item:last-child'),
            },
            values: {
                trio1_trans_in: [30, 0, { start: 0.05, end: 0.15 }],
                trio1_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
                trio1_trans_out: [0, -30, { start: 0.25, end: 0.35 }],
                trio1_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],

                trio2_trans_in: [30, 0, { start: 0.35, end: 0.45 }],
                trio2_opacity_in: [0, 1, { start: 0.35, end: 0.4 }],
                trio2_trans_out: [0, -30, { start: 0.55, end: 0.65 }],
                trio2_opacity_out: [1, 0, { start: 0.6, end: 0.65 }],

                trio3_trans_in: [30, 0, { start: 0.65, end: 0.75 }],
                trio3_opacity_in: [0, 1, { start: 0.65, end: 0.6 }],

                bag1_trans: [move, 0, { start: 0.35, end: 0.9 }],
                bag2_trans: [0, move, { start: 0.35, end: 0.9 }],

                bag_opacity: [0, 1, { start: 0, end: 0.2 }],
            }
        },
        { // 4
            type:'normal',
            heightNum:4, //브라우저 높이의 배수 (heightNum x scrollHeight = 높이값)
            scrollHeight:0,
            objs: {
                container:document.querySelector('#sec--4')
            },
        },
    ];

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./images/top/top-${i}.jpg`;

            sceneInfo[0].objs.videoImages.push(imgElem);
        }
    }

    function setLayout() { // 각 스크롤 섹션의 높이 세팅
        for(var i = 0; i < sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                sceneInfo[i].objs.container.style.height = sceneInfo[i].scrollHeight + "px";
            } 
            else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
                sceneInfo[i].objs.container.style.height = "auto";
            }
            
        }

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i= 0 ; i < sceneInfo.length; i++){ //새로고침시 현재 스크롤 위치찾기
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        container.setAttribute('id', "scene-" + currentScene);

        let widthRatio = window.innerWidth / 1280;
        let heightRatio = window.innerHeight / 720;
        if(widthRatio <= 1){
            widthRatio = 1;
        } else{
            widthRatio = window.innerWidth / 1280;
        }

        if(heightRatio <= 1){
            heightRatio = 1;
        } else{
            heightRatio = window.innerHeight / 720;
        }
        
        if(window.innerWidth <= 1280){
            sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${widthRatio})`;
        }
    }

    function calcValues(values, currentYOffset){ // 현재 섹션에서의 스크롤 위치
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; //현재 섹션에서 스크롤 된 범위를 비율로 구하기

        if(values.length === 3){ // start ~ end 사이에 애니메인션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]; // (이전 섹션 스크롤값 - 현재섹션 스크롤 시작값) / 현재섹션 총 스크롤 값 * 현재 섹션의 현재 스크롤 위치(비율)
            } else if(currentYOffset < partScrollStart){
                rv = values[0];
            } else if(currentYOffset > partScrollEnd){
                rv = values[1];
            }
        } else{
            rv = scrollRatio * (values[1] - values[0] + values[0]);//현재 섹션의 스크롤 위치(비율)
        }
        return rv;
    }

    function playAnimation() {
        var objs = sceneInfo[currentScene].objs; //현재 섹션의 objs
        var values = sceneInfo[currentScene].values; //현재 섹션의 values
        var currentYOffset = yOffset - prevScrollHeight; //현재 스크롤값 - 이전 섹션 스크롤값
        var scrollHeight = sceneInfo[currentScene].scrollHeight;
        var scrollRatio = currentYOffset / scrollHeight; // currentYOffset /현제 섹션의 scrollHeight
        
        switch(currentScene){ //현재 섹션에게만 이벤트
            case 0:
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                objs.msgT.style.opacity = calcValues(values.msgT_opacity, currentYOffset);

                objs.msgA.style.opacity = calcValues(values.msgA_opacity, currentYOffset);
                objs.msgA.style.transform = `translateY(${calcValues(values.msgA_trans, currentYOffset)}px)`;
                
                objs.msgBox.style.transform = `translate(${calcValues(values.msgBox_trans_1, currentYOffset)}px, -50%)`;

                objs.msgB.style.opacity = calcValues(values.msgB_opacity, currentYOffset);
                objs.msgB.style.transform = `translateY(${calcValues(values.msgB_trans, currentYOffset)}px)`;

                objs.msgC.style.opacity = calcValues(values.msgC_opacity, currentYOffset);
                objs.msgC.style.transform = `translateY(${calcValues(values.msgC_trans, currentYOffset)}px)`;

                if(scrollRatio >= 0.5){
                    objs.msgBox.style.transform = `translate(${calcValues(values.msgBox_trans_2, currentYOffset)}px, -50%)`;
                }

                if(scrollRatio >= 0.7){   
                    objs.msgBox.style.transform = `translate(0px, calc(-50% + ${calcValues(values.msgBox_trans_3, currentYOffset)}%))`;
                    objs.msgBox.style.opacity = calcValues(values.msgBox_opacity, currentYOffset);
                }

                break;

            case 1:
                for(i=0; i < objs.txtAll.length; i++){
                    if(scrollRatio <= 0.15){
                        objs.txtAll[i].style.opacity = 0.2;
                        objs.txt1.style.opacity = 1;
                    } else if(scrollRatio <= 0.275){
                        objs.txtAll[i].style.opacity = 0.2;
                        objs.txt2.style.opacity = 1;
                    } else if(scrollRatio <= 0.4){
                        objs.txtAll[i].style.opacity = 0.2;
                        objs.txt3.style.opacity = 1;
                    } else if(scrollRatio <= 0.525){
                        objs.txtAll[i].style.opacity = 0.2;
                        objs.txt4.style.opacity = 1;
                    } else if(scrollRatio <= 0.65){
                        objs.txtAll[i].style.opacity = 0.2;
                        objs.txt5.style.opacity = 1;
                    } else if(scrollRatio <= 0.775){
                        objs.txtAll[i].style.opacity = 0.2;
                        objs.txt6.style.opacity = 1;
                    }
                }
                
                if(scrollRatio >= 0){
                    objs.content.style.opacity = calcValues(values.cont_opacity_in, currentYOffset);
                }

                if(scrollRatio >= 0.8){
                    objs.content.style.opacity = calcValues(values.cont_opacity_out, currentYOffset);
                }

                break;

            case 2:
                objs.content.style.opacity = calcValues(values.cont_opacity, currentYOffset);

                if(scrollRatio >= 0.01){ // #1 out
                    objs.content.setAttribute('id', 'one');
                    objs.list1.style.transform = `translateY(${calcValues(values.list1_trans_out, currentYOffset)}px)`;
                    objs.list1.style.opacity = calcValues(values.list1_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.19){ // #2 in
                    objs.content.setAttribute('id', 'two');
                    objs.list2.style.transform = `translateY(${calcValues(values.list2_trans_in, currentYOffset)}px)`;
                    objs.list2.style.opacity = calcValues(values.list2_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.2625){ // #2 out
                    objs.list2.style.transform = `translateY(${calcValues(values.list2_trans_out, currentYOffset)}px)`;
                    objs.list2.style.opacity = calcValues(values.list2_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.315){ // #3 in
                    objs.content.setAttribute('id', 'three');
                    objs.list3.style.transform = `translateY(${calcValues(values.list3_trans_in, currentYOffset)}px)`;
                    objs.list3.style.opacity = calcValues(values.list3_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.3875){ // #3 out
                    objs.list3.style.transform = `translateY(${calcValues(values.list3_trans_out, currentYOffset)}px)`;
                    objs.list3.style.opacity = calcValues(values.list3_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.44){ // #4 in
                    objs.content.setAttribute('id', 'four');
                    objs.list4.style.transform = `translateY(${calcValues(values.list4_trans_in, currentYOffset)}px)`;
                    objs.list4.style.opacity = calcValues(values.list4_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.5125){ // #4 out
                    objs.list4.style.transform = `translateY(${calcValues(values.list4_trans_out, currentYOffset)}px)`;
                    objs.list4.style.opacity = calcValues(values.list4_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.565){ // #5 in
                    objs.content.setAttribute('id', 'five');
                    objs.list5.style.transform = `translateY(${calcValues(values.list5_trans_in, currentYOffset)}px)`;
                    objs.list5.style.opacity = calcValues(values.list5_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.6375){ // #5 out
                    objs.list5.style.transform = `translateY(${calcValues(values.list5_trans_out, currentYOffset)}px)`;
                    objs.list5.style.opacity = calcValues(values.list5_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.69){ // #6 in
                    objs.content.setAttribute('id', 'six');
                    objs.list6.style.transform = `translateY(${calcValues(values.list6_trans_in, currentYOffset)}px)`;
                    objs.list6.style.opacity = calcValues(values.list6_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.7625){ // #6 out
                    objs.list6.style.transform = `translateY(${calcValues(values.list6_trans_out, currentYOffset)}px)`;
                    objs.list6.style.opacity = calcValues(values.list6_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.815){ // #7 in
                    objs.content.setAttribute('id', 'seven');
                    objs.list7.style.transform = `translateY(${calcValues(values.list7_trans_in, currentYOffset)}px)`;
                    objs.list7.style.opacity = calcValues(values.list7_opacity_in, currentYOffset);
                }

                break;

            case 3:
                objs.bag1.style.opacity = calcValues(values.bag_opacity, currentYOffset);
                objs.bag2.style.opacity = calcValues(values.bag_opacity, currentYOffset);
                objs.bag1.style.transform = `translateX(${calcValues(values.bag1_trans, currentYOffset)}px)`;
                objs.bag2.style.transform = `translateX(${calcValues(values.bag2_trans, currentYOffset)}px)`;
                
                if(scrollRatio >= 0){ // #1 in
                    objs.trio1.style.transform = `translateY(${calcValues(values.trio1_trans_in, currentYOffset)}px)`;
                    objs.trio1.style.opacity = calcValues(values.trio1_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.2){ // #1 out
                    objs.trio1.style.transform = `translateY(${calcValues(values.trio1_trans_out, currentYOffset)}px)`;
                    objs.trio1.style.opacity = calcValues(values.trio1_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.3){ // #2 in
                    objs.trio2.style.transform = `translateY(${calcValues(values.trio2_trans_in, currentYOffset)}px)`;
                    objs.trio2.style.opacity = calcValues(values.trio2_opacity_in, currentYOffset);
                }
                
                if(scrollRatio >= 0.5){ // #2 out
                    objs.trio2.style.transform = `translateY(${calcValues(values.trio2_trans_out, currentYOffset)}px)`;
                    objs.trio2.style.opacity = calcValues(values.trio2_opacity_out, currentYOffset);
                }

                if(scrollRatio >= 0.6){ // #3 in
                    objs.trio3.style.transform = `translateY(${calcValues(values.trio3_trans_in, currentYOffset)}px)`;
                    objs.trio3.style.opacity = calcValues(values.trio3_opacity_in, currentYOffset);
                }
                
                break;
                
            case 4:
                break;
        }
    }
    
    function scrollLoop() { //현재 섹션 구하기
        enterNewScene = false;
        prevScrollHeight = 0;

        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
            container.setAttribute('id', "scene-" + currentScene);
        }

        if(delayedYOffset < prevScrollHeight){
            if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
            container.setAttribute('id', "scene-" + currentScene);
        }

        if(enterNewScene) return;

        playAnimation();
    }

    function loop() { //캔버스 이미지 드로우 부드럽게
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) { //섹션 교차시점이 아닌 경우
            if (currentScene === 0) { //첫번째 세번째만 컨버스 이미지 드로우
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if (objs.videoImages[sequence]) {
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }
    
    
    window.addEventListener('load', function(){
        const loadingElement = document.querySelector('.loading');
        
        document.body.classList.remove('hold');

        if (loadingElement) {
            loadingElement.classList.add('on');
            
            setTimeout(() => {
                loadingElement.parentNode.removeChild(loadingElement);
            }, 1000);
        }
        
        setLayout();

        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0); //스크롤 하기전 로드후 캔버스 이미지 드로운

        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (yOffset > 0) {
            let siId = setInterval(function() {

                window.scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 30) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window,addEventListener('scroll', function(){
            yOffset = window.pageYOffset;
            scrollLoop();

            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize', function(){
            setLayout();

            /* sceneInfo[3] */
            move = container.offsetWidth - (bagItem.offsetHeight * 10);
            bagItem.style.transform = `translateX(${move}px)`;
            
            sceneInfo[3].values.bag1_trans = [move, 0, { start: 0.35, end: 0.9 }];
            sceneInfo[3].values.bag2_trans = [0, move, { start: 0.35, end: 0.9 }];
            /* //sceneInfo[3] */
        });

        window.addEventListener("orientationchange", function() { // 모바일 가로모드
            setTimeout(setLayout, 500);
        });
    });

    setCanvasImages();
})();