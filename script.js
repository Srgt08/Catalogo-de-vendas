const NUMERO_VENDEDOR = "5527996717190";

/* ========== Modais ========== */
function abrirModal(id, nomeMoto) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;

  // Se for financiamento, guarda o nome da moto para enviar junto
  if (id === "financiamento" && nomeMoto) {
    const campoMoto = document.getElementById("moto");
    if (campoMoto) campoMoto.value = nomeMoto;
  }

  modal.style.display = "flex";
}

function fecharModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (modal) modal.style.display = "none";
}

// Fechar clicando fora do conteúdo
window.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach((m) => {
    if (e.target === m) m.style.display = "none";
  });
});

// Fechar com ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((m) => (m.style.display = "none"));
  }
});

/* ========== Máscaras ==========
   Formatação: R$ 3.300,00 | 30/03/2005 | 111.111.111-11 | (27)99999-9999 */
const entradaEl    = document.getElementById("entrada");
const nascEl       = document.getElementById("nascimento");
const cpfEl        = document.getElementById("cpf");
const telefoneEl   = document.getElementById("telefone");

function maskMoedaBRL(el) {
  let v = el.value.replace(/\D/g, "");     // só dígitos
  if (!v) { el.value = ""; return; }
  v = (parseInt(v, 10) / 100).toFixed(2);  // 2 casas
  // troca ponto por vírgula
  v = v.replace(".", ",");
  // separador de milhar com ponto
  const partes = v.split(",");
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  el.value = "R$ " + partes.join(",");
}
function maskData(el) {
  let v = el.value.replace(/\D/g, "").slice(0, 8);
  if (v.length >= 5) el.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
  else if (v.length >= 3) el.value = `${v.slice(0,2)}/${v.slice(2)}`;
  else el.value = v;
}
function maskCPF(el) {
  let v = el.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  el.value = v;
}
function maskTelefone(el) {
  let v = el.value.replace(/\D/g, "").slice(0, 11); // 2 DDD + 9 dígitos
  if (v.length >= 7) el.value = `(${v.slice(0,2)})${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) el.value = `(${v.slice(0,2)})${v.slice(2)}`;
  else el.value = v;
}

// Atacha máscaras
if (entradaEl)  entradaEl.addEventListener("input", () => maskMoedaBRL(entradaEl));
if (nascEl)     nascEl.addEventListener("input",  () => maskData(nascEl));
if (cpfEl)      cpfEl.addEventListener("input",   () => maskCPF(cpfEl));
if (telefoneEl) telefoneEl.addEventListener("input", () => maskTelefone(telefoneEl));

/* ========== Validação simples antes de enviar ========== */
function campoVazio(el) {
  return !el || !el.value || el.value.trim() === "";
}
function validaFormato() {
  const erros = [];

  // Entrada precisa começar com "R$ " e ter vírgula
  if (campoVazio(entradaEl) || !/^R\$ \d{1,3}(\.\d{3})*,\d{2}$/.test(entradaEl.value))
    erros.push("Enter the down payment amount (e.g.: R$ 3.300,00).");

  // Data DD/MM/AAAA básica
  if (campoVazio(nascEl) || !/^\d{2}\/\d{2}\/\d{4}$/.test(nascEl.value))
    erros.push("Enter the date of birth (e.g.: 30/03/2005).");

  // CPF 000.000.000-00
  if (campoVazio(cpfEl) || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpfEl.value))
    erros.push("Enter the CPF (e.g.: 111.111.111-11).");

  // Telefone (27)99999-9999
  if (campoVazio(telefoneEl) || !/^\(\d{2}\)\d{5}-\d{4}$/.test(telefoneEl.value))
    erros.push("Enter the phone number (e.g.: (27)99999-9999).");

  return erros;
}

/* ========== Enviar no WhatsApp ========== */
function enviarWhatsApp() {
  const habilitacaoEl = document.getElementById("habilitacao");
  const motoEl        = document.getElementById("moto");

  const erros = validaFormato();
  if (erros.length) {
    alert("Corrija os campos:\n\n• " + erros.join("\n• "));
    return;
  }

  const mensagem = [
    "Olá, gostaria de simular um financiamento:",
    motoEl && motoEl.value ? `- Moto: ${motoEl.value}` : "",
    `- Valor de entrada: ${entradaEl.value}`,
    `- Data de nascimento: ${nascEl.value}`,
    `- CPF: ${cpfEl.value}`,
    `- Telefone: ${telefoneEl.value}`,
    `- Possui habilitação: ${habilitacaoEl ? habilitacaoEl.value : ""}`
  ].filter(Boolean).join("\n");

  const url = `https://wa.me/${NUMERO_VENDEDOR}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

/* ========== Typing Effect ========== */
function typeWriter(element, text, speed) {
  let i = 0;
  element.innerHTML = '';
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

window.addEventListener('load', () => {
  const subtitle = document.querySelector('.typed-subtitle');
  typeWriter(subtitle, 'Especialista em Motos Honda', 100);
});


