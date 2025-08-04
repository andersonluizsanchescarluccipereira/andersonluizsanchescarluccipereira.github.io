document.getElementById("rescueForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const rescue = {
    name: document.getElementById("name").value.trim(),
    type: document.getElementById("type").value,
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("description").value.trim(),
    date: new Date().toLocaleString()
  };

  // Busca os resgates existentes ou cria array vazio
  const rescues = JSON.parse(localStorage.getItem("rescues")) || [];
  rescues.push(rescue);
  localStorage.setItem("rescues", JSON.stringify(rescues));

  alert("Resgate registrado com sucesso!");

  // Limpa formulário e volta para home
  this.reset();
  window.location.href = "index.html";
});
