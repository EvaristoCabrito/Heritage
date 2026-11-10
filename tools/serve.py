# Servidor local do jogo, sem cache: toda mudança nos arquivos aparece no próximo carregamento da página.
# Também responde /__version com a data da última mudança nos arquivos do jogo; a página usa isso
# para salvar, recarregar e voltar para a mesma partida sozinha quando o código muda.
# Uso: python tools/serve.py [porta]   (padrão 8765, serve a pasta onde foi chamado)
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

WATCH = ('.js', '.css', '.html', '.json')
SKIP = {'.git', '.claude', 'node_modules', 'work', 'tools'}


def latest_change():
    newest = 0.0
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in SKIP]
        for name in files:
            if name.endswith(WATCH):
                try:
                    newest = max(newest, os.path.getmtime(os.path.join(root, name)))
                except OSError:
                    pass
    return newest


class NoCacheHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/__version'):
            body = str(latest_change()).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, *args):
        if '/__version' not in (args[1] if len(args) > 1 else ''):
            super().log_message(*args)


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
