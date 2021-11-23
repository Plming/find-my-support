"use strict";

const params = new URL(document.location).searchParams;

function createCardElement(serviceDetail) {
  /*
  <div class="card bg-light mb-3" style="max-width: 18rem;">
    <div class="card-header">Header</div>
    <div class="card-body">
      <h5 class="card-title">Light card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>
  </div>
  */

  let card = document.createElement("div");
  card.classList.add("card", "h100");

  let cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header", "text-dark");
  cardHeader.textContent = serviceDetail["소관기관명"];

  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "text-dark");

  let cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = serviceDetail["서비스명"];

  let cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = serviceDetail["서비스목적"];

  let cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  let textMuted = document.createElement("small");
  textMuted.classList.add("text-muted");
  textMuted.textContent = serviceDetail["신청방법"];

  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);

  cardFooter.appendChild(textMuted);

  return card;
}

async function canServiced(serviceId) {
  const response = await fetch(
    `${base}/supportConditions?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${serviceId}&serviceKey=${encodedKey}`
  );
  const json = await response.json();

  let conditions = json.data[0];

  // TODO: api returns empty data
  if (conditions == undefined) {
    return true;
  }

  for (const [_, value] of params) {
    if (value === "") {
      continue;
    }

    if (conditions[value] !== "Y") {
      return false;
    }
  }

  return true;
}
