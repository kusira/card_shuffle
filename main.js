"use strict";

{
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const No1 =document.querySelector(".No1");
    const No2 =document.querySelector(".No2");
    const No3 =document.querySelector(".No3");
    const No4 =document.querySelector(".No4");
    const whiteNo1 =document.querySelector(".No1 > .white");
    const whiteNo2 =document.querySelector(".No2 > .white");
    const whiteNo3 =document.querySelector(".No3 > .white");
    const whiteNo4 =document.querySelector(".No4 > .white");

    // カードをクリックで回転させる
    function rotateCard(cardNum) {
        if(cardNum.classList.contains("open")){
            cardNum.classList.remove("open");
            cardNum.classList.add("close");
        }else if(cardNum.classList.contains("close")){
            cardNum.classList.remove("close");
            cardNum.classList.add("open");
        }else{
            cardNum.classList.add("open");
        }
        inactive();
        // ユーザーがカードを選んだ後にすべてのカードを見る
        async function result() {
            await sleep(500);
                for (let i = 0; i < 4; i++) {
                    cards[i].classList.add("open");
                    cards[i].classList.remove("close");
                }
            await sleep(1000);
                for (let i = 0; i < 4; i++) {
                    cards[i].classList.add("close");
                    cards[i].classList.remove("open");
                }
        }
        result()
        if(writtenOnCards[cards.indexOf(cardNum)].getAttribute("data-name") === "〇"){
            resultText.innerHTML = "正解";
            resultText.style = "color:blue;";
        }else{
            resultText.innerHTML = "不正解";
            resultText.style = "color:red;";
        }
        start.classList.remove("active");
        selectLevel.removeAttribute("disabled");
    }

    function writeAnswer(whiteNum) {
        whiteNum.setAttribute("data-name","〇");
        whiteNum.style = "color:blue;" ;
    }

    function writeIncorrectAnswer(whiteNum) {
        whiteNum.setAttribute("data-name","×");
        whiteNum.style = "color:red;" ;
    }
    // カードをアクティブ状態にする
    function active() {
        No1.classList.remove("inactive");
        No2.classList.remove("inactive");
        No3.classList.remove("inactive");
        No4.classList.remove("inactive");
        No1.classList.add("active");
        No2.classList.add("active");
        No3.classList.add("active");
        No4.classList.add("active");
    }
    // カードをインアクティブ状態にする
    function inactive() {
        No1.classList.add("inactive");
        No2.classList.add("inactive");
        No3.classList.add("inactive");
        No4.classList.add("inactive");
        No1.classList.remove("active");
        No2.classList.remove("active");
        No3.classList.remove("active");
        No4.classList.remove("active");
    }

    const cards = [No1, No2, No3, No4];
    const writtenOnCards = [whiteNo1, whiteNo2, whiteNo3, whiteNo4];

    const selectLevel = document.getElementById("select-level");
    const start = document.getElementById("start") ;
    let NumShuffle = 16;
    
    // スタートボタンを押す
    start.addEventListener("click",()=>{
        // 開始
        // console.log("開始")
        selectLevel.setAttribute("disabled","0");
        // 難易度が範囲外の時、範囲内に戻す。
        if(selectLevel.value<1){
            selectLevel.value = 1;
        }else if(5<selectLevel.value){
            selectLevel.value = 5;
        }
        NumShuffle = 8 * selectLevel.value;
        start.classList.add("active");
        resultText.innerHTML = "";
        No1.classList.add("inactive");
        No2.classList.add("inactive");
        No3.classList.add("inactive");
        No4.classList.add("inactive");
        async function shuffle() {
            // 一番最初に表のカードを全て裏返す
            for (let i = 0; i < 4; i++) {
                if(cards[i].classList.contains("open")){
                    cards[i].classList.add("close");
                }
            }
            await sleep(500);
            // カードに正解不正解の記入をする。
            const positionAnswer=[1, 2, 4, 8];
            let positionAnsewrInd = Math.floor(Math.random() * 4) ;
            let nowAnswer = positionAnswer[positionAnsewrInd];
            for (let i = 0; i < 4; i++) {
                if(nowAnswer >>i & 1){
                    writeAnswer(writtenOnCards[i]);
                }else{
                    writeIncorrectAnswer(writtenOnCards[i]);
                }
            }
            // 最初にカードを見せる
            await sleep(500);
                for (let i = 0; i < 4; i++) {
                    cards[i].classList.add("open");
                    cards[i].classList.remove("close");
                }
            await sleep(1000);
                for (let i = 0; i < 4; i++) {
                    cards[i].classList.add("close");
                    cards[i].classList.remove("open");
                }
            await sleep(1000);
                for (let i = 0; i < 4; i++) {
                    cards[i].classList.remove("close");
                }
            // シャッフルの回数分回す。
            for (let k = 0; k < NumShuffle; k++) {
                // ペアを決める。
                const pairs=[12, 10, 9, 6, 5, 3];
                const pairIdx = Math.floor(Math.random() * 6);
                const omega = Math.PI*selectLevel.value;
                const twocards = [];
                for (let i = 0; i < 4; i++) {
                    if(pairs[pairIdx] >> i & 1){
                        twocards.push(i);
                    }
                }
                const d = 160 * Math.abs(twocards[1]-twocards[0]);
                let t = 0;
                // シャッフルをする
                    while(omega*t/1000<=Math.PI){
                        t += 10;
                        cards[twocards[0]].style=`transform:translate(${d/2*(1-Math.cos(omega*t/1000))}px,${-1/5*d/2*(Math.sin(omega*t/1000))}px)`;
                        cards[twocards[1]].style=`transform:translate(${d/2*(-1+Math.cos(omega*t/1000))}px,${1/5*d/2*(Math.sin(omega*t/1000))}px)`;
                        await sleep(1);
                    }
                    // カードの中身を入れ替える
                    if(pairs[pairIdx]>>positionAnsewrInd & 1){
                        nowAnswer = pairs[pairIdx] - nowAnswer;
                    }
                    // console.log(nowAnswer)
                    // カードの中身以外初期化
                    for (let i = 0; i < 4; i++) {
                        if(nowAnswer>>i & 1){
                            positionAnsewrInd = i;
                        }
                        cards[i].style = "";
                        if(nowAnswer >>i & 1){
                            writeAnswer(writtenOnCards[i]);
                        }else{
                            writeIncorrectAnswer(writtenOnCards[i]);
                        }
                    }
                }
            // 終了
            active();
            // console.log("終了")
        }
        shuffle();
    })

    // クリックしたら回転
    No1.addEventListener("click",()=>{rotateCard(No1)});
    No2.addEventListener("click",()=>{rotateCard(No2)});
    No3.addEventListener("click",()=>{rotateCard(No3)});
    No4.addEventListener("click",()=>{rotateCard(No4)});

    const resultText = document.getElementById("result-text");
}