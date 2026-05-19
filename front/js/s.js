const API = 'http://localhost:3000';

async function login() {

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    try {

        const response = await fetch(`${API}/login`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        console.log(data);

        if (response.ok && data.token) {

            localStorage.setItem(
                'token',
                data.token
            );

            alert('Login realizado');

            window.location.href = 'index.html';

        } else {

            alert(data.error || 'Erro no login');
        }

    } catch (err) {

        console.log(err);

        alert('Erro ao conectar com servidor');
    }
}

async function calculate() {

    const a = Number(
        document.getElementById('a').value
    );

    const b = Number(
        document.getElementById('b').value
    );

    const operation =
        document.getElementById('operation').value;

    const token =
        localStorage.getItem('token');

    const response = await fetch(`${API}/calculate`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            a,
            b,
            operation
        })
    });

    const data = await response.json();

    document.getElementById('result').innerText =
        `Resultado: ${data.result}`;

    loadHistory();
}

async function loadHistory() {

    const token =
        localStorage.getItem('token');

    const response = await fetch(`${API}/history`, {

        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    const history =
        document.getElementById('history');

    history.innerHTML = '';

    data.forEach(item => {

        const li = document.createElement('li');

        li.innerText =
            `${item.expression} = ${item.result}
             (${new Date(item.created_at)
                .toLocaleString()})`;

        history.appendChild(li);
    });
}

async function register() {

    const username =
        document.getElementById('registerUsername').value;

    const password =
        document.getElementById('registerPassword').value;

    const response = await fetch(
        'http://localhost:3000/register',
        {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        alert('Usuário criado com sucesso');

        window.location.href = 'login.html';

    } else {

        alert(data.error);
    }
}