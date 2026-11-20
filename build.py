"""Rebuild the static reading list after editing papers.json or the HTML sources."""

import json
from html import escape
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent


def render_record(paper):
    url = paper["url"]
    address = urlsplit(url)
    if address.scheme != "https" or not address.netloc:
        raise ValueError(f"Expected an HTTPS publication URL for {paper['title']}")

    topics = escape("|".join(paper["topics"]))
    types = escape("|".join(paper["types"]))
    tags = escape(" · ".join([*paper["types"], paper["method"]]))
    return f"""<article class="record" data-topics="{topics}" data-types="{types}">
  <div class="record-year">{escape(str(paper['year']))}</div>
  <div class="record-body">
    <p class="record-meta">{escape(paper['authors'])} · {escape(paper['venue'])}</p>
    <h3><a href="{escape(url)}">{escape(paper['title'])}</a></h3>
    <p class="record-note">{escape(paper['note'])}</p>
    <p class="record-tags">{tags}</p>
  </div>
</article>"""


def main():
    papers = json.loads((ROOT / "papers.json").read_text(encoding="utf-8"))
    papers.sort(key=lambda paper: (-paper["year"], paper["title"].casefold()))
    template = (ROOT / "page.template.html").read_text(encoding="utf-8")
    parts = {
        "{{DIAGRAM}}": (ROOT / "diagram.html").read_text(encoding="utf-8"),
        "{{RECORDS}}": "\n".join(render_record(paper) for paper in papers),
        "{{COUNT}}": str(len(papers)),
    }
    for marker, content in parts.items():
        if marker not in template:
            raise ValueError(f"Missing template marker {marker}")
        template = template.replace(marker, content)
    (ROOT / "index.html").write_text(template, encoding="utf-8")


if __name__ == "__main__":
    main()
