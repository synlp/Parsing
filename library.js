(() => {
  const articles = [...document.querySelectorAll(".record")];
  const buttons = [...document.querySelectorAll("[data-topic]")];
  const structure = document.getElementById("tree-type");
  const search = document.getElementById("search");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty");
  const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const entries = articles.map(article => ({
    article,
    topics: article.dataset.topics.split("|"),
    types: article.dataset.types.split("|"),
    text: normalize([article.textContent, article.dataset.topics, article.dataset.types].join(" "))
  }));
  let topic = "";
  for (const button of buttons) {
    const value = button.dataset.topic;
    button.querySelector("span").textContent = entries.filter(entry => !value || entry.topics.includes(value)).length;
    button.addEventListener("click", () => {
      topic = value;
      update();
    });
  }
  function update() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let matched = 0;
    for (const entry of entries) {
      const visible = (!topic || entry.topics.includes(topic)) &&
        (!structure.value || entry.types.includes(structure.value)) &&
        terms.every(term => entry.text.includes(term));
      entry.article.hidden = !visible;
      if (visible) matched++;
    }
    for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.topic === topic));
    count.textContent = matched + (matched === 1 ? " paper" : " papers");
    empty.hidden = matched !== 0;
  }
  document.getElementById("reset").addEventListener("click", () => {
    search.value = "";
    structure.value = "";
    topic = "";
    update();
    search.focus();
  });
  search.addEventListener("input", update);
  structure.addEventListener("change", update);
  update();
  document.querySelectorAll("[data-enhanced]").forEach(element => element.hidden = false);
})();
