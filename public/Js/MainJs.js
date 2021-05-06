btn_amg_pend_temp()
window.setInterval(function () {
    btn_amg_pend_temp()
}, 900);

lista_de_amigos()
lista_de_chats()
buscaMensagens()

function aceitar_pedido_de_amizade(id) {
    console.log(id)
    $.post("./aceitar_pedido_de_amizade", {
        "id": id
    }).always(function (data) {
        $('#exampleModal').modal('hide')
        lista_de_amigos()
    })
}

function rejeitar_pedido_de_amizade(id) {
    console.log(id)
    $.post("./rejeitar_pedido_de_amizade", {
        "id": id
    }).always(function (data) {
        $('#exampleModal').modal('hide')
        lista_de_amigos()
    })
}


function __amigos_pend_mod() {
    $.post("./pedidos_pendentes").always(function (data) {
        $("#modal_ped_pend").empty()
        data.forEach(element => {

            if (element.status == "waiting_accepted") {
                $("#modal_ped_pend").append('<h5>PENDENTES DE SEREM ACEITES (:s) :</h5>')
                $("#modal_ped_pend").append(`<img src="${element.img.replace('public/','')}" alt="imagem de perfil" width="30" height="30"></img>`)
                $("#modal_ped_pend").append(element.name)
                $("#modal_ped_pend").append('<div class="btn-group" role="group">')
                $("#modal_ped_pend").append(`<button type="button" class="btn btn-danger" onclick="rejeitar_pedido_de_amizade('${element.id}')">ELIMINAR</button>`)
                $("#modal_ped_pend").append('</div>')
            } else {
                $("#modal_ped_pend").append('<h5>POR ACEITAR:</h5>')
                $("#modal_ped_pend").append(`<img src="${element.img}" alt="imagem de perfil" width="30" height="30"></img>`)
                $("#modal_ped_pend").append(element.name)
                $("#modal_ped_pend").append('<div class="btn-group" role="group">')
                $("#modal_ped_pend").append(`<button type="button" class="btn btn-success" onclick="aceitar_pedido_de_amizade('${element.id}')">ACEITAR</button>`)
                $("#modal_ped_pend").append(`<button type="button" class="btn btn-danger" onclick="rejeitar_pedido_de_amizade('${element.id}')">REJEITAR</button>`)
                $("#modal_ped_pend").append('</div>')
            }
        })
    })
}

let pendentes_cont = 0
function btn_amg_pend_temp() {
    $.post("./pedidos_pendentes_count")
        .always(function (data) {
            if (data != pendentes_cont) {
                pendentes_cont = data
                if (pendentes_cont != 0) {
                    $('#btn_pendentes').removeClass('invisible')
                    $('#btn_pendentes_').text(data)
                } else $('#btn_pendentes').addClass('invisible')
            }
        })
}

function lista_de_amigos() {
    $.post("./lista_amigos", (data) => {
        if (JSON.stringify(data) == JSON.stringify({})) {
            $('.lista_amigos').empty()
            $(".lista_amigos").append('<p>NÃO TEM AMIGOS AINDA :C</p>')
            $(".lista_amigos").append(
                '<div class="d-grid gap-2"><button class="btn btn-primary" type="button" onclic' +
                'k="procurar_amigos()">Adicionar amigos</button></div>'
            )
        } else {
            console.log(data)
            $('.lista_amigos').empty()
            data.forEach(element => {
                $(".lista_amigos").append(`<p>${element.name} <button type="button" class="btn btn-link" onclick="apagar_amigo('${element.id}')">Apagar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg></button> </p>`)
            })

            $(".lista_amigos").append(
                '<div class="d-grid gap-2"><button class="btn btn-primary" type="button" onclic' +
                'k="procurar_amigos()">Adicionar amigos</button></div>'
            )
        }
    })
}

function apagar_amigo(id) {
    $.post("./apagar_amigo", {
        "id": id
    }).always(function (data) {
        lista_de_amigos()
    })
}

function procurar_amigos() {
    $('.lista_amigos').empty()
    $(".lista_amigos").append('<div class="input-group mb-3">')
    $(".lista_amigos").append(
        '<input type="text" id="procurar_amigos" class="form-control" aria-label="Pesqu' +
        'isar amigos" aria-describedby="button-addon2">'
    )
    $(".lista_amigos").append('<span id="_lista_amigos"></span>')
    $(".lista_amigos").append(
        '<br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
        'ck="lista_de_amigos()">Back</button></div>'
    )
    $(".lista_amigos").append('</div>')
    procurar_amigos_find()
}

function add_amigo(nome) {
    console.log(nome)
    $.post("./add_amigos", {
            name: nome
        })
        .always(function (data) {
            console.log(data)
            lista_de_amigos()
        })

}

function procurar_amigos_find() {
    $('#procurar_amigos').keyup(function () {
        $('#_lista_amigos').empty()
        if ($('#procurar_amigos').val() != "") {
            $('#_lista_amigos').append(
                '<div id="load_friends" class="spinner-border" role="status"></div>'
            )
            $.post("./find_friends", {
                friends: $('#procurar_amigos').val()
            }, (data) => {
                $('#_lista_amigos').empty()
                data.forEach(element => {
                    $("#_lista_amigos").append(`<br>${element.name}`)
                    $('#_lista_amigos').append(`<button id="add_amigo_btn" type="button" class="btn btn-info" onclick="add_amigo('${element.name}')">add</button><br>`)
                })
                $('#load_friends').remove()
            })
        }
        $('#_lista_amigos').empty()
    })
}

//CHATS ======================================================================================

function lista_de_chats() {
    $('.lista_chat').empty()
    $.post("./lista_chat", (data) => {

        if (JSON.stringify(data) == JSON.stringify([])) {
            $(".lista_chat").append('<p>NÃO TEM CONVERSAS</p>')
        }else {
            $('.lista_chat').empty()
            data.forEach(element => {
                $(".lista_chat").append(`<div class = "conversaschat" >${element}</div><br>`)
            })
        }
        $(".lista_chat").append(
            '<div class="d-grid gap-2"><button class="btn btn-primary" type="button" onclic' +
            'k="cria_chats()">Criar conversa</button></div>'
        )
    })
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
            data.forEach(element => {
                $(".lista_chat").append(`<br>${element.name}`)
                $('.lista_chat').append('<button type="button" class="btn btn-info" onclick="#">add</button>')
            })
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

function criaChatNaBaseDeDados(){
    let nomeConversa = $("#cria_chats").val();
    $.post("./criaChat", {
        nome : nomeConversa,
    }).always(function (data) {
        console.log(data)
        lista_de_chats()
    })
}

function menuToggle(){
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
}
function buscaMensagens(){
    $('.mensagem').empty()
    $.post("./lista_mensagens", (data) => {
        if (JSON.stringify(data) == JSON.stringify([])) {
            $(".mensagem").append('<p>NÃO TEM mensagens</p>')
        }else {
            data.forEach(element => {
                $('.mensagem').append('<div class= "mensagemUser"><div>' + element + '</div><div></div></div>')
            })
        }
    })
}

let socket = io();

socket.on('connect', function () {
    socket.emit('join', 'dddsdjkfh1123'); //chat room id unique to two users
})

$("#botao").click(function () {
    const hora = new Date
    let textArea = $("#exampleFormControlTextarea1").val();
    let nomeConversa = "Trabalho de grupo";
    // let me = $(".nomeChat").val();
   if (textArea) {
        $.post("./guardaMensagem", {
            nome: nomeConversa,
            message: textArea,
            nameUser: utilizador.innerHTML,
            time: hora.toLocaleTimeString()
        })
        socket.emit('message', {
            room: 'dddsdjkfh1123',
            message: textArea,
            name: utilizador.innerHTML,
            time: hora.toLocaleTimeString()
        })
        $("#exampleFormControlTextarea1").val("");
    }
})

socket.on('message', function (msg) {
    console.log(msg)
    let scroll = document.querySelector(".scrollable")
    $("#messagens").append(
        '<div class= "mensagemUser"><div>' + msg.name + ' hoje às ' + msg.time + '</div><div>' + msg.message + '</div></div>'
    )
    scroll.scrollTo(0, document.body.scrollHeight);
})

