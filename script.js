javascript

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Atualiza automaticamente o ano do rodapé.
  document.querySelectorAll("#year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Menu responsivo.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
        menuButton.textContent = "☰";
      });
    });
  }

  // Impede a seleção de datas anteriores ao dia atual.
  const dateInput = document.querySelector("#data");

  if (dateInput) {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localDate;
  }

  // Cria resultados seguros usando elementos DOM, sem inserir
  // dados digitados pelo usuário diretamente como HTML.
  function showResult(container, title, lines, extraText) {
    container.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = title;
    container.appendChild(heading);

    lines.forEach((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      container.appendChild(paragraph);
    });

    if (extraText) {
      const note = document.createElement("p");
      note.textContent = extraText;
      container.appendChild(note);
    }

    container.hidden = false;
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Formulário de solicitação de agendamento.
  const bookingForm = document.querySelector("#booking-form");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingForm.reportValidity()) return;

      const data = new FormData(bookingForm);
      const result = document.querySelector("#booking-result");

      const dateParts = String(data.get("data")).split("-");
      const formattedDate = dateParts.length === 3
        ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
        : String(data.get("data"));

      showResult(
        result,
        "Solicitação preparada! 💙",
        [
          `Tutor: ${data.get("tutor")}`,
          `Pet: ${data.get("pet")} (${data.get("especie")})`,
          `Serviço: ${data.get("servico")}`,
          `Data desejada: ${formattedDate}`,
          `Período: ${data.get("horario")}`,
          `Contato: ${data.get("telefone")} | ${data.get("email")}`
        ],
        "Esta é apenas uma prévia. Nenhuma consulta foi marcada e os dados não foram enviados ou armazenados. Entre em contato com a clínica para confirmar a disponibilidade."
      );

      const extra = String(data.get("mensagem") || "").trim();

      if (extra) {
        const paragraph = document.createElement("p");
        paragraph.textContent = `Observações: ${extra}`;
        result.appendChild(paragraph);
      }

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "btn";
      copyButton.textContent = "Copiar resumo";

      copyButton.addEventListener("click", async () => {
        const summary = Array.from(result.querySelectorAll("h3, p"))
          .map((element) => element.textContent)
          .join("\n");

        try {
          await navigator.clipboard.writeText(summary);
          copyButton.textContent = "Resumo copiado!";
        } catch {
          copyButton.textContent =
            "Cópia indisponível neste navegador. Selecione o texto manualmente.";
        }
      });

      result.appendChild(copyButton);
    });
  }

  // Formulário de contato demonstrativo.
  const contactForm = document.querySelector("#contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const result = document.querySelector("#contact-result");

      showResult(
        result,
        "Mensagem preparada! 💙",
        [
          `Nome: ${data.get("nome")}`,
          `E-mail: ${data.get("email")}`,
          `Assunto: ${data.get("assunto")}`,
          `Mensagem: ${data.get("mensagem")}`
        ],
        "A mensagem ainda não foi enviada. Para receber mensagens de verdade, conecte o formulário a um serviço de envio ou back-end."
      );

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "btn";
      copyButton.textContent = "Copiar mensagem";

      copyButton.addEventListener("click", async () => {
        const summary = Array.from(result.querySelectorAll("h3, p"))
          .map((element) => element.textContent)
          .join("\n");

        try {
          await navigator.clipboard.writeText(summary);
          copyButton.textContent = "Mensagem copiada!";
        } catch {
          copyButton.textContent =
            "Cópia indisponível. Selecione o texto manualmente.";
        }
      });

      result.appendChild(copyButton);
    });
  }
});