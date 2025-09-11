let web3;
let contract;

// 📌 Cole aqui o ABI gerado pelo Remix após compilar o contrato
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "cpfHash",
        "type": "bytes32"
      },
      {
        "internalType": "enum UrnaEletronica.Cargo",
        "name": "cargo",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "idCandidato",
        "type": "uint256"
      }
    ],
    "name": "votar",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum UrnaEletronica.Cargo",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidatos",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "nome",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "partido",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "votos",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "cpfVotou",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum UrnaEletronica.Cargo",
        "name": "cargo",
        "type": "uint8"
      }
    ],
    "name": "listarCandidatos",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nome",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "partido",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "votos",
            "type": "uint256"
          }
        ],
        "internalType": "struct UrnaEletronica.Candidato[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 📌 Cole aqui o endereço gerado pelo Remix após o deploy
const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    contract = new web3.eth.Contract(abi, contractAddress);
    console.log("✅ Conectado ao contrato:", contractAddress);
  } else {
    alert("MetaMask não encontrado. Instale e recarregue a página.");
  }
});

async function votar() {
  const cpf = document.getElementById("cpf").value.trim();
  const cargo = parseInt(document.getElementById("cargo").value);
  const numero = parseInt(document.getElementById("numero").value);

  if (cpf.length !== 11 || isNaN(numero)) {
    alert("Preencha CPF e número do candidato corretamente.");
    return;
  }

  const cpfHash = web3.utils.sha3(cpf);
  const accounts = await web3.eth.getAccounts();

  try {
    await contract.methods.votar(cpfHash, cargo, numero).send({ from: accounts[0] });
    alert("✅ Voto registrado com sucesso!");
  } catch (err) {
    if (err.message.includes("CPF ja votou")) {
      alert("❌ Este CPF já votou.");
    } else if (err.message.includes("Candidato nao encontrado")) {
      alert("❌ Número de candidato inválido.");
    } else {
      alert("Erro ao votar: " + err.message);
    }
  }
}

async function mostrarResultados() {
  const cargo = parseInt(document.getElementById("cargo").value);
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "";

  try {
    const lista = await contract.methods.listarCandidatos(cargo).call();
    lista.forEach(c => {
      const li = document.createElement("li");
      li.textContent = `🧑 ${c.nome} (${c.partido}) - Número: ${c.id} - Votos: ${c.votos}`;
      resultados.appendChild(li);
    });
  } catch (err) {
    alert("Erro ao buscar resultados: " + err.message);
  }
}
