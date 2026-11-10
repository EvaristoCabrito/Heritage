# Servidor local do jogo, sem cache: toda mudança nos arquivos aparece no próximo carregamento da página.
# Uso: python tools/serve.py [porta]   (padrão 8765, serve a pasta onde foi chamado)
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
