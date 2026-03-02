fetch('http://localhost:8787/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sofish.io', password: 'Admin123!' })
}).then(r => r.text()).then(console.log).catch(console.error)
