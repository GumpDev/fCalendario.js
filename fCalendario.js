var mes_cache = 0;
var ano_cache = 0;

fCalendario = {
    intervals : [],
    instancia : null,
    meses : [
        "Janeiro",
        "Fevereiro",
        "Mar&ccedil;o",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ],
    semanas : [
        "Domingo",
        "Segunda-Feira",
        "Ter&ccedil;a-Feira",
        "Quarta-Feira",
        "Quinta-Feira",
        "Sexta-Feira",
        "S&aacute;bado"
    ],
    max_dias : [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ],
    evento : function (nome, tipo, cor, url,data) {
        this.nome = (nome == 'null') ? tipo : nome;
        this.tipo = tipo;
        this.cor = cor;
        this.url = url;
        this.dia = data.split('/')[0];
        this.mes = data.split('/')[1];
        this.ano = data.split('/')[2];
    },
    proximo : function(i){
        mes_cache += i;
        if(mes_cache > 12){
            mes_cache = 1;
            ano_cache++;
        }else if(mes_cache < 1){
            mes_cache = 12;
            ano_cache--;
        }
        fCalendario.carregar(fCalendario.instancia,mes_cache,ano_cache);
    },
    eventos : [

    ],
    adicionar_evento : function(evento){
        fCalendario.eventos.push(evento);
        fCalendario.carregar(fCalendario.instancia);
    },
    remover_evento : function(id){
        fCalendario.eventos.splice(id,1);
        fCalendario.carregar(fCalendario.instancia);
    },
    scroll : function (componente,valor){
        var intervalo = setInterval(() => {
            componente.scrollBy(valor,0);
        }, 10);
        return intervalo;
    },
    unscroll : function (componente, id){
        componente.scrollTo(0,0);
        clearInterval(fCalendario.intervals[id]);
    },
    carregar : function (componente,mes,ano){
        if(fCalendario.instancia == null)
            fCalendario.instancia = componente;
        
            if(mes == undefined){
                mes = new Date().getMonth();
                mes_cache = mes + 1;
            }else
                mes--;
            
            if(ano == undefined){
                ano = new Date().getFullYear();
                ano_cache = ano;
            }

            var semana_primeiro_dia = new Date(ano, mes, 1).getDay();

            var dias = [
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
            ]

            var dia = 1;

            if(semana_primeiro_dia == 6 && fCalendario.max_dias[mes] >= 30 ||
            semana_primeiro_dia == 5 && fCalendario.max_dias[mes] >= 31){
                dias.push([null,null,null,null,null,null,null]);
            }

            for(var s = 0; s < dias.length; s++){
                for(var d = 0; d < dias[s].length;d++){
                    if(d >= semana_primeiro_dia || s > 0){
                        if(dia <= fCalendario.max_dias[mes]){
                            dias[s][d] = dia;
                            dia++;
                        }
                    }
                }
            }

            var aColocar =
            "<table class='fCalendario' id='fCalendario'>"+
                "<tr class='mes'>"+
                    "<td style='cursor:pointer' onclick='fCalendario.proximo(-1);'><center><</center></td>"+
                    "<th colspan="+(fCalendario.semanas.length - 2)+"><center>" + fCalendario.meses[mes] + "</center></th>" +
                    "<td style='cursor:pointer' onclick='fCalendario.proximo(1);'><center>></center></td>"+     
                "</tr>" +
                "<tr class='semanas'>";
                    for(var i = 0; i < fCalendario.semanas.length; i++){
                        aColocar += "<th style='width: calc(100% / "+fCalendario.semanas.length+")'><center>"+fCalendario.semanas[i]+"</center></th>";
                    }
    aColocar += "</tr>";
            for(var s = 0; s < dias.length; s++){
                aColocar += "<tr class='semana' id='semana-"+s+"'>";
                for(var d = 0; d < dias[s].length;d++){
                    if(dias[s][d] == null){
                        aColocar += '<td class="dia_disabled"><div class="dia"></div></td>';
                    }else{
                        aColocar += '<td class="dia_td" id="dia-'+dias[s][d]+'"><div class="dia">'+dias[s][d]+'</div>';
                        for(var i = 0; i < fCalendario.eventos.length;i++){
                            if(fCalendario.eventos[i].ano == ano && fCalendario.eventos[i].mes == mes + 1 && fCalendario.eventos[i].dia == dias[s][d]){
                                aColocar += '<div onmouseover="fCalendario.intervals['+i+'] = fCalendario.scroll(this,1);" onmouseout="fCalendario.unscroll(this,'+i+');" class="evento"><a  class="evento_a" href="'+fCalendario.eventos[i].url+'" style="background-color: '+fCalendario.eventos[i].cor+'">'+fCalendario.eventos[i].nome+'</a></div><br>';
                            }
                        }
                        aColocar += '</td>';
                    }
                }
                aColocar += "</tr>";
            }
aColocar += "<tr>"+
            "<td colspan="+fCalendario.semanas.length+"><small class='ano'>" + ano + "</small></td></tr></table><br>";
            componente.innerHTML = aColocar;
    }
}