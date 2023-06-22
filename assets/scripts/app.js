const attackValue=10;
const monsterAttackValue=14;
const strongAttackValue=17;
const healValue=20;

const modeAttack='ATTACK';
const modeStrongAttack='STRONG_ATTACK';
const logEventPlayerAttack='PLAYER_ATTACK';
const logEventPlayerStrongAttack='PLAYER_STRONG_ATTACK';
const logEventMonsterAttack='MONSTER_ATTACK';
const logEventPlayerHeal='PLAYER_HEAL';
const logEventGameOver='GAME_OVER';



let battleLog=[];
let lastloggedentry;

function getmaxlifevalues(){
    const enteredValue=prompt('Max life','100');

    const parsedvalue=parseInt(enteredValue)
    if(isNaN(parsedvalue) || parsedvalue<=0){
        throw {message : "invalid input"};
    }
    return parsedvalue;
}

let chosenMaxLife;
try{
    chosenMaxLife=getmaxlifevalues();
}catch(error){
    console.log(error);
    chosenMaxLife=100;
    alert("entered wrong value");
    // throw error;
}


let currentMonsterHealth=chosenMaxLife;
let currentPlayerHealth=chosenMaxLife;
hasBonusLife=true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev,val,monsterHealth,playerHealth){
    let logEntry={
        event:ev,
        value:val,
        finalMonsterHealth:monsterHealth,
    };
    switch(ev){
        case logEventPlayerAttack:
            logEntry={
                event:ev,
                value:val,
                target:'MONSTER',
                finalMonsterHealth:monsterHealth,
                finalPlayerHealth:playerHealth
            };
            break;
            case logEventPlayerStrongAttack:
                logEntry={
                    event:ev,
                    value:val,
                    target:'MONSTER',
                    finalMonsterHealth:monsterHealth,
                    finalPlayerHealth:playerHealth
                };
                break
            case logEventMonsterAttack:
                logEntry={
                    event:ev,
                    value:val,
                    target:'MONSTER',
                    finalMonsterHealth:monsterHealth,
                    finalPlayerHealth:playerHealth
                };
                break;
            case logEventPlayerHeal:
                logEntry={
                    event:ev,
                    value:val,
                    target:'PLAYER',
                    finalMonsterHealth:monsterHealth,
                    finalPlayerHealth:playerHealth
                };
                break;
            case logEventGameOver:
                logEntry={
                    event:ev,
                    value:val,
                    finalMonsterHealth:monsterHealth,
                    finalPlayerHealth:playerHealth
                };
                break
            }
            battleLog.push(logEntry);
        }
        
        function reset(){
    currentMonsterHealth=chosenMaxLife;
    currentPlayerHealth=chosenMaxLife;
    resetGame(chosenMaxLife);
}   

function endRound(){
    const initialPlayerHealth=currentPlayerHealth;
    const playerDamage=dealPlayerDamage(monsterAttackValue);
    currentPlayerHealth-=playerDamage;
    writeToLog(
        logEventMonsterAttack,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
        );

    if(currentPlayerHealth<=0 && hasBonusLife){
        hasBonusLife=false;
        removeBonusLife();
        currentPlayerHealth=initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('Bonus life saved you');

    }

    if(currentMonsterHealth<=0 && currentPlayerHealth>0){
       alert('You won!');
       writeToLog(
        logEventGameOver,
        'PLAYER WON',
        currentMonsterHealth,
        currentPlayerHealth
        );
    }else if(currentPlayerHealth<=0 && currentMonsterHealth>0){
        alert("You lost!");
        writeToLog(
            logEventMonsterAttack,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
            );
    }else if(currentMonsterHealth<=0 && currentPlayerHealth<=0){
        alert('Draw');
        writeToLog(
            logEventMonsterAttack,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
            );
    }

    if(currentMonsterHealth<=0 || currentPlayerHealth<=0){
        reset();
    }
}

function attackMonster(mode){
    let maxDamage= mode===modeAttack? attackValue:strongAttackValue;
    let logEvent= mode===modeAttack?logEventPlayerAttack:logEventPlayerStrongAttack;
    // if(mode === modeAttack){
    //     maxDamage=attackValue;
    //     logEvent=logEventPlayerAttack;
    // }else if(mode=modeStrongAttack){
    //     maxDamage=strongAttackValue;
    //     logEvent=logEventPlayerStrongAttack;
    // }
    const damage=dealMonsterDamage(maxDamage);
    currentMonsterHealth-=damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
        );
    endRound();
    
}

function attackHandler(){
    attackMonster(modeAttack);
}

function strongAttackHandler(){
    attackMonster(modeStrongAttack);
}

function healPlayerHandler(){
    let heal_Value;
    if(currentPlayerHealth>=chosenMaxLife-healValue){
        alert('You cant heal more');
        heal_Value=chosenMaxLife-currentPlayerHealth;
    }else{
        heal_Value=healValue;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth+=healValue;
    writeToLog(
        logEventPlayerHeal,
        heal_Value,
        currentMonsterHealth,
        currentPlayerHealth
        );
    endRound();
}

function printLogHandler() {
    for(let i=0;i<3;i++){
        console.log('----------------');
    }
    
    let j=0;
    outerwhile: do{
    console.log('Outer',j);
    innerfor: for(let k=0;k<5;k++){
    if(k===3){
        break outerwhile;
    }
    console.log('inner',k);
    }
        j++;
    }while(j<3);

    let i=0;
    for(const logentry of battleLog){
        if((!lastloggedentry && lastloggedentry!==0) || lastloggedentry<i){
        console.log(`#${i}`);
        for (const key in logentry)
        {
            console.log(`${key} => ${logentry[key]}`);
        }
        lastloggedentry=i;
        break;
    }
        i++;
    }
  }

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);