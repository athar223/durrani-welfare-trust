"""
Build Script - Durrani Welfare Trust Management System
=====================================================
This script builds the complete Windows installer:
1. Builds the standalone .exe with PyInstaller
2. Copies updated source files into the dist
3. Compiles the Inno Setup installer (.exe setup)

Requirements:
  - Python 3.10+
  - pip install pyinstaller pillow reportlab pywebview
  - Inno Setup 6 installed (https://jrsoftware.org/isdl.php)
"""
import os
import sys
import shutil
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist', 'DWT Management System')
INTERNAL_DIR = os.path.join(DIST_DIR, '_internal')
INSTALLER_DIR = os.path.join(BASE_DIR, 'installer')
OUTPUT_DIR = os.path.join(BASE_DIR, 'installer_output')

# Inno Setup compiler paths (common install locations)
ISCC_PATHS = [
    r'C:\Program Files (x86)\Inno Setup 6\ISCC.exe',
    r'C:\Program Files\Inno Setup 6\ISCC.exe',
    r'C:\InnoSetup6\ISCC.exe',
    os.path.expanduser(r'~\AppData\Local\Programs\Inno Setup 6\ISCC.exe'),
    r'C:\Program Files (x86)\Inno Setup 5\ISCC.exe',
    r'C:\Program Files\Inno Setup 5\ISCC.exe',
]


def find_iscc():
    """Find the Inno Setup compiler."""
    for path in ISCC_PATHS:
        if os.path.exists(path):
            return path
    # Try PATH
    try:
        result = subprocess.run(['where', 'ISCC'], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip().split('\n')[0]
    except FileNotFoundError:
        pass
    return None


def step_1_generate_icon():
    """Generate application icon from logo."""
    print('\n  [1/4] Generating application icon...')
    ico_path = os.path.join(BASE_DIR, 'static', 'img', 'logo', 'app_icon.ico')
    if os.path.exists(ico_path):
        print('    Icon already exists, skipping.')
        return
    try:
        subprocess.run([sys.executable, os.path.join(BASE_DIR, 'create_icon.py')],
                      check=True, cwd=BASE_DIR)
    except subprocess.CalledProcessError:
        print('    WARNING: Could not generate icon. Using default.')


def step_2_build_exe():
    """Build the standalone exe with PyInstaller."""
    print('\n  [2/4] Building standalone application with PyInstaller...')
    print('    This may take several minutes...')
    subprocess.run([sys.executable, os.path.join(BASE_DIR, 'build_exe.py')],
                  check=True, cwd=BASE_DIR)
    print('    PyInstaller build complete.')


def step_3_sync_sources():
    """Copy updated source files into the dist directory."""
    print('\n  [3/4] Syncing source files into distribution...')

    # Sync templates
    src_templates = os.path.join(BASE_DIR, 'templates')
    dst_templates = os.path.join(INTERNAL_DIR, 'templates')
    if os.path.exists(dst_templates):
        shutil.rmtree(dst_templates)
    shutil.copytree(src_templates, dst_templates)
    print('    Templates synced.')

    # Sync static files
    src_static = os.path.join(BASE_DIR, 'static')
    dst_static = os.path.join(INTERNAL_DIR, 'static')
    if os.path.exists(dst_static):
        shutil.rmtree(dst_static)
    shutil.copytree(src_static, dst_static)
    print('    Static files synced.')

    # Sync Django app Python files
    src_app = os.path.join(BASE_DIR, 'durrani_welfare_system')
    dst_app = os.path.join(INTERNAL_DIR, 'durrani_welfare_system')
    if os.path.exists(dst_app):
        shutil.rmtree(dst_app)
    shutil.copytree(src_app, dst_app)
    print('    Application code synced.')

    # Ensure media directory exists in dist
    media_dir = os.path.join(DIST_DIR, 'media')
    os.makedirs(media_dir, exist_ok=True)
    for sub in ['staff', 'students', 'profile_images']:
        os.makedirs(os.path.join(media_dir, sub), exist_ok=True)
    print('    Media directories created.')


def step_4_build_installer():
    """Compile the Inno Setup installer."""
    print('\n  [4/4] Building Windows installer...')

    iscc = find_iscc()
    if not iscc:
        print('    WARNING: Inno Setup not found!')
        print('    To create the installer:')
        print('    1. Download Inno Setup 6 from: https://jrsoftware.org/isdl.php')
        print('    2. Install it (default location is fine)')
        print('    3. Run this script again')
        print()
        print('    Alternatively, you can open installer/setup.iss directly')
        print('    in Inno Setup and click Build > Compile.')
        return False

    iss_file = os.path.join(INSTALLER_DIR, 'setup.iss')
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f'    Using Inno Setup: {iscc}')
    result = subprocess.run([iscc, iss_file], capture_output=True, text=True, cwd=BASE_DIR)

    if result.returncode == 0:
        print('    Installer built successfully!')
        # Find the output file
        for f in os.listdir(OUTPUT_DIR):
            if f.endswith('.exe'):
                full_path = os.path.join(OUTPUT_DIR, f)
                size_mb = os.path.getsize(full_path) / (1024 * 1024)
                print(f'    Output: {full_path}')
                print(f'    Size: {size_mb:.1f} MB')
        return True
    else:
        print(f'    ERROR: Inno Setup compilation failed!')
        print(f'    {result.stderr}')
        return False


def main():
    print()
    print('  ================================================')
    print('  Durrani Welfare Trust - Installer Builder')
    print('  ================================================')

    step_1_generate_icon()
    step_2_build_exe()
    step_3_sync_sources()
    success = step_4_build_installer()

    print()
    print('  ================================================')
    if success:
        print('  BUILD COMPLETE - Installer ready!')
        print(f'  Check: {OUTPUT_DIR}')
    else:
        print('  BUILD PARTIAL - Exe built, installer needs Inno Setup.')
        print(f'  Portable app at: {DIST_DIR}')
    print('  ================================================')
    print()


if __name__ == '__main__':
    main()
