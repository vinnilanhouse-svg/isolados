"""Importa somente os capítulos 1–9 de um PDF marcado, sem reescrever o texto.

Uso local (não faz parte do build da Vercel):
  python3 scripts/import-chapters.py "/caminho/Isolados V2.pdf"
Requer pypdf, pdfplumber e pdftotext. O PDF completo não é copiado para o site.
"""
from collections import OrderedDict
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys

import pdfplumber
from pypdf import PdfReader

source = Path(sys.argv[1])
repository = Path(__file__).resolve().parents[1]
reader = PdfReader(source)
pages = {
    (page.indirect_reference.idnum, page.indirect_reference.generation): i
    for i, page in enumerate(reader.pages)
}


def resolve(value):
    return value.get_object() if hasattr(value, 'get_object') else value


def page_index(reference):
    if not hasattr(reference, 'idnum'):
        reference = reference.indirect_reference
    return pages[(reference.idnum, reference.generation)]


def marked_content(value, inherited_page=None):
    value = resolve(value)
    if isinstance(value, list):
        for child in value:
            yield from marked_content(child, inherited_page)
    elif isinstance(value, dict):
        current_page = page_index(value['/Pg']) if '/Pg' in value else inherited_page
        if value.get('/S') == '/Figure':
            return
        if '/MCID' in value:
            yield current_page, int(value['/MCID'])
        elif '/K' in value:
            yield from marked_content(value['/K'], current_page)
    elif isinstance(value, int):
        if inherited_page is None:
            raise ValueError('Conteúdo marcado sem página de origem.')
        yield inherited_page, value


def normalize_whitespace(text):
    return ' '.join(text.split())


structure = resolve(resolve(reader.trailer['/Root']['/StructTreeRoot'])['/K'])
assert structure['/S'] == '/Document'
chapters = []
with pdfplumber.open(source) as pdf:
    for element in structure['/K']:
        element = resolve(element)
        grouped = OrderedDict()
        for page, mcid in marked_content(element):
            grouped.setdefault(page, set()).add(mcid)
        pieces = []
        for page, mcids in grouped.items():
            text = pdf.pages[page].filter(lambda obj: obj.get('mcid') in mcids).extract_text() or ''
            if text.strip():
                pieces.append(normalize_whitespace(text))
        paragraph = ' '.join(pieces)
        if not paragraph:
            continue
        heading = re.fullmatch(r'Cap\s+(\d+)(?:\s*-\s*.+)?', paragraph, re.IGNORECASE)
        if heading:
            number = int(heading.group(1))
            if number > 9:
                break
            assert number == len(chapters) + 1, 'Sequência de capítulos inesperada.'
            chapters.append({'number': number, 'title': paragraph, 'paragraphs': [], 'pages': set(grouped)})
        elif chapters:
            chapters[-1]['paragraphs'].append(paragraph)
            chapters[-1]['pages'].update(grouped)

assert [chapter['number'] for chapter in chapters] == list(range(1, 10))
raw = subprocess.check_output(['pdftotext', '-enc', 'UTF-8', str(source), '-']).decode('utf-8')
headings = list(re.finditer(r'(?m)^[ \t\f]*(?:Cap|CAP)\s+(\d+)(?:[ \t]*-[^\n]*)?[ \t]*$', raw))
assert len(headings) >= 10 and headings[9].group(1) == '10'
for i, chapter in enumerate(chapters):
    original = raw[headings[i].end():headings[i + 1].start()]
    assert normalize_whitespace(original) == ' '.join(chapter['paragraphs']), f"Texto divergente no capítulo {i + 1}."
    assert headings[i].group().strip() == chapter['title'], f"Título divergente no capítulo {i + 1}."
    assert chapter['paragraphs'], 'Capítulo vazio.'

# Só grava os arquivos depois de comparar integralmente com a segunda extração.
output = repository / 'src/chapters'
output.mkdir(exist_ok=True)
imports = []
audit = {
    'source': source.name,
    'pdfSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'lastPublishedChapter': 9,
    'verification': 'Texto e títulos comparados integralmente entre a estrutura marcada do PDF e pdftotext; somente espaços e quebras de linha são adaptados para leitura responsiva.',
    'chapters': []
}
for chapter in chapters:
    number = chapter['number']
    text = '\n\n'.join(chapter['paragraphs'])
    record = {'number': number, 'title': chapter['title'], 'text': text}
    path = output / f'{number:02}.js'
    # Parágrafos separados tornam a revisão do conteúdo mais simples.
    lines = ',\n'.join('    ' + json.dumps(p, ensure_ascii=False) for p in chapter['paragraphs'])
    path.write_text(
        '// Texto original do PDF do autor. Não corrigir ou reescrever.\n'
        'export default {\n'
        f'  number: {number},\n'
        f'  title: {json.dumps(chapter["title"], ensure_ascii=False)},\n'
        f"  text: [\n{lines}\n  ].join('\\n\\n')\n"
        '};\n', encoding='utf-8')
    imports.append(f"import chapter{number} from './chapters/{number:02}.js';")
    audit['chapters'].append({
        'number': number, 'title': chapter['title'],
        'firstPdfPage': min(chapter['pages']) + 1, 'lastPdfPage': max(chapter['pages']) + 1,
        'words': len(text.split()),
        'textSha256': hashlib.sha256(text.encode('utf-8')).hexdigest()
    })
    print(number, chapter['title'], f'({len(text.split())} palavras) — conferido')
(repository / 'src/chapters.js').write_text('\n'.join(imports) + '\n\nexport const chapters = [' + ', '.join(f'chapter{i}' for i in range(1, 10)) + '];\n', encoding='utf-8')
(repository / 'scripts/chapter-import-audit.json').write_text(json.dumps(audit, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print('Somente os capítulos 1 a 9 foram gravados. O PDF completo permanece fora do site.')
