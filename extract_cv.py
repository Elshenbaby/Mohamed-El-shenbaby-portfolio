from __future__ import annotations

from pathlib import Path
import re

PDF_PATH = Path(r"C:\Users\Msi\Desktop\shenbaby CV.pdf")


def _looks_letter_spaced(line: str) -> bool:
    tokens = [t for t in line.split(" ") if t]
    if len(tokens) < 10:
        return False
    single_alpha = sum(1 for t in tokens if len(t) == 1 and t.isalpha())
    return (single_alpha / max(1, len(tokens))) >= 0.6


def _clean_line(line: str) -> str:
    if not line.strip():
        return ""
    if _looks_letter_spaced(line):
        line = re.sub(r"(?<=\S) (?=\S)", "", line)
    line = re.sub(r"\s{2,}", " ", line)
    return line.strip()


def clean_text(raw: str) -> str:
    lines = raw.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    cleaned_lines = [_clean_line(line) for line in lines]
    cleaned = "\n".join(cleaned_lines)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned


def main() -> int:
    print("exists", PDF_PATH.exists())
    if not PDF_PATH.exists():
        print("PDF_NOT_FOUND", str(PDF_PATH))
        return 1

    try:
        from pypdf import PdfReader  # type: ignore
    except Exception as exc:
        print("IMPORT_PYPDF_FAILED", type(exc).__name__, str(exc))
        return 2

    reader = PdfReader(str(PDF_PATH))
    full_text_parts: list[str] = []

    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        print("page", i, "chars", len(text))
        full_text_parts.append(text)

    full_text = "\n\n".join(full_text_parts).strip()
    print("TOTAL_CHARS", len(full_text))
    print("---BEGIN_PREVIEW---")
    print(full_text[:2500])
    print("---END_PREVIEW---")

    out_path = Path(__file__).with_name("cv_extracted.txt")
    out_path.write_text(full_text, encoding="utf-8", errors="replace")
    print("WROTE", str(out_path))

    cleaned = clean_text(full_text)
    out_path_clean = Path(__file__).with_name("cv_extracted_clean.txt")
    out_path_clean.write_text(cleaned, encoding="utf-8", errors="replace")
    print("WROTE", str(out_path_clean))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
