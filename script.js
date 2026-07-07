function copiarTexto() {
    const textoParaCopiar = document.getElementById('copiar').innerText
    navigator.clipboard.writeText(textoParaCopiar)
    .then(() => {
        const mensagem = document.getElementById('mensagem')
        mensagem.style.display = 'inline'

        setTimeout(() => {
            mensagem.style.display = 'none'
        }, 2000)
    })
.catch(err => {
    console.error('Erro ao copiar: ', err)
})

}