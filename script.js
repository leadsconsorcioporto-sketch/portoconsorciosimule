function toggleFaq(button) {
    const item = button.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

function scrollToSimulador() {
    document.getElementById('simulador').scrollIntoView({ behavior: 'smooth' });
}

function playVideo() {
    const player = document.getElementById('videoPlayer');
    const iframe = document.getElementById('videoIframe');
    const thumbnail = player.querySelector('.video-thumbnail');

    if (!iframe.src) {
        iframe.src = 'https://www.youtube.com/embed/SEU_VIDEO_ID?autoplay=1&rel=0';
    }
    thumbnail.style.display = 'none';
    iframe.style.display = 'block';
}

// Modal de Simulação
const modal = document.getElementById('modalSimulacao');
const btnsAbrirModal = document.querySelectorAll('.abrir-modal');
const btnFecharModal = document.getElementById('fecharModal');

// Abrir modal
btnsAbrirModal.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Fechar modal
btnFecharModal.addEventListener('click', function () {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

// Fechar modal ao clicar fora
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Validação e envio do formulário com EmailJS
const formSimulacao = document.getElementById('formSimulacao');

formSimulacao.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const credito = document.getElementById('credito').value;

    // Validação básica
    if (!nome || !email || !telefone || !credito) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // Desabilitar botão durante envio
    const submitBtn = formSimulacao.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Preparar dados para o EmailJS
    const templateParams = {
        from_name: nome,
        from_email: email,
        phone: telefone,
        credit_amount: formatarCredito(credito),
        to_name: 'Porto Consórcios',
        message: `Nova simulação solicitada:\n\nNome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nCrédito desejado: ${formatarCredito(credito)}`
    };

    // Enviar email usando EmailJS
    emailjs.send('service_haffxw3', 'template_xm1u4fh', templateParams)
        .then(function(response) {
            console.log('Email enviado com sucesso!', response.status, response.text);
            
            // Mensagem de sucesso
            alert('Simulação solicitada com sucesso! Em breve entraremos em contato.');
            
            // Fechar modal e limpar formulário
            modal.classList.remove('active');
            document.body.style.overflow = '';
            formSimulacao.reset();
            
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        })
        .catch(function(error) {
            console.error('Erro ao enviar email:', error);
            
            // Mensagem de erro
            alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente ou entre em contato via WhatsApp.');
            
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
});

// Função auxiliar para formatar o valor do crédito
function formatarCredito(valor) {
    const valorMap = {
        '150000': 'R$ 150 mil',
        '200000': 'R$ 200 mil',
        '250000': 'R$ 250 mil',
        '300000': 'R$ 300 mil',
        '350000': 'R$ 350 mil',
        '400000': 'R$ 400 mil',
        '450000': 'R$ 450 mil',
        '500000': 'R$ 500 mil',
        '600000': 'R$ 600 mil',
        '700000': 'R$ 700 mil',
        '800000': 'R$ 800 mil',
        '900000': 'R$ 900 mil',
        '1000000': 'R$ 1 milhão',
        '1500000': 'R$ 1,5 milhão',
        '2000000': 'R$ 2 milhões',
        '2000001': 'Acima de R$ 2 milhões'
    };
    return valorMap[valor] || valor;
}

// Máscara de telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }

    e.target.value = value;
});

console.log('✅ Site Porto Consórcios carregado com EmailJS integrado!');