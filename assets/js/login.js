const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', () => {
    if (loginBtn.disabled) return;
    window.channel.send('login');
    loginBtn.innerText = 'Please wait...';
    loginBtn.disabled = true;
})

window.channel.on('loginAvailable', () => {
    loginBtn.disabled = false;
    loginBtn.innerText = 'Login with Discord';
})