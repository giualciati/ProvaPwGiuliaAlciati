const container = document.getElementById("containerCards");
const filtroInput = document.getElementById("filtroNome");
const botaoLimpar = document.getElementById("limparTudo");
let tempoInativo;

function carregarVoluntarios() {
  const voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
  container.innerHTML = "";

  voluntarios.forEach((v) => {
    fetch('https://api.unsplash.com/photos/random?query=person&orientation=portrait', {
      headers: {
        Authorization: 'Client-ID N6hP5Isgcf7a-YPDZoMb3_7onRAFxTgN8WyUDkYzZiQ'
      }
    })
    .then(response => response.json())
    .then(data => {
      const imagemUrl = data.urls.small;

      const cidade = v.endereco.split(',')[2]?.trim()?.split('-')[0]?.trim(); // Extrai apenas o nome da cidade
      const urlClima = `https://goweather.herokuapp.com/weather/${encodeURIComponent(cidade)}`;

      fetch(urlClima)
        .then(resp => resp.json())
        .then(clima => {
          const temperatura = clima?.temperature || "Não disponível";

          const card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
            <img src="${imagemUrl}" alt="Foto de ${v.nome}">
            <h3>${v.nome}</h3>
            <p><strong>Email:</strong> ${v.email}</p>
            <p><strong>Telefone:</strong> ${v.telefone}</p>
            <p><strong>Endereço:</strong> ${v.endereco}, ${v.numeroEndereco}</p>
            <p><strong>Gênero:</strong> ${v.genero}</p>
            <p><strong>Temperatura atual:</strong> ${temperatura}</p>
            <button onclick="excluirVoluntario('${v.email}')">Excluir</button>
          `;
          container.appendChild(card);
        })
        .catch(error => {
          console.warn("Erro ao buscar clima", error);

          const card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
            <img src="${imagemUrl}" alt="Foto de ${v.nome}">
            <h3>${v.nome}</h3>
            <p><strong>Email:</strong> ${v.email}</p>
            <p><strong>Telefone:</strong> ${v.telefone}</p>
            <p><strong>Endereço:</strong> ${v.endereco}, ${v.numeroEndereco}</p>
            <p><strong>Gênero:</strong> ${v.genero}</p>
            <p><strong>Temperatura atual:</strong> Não disponível</p>
            <button onclick="excluirVoluntario('${v.email}')">Excluir</button>
          `;
          container.appendChild(card);
        });
    })
    .catch(error => {
      console.error("Erro ao carregar imagem", error);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="https://via.placeholder.com/160" alt="Foto padrão">
        <h3>${v.nome}</h3>
        <p><strong>Email:</strong> ${v.email}</p>
        <p><strong>Telefone:</strong> ${v.telefone}</p>
        <p><strong>Endereço:</strong> ${v.endereco}, ${v.numeroEndereco}</p>
        <p><strong>Gênero:</strong> ${v.genero}</p>
        <p><strong>Temperatura atual:</strong> Não disponível</p>
        <button onclick="excluirVoluntario('${v.email}')">Excluir</button>
      `;
      container.appendChild(card);
    });
  });
}

function excluirVoluntario(email) {
  let voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];
  voluntarios = voluntarios.filter(v => v.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem("voluntarios", JSON.stringify(voluntarios));
  carregarVoluntarios();
}

function limparTudo() {
  if (confirm("Deseja remover todos os voluntários?")) {
    localStorage.removeItem("voluntarios");
    carregarVoluntarios();
  }
}

filtroInput.addEventListener("input", () => {
  const texto = filtroInput.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    const nome = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = nome.includes(texto) ? "block" : "none";
  });
});

botaoLimpar.addEventListener("click", limparTudo);

function resetarTempo() {
  clearTimeout(tempoInativo);
  tempoInativo = setTimeout(() => {
    alert("Sessão expirada por inatividade.");
    window.location.href = "index.html";
  }, 5 * 60 * 1000);
}

window.addEventListener("mousemove", resetarTempo);
window.addEventListener("keydown", resetarTempo);
window.addEventListener("click", resetarTempo);
window.addEventListener("scroll", resetarTempo);

resetarTempo();
carregarVoluntarios();