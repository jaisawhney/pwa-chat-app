window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/serviceWorker.js', {scope: '/'});
    }
});