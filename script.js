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


window.addEventListener("load", () => {
const video = document.createElement('video');
const container = document.querySelector(".midiaBackground");

video.src = "video/Fundo.mp4";
video.autoplay = true;
video.muted = true;
video.playsInline = true;
video.loop = true;
video.style.opacity = '0';

video.addEventListener("canplaythrough", () => {
video.style.opacity = "1";
});

midiaBackground.appendChild(video);
});