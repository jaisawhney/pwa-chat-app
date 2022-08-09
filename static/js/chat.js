const wsHost = location.origin.replace(/^http/, 'ws');

let ws;

(function init() {
    ws = new WebSocket(wsHost);

    ws.onclose = function () {
        setTimeout(() => {
            init();
        }, 1000);
    };

    ws.onerror = function () {
        ws.close();
    };

    ws.onmessage = function (e) {
        const data = JSON.parse(e.data);
        const [eventName, payload] = data;

        switch (eventName) {
            case 'chatMsg':
                appendChatMsg(payload);
                break;
            case 'updateRoomList':
                updateRoomList(payload);
                break;
        }
    }
}())
const messagesDiv = document.getElementById('msgs');

function appendChatMsg(payload) {
    const msgDate = new Date(payload.date).toLocaleString([], {
        hour: '2-digit', minute: '2-digit'
    });

    const msgContainer = document.createElement('div');
    const msg = document.createElement('p');

    msg.innerHTML = msgDate + ' - ' + payload.content;
    msgContainer.appendChild(msg);

    messagesDiv.appendChild(msgContainer);
}


function joinRoom(room) {
    messagesDiv.innerHTML = '';

    const fieldset = document.querySelector('#sendMsg > fieldset');
    fieldset.disabled = false

    ws.send(JSON.stringify(['joinRoom', {
        room: room
    }]));
    appendChatMsg({
        content: `INFO: You are now in the "${room}" room`,
        date: Date.now()
    });
}

const rooms = document.getElementById('rooms');
function updateRoomList(payload) {
    rooms.innerHTML = '';
    for (const room of payload.rooms) {
        const roomEl = document.createElement('p');
        roomEl.classList.add('px-2', 'm-0');
        roomEl.setAttribute('role', 'button');
        roomEl.innerHTML = '#' + room;
        roomEl.addEventListener('click', () => joinRoom(room));
        rooms.appendChild(roomEl);
    }
}

const createRoomForm = document.getElementById('createRoom');
createRoomForm.addEventListener('submit', e => {
    e.preventDefault();

    const roomTopic = document.getElementById('roomTopic');
    joinRoom(roomTopic.value)
    roomTopic.value = '';
});

const msgForm = document.getElementById('sendMsg');
msgForm.addEventListener('submit', e => {
    e.preventDefault();

    const msgInput = document.getElementById('msg');
    ws.send(JSON.stringify(['chatMsg', {
        content: msgInput.value,
        date: Date.now()
    }]));
    appendChatMsg({
        content: `(you) ${msgInput.value}`,
        date: Date.now()
    });
    msgInput.value = '';
});