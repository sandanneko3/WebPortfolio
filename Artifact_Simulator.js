var Artifact = {
    level   : 0,
    part    : 0,
    main    : 0,
    initial : 3,
    sub     : [0,0,0,0],
    value   : [0, 0, 0, 0],
    score   : 0,
}

var Setting = {
    part    : [1, 1, 1, 1, 1],
    score   : [1, 0, 0],
    levelup : 0,
}

const ValueStorage = {
    //確率の比重
    percent : [30, 30, 30, 20, 20, 20, 20, 20, 15, 15],
    //EnhanceよりEnh0 ~ Enh9
    Enh0     : [209, 239, 269, 299], //HP実数
    Enh1     : [14, 16, 18, 19],     //攻撃実数
    Enh2     : [16, 19, 21, 23],     //防御実数
    Enh3     : [4.1, 4.7, 5.3, 5.8], //HP%
    Enh4     : [4.1, 4.7, 5.3, 5.8], //攻撃%
    Enh5     : [5.1, 5.8, 6.6, 7.3], //防御%
    Enh6     : [16, 19, 21, 23],     //元素熟知
    Enh7     : [4.5, 5.2, 5.8, 6.5], //元素チャージ効率
    Enh8     : [2.7, 3.1, 3.5, 3.9], //会心率
    Enh9     : [5.4, 6.2, 7.0, 7.8], //会心ダメージ
}

const TextStorage = {
    part   : ["生の花","死の羽","時の砂","空の杯","理の冠"],
    status : ["H P","攻撃力","防御力","H P","攻撃力","防御力","元素熟知","元素チャージ効率","会心率","会心ダメージ","与える治療効果",
        "炎元素ダメージ", "水元素ダメージ", "雷元素ダメージ", "氷元素ダメージ", "風元素ダメージ", "岩元素ダメージ", "草元素ダメージ", "物理与ダメージ", ""],
        /*
        0  HP実数         6  元素熟知
        1  攻撃力実数     7  元素チャージ効率
        2  防御力実数     8  会心率
        3  HP割合         9  会心ダメ―ジ
        4  攻撃力割合     10 与える治療効果
        5  防御力割合     11~各ダメージバフ
        */

    //メインステの数値
    MS0    : [717, "1,530", "2,342", "3,155", "3,967", "4,780"],
    MS1    : [47, 100, 152, 205, 258, 311],
    MS2    : [],
    MS3    : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS4    : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS5    : ["8.7%", "18.6%", "28.6%", "38.5%", "48.4%", "58.3%"],
    MS6    : [28, 60, 91, 123, 155, 187],
    MS7    : ["7.8%", "16.6%", "25.4%", "34.2%", "43.0%", "51.8%"],
    MS8    : ["4.7%", "9.9%", "15.2%", "20.5%", "25.8%", "31.1%"],
    MS9    : ["9.3%", "19.9%", "30.5%", "41.0%", "51.6%", "62.2%"],
    MS10   : ["5.4%", "11.5%", "17.6%", "23.7%", "29.8%", "35.9%"],
    MS11   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS12   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS13   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS14   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS15   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS16   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS17   : ["7.0%", "14.9%", "22.8%", "30.8%", "38.7%", "46.6%"],
    MS18   : ["8.7%", "18.6%", "28.6%", "38.5%", "48.4%", "58.3%"],
}

//START
function BuildStart(){
    Initialization()
    ArtifactPart()
    ArtifactMainStates()
    ArtifactSubStates()
    CalculateScore()
    Display()
    document.getElementById("start_button").textContent = "RESET";
}

//初期化・設定の読み込み
function Initialization(){
    //初期化
    Artifact.level = 0;
    Artifact.part    = 0;
    Artifact.main    = 0;
    Artifact.initial = 3;
    Artifact.sub     = [];
    Artifact.value = [];
    Artifact.score = 0;
    for (var i = 0; i < 4; i++){
        var SUB = "sub" + i;
        var VALUE = "value" + i;
        document.getElementById(SUB).innerText = "";
        document.getElementById(VALUE).innerText = "";
    }

    //設定の読み込み
    //部位
    var setting_part = document.getElementById("artifact_part");
    var part = [];
    part.push(setting_part.elements["flower"]);
    part.push(setting_part.elements["plume"]);
    part.push(setting_part.elements["sands"]);
    part.push(setting_part.elements["goblet"]);
    part.push(setting_part.elements["circlet"]);
    for (var i = 0; i < 5; i++)
        Setting.part[i] = parseInt(part[i].checked ? part[i].value : 5);

    //スコアに加算する要素
    var score_element = document.getElementById("score_element");
    var score = [];
    score.push(score_element.elements["ATK"]);
    score.push(score_element.elements["HP"]);
    score.push(score_element.elements["EM"]);
    for (var i = 0; i < 3; i++)
        Setting.score[i] = parseInt(score[i].checked ? score[i].value : 0);

    //強化方法
    var Selected = [];
    Selected.push(document.getElementById("4up"));
    Selected.push(document.getElementById("20up"));
    Selected.push(document.getElementById("stop4op"));
    for (var i = 0; i < 3; i++)
        if (Selected[i].checked)
            Setting.levelup = i;
}

//ランダムな整数を生成
function GetRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//部位の決定
function ArtifactPart() {
    var RandomPart = []
    for (var i of Setting.part)
        if (i !== 5)
            RandomPart.push(i);
    //全てチェックが無い時
    if (RandomPart.length == 0)
        RandomPart = [0, 1, 2, 3, 4];
    console.log(RandomPart)
    Artifact.part = RandomPart[GetRandomInt(0, RandomPart.length - 1)];
    console.log(Artifact.part)
}

//メインステータス決定
function ArtifactMainStates(){
    randMain = GetRandomInt(0,99)

    switch(Artifact.part){
        case 0: //花
            Artifact.main = 0; //HP実数
            break;
        case 1: //羽
            Artifact.main = 1; //攻撃実数
            break;
        case 2: //時計
            if (randMain < 80)
                Artifact.main = GetRandomInt(3, 5); //HP・攻撃・防御実数
            else
                Artifact.main = GetRandomInt(6, 7); //熟知,チャージ
            break;
        case 3: //杯
            if (randMain < 57)
                Artifact.main = GetRandomInt(3, 5); //HP・攻撃・防御実数
            else if (randMain < 97)
                Artifact.main = GetRandomInt(11, 18); //各元素ダメージ
            else
                Artifact.main = 6; //熟知
            break;
        case 4: //冠
            if (randMain < 66)
                Artifact.main = GetRandomInt(3, 5); //HP・攻撃・防御実数
            else if (randMain < 96)
                Artifact.main = GetRandomInt(8, 10); //会心率,会心ダメ,治療効果
            else
                Artifact.main = 6; //熟知
            break
    }
}
//重み付きランダム抽出
function WeightRandom(weight) {
    var SumWeight = weight.reduce((acc, curr) => acc + curr, 0);
    var RandomNum = GetRandomInt(1, SumWeight);
    var AddWeight = 0;
    for (var i = 0; i < weight.length; i++) {
        AddWeight += weight[i];
        if (RandomNum <= AddWeight)
            return i;
    }
}

//サブステータスの決定
function ArtifactSubStates() {
    //比重
    var weight = [...ValueStorage.percent];

    //初期サブステ数決定
    initialOP = GetRandomInt(0, 9)
    if (initialOP > 7)
        Artifact.initial = 4;

    //メインステ除外
    if(Artifact.main < 10)
        weight[Artifact.main] = 0;

    //サブステータス付与
    for (var i = 0; i < Artifact.initial; i++) {
        ReturnNum = WeightRandom(weight);
        Artifact.sub.push(ReturnNum);
        Artifact.value.push(RandomValue(ReturnNum));
        weight[ReturnNum] = 0;
    }
}

//ランダムにサブステの数値を返す
function RandomValue(sub){
    var RandomNum = GetRandomInt(0,3);
    var STvalue   = "Enh" + sub;
    var Noise = Math.random() * 0.09;
    if (Noise <= 0.05)
        return (0 + ValueStorage[STvalue][RandomNum] - Noise);
    else
        return (0 + ValueStorage[STvalue][RandomNum] + (Noise - 0.05));
}

//4オプ目の追加
function Add_4option() {
    var randomweight = [...ValueStorage.percent]
    //メインステータス除去
    if (Artifact.main < 10)
        randomweight[Artifact.main] = 0;

    //サブステータス除去
    for (var i = 0; i < 3; i++)
        randomweight[Artifact.sub[i]] = 0;

    //4op目の追加
    Artifact.sub.push(WeightRandom(randomweight));
    Artifact.value.push(RandomValue(Artifact.sub[3]));
    Artifact.level += 1;
}

//最大レベルまで強化
function Max_Enhance() {
    for (var i = Artifact.level; i < 5; i++) {
        //上昇するサブステを選択
        var RandomChoice = GetRandomInt(0, 3);
        Artifact.value[RandomChoice] += RandomValue(Artifact.sub[RandomChoice]);
        Artifact.level += 1;
    }
}

//聖遺物の強化
function Enhance() {
    //設定の読み込み
    var Selected = [];
    Selected.push(document.getElementById("4up"));
    Selected.push(document.getElementById("20up"));
    Selected.push(document.getElementById("stop4op"));
    for (var i = 0; i < 3; i++)
        if (Selected[i].checked)
            Setting.levelup = i;

    var SetEnhance = Setting.levelup;
    //4Lvずつ強化
    if (SetEnhance == 0 && Artifact.level < 5) {
        if (Artifact.initial == 3 && Artifact.level == 0)
            Add_4option();
        else {
            var RandomChoice = GetRandomInt(0, 3);
            Artifact.value[RandomChoice] += RandomValue(Artifact.sub[RandomChoice]);
            Artifact.level += 1;
        }
    }
    //最大まで強化
    else if (SetEnhance == 1 && Artifact.level < 5) {
        if (Artifact.initial == 3 && Artifact.level == 0)
            Add_4option();
        Max_Enhance();
    } else if (SetEnhance == 2 && Artifact.level < 5) {
        if (Artifact.initial == 3 && Artifact.level == 0)
            Add_4option();
        else
            Max_Enhance();
    }
    CalculateScore();
    Display();
}

//スコアの計算
function CalculateScore() {
    var score = 0;
    for (var i = 0; i < 4; i++) {
        //会心率
        if (Artifact.sub[i] == 8)
            score += (((Math.round(Artifact.value[i] * 10)) / 10).toFixed(1)) * 2;
        //会心ダメ―ジ
        else if (Artifact.sub[i] == 9){
            score += parseFloat(((Math.round(Artifact.value[i] * 10)) / 10).toFixed(1));
        }
        //攻撃力％
        else if (Artifact.sub[i] == 4 && Setting.score[0] == 1) {
            score += parseFloat(((Math.round(Artifact.value[i] * 10)) / 10).toFixed(1));
        }
        //HP％
        else if (Artifact.sub[i] == 3 && Setting.score[1] == 1) {
            score += parseFloat(((Math.round(Artifact.value[i] * 10)) / 10).toFixed(1));
        }
        //元素熟知
        else if (Artifact.sub[i] == 6 && Setting.score[2] == 1) {
            score += parseFloat(((Math.round(Artifact.value[i] * 10)) / 40).toFixed(1));
        }
    }
    Artifact.score = score;
}

//スコアの再読み込み
function ReloadScore() {
    //設定の読み込み
    var score_element = document.getElementById("score_element");
    var score = [];
    score.push(score_element.elements["ATK"]);
    score.push(score_element.elements["HP"]);
    score.push(score_element.elements["EM"]);
    for (var i = 0; i < 3; i++)
        Setting.score[i] = parseInt(score[i].checked ? score[i].value : 0);
    //スコアの表示
    console.log(Setting.levelup);
    CalculateScore();
    console.log(Artifact.score);
    Display();
}

//要素の表示
function Display() {
    //部位
    document.getElementById("Artifact_Part").innerText = TextStorage.part[Artifact.part];
    //メインステータス
    document.getElementById("Artifact_Main").innerText = TextStorage.status[Artifact.main];
    //メインステータスの数値
    var Assign = "MS" + Artifact.main;
    document.getElementById("Main_Value").innerText = String(TextStorage[Assign][Artifact.level]);
    //サブステータス
    for (var i = 0; i < Artifact.sub.length; i++){
        var Assign = "sub" + i;
        document.getElementById(Assign).innerText = TextStorage.status[Artifact.sub[i]];
    }
    //サブステータスの数値
    for (var i = 0; i < Artifact.sub.length; i++){
        var Assign = "value" + i;
        if (Artifact.sub[i] < 3 || Artifact.sub[i] == 6)
            document.getElementById(Assign).innerText = (Math.round(Artifact.value[i]));
        else
            document.getElementById(Assign).innerText = (((Math.round(Artifact.value[i] * 10)) / 10).toFixed(1) + "%");
    }
    //レベル
    document.getElementById("Artifact_Level").innerText = ("+" + Artifact.level * 4);

    //スコア
    document.getElementById("Artifact_Score").innerText = (((Math.round(Artifact.score * 10)) / 10).toFixed(1));
}

//ボタン[start_button]
let StartButton = document.getElementById("start_button");
StartButton.addEventListener("click",BuildStart);
//ボタン[enhance_button]
let EnhanceButton = document.getElementById("enhance_button");
EnhanceButton.addEventListener("click", Enhance);
//ボタン[reload_button]
let ReloadButton = document.getElementById("reload_button");
ReloadButton.addEventListener("click", ReloadScore);