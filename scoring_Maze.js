//1つあたりの得点の設定
const BUMP_POINT = 5;                               //バンプの得点(5)
const CHECKPOINT_POINT = 10;                        //チェックポイントの得点(10)
const DOWNSLOPE_POINT = 10;                         //傾斜路(下り)の得点(10)
const UPSLOPE_POINT = 20;                           //傾斜路(上り)の得点(20)
const FIND_LINEAR_VICTIM_POINT = 10;                //リニアウォールに繋がるタイルの被災者発見の得点(10)
const FIND_FLOATING_VICTIM_POINT = 25;              //その他の壁に繋がるタイルの被災者発見の得点(25)
const PLACE_KIT_POINT = 10;                         //レスキューキット配置の得点(10)
const MAX_PLACE_KIT_HEATED_VICTIM_POINT = 1;        //熱を発する被災者へのレスキューキット配置数の最大数(1)
const MAX_PLACE_KIT_HARMED_VICTIM_POINT = 2;        //傷ついた被災者へのレスキューキット配置数の最大数(2)
const MAX_PLACE_KIT_STABLE_VICTIM_POINT = 1;        //しっかりした被災者へのレスキューキット配置数の最大数(3)
const MAX_PLACE_KIT_UNHARMED_VICTIM_POINT = 0;      //無傷な被災者へのレスキューキット配置数の最大数(0)
const FINDED_VICTIM_RILIABILITY_POINT = 10;         //リライアビリティボーナスでの被災者発見の得点(10)
const PLACED_KIT_RILIABILITY_POINT = 10;            //リライアビリティボーナスでのレスキューキット配置の得点(10)
const STOP_RILIABILITY_POINT = -10;                 //リライアビリティボーナスでの競技進行の停止の減点(-10)
const FINDED_VICTIM_ESCAPE_POINT = 10;              //脱出成功得点での被災者発見の得点(10)
const MISiDENtiFiCATION_POINT = -5;                 //被災者誤発見による減点(-5)


//変数の宣言と定義
var number_victim = 1;       //被災者の人数

//初期化(設定の適応)
{
    let tr_victim = document.getElementById('tbody_victim').childNodes[0];                  //被災者に関する得点表の行のオブジェクトエレメント取得
    tr_victim.childNodes[3].childNodes[0].max = MAX_PLACE_KIT_HEATED_VICTIM_POINT;          //レスキューキットの最大配置数変更
}

//合計得点計算
function calculateTotal(){
    //得点の計算
    const part_bump = document.getElementById('bump').value * BUMP_POINT;                               //減速バンプの合計得点計算
    const part_checkpoint = document.getElementById('checkpoint').value * CHECKPOINT_POINT;             //チェックポイントの合計得点計算
    const part_downslope = document.getElementById('downslope').value * DOWNSLOPE_POINT;                //傾斜路(下り)の合計得点計算
    const part_upslope = document.getElementById('upslope').value * UPSLOPE_POINT;                      //傾斜路(上り)の合計得点計算
    const part_rescue = calculateRescue();                                                              //被災者発見とレスキューキット配置の合計得点計算と表示
    const part_reliabilityBonus = calculateReliabilityBonus();                                          //リライアビリティボーナスの計算
    const part_escape = calculateEscapeBonus();                                                         //脱出成功の合計得点計算
    const part_misidentification = document.getElementById('misidentification_number').value * MISiDENtiFiCATION_POINT;      //被災者誤発見による減点の計算
    //合計得点の計算
    let total = part_bump + part_checkpoint + part_downslope + part_upslope + part_rescue + part_reliabilityBonus + part_escape + part_misidentification;
    if(total < 0) total = 0;
    //計算した得点の表示
    document.getElementById('score_bump').value = part_bump;                            //減速バンプの合計得点表示
    document.getElementById('score_checkpoint').value = part_checkpoint;                //チェックポイントの合計得点表示
    document.getElementById('score_downslope').value = part_downslope;                  //傾斜路(下り)の合計得点表示
    document.getElementById('score_upslope').value = part_upslope;                      //傾斜路(上り)の合計得点表示
    document.getElementById('score_reliabilityBonus').value = part_reliabilityBonus;    //リライアビリティボーナスの表示
    document.getElementById('score_escape').value = part_escape;                        //脱出成功ボーナス表示
    document.getElementById('score_misidentification').value = part_misidentification;  //被災者誤発見による減点の表示   
    document.getElementById('score_all').value = total;                                 //合計得点表示
}

function addList(obj) {
    //tbody要素に指定したIDを取得し、変数「tbody」に代入
    const tbody = document.getElementById('tbody_victim');
    //objの親の親のノードを取得し（つまりtr要素）、変数「tr」に代入
    const tr = obj.parentNode.parentNode;
    //tbodyタグ直下のノード（行）を複製し、変数「list」に代入
    const list = tbody.childNodes[0].cloneNode(true);
    parseInt(tr.childNodes[0].textContent,10);
    //複製した行の3番目のセルのエレメント<input>の属性checkedにfalseを代入
    list.childNodes[2].childNodes[0].checked = false;
    //複製した行の4番目のセルのエレメント<input>のvalueに０を代入
    list.childNodes[3].childNodes[0].value = 0;
    //複製した行の4番目のセルのエレメント<input>のmaxに熱を発する被災者のレスキューキット最大配置数を代入
    list.childNodes[3].childNodes[0].max = MAX_PLACE_KIT_HEATED_VICTIM_POINT;
    //複製した行の5番目のセルのテキストに0を代入
    list.childNodes[4].textContent = 0;
    //複製したノード「list」を直後の兄弟ノードの上に挿入
    //（「tr」の下に挿入）
    tbody.insertBefore(list, tr.nextSibling);
    number_victim++;       //表の行の「数」の加算
}

function removeList(obj) {
    // tbody要素に指定したIDを取得し、変数「tbody」に代入
    const tbody = document.getElementById('tbody_victim');
    // objの親の親のノードを取得し（つまりtr要素）、変数「tr」に代入
    const tr = obj.parentNode.parentNode;
    //表行数が１より多いとき１行削除する
    if(number_victim > 1){
        // 「tbody」の子ノード「tr」を削除
        tbody.removeChild(tr);
        number_victim--;    //表の行の「数」の引算
    }
}

//被災者に関する得点の表のレスキューキット配置数の最大値変更する
function changingMax(obj){
    const victim_type = obj.value;
    const kit = obj.parentNode.parentNode.childNodes[3].childNodes[0];            //要素<input>の要素オブジェクト
    let kit_max;                                                                //得点となるレスキューキットの最大配置数
    if(victim_type == 'heated'){                                                //熱を発する被災者のとき
        kit_max = MAX_PLACE_KIT_HEATED_VICTIM_POINT;
    }
    else if(victim_type == 'harmed'){                                           //傷ついた被災者のとき
        kit_max = MAX_PLACE_KIT_HARMED_VICTIM_POINT;
    }
    else if(victim_type == 'stable'){                                           //しっかりした被災者のとき
        kit_max = MAX_PLACE_KIT_STABLE_VICTIM_POINT;
    }
    else if(victim_type == 'unharmed'){                                         //無傷な被災者のとき
        kit_max = MAX_PLACE_KIT_UNHARMED_VICTIM_POINT;
    }
    if(kit.value > kit_max){
        kit.value = kit_max;
    }
    kit.max = kit_max;
}

//被災者救助に関する得点計算と表示
function calculateRescue(){
    const tbody = document.getElementById('tbody_victim');    //被災者に関する得点の表の<tbody>のエレメントオブジェクトを取得
    let tr;
    let one_score_rescue;                                   //被災者一人の救助得点
    let kit_number;                                         //レスキューキットの配置数
    let part_rescue = 0;                                    //被災者救助の合計得点
    for(let n = 0; n <= number_victim - 1; n++){            //全ての被災者の得点を計算する
        one_score_rescue = 0;                               //被災者一人の救助得点の初期化
        tr = tbody.childNodes[n];                           //ｎ+1番目の行の<tr>のエレメントオブジェクトを取得
        kit_number = tr.childNodes[3].childNodes[0].value;  //レスキューキットの配置数代入
        if(tr.childNodes[2].childNodes[0].checked || kit_number > 0){         //その被災者を発見したか
            //発見の得点加算
            if(tr.childNodes[1].childNodes[0].value == 'linear'){   //リニアウォールに繋がるタイルの被災者を発見したとき
                one_score_rescue += FIND_LINEAR_VICTIM_POINT;       //点を加算する
            }
            else{                                                   //その他のタイルの被災者を発見したとき
                one_score_rescue += FIND_FLOATING_VICTIM_POINT;     //点を加算する
            }
            //レスキューキットの配置の得点加算
            if(kit_number > 0){                                     //1個以上配置したとき
                one_score_rescue += kit_number * PLACE_KIT_POINT;   //レスキューキット配置数分の点を加算する
            }
        }
        tr.childNodes[4].textContent = one_score_rescue;            //被災者一人の救助得点表示
        part_rescue += one_score_rescue;                            //被災者一人の救助得点を加算する
    }
    return part_rescue;
}

//リライアビリティボーナスの計算
function calculateReliabilityBonus(){
    let part_reliabilityBonus;                                                  //リライアビリティボーナスの得点
    const tbody_victim = document.getElementById('tbody_victim');                 //被災者に関する得点表のtbodyのエレメントオブジェクトを取得
    let tr_victim;                                                              //被災者に関する得点表のtrのエレメントオブジェクト
    const number_stop = document.getElementById('number_stop').value;             //競技進行の停止数を取得
    let sum_finded_victim = 0;                                                  //発見した被災者の人数
    let sum_placed_kit = 0;                                                     //配置したレスキューキットの数
    for(let n = 0; n < number_victim; n++){                                     //被災者に関する得点表の行数分ループする
        tr_victim = tbody_victim.childNodes[n];                                 //被災者に関する得点表のtrのエレメントオブジェクト取得
        if(tr_victim.childNodes[2].childNodes[0].checked == true){              //その行の被災者が発見されているか
            sum_finded_victim++;                                                //発見した被災者の人数を１加算する
        }
        sum_placed_kit += tr_victim.childNodes[3].childNodes[0].value*1;        //その行の配置したレスキューキット数を加算する
    }
    part_reliabilityBonus = sum_finded_victim * FINDED_VICTIM_RILIABILITY_POINT + sum_placed_kit * PLACED_KIT_RILIABILITY_POINT + number_stop * STOP_RILIABILITY_POINT; //リライアビリティボーナスの計算
    if(part_reliabilityBonus < 0){
        part_reliabilityBonus = 0;
    }
    return part_reliabilityBonus;
}

//脱出成功得点を計算する
function calculateEscapeBonus(){
    let part_escape;                                                                    //脱出成功コーナス
    const tbody_victim = document.getElementById('tbody_victim');                         //被災者に関する得点表のtbodyのエレメントオブジェクトを取得
    const escaped = document.getElementById('escape').checked;                            //脱出成功の可否を取得
    let sum_finded_victim = 0;                                                          //発見した被災者の人数を初期化する
    if(escaped == true){
        for(let n = 0; n < number_victim; n++)                                              //被災者に関する得点表の行数分ループする
        {
            if(tbody_victim.childNodes[n].childNodes[2].childNodes[0].checked == true){     //その行の被災者が発見されているか
                sum_finded_victim++;                                                        //発見した被災者の人数を1加算する
            }
        }
    }
    part_escape = sum_finded_victim * FINDED_VICTIM_ESCAPE_POINT;                           //脱出成功ボーナスを計算する
    return part_escape;
}