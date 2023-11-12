window.channel.send('requestData');
setInterval(() => {
    window.channel.send('requestData');
}, 60_000)

const startTime = Date.now();
let processedEarnings = [];
let earnedThisSession = 0;
window.channel.on('data', (_, data) => {
    document.getElementById('info-username').innerText = data.username;
    document.getElementById('info-coins').innerText = data.coins;
    document.getElementById('info-earningRate').innerText = data.afkAppCoinsPerMin;

    for (const earning of data.recentEarnings) {
        if (processedEarnings.includes(earning.time) || earning.time < startTime) continue;
        processedEarnings.push(earning.time);
        earnedThisSession += earning.coins;
    }

    processedEarnings = processedEarnings.filter(pe => data.recentEarnings.some(re => re.time === pe));

    document.getElementById('info-coinsThisSession').innerText = earnedThisSession;
    if (earnedThisSession === 1) document.getElementById('info-coinsThisSession-plural').innerText = '';
    else document.getElementById('info-coinsThisSession-plural').innerText = 's';
})

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    window.channel.send('logout');
});