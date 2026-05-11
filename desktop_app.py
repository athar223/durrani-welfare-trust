"""
Durrani Welfare Trust - Desktop Application
Native desktop window with DWT branding using PyQt6.
"""
import os
import sys
import time
import socket
import threading

# Detect frozen exe
if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(sys.executable)
    INTERNAL_DIR = os.path.join(BASE_DIR, '_internal')
    sys.path.insert(0, INTERNAL_DIR)
    sys.path.insert(0, BASE_DIR)
    os.chdir(INTERNAL_DIR)
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    INTERNAL_DIR = BASE_DIR
    sys.path.insert(0, BASE_DIR)
    os.chdir(BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'durrani_welfare_system.settings')

# Data directory
if getattr(sys, 'frozen', False):
    DATA_DIR = os.path.join(os.environ.get('LOCALAPPDATA', os.path.expanduser('~')), 'DWT Management System')
else:
    DATA_DIR = BASE_DIR
os.makedirs(DATA_DIR, exist_ok=True)

LOCK_FILE = os.path.join(DATA_DIR, '.dwt_running.lock')


def is_already_running():
    if os.path.exists(LOCK_FILE):
        try:
            with open(LOCK_FILE, 'r') as f:
                port = int(f.read().strip())
            with socket.create_connection(('127.0.0.1', port), timeout=1):
                return port
        except (ConnectionRefusedError, OSError, ValueError):
            try:
                os.remove(LOCK_FILE)
            except OSError:
                pass
    return None


def create_lock(port):
    try:
        with open(LOCK_FILE, 'w') as f:
            f.write(str(port))
    except OSError:
        pass


def remove_lock():
    try:
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
    except OSError:
        pass


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def wait_for_server(port, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=1):
                return True
        except (ConnectionRefusedError, OSError):
            time.sleep(0.3)
    return False


def setup_database():
    import django
    django.setup()
    from django.core.management import call_command
    call_command('migrate', '--run-syncdb', verbosity=0)
    from durrani_welfare_system.core.models import User
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin', password='admin123',
            email='admin@dwtrust.org', first_name='Admin',
            last_name='User', role='admin', phone='0300-1234567'
        )


def run_server(port):
    import django
    django.setup()
    from django.core.wsgi import get_wsgi_application
    from django.contrib.staticfiles.handlers import StaticFilesHandler
    from wsgiref.simple_server import make_server, WSGIRequestHandler

    class QuietHandler(WSGIRequestHandler):
        def log_message(self, format, *args):
            pass

    app = StaticFilesHandler(get_wsgi_application())
    server = make_server('127.0.0.1', port, app, handler_class=QuietHandler)
    server.serve_forever()


def get_icon_path():
    """Find the DWT icon file."""
    paths = [
        os.path.join(BASE_DIR, 'app_icon.ico'),
        os.path.join(INTERNAL_DIR, 'static', 'img', 'logo', 'app_icon.ico'),
        os.path.join(BASE_DIR, 'static', 'img', 'logo', 'app_icon.ico'),
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    return None


def run_qt_app(url):
    """Run the DWT desktop window using PyQt6."""
    from PyQt6.QtWidgets import QApplication, QMainWindow
    from PyQt6.QtWebEngineWidgets import QWebEngineView
    from PyQt6.QtCore import QUrl, QTimer
    from PyQt6.QtGui import QIcon

    app = QApplication(sys.argv)
    app.setApplicationName('DWT Management System')
    app.setOrganizationName('Durrani Welfare Trust')

    # Set DWT icon on the app
    icon_path = get_icon_path()
    if icon_path:
        icon = QIcon(icon_path)
        app.setWindowIcon(icon)

    # Create main window
    window = QMainWindow()
    window.setWindowTitle('DWT - Durrani Welfare Trust Management System')
    window.setMinimumSize(900, 600)
    window.resize(1280, 800)
    if icon_path:
        window.setWindowIcon(QIcon(icon_path))

    # Create web view - load server URL directly
    web = QWebEngineView()
    window.setCentralWidget(web)

    # Try loading the server URL, retry until ready
    def try_load():
        web.load(QUrl(url))

    # Check if server is ready, then load
    def check_and_load():
        try:
            with socket.create_connection(('127.0.0.1', int(url.split(':')[-1])), timeout=0.5):
                try_load()
                return
        except (ConnectionRefusedError, OSError):
            QTimer.singleShot(500, check_and_load)

    check_and_load()

    # Center on screen
    screen = app.primaryScreen().geometry()
    x = (screen.width() - 1280) // 2
    y = (screen.height() - 800) // 2
    window.move(max(0, x), max(0, y))

    window.show()
    app.exec()


def main():
    # If already running, open new window to existing instance
    existing_port = is_already_running()
    if existing_port:
        url = f'http://127.0.0.1:{existing_port}'
        try:
            run_qt_app(url)
        except Exception:
            import webbrowser
            webbrowser.open(url)
        return

    port = find_free_port()
    url = f'http://127.0.0.1:{port}'

    # Setup database
    try:
        setup_database()
    except Exception as e:
        try:
            from PyQt6.QtWidgets import QApplication, QMessageBox
            app = QApplication(sys.argv)
            QMessageBox.critical(None, 'DWT - Error', f'Database error:\n{e}')
        except Exception:
            pass
        sys.exit(1)

    # Create lock and start server
    create_lock(port)
    server_thread = threading.Thread(target=run_server, args=(port,), daemon=True)
    server_thread.start()

    # Open native DWT window
    try:
        run_qt_app(url)
    except Exception:
        import webbrowser
        if wait_for_server(port):
            webbrowser.open(url)
        try:
            while True:
                time.sleep(1)
        except (KeyboardInterrupt, EOFError):
            pass

    # Cleanup
    remove_lock()


if __name__ == '__main__':
    main()
