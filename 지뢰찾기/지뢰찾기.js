const tbody = document.querySelector("#table tbody");

document.querySelector("#exec").addEventListener("click",function(){
    const hor = parseInt(document.querySelector("#hor").value);
    const ver = parseInt(document.querySelector("#ver").value);
    const mine = parseInt(document.querySelector("#mine").value);
    //2. 지뢰 심을 자리 랜덤 뽑기
    const candidate = Array(hor*ver).fill().map(function(value,idx){
        return idx;
    });
    let shuffle = [];
    while(candidate.length>hor*ver-mine){
        let move = candidate.splice(Math.floor(Math.random()*candidate.length),1)[0];
        shuffle.push(move);
    }
    
    //1. 지뢰 판 만들기
    //이차배열
    //1-1. 세로 (tr) 만들기
    //초기화
    tbody.innerHTML="";
    let  dataset =[];
    for(let i=0; i<ver; i++){
        let arr= [];
        dataset.push(arr);
        const tr = document.createElement('tr');
        //1-2. 가로 (td) 만들기
        for( let j=0; j<hor; j++){
            arr.push(1);
            const td = document.createElement('td');
            tr.appendChild(td);
            //4. 마우스 오른쪽 버튼 클릭시, 이벤트 생성 (깃발 꽂기)
            td.addEventListener('contextmenu',function(e){
                // 컨텍스트 메뉴창 뜨는거 막기
                e.preventDefault();
                //클릭시, 줄 칸 몇번째 인지 알아내기
                const parent_tr = e.currentTarget.parentNode;
                const parent_tbody =  e.currentTarget.parentNode.parentNode;
                const column = Array.prototype.indexOf.call(parent_tr.children,e.currentTarget);
                const row= Array.prototype.indexOf.call(parent_tbody.children,parent_tr);
                // this.textContent='!';
                // dataset[row][column]='!';
                // console.log("여기요",row,column);
                // console.log(dataset);

                //e.target vs e.currentTarget 
                //e.currentTarget : 이벤트 리스너를 단 대상
                //e.target : 이벤트가 실행되는 대상 

                //중복 클릭시 이벤트
                if(e.currentTarget.textContent==='' || e.currentTarget.textContent==='X'){
                    e.currentTarget.textContent='!';
                }else if(e.currentTarget.textContent==='!'){
                    e.currentTarget.textContent='?';
                }else if(e.currentTarget.textContent==='?'){
                    if(dataset[row][column]==="X"){
                        e.currentTarget.textContent='X';
                    }else{
                        e.currentTarget.textContent='';
                    }
                }
            });
            //5. 마우스 왼쪽 버튼 클릭시, 이벤트 생성 (주변 지뢰 개수 세기)
            td.addEventListener('click',function(e){
                const parent_tr = e.currentTarget.parentNode;
                const parent_tbody =  e.currentTarget.parentNode.parentNode;
                const column = Array.prototype.indexOf.call(parent_tr.children,e.currentTarget);
                const row= Array.prototype.indexOf.call(parent_tbody.children,parent_tr);
                
                e.currentTarget.classList.add('opend');

                if(dataset[row][column]==='X'){
                    e.currentTarget.textContent='펑';
                }else{
                    let arround = [dataset[row][column-1],dataset[row][column+1]];
                    if(dataset[row-1]){
                        arround= arround.concat([ dataset[row-1][column-1],dataset[row-1][column],dataset[row-1][column+1] ])
                    }
                    if(dataset[row+1]){
                        arround= arround.concat([ dataset[row+1][column-1],dataset[row+1][column],dataset[row+1][column+1] ])
                    }
                    console.log ('around',arround);
                    const arround_mine_count = arround.filter(function(v){return v==='X'}).length;
                    e.currentTarget.textContent = arround_mine_count; 
                
                    // 6. 클릭시, 주변 x가 0 이면 주변 8칸 동시 오픈 
                    //6-1. 주변칸을 배열로 모은다
                    if(arround_mine_count===0){
                        let arround_square = [];
                        if(tbody.children[row-1]){
                            arround_square = arround_square.concat([
                                tbody.children[row-1].children[column-1],
                                tbody.children[row-1].children[column],
                                tbody.children[row-1].children[column+1],
                            ]);
                        }
                        arround_square = arround_square.concat([
                            tbody.children[row].children[column-1],
                            tbody.children[row].children[column],
                            tbody.children[row].children[column+1],
                        ]);
                        if(tbody.children[row+1]){
                            arround_square = arround_square.concat([
                                tbody.children[row+1].children[column-1],
                                tbody.children[row+1].children[column],
                                tbody.children[row+1].children[column+1],
                            ]);
                        }
                    }
                    //배열에서 undifind, null, 0을 제거하는 코드 
                    arround_square.filter(function(v){return !!v}).forEach(function(next_square){
                        next_square.click();
                    });
                }
            });
            
        }
        tbody.appendChild(tr);        
    }
    
    //3. 지뢰심기
    for( let k=0; k<shuffle.length; k++){
        const saero = Math.floor(shuffle[k]/ver);
        const garo = shuffle[k]%hor;
        tbody.children[saero].children[garo].textContent='X';
        dataset[saero][garo]='X';
    }

    
});

