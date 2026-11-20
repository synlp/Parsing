(() => {
  const figure = document.querySelector("[data-syntax-figure]");
  if (!figure) return;

  const canvas = figure.querySelector("canvas");
  const context = canvas.getContext("2d");
  const caption = figure.querySelector("figcaption");
  const choices = [...figure.querySelectorAll("[data-parse]")];
  const captions = {
    constituency: "The sentence splits into the noun phrase “Birds” and the verb phrase “build nests”.",
    dependency: "The verb “build” is the root. “Birds” is its subject (nsubj) and “nests” is its object (obj)."
  };
  let representation = "constituency";

  function line(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function label(text, x, y, font) {
    context.font = font;
    context.fillText(text, x, y);
  }

  function redraw() {
    if (!context) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeStyle = "#6c8c79";
    context.fillStyle = "#244c42";
    context.lineWidth = 1.4;
    context.lineCap = "round";

    const positions = [.15 * width, .49 * width, .85 * width];
    const [birds, build, nests] = positions;
    const mono = '600 14px "Courier New", monospace';
    if (representation === "constituency") {
      const sentence = .43 * width;
      const verbPhrase = .68 * width;
      line(sentence - 7, 21, birds + 8, 41);
      line(sentence + 7, 21, verbPhrase - 8, 41);
      line(birds, 57, birds, 100);
      line(verbPhrase - 5, 57, build + 5, 100);
      line(verbPhrase + 8, 57, nests - 7, 71);
      line(nests, 88, nests, 100);
      positions.forEach(x => line(x, 119, x, 133));
      label("S", sentence, 14, mono);
      label("NP", birds, 49, mono);
      label("VP", verbPhrase, 49, mono);
      label("NP", nests, 80, mono);
      ["NNS", "VBP", "NNS"].forEach((tag, i) => label(tag, positions[i], 111, mono));
    } else {
      label("root", build, 20, mono);
      line(build, 32, build, 128);
      const arrow = x => {
        line(x, 128, x - 3.5, 122);
        line(x, 128, x + 3.5, 122);
      };
      arrow(build);
      [[birds, "nsubj"], [nests, "obj"]].forEach(([dependent, relation]) => {
        context.beginPath();
        context.moveTo(build, 123);
        context.bezierCurveTo(build, 42, dependent, 42, dependent, 128);
        context.stroke();
        arrow(dependent);
        label(relation, (build + dependent) / 2, 49, mono);
      });
    }
    ["Birds", "build", "nests"].forEach((word, i) =>
      label(word, positions[i], 146, 'italic 23px Georgia, "Times New Roman", serif')
    );
  }

  choices.forEach(button => button.addEventListener("click", () => {
    representation = button.dataset.parse;
    choices.forEach(choice => choice.setAttribute("aria-pressed", String(choice === button)));
    canvas.setAttribute("aria-label", representation === "constituency"
      ? "Phrase structure tree of Birds build nests" : "Dependency tree of Birds build nests");
    canvas.textContent = captions[representation];
    caption.textContent = captions[representation];
    redraw();
  }));
  redraw();
  if (window.ResizeObserver) new ResizeObserver(redraw).observe(figure);
  else window.addEventListener("resize", redraw);
})();
