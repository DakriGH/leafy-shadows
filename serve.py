# Server di sviluppo: come http.server ma con no-cache sui moduli,
# così gli edit si vedono al primo reload (niente moduli fantasma).
import http.server
import os
import socketserver
import sys

PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 8142
os.chdir(os.path.dirname(os.path.abspath(__file__)))  # serve sempre la cartella del gioco


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, *args):
        pass  # silenzioso


# MULTITHREAD obbligatorio: il TCPServer semplice è single-thread e le
# connessioni keep-alive dei browser lo MONOPOLIZZANO — la seconda tab
# (o il P2P in due finestre) restava appesa in attesa del socket libero.
class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


with Server(('', PORTA), Handler) as httpd:
    print(f'Leafy-Shadows su http://localhost:{PORTA}')
    httpd.serve_forever()
