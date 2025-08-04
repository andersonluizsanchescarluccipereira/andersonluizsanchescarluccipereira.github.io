document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const type = document.getElementById("type").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <strong>${name}</strong> (${type})<br>
    <em>${location}</em><br>
    ${description}
  `;

  document.getElementById("list").appendChild(listItem);

  // Limpar o formulário
  document.getElementById("form").reset();
});
