const ws = new WebSocket(`ws://${location.host}/ws`);

ws.onmessage = function (event) {
    const payload = JSON.parse(event.data);
    switch (payload.type) {
        case 'message':
            const msgDate = new Date(payload.params.date).toLocaleString([], {
                year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const messages = document.getElementById('msgs');
            const msgContainer = document.createElement('div');
            msgContainer.classList.add('msg');

            const msg = document.createElement('p');
            msg.innerHTML = msgDate + ' - ' + payload.params.content;
            msgContainer.appendChild(msg)

            messages.appendChild(msgContainer);
            break;
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