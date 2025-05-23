function buscarEnderecoPorCEP() {
    const cep = document.getElementById("cep").value.replace(/\D/g, '');

    if (cep.length !== 8) {
        alert("CEP inválido.");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado");
                document.getElementById('endereco').value = "";
            } else {
                const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                document.getElementById("endereco").value = enderecoCompleto;
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o CEP:", error);
        });
}

function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade >= 18;
}

function validarSignUp(event) {
    event.preventDefault();

    const dataNascimento = document.getElementById("dataNascimento").value;
    const generoSelecionado = document.querySelector('input[name="gender"]:checked');
    const captcha = grecaptcha.getResponse();

    if (!validarIdade(dataNascimento)) {
        alert("Você deve ser maior de idade para se cadastrar.");
        return;
    }

    if (!generoSelecionado) {
        alert("Por favor, selecione um gênero antes de continuar.");
        return;
    }

    if (!captcha) {
        alert("Por favor, confirme que você não é um robô.");
        return;
    }

    salvarVoluntario();
}

function salvarVoluntario() {
    const generoSelecionado = document.querySelector('input[name="gender"]:checked');

    const voluntario = {
        nome: document.getElementById("txtnome").value,
        email: document.getElementById("txtemail").value.trim().toLowerCase(),
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
        numeroEndereco: document.getElementById("numeroEndereco").value,
        genero: generoSelecionado ? generoSelecionado.nextElementSibling.textContent : "Não informado"
    };

    const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];

    
    const emailJaExiste = voluntarios.some(v => v.email === voluntario.email);

    if (emailJaExiste) {
        alert("Este e-mail já está cadastrado como voluntário.");
        return;
    }

    
    voluntarios.push(voluntario);
    localStorage.setItem("voluntarios", JSON.stringify(voluntarios));

    alert("Voluntário cadastrado com sucesso!");
    window.location.href = "landingpage.html";
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".form-signUp").addEventListener("submit", validarSignUp);
});
