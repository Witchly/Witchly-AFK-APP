window.channel.send('requestData');
setInterval(() => {
    window.channel.send('requestData');
}, 60_000)

window.channel.on('data', (_, data) => {
    document.getElementById('info-username').innerText = data.username;
    document.getElementById('info-coins').innerText = data.coins;
})

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    window.channel.send('logout');
});