var amigos_para_add = []
var socket = io.connect()



socket.on('connect', function () {})

socket.on('message', function (msg) {
    let scroll = document.querySelector(".scrollable")
    $("#messagens").append(
        '<div class= "mensagemUser"><div> <img src="'+msg.image+'" width="50" height="50"> "' + msg.name + '" enviou hoje às ' + msg.time + `</div><p>${msg.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p></div>`

        )
    scroll.scrollTo(0,  document.querySelector(".scrollable").scrollHeight);
})

lista_de_chats()
mostraPerfil()

var qtd_de_vot = 0
function buscaMensagens (id,nome) {
    $('.mensagem').empty()
    $.post("./lista_mensagens", {
        id: id
    }).always(function (data) {
        console.log(data)
        let html = ''
        if (JSON.stringify(data) != JSON.stringify([])) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                console.log(element)
                if(element.message != null){ 
                    html+='<div class= "mensagemUser"><div> <img src="'+element.image_owner+'" width="50" height="50"> "' + element.owner + '" enviou hoje às ' + element.date + `</div><p>${element.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p></div>`
                } 
                else{
                    console.log(element.votacao[0])
                    let names = []
                    let values = []

                    html+=` <div class= "mensagemUser">
                    <div> 
                        <img src="${element.image_owner}" width="15" height="15"> "${element.owner}" enviou hoje às ${element.date} 
                    </div>
                    
                    <div class="card" style="width: 18rem;">
                        <div class="card-header">
                            Pergunta:: ${element.votacao[0].titulo}`
                            if(element.votacao[0].descrição == "") html+= `<br>Descrição:: "Não existe descrição" </div>`
                            else html += `Descrição:: ${element.votacao[0].descrição} </div>`

                    let array = element.votacao[0].opções
                    html+= `<ul class="list-group list-group-flush">`
                    for (let index = 0; index < array.length-1; index++) {
                        const element1 = array[index]

                        console.log(element1)
                        html += `
                                <li class="list-group-item">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="escolha_${qtd_de_vot}" id="escolha${index}_${qtd_de_vot}" onclick="voting_footer_update(${qtd_de_vot})">
                                        <label class="form-check-label" for="escolha${index}_${qtd_de_vot}">
                                            ${element1.name}
                                        </label>
                                    </div>
                                </li>
                                `
                        
                    }
                                    
                    html+= `        </ul>
                                    <span id="voting_footer_btn_${qtd_de_vot}"></span>
                                </div>
                            </div>`
                    
                    qtd_de_vot++
                    
                }
            }
        }
        $('#load_conversas').remove()
        $.post("./verifica_dono", {
            id: id
        }).always(function (data) {
            let lists
            data.forEach(element => {
                if(element.dono){                
                    lists = (`<li><a class="dropdown-item"><button type="button"  onclick="atualiza_chats('${id}','${nome}')">Editar conversa</button></a></li>
                    <li><a class="dropdown-item"><button type="button"  onclick="ApagaChatNaBaseDeDados('${id}')">Eliminar Conversa</button></a></li>`)
                }else{
                    lists = (`<li><a class="dropdown-item"><button type="button" onclick="sairDaConversa('${id}')">Sair da Conversa</button></a></li>`)
                }
            })
            $('.content-mensagens').append(
                `
                <nav class="navbar navbar-light bg-light">
                    <div class="container-fluid">
                        <h4>${nome}</h4>
                        <div>
                            <button type="button" class="btn btn-sm btn-primary" onclick="abrir_modal_voting('${id}')">
                                    Criar votação personalizada
                            </button>
                            <span class="dropdown">
                                
                                <a class=" dropdown btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                    Opções do chat
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink"> 
                                    <li><a class="dropdown-item" href="#">Partilhar conversa</a></li>
                                    ${lists}               
                                </ul>
                            </span>
                            <button type="button" class="btn-close" aria-label="Close"></button>
                        </div>
                    </div>
                </nav>

                <div class="scrollable">
                
                        <div id="messagens" class="mensagem">
                            
                        </div>
                    </div>

                    <div class="writtinZone">
                        <textarea class="textArea form-control" id="exampleFormControlTextarea1" rows="4"></textarea>
                        <div class="icons"> emojis e mandar ficheiros</div>
                        <button type="button" id="botao" class="send btn btn-primary btn-lg" onclick="enviar_msg_db('${id}')">ENVIAR
                        </button>
                    </div>`)
            $('#messagens').append(html)
            document.querySelector(".scrollable").scrollTo(0,  document.querySelector(".scrollable").scrollHeight);
           
        })
    })
    $('.mensagem').empty()
    $.post("./amigosNaConversa", {
        id: id
    }).always(function (data) {
        $('.lista_amigos').empty()
        $("#tituloAmigos").empty();
        $("#tituloAmigos").append('<p>Pessoas nesta conversa:</p>')
        data.forEach(element => {
            $(".lista_amigos").append(`<p>${element.name}</p>`)
        })
    })
}

function voting_footer_update(id){


    $(`#voting_footer_btn_${id}`).empty()
    $(`#voting_footer_btn_${id}`).append(`  <div class="card-footer text-end">
                                                <button type="button" class="btn btn-success">Enviar</button>
                                            </div>`
                                        )
                            

}

var opcoes_voting = 2
function mais_opcoes_voting(){
    opcoes_voting++
    if(opcoes_voting > 2){
        $("#menos_voting_btn").removeClass("invisible")
        $("#menos_voting_btn").addClass("visible")
    }
    $('#mais_forms_voting').append(
        `
        <div class="form-floating mb-3" id="opção${opcoes_voting}_voting_div">
            <input type="text" class="form-control" id="opção${opcoes_voting}_voting">
            <label for="floatingInput">Opção ${opcoes_voting}</label>
        </div>
        
        `
    )
}

function menos_opcoes_voting(){
    $(`#opção${opcoes_voting}_voting_div`).remove()
    opcoes_voting--
    if(opcoes_voting <= 2){
        $("#menos_voting_btn").removeClass("visible")
        $("#menos_voting_btn").addClass("invisible")
    }
    
}

function abrir_modal_voting(id){
    $('#criar_votacao_modal').empty()
    $('#criar_votacao_modal').append(
        `
            <div id="abrir_votacao_modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Criar votação personalizada</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="title_voting">
                                <label for="floatingInput">Titulo ..</label>
                            </div>
                            <div class="form-floating mb-3">
                                <textarea class="form-control" id="descrição_voting" style="height: 100px"></textarea>
                                <label for="floatingTextarea2">Descrição</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="opção1_voting" value="Sim">
                                <label for="floatingInput">Opção 1</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="opção2_voting" value="Não">
                                <label for="floatingInput">Opção 2</label>
                            </div>
                            <span id="mais_forms_voting"></span>
                            <button type="button" class="btn btn-primary btn-lg" onclick="mais_opcoes_voting()"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                                    height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                                </svg>
                                Mais opções 
                            </button>
                            <button id="menos_voting_btn" type="button" class="btn btn-danger btn-lg invisible" onclick="menos_opcoes_voting()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1z"/>
                                </svg>
                                Menos opções 
                            </button>

                            
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success" onclick="enviar_voting_personalizada('${id}')">Criar</button>
                        </div>
                    </div>
                </div>
            </div>
        `)
    $("#abrir_votacao_modal").modal("show")
    opcoes_voting = 2
}

function enviar_voting_personalizada(id){
    let votação = []
    let votação_ = {}
    let opção = []
    

    if($('#title_voting').val() == "") {
        $('#title_voting').addClass("is-invalid")
        return 0
    }
    else    
        votação_["titulo"] = $('#title_voting').val()
    if($('#descrição_voting').val() == "")
        votação_["descrição"] = null
    else    
        votação_["descrição"] = $('#descrição_voting').val()
    for (let index = 1; index <= opcoes_voting; index++) {
        if($(`#opção${index}_voting`).val() == "") {
            $(`#opção${index}_voting`).addClass("is-invalid")
            return 0
        }
        else {
            let opção_ = {}
            opção_["name"] = $(`#opção${index}_voting`).val()
            opção_["value"] = []
            opção.push(opção_)
        }
    }
    let opção_ = {}
    opção_["total"] = 0
    opção.push(opção_)
    votação_["opções"] = opção

    votação.push(votação_)
    console.log(votação)

    $.post("./envia_votacao", {
        id: id,
        voting: votação
    }).always(function (data) {
        /*console.log(data)
        socket.emit('message', {
            room: id,
            name: data.name,
            image: data.image,
            message: textArea,
            time: hora.toLocaleTimeString()
        })*/
    })

}

function mostraPerfil(){
    $('.content-mensagens').empty()
    $('.content-mensagens').append(`<h1>Bem vindo ao milos ` + utilizador.innerHTML + `</h1>`)
    $('.content-mensagens').append('<div class="d-flex justify-content-center"><img  class = "imagePerfil" src="'+$('.UserImage').attr('src')+'"height = "200px" width = "200px"></img></div>')
    // $('.content-mensagens').append(`<div class = "nomeUtilizadorPerfil">Nome do Utilizador: ` + utilizador.innerHTML + `</div>`)
    $('.content-mensagens').append(`<h2>Faça novos amigos e inicie novas conversas</h2>`)
}
function criaChatNaBaseDeDados() {
    let nomeConversa = $("#cria_chats").val();
    $.post("./criaChat", {
        nome: nomeConversa,
        membros: amigos_para_add
    }).always(function (data) {
        console.log(data)
        lista_de_chats()
    })
}
function atualizaChatNaBaseDeDados(id) {
    let nomeConversa = $("#cria_chats").val();
    $.post("./atualizaChat", {
        id: id,
        nome: nomeConversa,
        membros: amigos_para_add
    }).always(function (data) {
        console.log(data)
        lista_de_chats()
    })
}
function sairDaConversa(idConversa) {
    $.post("./sairchat", {
        id: idConversa
    }).always(function (data) {
        location.reload()
    })
}
function ApagaChatNaBaseDeDados(id) {
    $.post("./ApagaChat", {
        id: id,
    }).always(
        location.reload()
    )
}
function lista_de_chats() {
    $('.lista_chat').empty()
    $.post("./lista_chat", (data) => {

        if (JSON.stringify(data) == JSON.stringify([])) {
            $(".lista_chat").append('<p>NÃO TEM CONVERSAS</p>')
        } else {
            $('.lista_chat').empty()
            data.forEach(element => {
                console.log(element)
                $(".lista_chat").append(`<a id="${element.id}" class="list-group-item list-group-item-action " aria-current="true" onclick="abrir_conversa('${element.id}','${element.nome}')">` +
                    `<div class="d-flex justify-content-between">` +
                    `<h5 class="mb-1">${element.nome}</h5>` +
                    `</div>`)

            })
        }
        $(".lista_chat").append(
            '<br><div class="d-grid gap-2"><button class="btn btn-primary" type="button" onclic' +
            'k="cria_chats()">Criar conversa</button></div>'
        )
    })
}

function rejeitar_conv_conversa(id) {
    $.post("./rejeitar_conv_conversa", {
        id: id
    }).always(function (data) {
        console.log(data)
        lista_de_chats()
    })
}

function aceitar_conv_conversa(id) {
    $.post("./aceitar_conv_conversa", {
        id: id
    }).always(function (data) {
        console.log(data)
        lista_de_chats()
    })
}




function abrir_conversa(id, nome) {
    //$(`#${id}`).addClass("active")
    let resposta
    $.post("./abrir_conversa", {
        id: id,
    }).always(function (data) {
        resposta = data
        //console.log(data)
        if (resposta.status == "pending_to_be_accepted") {
            $('#_aceitar_convite_title').append(`Nome do chat: ${nome}`)
            $('#_aceitar_convite_footer').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="rejeitar_conv_conversa('${id}')">Rejeito</button>`)
            $('#_aceitar_convite_footer').append(`<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="aceitar_conv_conversa('${id}')">Aceito</button>`)
            $('#_aceitar_convite').modal("show")
        } else if (resposta.status == "accepted") {
            $('.content-mensagens').empty()
            $('.content-mensagens').append(`<span id="load_conversas" class="spinner-border spinner" role="status"></span>`)
            socket.emit('switchRoom', id)
            buscaMensagens(id,nome)
            
        }
    })
}

function add_amigo_criar_chat(id, nome) {
    amigos_para_add.push(id)
    $(`#add_${id}`).empty()
    $(`#add_${id}`).append(`<p id="add_${id}">${nome}<button " type="button" class="btn btn-link" onclick="rm_amigo_criar_chat('${id}','${nome}')">Remover <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg></button></p>`)

    //console.log(amigos_para_add)
}

function rm_amigo_criar_chat(id, nome) {

    for (var i = 0; i < amigos_para_add.length; i++) {

        if (amigos_para_add[i] == id) {

            amigos_para_add.splice(i, 1);
        }

    }
    //amigos_para_add.push(id)
    $(`#add_${id}`).empty()
    $(`#add_${id}`).append(`<p id="add_${id}">${nome}<button " type="button" class="btn btn-link" onclick="add_amigo_criar_chat('${id}','${nome}')">Adicionar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg></button></p>`)

    //console.log(amigos_para_add)
}

function cria_chats() {
    $('.lista_chat').empty()
    $(".lista_chat").append('<p>Nome da conversa:</p>')
    $(".lista_chat").append('<input type="text" id="cria_chats" placeholder="Nome da conversa" class="nomeChat form-control" aria-label="Nome da' +
        'conversa" aria-describedby="button-addon2"><br>')
    $(".lista_chat").append('Amigos que quer convidar:')
    $.post("./lista_amigos", (data) => {
        if (JSON.stringify(data) == JSON.stringify([])) {
            $(".lista_chat").append('<p>NÃO TEM AMIGOS</p>')
        } else {
            let amigos_add_html = `<span id="amigos_add">`
            data.forEach(element => {

                amigos_add_html += `<p id="add_${element.id}">${element.name}<button " type="button" class="btn btn-link" onclick="add_amigo_criar_chat('${element.id}','${element.name}')">Adicionar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                    </svg></button></p>`
            })
            amigos_add_html += `</span>`
            $(".lista_chat").append(amigos_add_html)

        }
        $(".lista_chat").append(
            '<br><br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
            `ck="criaChatNaBaseDeDados()">Criar conversa</button></div>`
        )
        $(".lista_chat").append(
            '<br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
            'ck="lista_de_chats()">Back</button></div>'
        )
    })
}

function atualiza_chats(id, nome) {
    $('.lista_chat').empty()
    $(".lista_chat").append('<p>Mude o nome da conversa:</p>')
    $(".lista_chat").append('<input type="text" id="cria_chats" class="nomeChat form-control" aria-label="Mude o nome da' +
        'conversa" aria-describedby="button-addon2" value = "'+ nome+ '"><br>')
    $(".lista_chat").append('Amigos que quer convidar:')
    $.post("./verificaSeAmigoEstaNaConversa", {
        id: id,
    }).always(function (data) {
        if (JSON.stringify(data) == JSON.stringify([])) {
            $(".lista_chat").append('<p>NÃO TEM AMIGOS PARA ADICIONAR</p>')
        } else {
           
            let amigos_add_html = `<span id="amigos_add">`
            data.forEach(element => {

                amigos_add_html += `<p id="add_${element.id}">${element.name}<button " type="button" class="btn btn-link" onclick="add_amigo_criar_chat('${element.id}','${element.name}')">Adicionar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                    </svg></button></p>`
            })
            amigos_add_html += `</span>`
            $(".lista_chat").append(amigos_add_html)

        }
        $(".lista_chat").append(
            '<br><br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
            `ck="atualizaChatNaBaseDeDados('${id}')">Guardar alterações</button></div>`
        )
        $(".lista_chat").append(
            '<br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
            'ck="lista_de_chats()">Back</button></div>'
        )
    })
}

function enviar_msg_db(id) {
    const hora = new Date
    let textArea = $("#exampleFormControlTextarea1").val()
    // let me = $(".nomeChat").val();
    //console.log(socket[index])
    //console.log(utilizador.innerHTML)
    if (textArea) {
        $.post("./guardaMensagem", {
            id: id,
            //nome: nomeConversa,
            message: textArea
            //nameUser: utilizador.innerHTML,
            //time: hora.toLocaleTimeString()
        }).always(function (data) {
            console.log(data)
            socket.emit('message', {
                room: id,
                name: data.name,
                image: data.image,
                message: textArea,
                time: hora.toLocaleTimeString()
            })
            $("#exampleFormControlTextarea1").val("");
        })
    }
}