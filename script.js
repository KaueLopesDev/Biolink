/* =============================================
   script.js — Biolink Sinixtro.XL
   Código limpo, comentado, sem frameworks.
   ============================================= */

/* ── CONSTANTES CONFIGURÁVEIS ──────────────────
   Edite estas constantes sem mexer no HTML/CSS   */

/**
 * Exibe o selo "NOVO" ao lado do nome quando true.
 * Mude para true ao publicar novo conteúdo.
 * @type {boolean}
 */
const MOSTRAR_NOVO_VIDEO = false;

/**
 * Frases exibidas pelo efeito de digitação.
 * O texto original continua no HTML (SEO / leitores de tela).
 * @type {string[]}
 */
const FRASES_TYPEWRITER = [
    "Bem-vindo, bro! 💀🎮",
    "Gameplay e conteúdo geek bom? É aqui!",
    "Sinta-se em casa: aqui não tem regras",
    "e ninguém julga seu histórico de busca."
];

/* ── PREFERÊNCIAS DO SISTEMA ───────────────────
   Lidas uma vez no topo para uso em todos os módulos */

/** true se o usuário pediu animações reduzidas (acessibilidade) */
const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true se o usuário ativou economia de dados no dispositivo */
const saveData = navigator.connection?.saveData ?? false;

/* ── INICIALIZAÇÃO ─────────────────────────── */
window.addEventListener("load", () => {
    initVideo();
    initBtnSom();
    initTypewriter();
    initParticulas();
    initParallax();
    initCursor();
    initSeloNovoVideo();
});

/* ══════════════════════════════════════════════
   VÍDEO DE FUNDO
   ══════════════════════════════════════════════ */
function initVideo() {
    // Não carrega vídeo em reduced-motion ou economia de dados
    if (prefersReducedMotion || saveData) return;

    // Usa variável local (não o ID global implícito — fix B2)
    const container = document.querySelector("#midiaBackground");
    if (!container) return;

    const video = document.createElement("video");
    video.src       = "video/Fundo.mp4";
    video.autoplay  = true;
    video.muted     = true;
    video.playsInline = true;
    video.loop      = true;
    video.preload   = "metadata";          /* Carrega metadados antes, não o vídeo inteiro */
    video.poster    = "imagens/Fundo.jpeg"; /* Exibe a imagem enquanto o vídeo bufferiza */

    // Começa invisível; a transition no CSS (.6s ease) faz o fade-in — fix B3
    video.style.opacity = "0";

    video.addEventListener("canplaythrough", () => {
        video.style.opacity = "1";
        // Expõe o elemento para o botão de som
        window._videoFundo = video;
        // Exibe o botão de som agora que o vídeo está pronto
        const btn = document.getElementById("btn-som");
        if (btn) btn.style.display = "flex";
    }, { once: true });

    // Usa container (não midiaBackground global) — fix B2
    container.appendChild(video);
}

/* ══════════════════════════════════════════════
   BOTÃO DE SOM DO VÍDEO
   ══════════════════════════════════════════════ */

/** SVG path — estado mudo (padrão) */
const PATH_MUDO =
    "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z";

/** SVG path — estado com som */
const PATH_SOM =
    "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";

function initBtnSom() {
    const btn = document.getElementById("btn-som");
    if (!btn) return;

    // Oculto inicialmente; initVideo() o exibe quando o vídeo carrega
    btn.style.display = "none";

    btn.addEventListener("click", () => {
        const video = window._videoFundo;
        if (!video) return;

        video.muted = !video.muted;

        const ativo = !video.muted;
        const label = ativo ? "Desativar som do vídeo" : "Ativar som do vídeo";
        btn.setAttribute("aria-label", label);
        btn.title = label;

        // Troca o ícone SVG conforme o estado
        const path = btn.querySelector("#icone-som-path");
        if (path) path.setAttribute("d", ativo ? PATH_SOM : PATH_MUDO);
    });
}

/* ══════════════════════════════════════════════
   EFEITO DE DIGITAÇÃO (typewriter)
   ══════════════════════════════════════════════ */
function initTypewriter() {
    const el = document.getElementById("typewriter-texto");
    if (!el) return;

    // Em reduced-motion: exibe texto estático sem animação
    if (prefersReducedMotion) {
        el.textContent = FRASES_TYPEWRITER[FRASES_TYPEWRITER.length - 1];
        return;
    }

    let fraseIdx  = 0;
    let charIdx   = 0;
    let deletando = false;
    let aguardando = false;

    function digitar() {
        const frase = FRASES_TYPEWRITER[fraseIdx];

        if (aguardando) {
            aguardando = false;
            deletando  = true;
            setTimeout(digitar, 1400);
            return;
        }

        if (!deletando) {
            // Digita um caractere por vez
            el.textContent = frase.slice(0, ++charIdx);
            if (charIdx === frase.length) {
                aguardando = true;
                setTimeout(digitar, 120);
                return;
            }
        } else {
            // Apaga um caractere por vez
            el.textContent = frase.slice(0, --charIdx);
            if (charIdx === 0) {
                deletando = false;
                fraseIdx  = (fraseIdx + 1) % FRASES_TYPEWRITER.length;
            }
        }

        const delay = deletando ? 42 : 72;
        setTimeout(digitar, delay);
    }

    // Pequeno delay inicial para a UI aparecer primeiro
    setTimeout(digitar, 900);
}

/* ══════════════════════════════════════════════
   PARTÍCULAS DECORATIVAS (canvas leve)
   Pausadas em: prefers-reduced-motion, saveData,
   aba oculta e bateria baixa (<20%)
   ══════════════════════════════════════════════ */
function initParticulas() {
    if (prefersReducedMotion || saveData) return;

    const canvas = document.getElementById("particulas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const QTD = 30;
    let particulas = [];
    let animId;
    let pausado = false;

    function redimensionar() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /** Cria uma partícula com posição e cor aleatórias */
    function novaParticula(yFixo = null) {
        return {
            x:    Math.random() * canvas.width,
            y:    yFixo ?? Math.random() * canvas.height,
            raio: Math.random() * 1.4 + 0.4,
            // Mix de tonalidades roxas e brancas sutis
            cor:  Math.random() > 0.45
                  ? `rgba(167,139,250,${(Math.random() * 0.4 + 0.1).toFixed(2)})`
                  : `rgba(255,255,255,${(Math.random() * 0.22 + 0.04).toFixed(2)})`,
            vx:   (Math.random() - 0.5) * 0.28,
            vy:   -(Math.random() * 0.38 + 0.08),
            fase: Math.random() * Math.PI * 2, // fase individual para pulsação
        };
    }

    function animar() {
        if (pausado) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];
            p.fase += 0.018;

            // Pulsa o alpha individualmente
            const alpha = (0.4 + Math.sin(p.fase) * 0.4) * 0.6;
            const corPulsada = p.cor.replace(/[\d.]+\)$/, `${alpha.toFixed(2)})`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
            ctx.fillStyle = corPulsada;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            // Recicla partícula ao sair da tela
            if (p.y < -4 || p.x < -4 || p.x > canvas.width + 4) {
                particulas[i] = novaParticula(canvas.height + 4);
            }
        }

        animId = requestAnimationFrame(animar);
    }

    function pausar() {
        pausado = true;
        cancelAnimationFrame(animId);
    }

    function retomar() {
        if (pausado) {
            pausado = false;
            animar();
        }
    }

    // Pausa quando a aba fica em segundo plano (economiza CPU)
    document.addEventListener("visibilitychange", () => {
        document.hidden ? pausar() : retomar();
    });

    // Pausa com bateria baixa (< 20%) e sem carregador
    if (typeof navigator.getBattery === "function") {
        navigator.getBattery().then((bat) => {
            const checar = () => {
                bat.level < 0.2 && !bat.charging ? pausar() : retomar();
            };
            checar();
            bat.addEventListener("levelchange",   checar);
            bat.addEventListener("chargingchange", checar);
        });
    }

    window.addEventListener("resize", () => {
        redimensionar();
        particulas = Array.from({ length: QTD }, () => novaParticula());
    });

    redimensionar();
    particulas = Array.from({ length: QTD }, () => novaParticula());
    animar();
}

/* ══════════════════════════════════════════════
   PARALLAX DO AVATAR (mouse / giroscópio)
   Ativa apenas onde há suporte e permissão
   ══════════════════════════════════════════════ */
function initParallax() {
    if (prefersReducedMotion) return;

    const wrapper = document.getElementById("perfil-wrapper");
    if (!wrapper) return;

    const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (temMouse) {
        /* ── Desktop: parallax via mouse ── */
        wrapper.style.willChange = "transform";

        document.addEventListener("mousemove", (e) => {
            const cx = window.innerWidth  / 2;
            const cy = window.innerHeight / 2;
            // Inclinação limitada a ±4°
            const rotX = ((e.clientY - cy) / cy) * -4;
            const rotY = ((e.clientX - cx) / cx) *  4;
            wrapper.style.transform =
                `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });

        document.addEventListener("mouseleave", () => {
            wrapper.style.transform =
                "perspective(700px) rotateX(0deg) rotateY(0deg)";
        });

    } else if (typeof DeviceOrientationEvent !== "undefined") {
        /* ── Mobile: parallax via giroscópio ── */
        const ativarGiro = () => {
            wrapper.style.willChange = "transform";
            window.addEventListener("deviceorientation", (e) => {
                if (e.beta === null || e.gamma === null) return;
                // Limita a ±5° com fator de suavização
                const rotX = Math.max(-5, Math.min(5, e.beta  * 0.07));
                const rotY = Math.max(-5, Math.min(5, e.gamma * 0.07));
                wrapper.style.transform =
                    `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
        };

        // iOS 13+ exige interação do usuário para acessar giroscópio
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            wrapper.addEventListener("click", async () => {
                try {
                    const perm = await DeviceOrientationEvent.requestPermission();
                    if (perm === "granted") ativarGiro();
                } catch (err) {
                    console.warn("Permissão para giroscópio negada:", err);
                }
            }, { once: true });
        } else {
            ativarGiro();
        }
    }
}

/* ══════════════════════════════════════════════
   CURSOR CUSTOMIZADO (desktop com mouse)
   ══════════════════════════════════════════════ */
function initCursor() {
    const cursor = document.getElementById("cursor");
    const brilho = document.getElementById("cursor-brilho");
    if (!cursor || !brilho) return;

    // Verifica se o dispositivo tem mouse real
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let mx = 0, my = 0; // posição real do mouse
    let bx = 0, by = 0; // posição suavizada do brilho (lag)

    document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        // Ponto central: segue o mouse sem delay
        cursor.style.left = mx + "px";
        cursor.style.top  = my + "px";
    });

    // Anel externo com suavização via rAF (efeito de inércia)
    (function suavizar() {
        bx += (mx - bx) * 0.1;
        by += (my - by) * 0.1;
        brilho.style.left = bx + "px";
        brilho.style.top  = by + "px";
        requestAnimationFrame(suavizar);
    })();
}

/* ══════════════════════════════════════════════
   SELO "NOVO VÍDEO"
   ══════════════════════════════════════════════ */
function initSeloNovoVideo() {
    if (!MOSTRAR_NOVO_VIDEO) return;

    const wrapper = document.querySelector(".nome-wrapper");
    if (!wrapper) return;

    const selo = document.createElement("span");
    selo.className   = "selo-novo";
    selo.textContent = "NOVO";
    selo.setAttribute("aria-label", "Novo vídeo disponível");

    wrapper.appendChild(selo);
}

/* ══════════════════════════════════════════════
   CÓDIGO MORTO — SINALIZADO
   copiarTexto() e #copiar não são chamados pelo HTML atual
   (o link do Gmail usa mailto: diretamente).
   Mantidos para preservar histórico do criador.
   NÃO remover sem confirmar.
   ══════════════════════════════════════════════ */
function copiarTexto() {
    const el = document.getElementById("copiar");
    if (!el) return;
    navigator.clipboard
        .writeText(el.innerText)
        .then(() => {
            const msg = document.getElementById("mensagem");
            if (!msg) return;
            msg.style.display = "inline";
            setTimeout(() => { msg.style.display = "none"; }, 2000);
        })
        .catch((err) => console.error("Erro ao copiar:", err));
}