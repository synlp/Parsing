# Syntactic Parsing in the LLM Era

[Browse the research index](https://synlp.github.io/Parsing/) accompanying *Reconfiguring Parsing in the Large Language Model Era* by Yan Song, Yuanhe Tian, and Fei Xia.

The library covers direct parsing, resource construction, and application scenarios alongside foundational constituency and dependency parsers. Each record links to the original publication or preprint.

GitHub Pages serves the site from the root of the `gh-pages` branch. Open index.html in a browser to use a local copy.

To update the library, edit `papers.json` and run `python3 build.py` to regenerate `index.html`. Page text lives in `page.template.html`. The interactive example is in `diagram.html`, `diagram.js`, and `diagram.css`.

After committing changes to `main`, fast-forward `gh-pages` to the same commit and push both branches.
