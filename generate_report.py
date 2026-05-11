"""Generate a detailed PDF report of all work done on the DWT project."""
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white, black, grey
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'DWT_Project_Report.pdf')

DWT_GREEN = HexColor('#1a6b3c')
DWT_DARK = HexColor('#0f3d22')
DWT_LIGHT = HexColor('#e8f5ee')
LIGHT_GREY = HexColor('#f5f5f5')

# Custom styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle', parent=styles['Title'],
    fontSize=22, textColor=white, alignment=TA_CENTER,
    spaceAfter=4, fontName='Helvetica-Bold'
)
subtitle_style = ParagraphStyle(
    'Subtitle', parent=styles['Normal'],
    fontSize=12, textColor=white, alignment=TA_CENTER,
    spaceAfter=2
)
h1_style = ParagraphStyle(
    'H1', parent=styles['Heading1'],
    fontSize=16, textColor=DWT_DARK, spaceBefore=14, spaceAfter=8,
    fontName='Helvetica-Bold', borderPadding=4
)
h2_style = ParagraphStyle(
    'H2', parent=styles['Heading2'],
    fontSize=13, textColor=DWT_GREEN, spaceBefore=10, spaceAfter=6,
    fontName='Helvetica-Bold'
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontSize=10, textColor=black, alignment=TA_JUSTIFY,
    spaceAfter=6, leading=14
)
bullet_style = ParagraphStyle(
    'Bullet', parent=body_style,
    leftIndent=20, bulletIndent=8, spaceAfter=4
)
code_style = ParagraphStyle(
    'Code', parent=styles['Normal'],
    fontSize=8, textColor=DWT_DARK, fontName='Courier',
    backColor=LIGHT_GREY, borderPadding=4, leftIndent=10
)


def header_banner(text, subtitle=None):
    """Create a green banner with white text."""
    data = [[Paragraph(text, title_style)]]
    if subtitle:
        data.append([Paragraph(subtitle, subtitle_style)])
    t = Table(data, colWidths=[16 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DWT_GREEN),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    return t


def section_header(text):
    """Create a section header with green underline."""
    data = [[Paragraph(text, h1_style)]]
    t = Table(data, colWidths=[16 * cm])
    t.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 2, DWT_GREEN),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    return t


def fix_table(rows):
    """Create a table for documenting fixes."""
    data = [['#', 'Issue', 'File', 'Status']]
    for i, (issue, file_path, status) in enumerate(rows, 1):
        data.append([
            str(i),
            Paragraph(issue, body_style),
            Paragraph(file_path, code_style),
            status
        ])
    t = Table(data, colWidths=[1 * cm, 6 * cm, 6.5 * cm, 2.5 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (3, 0), (3, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 1), (-1, -1), white),
        ('GRID', (0, 0), (-1, -1), 0.5, grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
        ('TEXTCOLOR', (3, 1), (3, -1), DWT_GREEN),
        ('FONTNAME', (3, 1), (3, -1), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return t


def info_box(label, value):
    """Create an info row."""
    t = Table([[label, value]], colWidths=[5 * cm, 11 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), DWT_LIGHT),
        ('TEXTCOLOR', (0, 0), (0, 0), DWT_DARK),
        ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 0.5, grey),
    ]))
    return t


def build():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=2.5 * cm, rightMargin=2.5 * cm,
        topMargin=2 * cm, bottomMargin=2 * cm,
        title='DWT Project - Development Report'
    )

    story = []

    # ==================== COVER ====================
    story.append(Spacer(1, 3 * cm))
    story.append(header_banner(
        'DURRANI WELFARE TRUST',
        'Management Information System &mdash; Development Report'
    ))
    story.append(Spacer(1, 1 * cm))

    cover_info = [
        ('Project Name:', 'DWT Management System'),
        ('Version:', '1.0.0'),
        ('Report Date:', datetime.now().strftime('%B %d, %Y')),
        ('Technology:', 'Python 3.14 + Django 4.2 + PyQt6 + SQLite'),
        ('Deployment:', 'Standalone Windows Installer (.exe)'),
        ('Database:', 'SQLite (offline, local storage)'),
        ('UI Framework:', 'Tabler (Bootstrap 5) + Custom DWT Theme'),
    ]
    for label, value in cover_info:
        story.append(info_box(label, value))
        story.append(Spacer(1, 0.15 * cm))

    story.append(Spacer(1, 1 * cm))
    story.append(Paragraph(
        '<b>Scope:</b> Complete review and fix of the Staff module, '
        'system-wide bug fixes, and creation of a professional Windows installer '
        'with native desktop application launcher.',
        body_style
    ))

    story.append(PageBreak())

    # ==================== EXECUTIVE SUMMARY ====================
    story.append(section_header('1. Executive Summary'))
    story.append(Paragraph(
        'This report documents the complete development work performed on the '
        '<b>Durrani Welfare Trust Management System</b>. The work covered three main areas:',
        body_style
    ))
    story.append(Paragraph(
        '<b>1.</b> Fixing the Staff module to ensure all data is properly recorded, stored, and managed.',
        bullet_style
    ))
    story.append(Paragraph(
        '<b>2.</b> Conducting a system-wide review to identify and resolve all bugs in other modules.',
        bullet_style
    ))
    story.append(Paragraph(
        '<b>3.</b> Building a professional Windows installer with native desktop window, '
        'DWT branding, and offline capability.',
        bullet_style
    ))
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph(
        'The system is now stable, professional, fully offline-capable, and deployable to '
        'any Windows 10/11 PC via a single setup file (no Python installation required on client PCs).',
        body_style
    ))

    # ==================== STAFF MODULE FIXES ====================
    story.append(section_header('2. Staff Module Fixes'))
    story.append(Paragraph(
        'The Staff section had several missing fields and outdated labels. '
        'All issues have been resolved as listed below:',
        body_style
    ))
    story.append(Spacer(1, 0.3 * cm))

    staff_fixes = [
        (
            '<b>Form template missing fields:</b> The Add/Edit Staff form did not display '
            'the Supervisor and Base Salary fields, even though they existed in the database model.',
            'templates/staff/staff_form.html',
            'FIXED'
        ),
        (
            '<b>Detail page missing fields:</b> The Staff Detail page did not show the Supervisor '
            'name or Base Salary (PKR) on the staff profile.',
            'templates/staff/staff_detail.html',
            'FIXED'
        ),
        (
            '<b>CSV export incomplete:</b> The Export CSV feature was missing the Supervisor '
            'and Base Salary columns in the exported file.',
            'durrani_welfare_system/staff/views.py',
            'FIXED'
        ),
        (
            '<b>Outdated label:</b> The Staff page header still said "Staff &amp; Volunteers" '
            'even though Volunteers is now a separate module.',
            'templates/staff/staff_list.html',
            'FIXED'
        ),
        (
            '<b>Module description outdated:</b> Internal docstrings and URL configuration '
            'still referenced the legacy combined Staff &amp; Volunteers module.',
            'durrani_welfare_system/staff/urls.py + views.py',
            'FIXED'
        ),
    ]
    story.append(fix_table(staff_fixes))

    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph('<b>Staff Module Features (fully working):</b>', h2_style))
    features = [
        'Add, Edit, View, and Delete staff members',
        'All fields stored: Name, Role, Contact, Email, Address, Joining Date, Supervisor, Base Salary, Profile Image, Active Status, Notes',
        'Daily attendance marking (Present / Absent / Leave) with remarks',
        'Bulk attendance &mdash; "Mark All Present" / "Mark All Absent" buttons',
        'Search staff by name with pagination (20 per page)',
        'Export complete staff list to CSV with all fields',
        'Attendance history per staff member (last 50 records)',
        'Profile image upload and display',
    ]
    for f in features:
        story.append(Paragraph(f'&#8226; {f}', bullet_style))

    story.append(PageBreak())

    # ==================== SYSTEM-WIDE FIXES ====================
    story.append(section_header('3. System-Wide Bug Fixes'))
    story.append(Paragraph(
        'A complete review of all modules was conducted. Critical bugs found and fixed:',
        body_style
    ))
    story.append(Spacer(1, 0.3 * cm))

    system_fixes = [
        (
            '<b>CRITICAL: Dashboard crash (NameError)</b> &mdash; The dashboard view used '
            '<i>models_Q</i> on line 98 but the import statement was on line 158, '
            'causing the dashboard to crash on every load.',
            'durrani_welfare_system/core/views.py',
            'FIXED'
        ),
        (
            '<b>File handle leak in backup view</b> &mdash; The database backup feature '
            'opened the SQLite file without properly closing it, leaking file handles.',
            'durrani_welfare_system/core/views.py',
            'FIXED'
        ),
        (
            '<b>Volunteer attendance display bug</b> &mdash; The __str__ method used the raw '
            'status code (e.g. "present") instead of the human-readable label (e.g. "Present").',
            'durrani_welfare_system/volunteers/models.py',
            'FIXED'
        ),
        (
            '<b>Database path on installed PC</b> &mdash; When installed to Program Files, '
            'the app could not write to the database (read-only location). Database now stored '
            'in user\'s LocalAppData (writable, persists per user).',
            'durrani_welfare_system/settings.py',
            'FIXED'
        ),
        (
            '<b>Console window visible on launch</b> &mdash; The app showed an unwanted black '
            'CMD window. Now runs as a clean windowed application.',
            'build_exe.py (--windowed flag)',
            'FIXED'
        ),
        (
            '<b>Port conflicts on restart</b> &mdash; Previous instance could leave stale '
            'lock files. Added lock file management to prevent duplicate instances and clean up properly.',
            'desktop_app.py',
            'FIXED'
        ),
        (
            '<b>App opened in browser instead of native window</b> &mdash; pywebview '
            '(old library) was incompatible with Python 3.14. Replaced with PyQt6 + WebEngine for '
            'a true native desktop window.',
            'desktop_app.py + build_exe.py',
            'FIXED'
        ),
        (
            '<b>Generic shortcut icon</b> &mdash; Desktop and Start Menu shortcuts showed '
            'a generic icon instead of the DWT logo. Now uses app_icon.ico everywhere.',
            'installer/setup.iss',
            'FIXED'
        ),
    ]
    story.append(fix_table(system_fixes))

    story.append(PageBreak())

    # ==================== MODULES OVERVIEW ====================
    story.append(section_header('4. Modules Reviewed (All Working)'))
    story.append(Paragraph(
        'All 11 modules of the system were reviewed and verified to be functioning correctly:',
        body_style
    ))

    modules_data = [
        ['Module', 'Description', 'Status'],
        ['Dashboard', 'Real-time analytics, charts, recent activity, financial summary', 'Working'],
        ['Students', 'Student records, attendance, education tracking, search & export', 'Working'],
        ['Staff', 'Staff records, supervisors, salary, attendance, CSV export', 'Working (Fixed)'],
        ['Volunteers', 'Volunteer profiles, skills, availability, attendance', 'Working (Fixed)'],
        ['Drivers', 'Driver records, vehicle assignment, trip logs, fuel logs, maintenance', 'Working'],
        ['Ambulance Service', 'Vehicle fleet, drivers, trip records, fuel & maintenance logs', 'Working'],
        ['Community Projects', 'Project tracking, budgets, beneficiaries, status & category', 'Working'],
        ['Donations & Expenses', 'Donor records, donations, expenses, categories, payment methods', 'Working'],
        ['Daily Expenses', 'Daily expense entries by category (food, medical, etc.)', 'Working'],
        ['Salaries', 'Salary records, payments, allowances, deductions, bonuses', 'Working'],
        ['Reports', 'PDF & CSV reports for students, finance, projects', 'Working'],
        ['User Management', 'Multi-role access (Admin, Limited Admin, Staff, Volunteer)', 'Working'],
        ['Backup / Restore', 'Export and import database for safety backups', 'Working (Fixed)'],
    ]

    t = Table(modules_data, colWidths=[4 * cm, 9 * cm, 3 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2, 1), (2, -1), DWT_GREEN),
        ('FONTNAME', (2, 1), (2, -1), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)

    story.append(PageBreak())

    # ==================== DEPLOYMENT ====================
    story.append(section_header('5. Windows Installer & Deployment'))
    story.append(Paragraph(
        'A professional Windows installer was created using <b>Inno Setup 6</b>. '
        'The installer is fully self-contained &mdash; no Python or other software needs to be '
        'installed on the client PC.',
        body_style
    ))

    story.append(Paragraph('<b>Installer Features:</b>', h2_style))
    installer_features = [
        ('Installation Location', 'User can choose where to install (default: Program Files)'),
        ('Desktop Shortcut', 'Created with DWT icon, optional during install'),
        ('Start Menu Entry', 'Added under "DWT Management System"'),
        ('Uninstaller', 'Standard Windows uninstall via Settings &gt; Apps'),
        ('App Icon', 'DWT logo shown on shortcuts, taskbar, title bar, and system tray'),
        ('Database Location', 'Stored in %LocalAppData%\\DWT Management System (writable, per-user)'),
        ('Default Login', 'Username: admin &nbsp;|&nbsp; Password: admin123'),
        ('File Size', 'Approximately 34 MB (single .exe setup file)'),
        ('Offline Operation', 'Works completely offline &mdash; no internet required'),
        ('Auto Database Setup', 'Creates database and admin account on first run'),
    ]

    for label, value in installer_features:
        t = Table([[label, value]], colWidths=[5 * cm, 11 * cm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), DWT_LIGHT),
            ('TEXTCOLOR', (0, 0), (0, 0), DWT_DARK),
            ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('BOX', (0, 0), (-1, -1), 0.3, grey),
        ]))
        story.append(t)
        story.append(Spacer(1, 0.1 * cm))

    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph('<b>Installation Steps for Client PC:</b>', h2_style))
    steps = [
        '<b>1.</b> Copy <i>DWT_Management_System_Setup_v1.0.0.exe</i> to USB drive.',
        '<b>2.</b> Plug USB into the client PC.',
        '<b>3.</b> Double-click the setup file to launch the installer.',
        '<b>4.</b> Choose installation folder (or accept default) and click Install.',
        '<b>5.</b> Wait for files to be copied (approximately 1-2 minutes).',
        '<b>6.</b> Launch the application from the Desktop shortcut.',
        '<b>7.</b> Login with admin / admin123 and change the password.',
    ]
    for s in steps:
        story.append(Paragraph(s, bullet_style))

    story.append(PageBreak())

    # ==================== TECHNICAL DETAILS ====================
    story.append(section_header('6. Technical Architecture'))

    story.append(Paragraph('<b>Backend Stack:</b>', h2_style))
    backend = [
        '<b>Django 4.2+</b> &mdash; Web framework handling models, views, templates, URLs',
        '<b>SQLite 3</b> &mdash; Embedded database (no separate database server needed)',
        '<b>ReportLab</b> &mdash; PDF generation for reports and exports',
        '<b>Pillow (PIL)</b> &mdash; Image processing for profile images',
    ]
    for b in backend:
        story.append(Paragraph(f'&#8226; {b}', bullet_style))

    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph('<b>Desktop Wrapper:</b>', h2_style))
    desktop = [
        '<b>PyQt6</b> &mdash; Native Windows GUI framework',
        '<b>PyQt6-WebEngine</b> &mdash; Embedded Chromium browser for rendering the Django UI',
        '<b>WSGI Reference Server</b> &mdash; Lightweight local HTTP server (127.0.0.1)',
        '<b>Threading</b> &mdash; Server runs in background thread, UI in main thread',
    ]
    for d in desktop:
        story.append(Paragraph(f'&#8226; {d}', bullet_style))

    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph('<b>Build Tools:</b>', h2_style))
    build = [
        '<b>PyInstaller 6.x</b> &mdash; Bundles Python + all dependencies into a standalone .exe',
        '<b>Inno Setup 6.7</b> &mdash; Compiles the Windows installer (.exe setup)',
        '<b>build_exe.py</b> &mdash; Custom script to build the application bundle',
        '<b>build_installer.py</b> &mdash; Custom script to build the full installer pipeline',
    ]
    for b in build:
        story.append(Paragraph(f'&#8226; {b}', bullet_style))

    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph('<b>UI Framework:</b>', h2_style))
    ui = [
        '<b>Tabler 1.x</b> &mdash; Modern, professional Bootstrap 5-based admin theme',
        '<b>Custom DWT Theme</b> &mdash; Green color scheme (#1a6b3c) matching DWT branding',
        '<b>Responsive Design</b> &mdash; Works on different screen sizes',
        '<b>Print-friendly</b> &mdash; Reports and lists optimized for printing',
    ]
    for u in ui:
        story.append(Paragraph(f'&#8226; {u}', bullet_style))

    story.append(PageBreak())

    # ==================== FINAL DELIVERABLES ====================
    story.append(section_header('7. Final Deliverables'))

    deliverables = [
        ('Installer File',
         'installer_output\\DWT_Management_System_Setup_v1.0.0.exe',
         '~34 MB'),
        ('Source Code',
         'durrani_welfare_system\\ (all Django apps)',
         '90+ Python files'),
        ('Templates',
         'templates\\ (all module templates)',
         '80+ HTML files'),
        ('Static Assets',
         'static\\ (CSS, JS, images, logo)',
         'Tabler framework'),
        ('Build Scripts',
         'build_exe.py, build_installer.py, BUILD_INSTALLER.bat',
         'Auto-build pipeline'),
        ('Inno Setup Script',
         'installer\\setup.iss',
         'Configurable installer'),
        ('App Icon',
         'static\\img\\logo\\app_icon.ico',
         'Multi-resolution'),
        ('This Report',
         'DWT_Project_Report.pdf',
         'Generated by ReportLab'),
    ]

    data = [['Deliverable', 'Location', 'Detail']]
    for name, path, detail in deliverables:
        data.append([
            Paragraph(f'<b>{name}</b>', body_style),
            Paragraph(path, code_style),
            Paragraph(detail, body_style)
        ])

    t = Table(data, colWidths=[4 * cm, 8 * cm, 4 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)

    story.append(Spacer(1, 1 * cm))
    story.append(section_header('8. Conclusion'))
    story.append(Paragraph(
        'The Durrani Welfare Trust Management System is now <b>complete, stable, and production-ready</b>. '
        'All known bugs have been resolved, the Staff module records and manages all data correctly, '
        'and the system has been packaged into a professional Windows installer.',
        body_style
    ))
    story.append(Paragraph(
        'The application can be installed on any Windows 10/11 PC by simply running the setup file. '
        'No technical knowledge or additional software is required on the client side. '
        'The system runs <b>fully offline</b> with all data stored locally in SQLite.',
        body_style
    ))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph(
        '<b>Default Login:</b> admin / admin123 (please change after first login)',
        body_style
    ))
    story.append(Paragraph(
        '<b>Data Location:</b> %LocalAppData%\\DWT Management System\\db.sqlite3',
        body_style
    ))

    story.append(Spacer(1, 1.5 * cm))
    closing = Table(
        [['Report generated automatically by the DWT Management System build pipeline.']],
        colWidths=[16 * cm]
    )
    closing.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DWT_DARK),
        ('TEXTCOLOR', (0, 0), (-1, -1), white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Oblique'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(closing)

    doc.build(story)
    print(f'Report generated: {OUTPUT}')


if __name__ == '__main__':
    build()
