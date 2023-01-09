const TEMPO_DE_CLOCK = 1000;

const arquivo = [];

adicionaProcesso(1500);
adicionaProcesso(2000);
adicionaProcesso(3200);
adicionaProcesso(1000);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function adicionaProcesso(tempo) {
    arquivo.push({
        tempo,
        tempoJaExecutado: 0,
        tempoEsperando: 0,
        processoId: arquivo.length + 1
    })
}

async function fifo() {
    let i = 0;
    let ciclos = 0;
    while(true) {
        ciclos += 1;
        // Realiza um ciclo de clock
        let tempoDelay = arquivo[i].tempo < TEMPO_DE_CLOCK ? arquivo[i].tempo : TEMPO_DE_CLOCK;
        await delay(tempoDelay);
        
        // Reorganiza tempos dos arquivos
        arquivo[i].tempo -= tempoDelay;
        arquivo[i].tempoJaExecutado += tempoDelay;
        for (let j = i; j < arquivo.length; j++) {
            arquivo[j].tempoEsperando += tempoDelay;
        }

        console.log("ciclo " + ciclos + " finalizado");
        console.log("Processo em execução: " + arquivo[i].processoId+ "\n");

        // O processo terminou de ser executado
        if(arquivo[i].tempo <= 0) {
            console.log("Tempo do processo: " + arquivo[i].tempoJaExecutado + "ms")
            console.log("O processo " + i + " demorou: " + arquivo[i].tempoEsperando + "ms para ser executado \n")
            i++;
        }

        if (ciclos == 5) 
            adicionaProcesso(10000);

        // Finaliza caso tenha chegado no ultimo processo
        if(i >= arquivo.length) {
            console.log("Acabou, e precisou de: " + ciclos + " ciclos de clock")
            break;
        }
    }
    
    // console.log(arquivo)
    let tempoTotal = 0;
    for (let i = 0; i < arquivo.length; i++) {
        tempoTotal += arquivo[i].tempoEsperando;
    }

    console.log("tempo total de turnaround: " + tempoTotal + "ms");
}
  
fifo();
