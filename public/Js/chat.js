var amigos_para_add = []
var socket = io.connect()
socket.on('connect', function () {})

socket.on('message', function (msg) {
    let scroll = document.querySelector(".scrollable")
    $("#messagens").append(
        '<div class= "mensagemUser"><div>' + msg.name + ' hoje às ' + msg.time + '</div><div>' + msg.message + '</div></div>'
    )
    scroll.scrollTo(0, document.body.scrollHeight);
})

lista_de_chats()

function buscaMensagens(id) {
    $('.mensagem').empty()
    $.post("./lista_mensagens", {
        id: id
    }).always(function (data) {
        let html
        if (JSON.stringify(data) != JSON.stringify([])) {
            data.forEach(element => {             
                html+='<div class= "mensagemUser"><div>' + element.owner + ' hoje às ' + element.date + '</div><div>' + element.message + '</div></div>' 
            })
        }
        $('#load_conversas').remove()
        $('.content-mensagens').append(
            `<div class="scrollable">
               
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
        

        
    })
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
                    `<div class="d-flex w-100 justify-content-between">` +
                    `<h5 class="mb-1">${element.nome}</h5>` +
                    //`<small>3 days ago</small>` +
                    `</div>` +
                    //`<p class="mb-1">Some placeholder content in a paragraph.</p>` +
                    `</a>`)
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
            buscaMensagens(id)
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
                name: utilizador.innerHTML,
                message: textArea,
                time: hora.toLocaleTimeString()
            })
            $("#exampleFormControlTextarea1").val("");
        })
    }
}