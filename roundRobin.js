const TEMPO_DE_CLOCK = 1000;

const arquivo = [];
const processosFinalizados = [];

adicionaProcesso(1500);
adicionaProcesso(2000);
adicionaProcesso(3000);
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

function adicionaProcessoNoMeio(cicloAtual, cicloDesejado, i, idProcesso, tempo) {
    if(cicloAtual == cicloDesejado && arquivo.length > 0 && i != 0) {
        arquivo.splice(i - 1, 0, { tempo, tempoJaExecutado: 0, tempoEsperando: 0, processoId: idProcesso});
    } else if(cicloAtual == cicloDesejado) {
        
        arquivo.push({ tempo, tempoJaExecutado: 0, tempoEsperando: 0, processoId: idProcesso});
    }
}

async function roundRobin() {
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
        for (let j = 0; j < arquivo.length; j++) {
            arquivo[j].tempoEsperando += tempoDelay;
        }

        console.log("ciclo " + ciclos + " finalizado");
        console.log("Processo em execução: " + arquivo[i].processoId+ "\n");

        // Remove o processo ao finaliza-lo
        if(arquivo[i].tempo <= 0) {
            // Para adiconar o processo na ultima posição
            let indiceRemocao = i;
            if(i >= arquivo.length - 1) i = 0
            
            let processoFinalizado = arquivo.splice(indiceRemocao, 1);
            processosFinalizados.push(processoFinalizado[0]);

        } else {
            // quando acaba um ciclo vai pro próximo
            if(i >= arquivo.length - 1) i = 0
            else i += 1;
        }

        // Adiciona um processo no 5 ciclo
        adicionaProcessoNoMeio(ciclos, 5, i, 5, 10000);
        adicionaProcessoNoMeio(ciclos, 5, i, 6, 10000);
        

        // Finaliza caso tenha chegado no ultimo processo
        if(arquivo.length == 0) {
            console.log("Acabou, e precisou de: " + ciclos + " ciclos de clock")
            break;
        }
    }
    
    let tempoTotal = 0;
    for (let i = 0; i < processosFinalizados.length; i++) {
        tempoTotal += processosFinalizados[i].tempoEsperando;
    }

    console.log("precisou de um total de: " + ciclos + " ciclos");
    console.log("tempo total de turnaround: " + tempoTotal + "ms");
}
  
roundRobin();
