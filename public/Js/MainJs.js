let pendentes_cont = 0
window.setInterval(function () {
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

}, 900);

lista_de_amigos()
lista_de_chats()

function __amigos_pend_mod() {
    $.post("./pedidos_pendentes").always(function (data) {
        $("#modal_ped_pend").empty()
        data.forEach(element => {
            
            if(element.status == "waiting_accepted") {
                $("#modal_ped_pend").append('<h5>PENDENTES DE SEREM ACEITES (:s) :</h5>')
                $("#modal_ped_pend").append('<img src="'+element.img+'" alt="imagem de perfil" width="30" height="30"></img>')
                $("#modal_ped_pend").append(element.name)
                $("#modal_ped_pend").append('<div class="btn-group" role="group">')
                $("#modal_ped_pend").append('<button type="button" class="btn btn-success">ACEITAR</button>')
                $("#modal_ped_pend").append('<button type="button" class="btn btn-danger">REJEITAR</button>')
                $("#modal_ped_pend").append('</div>')
            } else {
                $("#modal_ped_pend").append('<h5>POR ACEITAR:</h5>')
                $("#modal_ped_pend").append('<img src="'+element.img+'" alt="imagem de perfil" width="30" height="30"></img>')
                $("#modal_ped_pend").append(element.name)
                $("#modal_ped_pend").append('<div class="btn-group" role="group">')
                $("#modal_ped_pend").append('<button type="button" class="btn btn-success">ACEITAR</button>')
                $("#modal_ped_pend").append('<button type="button" class="btn btn-danger">REJEITAR</button>')
                $("#modal_ped_pend").append('</div>')
            }
        })
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
                $(".lista_amigos").append('<p>' + element.name + '</p>')
            })

            $(".lista_amigos").append(
                '<div class="d-grid gap-2"><button class="btn btn-primary" type="button" onclic' +
                'k="procurar_amigos()">Adicionar amigos</button></div>'
            )
            
                

            
        }
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
                    $("#_lista_amigos").append("<br>" + element.name + " ")
                    $('#_lista_amigos').append('<button id="add_amigo_btn" type="button" class="btn btn-info" onclick="add_amigo(' + "'" + element.name + "'" + ')">add</button><br>')
                })
                $('#load_friends').remove()
            })
        }
        $('#_lista_amigos').empty()
    })
}

function lista_de_chats() {
    $('.lista_chat').empty()
    $(".lista_chat").append('<p>NÃO TEM CONVERSAS</p>')
    $(".lista_chat").append(
        '<div class="d-grid gap-2"><button class="btn btn-primary" type="button" onclic' +
        'k="cria_chats()">Criar conversa</button></div>'
    )

}

function cria_chats() {
    $('.lista_chat').empty()
    $(".lista_chat").append('<p>Nome da conversa:</p>')
    $(".lista_chat").append('<input type="text" id="cria_chats" placeholder="Nome da conversa" class="form-control" aria-label="Nome da' +
        'conversa" aria-describedby="button-addon2"><br>')
    $(".lista_chat").append('Amigos que quer convidar:')
    $.post("./lista_amigos", (data) => {
        if (JSON.stringify(data) == JSON.stringify({})) {
            $(".lista_chat").append('<p>NÃO TEM AMIGOS</p>')
        } else {
            data.forEach(element => {
                $(".lista_chat").append("<br>" + element.name + " ")
                $('.lista_chat').append('<button type="button" class="btn btn-info" onclick="#">add</button>')
            })
        }
        $(".lista_chat").append(
            '<br><br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
            'ck="lista_de_chats()">Criar conversa</button></div>'
        )
        $(".lista_chat").append(
            '<br><div class="d-grid gap-2"><button type="button" class="btn btn-info" oncli' +
            'ck="lista_de_chats()">Back</button></div>'
        )
    })

}

let socket = io();

socket.on('connect', function () {
    socket.emit('join', 'dddsdjkfh1123'); //chat room id unique to two users
})

$("#botao").click(function () {
    let textArea = $("#exampleFormControlTextarea1").val();
    if (textArea) {
        socket.emit('message', {
            room: 'dddsdjkfh1123',
            message: textArea,
            name: "nome"
        });
        $("#exampleFormControlTextarea1").val("");
    }
})

socket.on('message', function (msg) {
    console.log(msg)
    let scroll = document.querySelector(".scrollable")
    $("#messagens").append(
        '<div class= "Mensagem"><div>' + utilizador.innerHTML + '</div><div>' + msg.message + '</div></div>'
    )
    scroll.scrollTo(0, document.body.scrollHeight);
})