"""
Baixa imagens encontradas no site Gira Discos.
Instalação:
    py -m pip install requests beautifulsoup4

Execução:
    py baixar_imagens.py

As imagens são salvas na pasta "imagens_giradiscos".
O script percorre páginas internas do mesmo domínio, até MAX_PAGES.
"""

import os
import re
import time
import hashlib
from urllib.parse import urljoin, urlparse, urldefrag
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

SITE = "https://giradiscos.com.br/"
OUTPUT_DIR = "imagens_giradiscos"
MAX_PAGES = 150
DELAY_SECONDS = 0.4

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ImageDownloader/1.0)"
}
session = requests.Session()
session.headers.update(HEADERS)

os.makedirs(OUTPUT_DIR, exist_ok=True)
site_host = urlparse(SITE).netloc.lower()
visited_pages = set()
image_urls = set()
queue = [SITE]


def allowed_by_robots(url):
    """Respeita as regras de robots.txt quando disponível."""
    try:
        robots_url = urljoin(SITE, "/robots.txt")
        parser = RobotFileParser()
        parser.set_url(robots_url)
        parser.read()
        return parser.can_fetch(HEADERS["User-Agent"], url)
    except Exception:
        # Se robots.txt não puder ser consultado, não bloqueia a coleta.
        return True


def clean_url(url, base):
    if not url:
        return None
    url = url.strip()
    if url.startswith(("data:", "javascript:", "mailto:", "tel:")):
        return None
    absolute = urldefrag(urljoin(base, url))[0]
    parsed = urlparse(absolute)
    if parsed.scheme not in ("http", "https"):
        return None
    return absolute


def add_srcset(value, base):
    if not value:
        return
    for item in value.split(","):
        candidate = item.strip().split()
        if candidate:
            url = clean_url(candidate[0], base)
            if url:
                image_urls.add(url)


def find_css_images(css, base):
    if not css:
        return
    # Captura url(...) em estilos inline e arquivos CSS.
    for match in re.findall(r"url\((?:['\"])?(.*?)(?:['\"])?\)", css, re.I):
        url = clean_url(match, base)
        if url:
            image_urls.add(url)


def extension_from_response(response, url):
    path_ext = os.path.splitext(urlparse(url).path)[1].lower()
    if path_ext in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg", ".bmp", ".ico"):
        return path_ext
    content_type = response.headers.get("Content-Type", "").split(";")[0].lower()
    mapping = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "image/avif": ".avif",
        "image/svg+xml": ".svg",
        "image/bmp": ".bmp",
        "image/x-icon": ".ico",
    }
    return mapping.get(content_type, ".img")


def scan_page(url):
    try:
        response = session.get(url, timeout=25)
        response.raise_for_status()
    except requests.RequestException as error:
        print(f"[PÁGINA IGNORADA] {url} — {error}")
        return

    content_type = response.headers.get("Content-Type", "").lower()
    if "text/html" not in content_type:
        return

    soup = BeautifulSoup(response.text, "html.parser")

    # Imagens comuns, imagens lazy-load e versões responsivas.
    for tag in soup.find_all(["img", "source"]):
        for attr in ("src", "data-src", "data-original", "data-lazy-src", "data-zoom-image"):
            candidate = clean_url(tag.get(attr), url)
            if candidate:
                image_urls.add(candidate)
        add_srcset(tag.get("srcset") or tag.get("data-srcset"), url)

    # Imagens em estilos inline.
    for tag in soup.find_all(style=True):
        find_css_images(tag.get("style"), url)

    # Links para páginas internas.
    for tag in soup.find_all("a", href=True):
        link = clean_url(tag["href"], url)
        if link and urlparse(link).netloc.lower() == site_host:
            if link not in visited_pages and link not in queue:
                queue.append(link)

    # Folhas CSS externas podem conter imagens de fundo.
    for tag in soup.find_all("link", rel=lambda value: value and "stylesheet" in value):
        css_url = clean_url(tag.get("href"), url)
        if not css_url:
            continue
        try:
            css_response = session.get(css_url, timeout=20)
            if css_response.ok:
                find_css_images(css_response.text, css_url)
        except requests.RequestException:
            pass

    print(f"[PÁGINA] {url}")


def download_images():
    total = len(image_urls)
    print(f"\nEncontradas {total} URLs de imagem. Iniciando downloads...\n")
    downloaded = 0

    for index, url in enumerate(sorted(image_urls), start=1):
        try:
            response = session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            content_type = response.headers.get("Content-Type", "").lower()
            if not content_type.startswith("image/"):
                continue

            ext = extension_from_response(response, url)
            digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
            filename = f"imagem_{index:04d}_{digest}{ext}"
            filepath = os.path.join(OUTPUT_DIR, filename)

            with open(filepath, "wb") as file:
                for chunk in response.iter_content(chunk_size=1024 * 64):
                    if chunk:
                        file.write(chunk)

            downloaded += 1
            print(f"[{downloaded}] {filename}")
            time.sleep(0.15)

        except requests.RequestException as error:
            print(f"[ERRO] {url} — {error}")

    print(f"\nConcluído: {downloaded} imagens salvas em '{OUTPUT_DIR}'.")


def main():
    while queue and len(visited_pages) < MAX_PAGES:
        page = queue.pop(0)
        if page in visited_pages:
            continue
        if not allowed_by_robots(page):
            print(f"[ROBOTS.TXT] Pulando: {page}")
            continue

        visited_pages.add(page)
        scan_page(page)
        time.sleep(DELAY_SECONDS)

    print(f"\nPáginas analisadas: {len(visited_pages)}")
    download_images()


if __name__ == "__main__":
    main()
