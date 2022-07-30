let ws;

const roomId = document.getElementById('roomId');
function init() {
    ws = new WebSocket(`ws://${location.host}/ws`);

    ws.onopen = function () {
        ws.send(JSON.stringify({
            type: 'joinRoom',
            params: {
                roomId: roomId.value
            }
        }));
    };

    ws.onclose = function () {
        setTimeout(() => {
            init();
        }, 1000);
    };

    ws.onerror = function () {
        ws.close();
    };

    ws.onmessage = function (e) {
        const payload = JSON.parse(e.data);
        switch (payload.type) {
            case 'message':
                const msgDate = new Date(payload.params.date).toLocaleString([], {
                    year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                const messages = document.getElementById('msgs');
                const msgContainer = document.createElement('div');

                const msg = document.createElement('p');
                msg.innerHTML = msgDate + ' - ' + payload.params.content;
                msgContainer.appendChild(msg)

                messages.appendChild(msgContainer);
                break;
        }
    }
}

const msgForm = document.getElementById('msgForm');
msgForm.addEventListener('submit', e => {
    e.preventDefault();

    const msgInput = document.getElementById('msgInput');
    ws.send(JSON.stringify({
        type: 'message',
        params: {
            content: msgInput.value,
            date: Date.now()
        }
    }));

    msgInput.value = '';

});
init()