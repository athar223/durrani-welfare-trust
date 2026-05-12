"""
Generate the complete deployment proposal PDF for the DWT platform.
Covers: platform overview, ERP modules, public website, CMS, architecture,
deployment plan, hosting costs, timeline, security, maintenance.
"""
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black, grey, Color
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, ListFlowable, ListItem,
    Image, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas

OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                      'DWT_Deployment_Proposal.pdf')

# DWT brand colors
DWT_GREEN = HexColor('#1a6b3c')
DWT_DARK = HexColor('#0f3d22')
DWT_LIGHT = HexColor('#e8f5ee')
DWT_GOLD = HexColor('#c69c4e')
LIGHT_GREY = HexColor('#f5f5f5')
MEDIUM_GREY = HexColor('#9aa0a6')
DARK_GREY = HexColor('#3c4043')

styles = getSampleStyleSheet()

# Styles
title_style = ParagraphStyle(
    'Title', parent=styles['Title'], fontSize=26, textColor=white,
    alignment=TA_CENTER, spaceAfter=6, fontName='Helvetica-Bold', leading=30
)
subtitle_style = ParagraphStyle(
    'Subtitle', parent=styles['Normal'], fontSize=14, textColor=white,
    alignment=TA_CENTER, spaceAfter=4, leading=18
)
cover_label_style = ParagraphStyle(
    'CoverLabel', parent=styles['Normal'], fontSize=10, textColor=DWT_GOLD,
    alignment=TA_CENTER, spaceAfter=4, fontName='Helvetica-Bold', leading=14
)
h1_style = ParagraphStyle(
    'H1', parent=styles['Heading1'], fontSize=18, textColor=DWT_DARK,
    spaceBefore=14, spaceAfter=10, fontName='Helvetica-Bold', leading=22
)
h2_style = ParagraphStyle(
    'H2', parent=styles['Heading2'], fontSize=14, textColor=DWT_GREEN,
    spaceBefore=12, spaceAfter=6, fontName='Helvetica-Bold', leading=18
)
h3_style = ParagraphStyle(
    'H3', parent=styles['Heading3'], fontSize=11, textColor=DWT_DARK,
    spaceBefore=8, spaceAfter=4, fontName='Helvetica-Bold', leading=14
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'], fontSize=10, textColor=DARK_GREY,
    alignment=TA_JUSTIFY, spaceAfter=8, leading=15
)
bullet_style = ParagraphStyle(
    'Bullet', parent=body_style, leftIndent=18, bulletIndent=6,
    spaceAfter=4, leading=14
)
small_style = ParagraphStyle(
    'Small', parent=body_style, fontSize=9, leading=12, textColor=MEDIUM_GREY,
)
code_style = ParagraphStyle(
    'Code', parent=styles['Normal'], fontSize=8, textColor=DWT_DARK,
    fontName='Courier', backColor=LIGHT_GREY, borderPadding=6,
    leftIndent=8, leading=11
)
quote_style = ParagraphStyle(
    'Quote', parent=body_style, fontSize=11, textColor=DWT_GREEN,
    fontName='Helvetica-Oblique', leftIndent=20, leading=16
)


def cover_banner(text, sub1=None, sub2=None, label=None):
    """Top banner for the cover page."""
    rows = []
    if label:
        rows.append([Paragraph(label, cover_label_style)])
    rows.append([Paragraph(text, title_style)])
    if sub1:
        rows.append([Paragraph(sub1, subtitle_style)])
    if sub2:
        rows.append([Paragraph(sub2, subtitle_style)])
    t = Table(rows, colWidths=[16 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DWT_GREEN),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
    ]))
    return t


def section_header(text, number=None):
    label = f'{number}. {text}' if number else text
    data = [[Paragraph(label, h1_style)]]
    t = Table(data, colWidths=[16 * cm])
    t.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 2, DWT_GREEN),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    return t


def info_table(rows, col_widths=(5 * cm, 11 * cm)):
    """2-column info table with bold labels and shaded rows."""
    data = []
    for label, value in rows:
        data.append([Paragraph(f'<b>{label}</b>', body_style),
                     Paragraph(value, body_style)])
    t = Table(data, colWidths=list(col_widths))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), DWT_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 0.3, grey),
        ('INNERGRID', (0, 0), (-1, -1), 0.2, grey),
    ]))
    return t


def feature_table(features, col_widths=(0.8 * cm, 5 * cm, 10.2 * cm)):
    """Table for listing features: # | name | description"""
    data = [['#', 'Module / Feature', 'Description']]
    for i, (name, desc) in enumerate(features, 1):
        data.append([str(i),
                     Paragraph(f'<b>{name}</b>', body_style),
                     Paragraph(desc, body_style)])
    t = Table(data, colWidths=list(col_widths))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.4, grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return t


def cost_table(rows):
    """Cost / pricing comparison table."""
    data = [['Service', 'Tier', 'Cost', 'What it covers']]
    for row in rows:
        data.append([Paragraph(f'<b>{row[0]}</b>', body_style),
                     row[1],
                     Paragraph(f'<b>{row[2]}</b>', body_style),
                     Paragraph(row[3], body_style)])
    t = Table(data, colWidths=[3.5 * cm, 2.5 * cm, 2.5 * cm, 7.5 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.4, grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (2, 1), (2, -1), 'RIGHT'),
        ('TEXTCOLOR', (2, 1), (2, -1), DWT_GREEN),
    ]))
    return t


def timeline_table(phases):
    """Project timeline / Gantt-like table."""
    data = [['Phase', 'Duration', 'Deliverables', 'Status']]
    for ph in phases:
        data.append([Paragraph(f'<b>{ph[0]}</b>', body_style),
                     ph[1],
                     Paragraph(ph[2], body_style),
                     ph[3]])
    t = Table(data, colWidths=[3 * cm, 2 * cm, 8.5 * cm, 2.5 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.4, grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (3, 1), (3, -1), 'CENTER'),
        ('FONTNAME', (3, 1), (3, -1), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return t


def numbered_steps(steps):
    """Formatted numbered steps."""
    flow = []
    for i, step in enumerate(steps, 1):
        title, body = step if isinstance(step, tuple) else (None, step)
        if title:
            flow.append(Paragraph(
                f'<font color="#1a6b3c"><b>Step {i}: {title}</b></font>',
                body_style))
        else:
            flow.append(Paragraph(
                f'<font color="#1a6b3c"><b>Step {i}.</b></font>',
                body_style))
        flow.append(Paragraph(body, body_style))
        flow.append(Spacer(1, 0.15 * cm))
    return flow


def page_footer(canvas, doc):
    """Footer on every page."""
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MEDIUM_GREY)
    page_num = canvas.getPageNumber()
    canvas.drawString(2.5 * cm, 1.2 * cm,
                      'Durrani Welfare Trust — Web Platform Deployment Proposal')
    canvas.drawRightString(A4[0] - 2.5 * cm, 1.2 * cm, f'Page {page_num}')
    canvas.setStrokeColor(LIGHT_GREY)
    canvas.line(2.5 * cm, 1.6 * cm, A4[0] - 2.5 * cm, 1.6 * cm)
    canvas.restoreState()


def hr():
    return HRFlowable(width='100%', thickness=0.5, color=LIGHT_GREY,
                      spaceBefore=8, spaceAfter=8)


def build():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=2.5 * cm, rightMargin=2.5 * cm,
        topMargin=2.2 * cm, bottomMargin=2.2 * cm,
        title='DWT Web Platform — Deployment Proposal',
        author='DWT IT Team',
    )
    story = []

    # ======================================================
    # 1. COVER PAGE
    # ======================================================
    story.append(Spacer(1, 1.5 * cm))
    logo_path = os.path.join('static', 'img', 'logo', 'logo.png')
    if os.path.exists(logo_path):
        try:
            story.append(Image(logo_path, width=3.5 * cm, height=3.5 * cm,
                               hAlign='CENTER'))
            story.append(Spacer(1, 0.4 * cm))
        except Exception:
            pass

    story.append(cover_banner(
        'DEPLOYMENT &amp; GO-LIVE PROPOSAL',
        'Durrani Welfare Trust — Web Platform &amp; ERP',
        'Public NGO Website + Centralized Management System',
        label='OFFICIAL PROPOSAL'
    ))
    story.append(Spacer(1, 2 * cm))

    cover_meta = [
        ('Document', 'Web Platform Deployment Proposal'),
        ('Project', 'DWT Management Platform &amp; Public Website'),
        ('Version', '1.0'),
        ('Prepared On', datetime.now().strftime('%B %d, %Y')),
        ('Prepared For', 'Durrani Welfare &amp; Social Development Organization'),
        ('Architecture', 'Next.js Frontend + Django REST Backend + PostgreSQL'),
        ('Status', 'Frontend deployed &nbsp;|&nbsp; Backend awaiting database'),
    ]
    story.append(info_table(cover_meta))
    story.append(Spacer(1, 1.5 * cm))
    story.append(Paragraph(
        '<i>"Serving humanity with compassion through technology, transparency, '
        'and trust."</i>', quote_style))

    story.append(PageBreak())

    # ======================================================
    # 2. TABLE OF CONTENTS
    # ======================================================
    story.append(section_header('Table of Contents'))

    toc = [
        ('1.', 'Executive Summary', '3'),
        ('2.', 'Project Overview', '4'),
        ('3.', 'System Architecture', '5'),
        ('4.', 'ERP Modules (Internal)', '6'),
        ('5.', 'Public Website Features', '8'),
        ('6.', 'Content Management System (CMS)', '9'),
        ('7.', 'Technology Stack', '10'),
        ('8.', 'Current Deployment Status', '11'),
        ('9.', 'Go-Live Deployment Plan', '12'),
        ('10.', 'What You Need to Buy &amp; Total Cost (PKR)', '14'),
        ('11.', 'Project Timeline', '15'),
        ('12.', 'Security &amp; Compliance', '16'),
        ('13.', 'Maintenance &amp; Support Plan', '17'),
        ('14.', 'File &amp; Asset Inventory', '18'),
        ('15.', 'Risks &amp; Mitigation', '19'),
        ('16.', 'Acceptance &amp; Sign-off', '20'),
    ]
    data = [[t[0], t[1], t[2]] for t in toc]
    t = Table(data, colWidths=[1.5 * cm, 12 * cm, 2 * cm])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), DWT_GREEN),
        ('TEXTCOLOR', (2, 0), (2, -1), MEDIUM_GREY),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, LIGHT_GREY),
    ]))
    story.append(t)
    story.append(PageBreak())

    # ======================================================
    # 3. EXECUTIVE SUMMARY
    # ======================================================
    story.append(section_header('Executive Summary', 1))

    story.append(Paragraph(
        'This proposal documents the transformation of the Durrani Welfare Trust\'s '
        'desktop-based management system into a modern, responsive, internet-accessible '
        'web platform. The new platform combines a public-facing NGO website with a '
        'comprehensive Enterprise Resource Planning (ERP) system, all served from a '
        'centralized cloud backend.',
        body_style))

    story.append(Paragraph('<b>What Has Been Delivered:</b>', h3_style))
    for item in [
        'Public website (Next.js / React) — Home, About, Services, News, Gallery, Contact, plus public forms for volunteer registration, student enrollment, and donations.',
        'Admin Dashboard — full ERP with Students, Staff, Volunteers, Drivers, Donations, Expenses, Daily Expenses, Salaries, Projects, Ambulance, Reports, User Management, Backup, and CMS panels.',
        'REST API backend (Django + DRF + JWT) exposing 30+ endpoints for all modules.',
        'Content Management System enabling non-technical staff to update website content (hero banners, news, gallery, services, campaigns, etc.) without code changes.',
        'Existing desktop application preserved alongside the web platform.',
        'Frontend deployed and live on Vercel.',
    ]:
        story.append(Paragraph(f'&#8226; {item}', bullet_style))

    story.append(Paragraph('<b>What Is Required to Go Live:</b>', h3_style))
    for item in [
        'Provision a managed PostgreSQL database (Neon, Vercel Postgres, or Supabase).',
        'Configure backend environment variables (DATABASE_URL, secret keys).',
        'Connect the deployed frontend to the live backend.',
        'Acquire a custom domain (optional but recommended — e.g. <i>duraniwelfaretrust.org</i>).',
        'Setup HTTPS / SSL (automatically provided by Vercel).',
    ]:
        story.append(Paragraph(f'&#8226; {item}', bullet_style))

    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph('<b>Estimated Total Cost to Go Live:</b>', h3_style))
    story.append(Paragraph(
        'Approximately <b>PKR 26,000 – 31,000 for the first year</b> (about PKR 2,200 per month) '
        'with a standard VPS hosting plan. Annual renewal from Year 2 onwards is approximately '
        '<b>PKR 21,000 per year</b>. Complete cost breakdown is provided in Section 10.',
        body_style))

    story.append(PageBreak())

    # ======================================================
    # 4. PROJECT OVERVIEW
    # ======================================================
    story.append(section_header('Project Overview', 2))

    story.append(Paragraph('<b>Objective</b>', h2_style))
    story.append(Paragraph(
        'Replace the legacy Windows-only desktop application with a multi-user, '
        'cloud-hosted web platform that enables: '
        '(a) the public to learn about DWT, donate, volunteer, and apply for educational '
        'support online, and '
        '(b) DWT staff to manage every aspect of the organization\'s operations from '
        'any browser, on any device.',
        body_style))

    story.append(Paragraph('<b>Stakeholders</b>', h2_style))
    stakeholders = [
        ('Donors &amp; Public', 'Visit website, view services and news, make donations online.'),
        ('Beneficiaries', 'Apply for student support, scholarships, and welfare programs.'),
        ('Volunteers', 'Register interest through public form, view assignments.'),
        ('Staff', 'Manage students, attendance, finances, daily operations.'),
        ('Administrators', 'Configure CMS, manage users, generate reports, oversee everything.'),
    ]
    story.append(feature_table(stakeholders))

    story.append(Paragraph('<b>Key Benefits Over Desktop Version</b>', h2_style))
    benefits = [
        ('Centralized Data', 'All staff see the same data in real time; no more sync issues.'),
        ('Anywhere Access', 'Works from any device with a browser — desktop, laptop, tablet, phone.'),
        ('Public Visibility', 'Donors and beneficiaries can find DWT online and engage directly.'),
        ('Lower IT Cost', 'No per-PC installation, automatic updates, automatic backups.'),
        ('Modern UX', 'Faster, mobile-friendly, professional appearance matching modern NGOs.'),
        ('Scalable', 'Handles growth in users and data without re-architecting.'),
    ]
    story.append(feature_table(benefits))

    story.append(PageBreak())

    # ======================================================
    # 5. ARCHITECTURE
    # ======================================================
    story.append(section_header('System Architecture', 3))

    story.append(Paragraph(
        'The platform follows a modern three-tier architecture with a clean separation '
        'between the user interface, the application logic, and the data layer.',
        body_style))

    arch_diagram = """
+--------------------------------------------------------------+
|   END USERS (Donors, Volunteers, Students, Staff, Admins)    |
|         Browser on Desktop / Tablet / Mobile                 |
+----------------------------+---------------------------------+
                             |  HTTPS (TLS)
                             v
+--------------------------------------------------------------+
|   WEB SERVER  -  Nginx (Port 80 / 443)                       |
|   - Handles HTTPS / SSL                                      |
|   - Serves static files                                      |
|   - Reverse-proxies to Django and Next.js                    |
+----+--------------------------------------------+------------+
     |                                            |
     v                                            v
+-------------------------+      +-------------------------------+
|   FRONTEND  -  Next.js  |      |   BACKEND  -  Django + DRF    |
|   (PM2 process manager) |      |   (Gunicorn process manager)  |
|   Port 3000             |      |   Port 8000                   |
|   - Public site         |      |   - JWT authentication        |
|   - Admin dashboard     |      |   - 30+ REST API endpoints    |
|   - Forms               |      |   - File uploads, PDF, CSV    |
+-------------------------+      +---------------+---------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  |  DATABASE  -  PostgreSQL 16  |
                                  |  (Local on the same VPS)     |
                                  |  - All ERP data              |
                                  |  - CMS content               |
                                  |  - User accounts             |
                                  +------------------------------+

   All running on a single VPS (Virtual Private Server)
   with HTTPS, daily backups, and automated SSL renewal.
"""
    story.append(Paragraph(arch_diagram.replace('\n', '<br/>').replace(' ', '&nbsp;'),
                           code_style))

    story.append(Paragraph('<b>Design Principles</b>', h2_style))
    for item in [
        '<b>Separation of concerns:</b> Frontend, backend, and database are independent and can scale or be replaced individually.',
        '<b>API-first:</b> All data flows through the REST API, ensuring the same logic powers web, mobile, and future integrations.',
        '<b>Stateless backend:</b> Easy horizontal scaling, fast failover, no session affinity required.',
        '<b>Secure by default:</b> HTTPS everywhere, JWT tokens, environment variables for secrets, password hashing.',
        '<b>Progressive enhancement:</b> Works on older browsers; mobile-first responsive design.',
    ]:
        story.append(Paragraph(f'&#8226; {item}', bullet_style))

    story.append(PageBreak())

    # ======================================================
    # 6. ERP MODULES (Internal)
    # ======================================================
    story.append(section_header('ERP Modules (Internal Management)', 4))

    story.append(Paragraph(
        'The internal Management Dashboard provides a complete ERP system for running '
        'DWT operations. Each module supports full CRUD (Create, Read, Update, Delete), '
        'search, filtering, and integration with related modules.',
        body_style))

    story.append(Paragraph('<b>People &amp; HR</b>', h2_style))
    story.append(feature_table([
        ('Students', 'Personal information, guardian details, education level, admission tracking, attendance, profile photos. CSV export.'),
        ('Staff', 'Employee records with roles (teacher, admin, coordinator, etc.), contact info, supervisor, base salary, attendance, profile photos.'),
        ('Volunteers', 'Volunteer registry with skills, availability, role, status; sourced from public form submissions after approval.'),
        ('Drivers', 'Driver registry with license info, vehicle assignment, shift, salary.'),
        ('Attendance', 'Daily attendance for students and staff with Present/Absent/Leave statuses, bulk-mark, remarks per person.'),
        ('User Management', 'Multi-role user accounts (Admin, Limited Admin, Staff, Volunteer), permissions per module, password management.'),
    ]))

    story.append(Paragraph('<b>Finance</b>', h2_style))
    story.append(feature_table([
        ('Donations', 'Donor records, donation categories (Zakat, Sadqa, Fitrana, etc.), payment methods, reference numbers.'),
        ('Expenses', 'Categorized expenses (salaries, rent, utilities, transport, medical, etc.), approval tracking, payment methods.'),
        ('Daily Expenses', 'Day-to-day operational spending (food, supplies, transport).'),
        ('Salaries', 'Monthly salary records with base + allowances + deductions + bonuses + overtime; status tracking (pending/paid).'),
        ('Financial Reports', 'PDF / CSV reports of donations vs expenses, monthly trends, category breakdowns.'),
    ]))

    story.append(Paragraph('<b>Operations</b>', h2_style))
    story.append(feature_table([
        ('Community Projects', 'Project tracking with budget, expenses, beneficiaries, status (planned/ongoing/completed), category.'),
        ('Ambulance Service', 'Vehicle fleet, drivers, trip logs (patient transfers), fuel purchases, maintenance records.'),
    ]))

    story.append(Paragraph('<b>Public Submissions Review</b>', h2_style))
    story.append(feature_table([
        ('Student Applications', 'Review online enrollment applications. Approving automatically creates a Student record.'),
        ('Volunteer Applications', 'Review volunteer registration requests. Approving creates a Volunteer record.'),
        ('Donation Pledges', 'Confirm online donation pledges. Confirming creates a Donation record in finance.'),
        ('Contact Messages', 'Read and reply to messages from the public contact form.'),
    ]))

    story.append(Paragraph('<b>Reports &amp; Tools</b>', h2_style))
    story.append(feature_table([
        ('Dashboard Analytics', 'Real-time KPIs: active students, staff, volunteers, total donations, expenses, balance, pending applications.'),
        ('Charts', 'Six-month donation vs expense trend, category breakdowns.'),
        ('PDF Reports', 'Student report, financial report, project report — exportable as PDF for board meetings or audits.'),
        ('CSV Exports', 'All modules support CSV export for use in Excel / Google Sheets.'),
        ('Backup &amp; Restore', 'Export the entire database; import a previous backup. Useful for off-site backups and disaster recovery.'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 7. PUBLIC WEBSITE FEATURES
    # ======================================================
    story.append(section_header('Public Website Features', 5))

    story.append(Paragraph(
        'The public-facing website is built with Next.js for fast page loads (server-side '
        'rendering + edge caching) and SEO discoverability. It is fully responsive across '
        'desktop, tablet, and mobile.',
        body_style))

    story.append(Paragraph('<b>Pages</b>', h2_style))
    story.append(feature_table([
        ('Home', 'Hero banner with rotating slides, mission summary, services preview, statistics, active campaigns, latest news, calls-to-action.'),
        ('About Us', 'Our story, mission, vision, values, history. Editable via CMS.'),
        ('Services', 'Detailed page for each service offered (Education, Healthcare, Ambulance, etc.) with features list.'),
        ('News &amp; Announcements', 'List of news posts filterable by category (news / announcement / event / campaign / story). Individual post pages with cover image, content, share buttons.'),
        ('Photo Gallery', 'Album-based gallery with lightbox viewer for full-screen photos.'),
        ('Contact', 'Contact form, office details, phone numbers, email, office hours, Google Maps embed.'),
    ]))

    story.append(Paragraph('<b>Interactive Forms</b>', h2_style))
    story.append(feature_table([
        ('Volunteer Registration', 'Public can apply to volunteer. Form collects name, CNIC, contact, address, skills, availability, profile photo.'),
        ('Student Enrollment', 'Online application for educational support / scholarships. Collects student details, parent contacts, financial status, documents.'),
        ('Online Donation', 'Donor name/contact, amount selector with preset amounts, category (Zakat/Sadqa/etc.), payment method, reference, anonymous option.'),
        ('Contact Form', 'Standard subject/message form. Submissions appear in admin Messages inbox.'),
        ('Newsletter Subscribe', 'Email-only subscription in footer for site updates.'),
    ]))

    story.append(Paragraph(
        'All submissions are stored in the database and appear in the admin dashboard '
        'for review. Approving an application automatically promotes it into the '
        'corresponding ERP module (e.g., approving a Student Application creates a '
        'Student record).', body_style))

    story.append(PageBreak())

    # ======================================================
    # 8. CMS
    # ======================================================
    story.append(section_header('Content Management System (CMS)', 6))

    story.append(Paragraph(
        'Non-technical staff can update website content directly through the admin '
        'dashboard without touching code. Changes appear on the public website immediately '
        '(no rebuild required).',
        body_style))

    story.append(Paragraph('<b>What Can Be Managed via CMS</b>', h2_style))
    story.append(feature_table([
        ('Site Settings', 'Organization name, tagline, logo, favicon, contact info (email/phones/address), Google Maps embed, social media links (FB, Twitter, IG, YouTube, LinkedIn), SEO meta tags.'),
        ('Hero Banners', 'Home-page slideshow. Multiple banners with title, subtitle, background image, two call-to-action buttons each.'),
        ('About Sections', 'Mission, vision, values, history — each section is editable with title, content, and optional image.'),
        ('Services', 'Add or update service listings shown on Services page and home preview. Each has title, slug, short/full description, icon, image, featured flag.'),
        ('News &amp; Posts', 'Create blog posts, announcements, events. Categories: News / Announcement / Event / Campaign / Story. Cover image, summary, content, featured flag, publish toggle.'),
        ('Gallery Albums', 'Create photo albums with cover images. Photos managed individually with captions and ordering.'),
        ('Donation Campaigns', 'Active fundraising campaigns shown on home page with progress bars (raised vs target), end dates, and direct donate buttons.'),
        ('Newsletter Subscribers', 'View and manage email subscribers for future bulk emails.'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 9. TECHNOLOGY STACK
    # ======================================================
    story.append(section_header('Technology Stack', 7))

    story.append(Paragraph('<b>Frontend (Next.js)</b>', h2_style))
    story.append(info_table([
        ('Framework', 'Next.js 15 (App Router) with React 19'),
        ('Language', 'TypeScript'),
        ('Styling', 'Tailwind CSS with custom DWT theme (green #1a6b3c)'),
        ('Forms', 'React Hook Form for validation and submission'),
        ('HTTP Client', 'Axios with JWT auth interceptor'),
        ('Icons', 'Lucide React (250+ icons)'),
        ('Notifications', 'React Hot Toast'),
        ('Fonts', 'Libre Baskerville (headings), Lato (body)'),
    ]))

    story.append(Paragraph('<b>Backend (Django)</b>', h2_style))
    story.append(info_table([
        ('Framework', 'Django 4.2'),
        ('API Layer', 'Django REST Framework (DRF) 3.17'),
        ('Authentication', 'Simple JWT (JSON Web Tokens)'),
        ('Filtering', 'django-filter, search, ordering'),
        ('CORS', 'django-cors-headers'),
        ('Static Files', 'Whitenoise (zero-config in production)'),
        ('Database Driver', 'psycopg2-binary for PostgreSQL'),
        ('Image Processing', 'Pillow (PIL fork)'),
        ('PDF Generation', 'ReportLab'),
        ('WSGI Server', 'Gunicorn'),
        ('Python', '3.12+'),
    ]))

    story.append(Paragraph('<b>Data &amp; Infrastructure</b>', h2_style))
    story.append(info_table([
        ('Database', 'PostgreSQL 16 (installed on the VPS)'),
        ('Web Server', 'Nginx (reverse proxy + SSL termination)'),
        ('Backend Process Manager', 'Gunicorn + Systemd service'),
        ('Frontend Process Manager', 'PM2 (Node.js process manager)'),
        ('Hosting', 'VPS (any provider: Hostingerpk, Navicosoft, DigitalOcean, Vultr, Contabo)'),
        ('Operating System', 'Ubuntu 22.04 LTS (recommended) or any modern Linux distro'),
        ('Domain &amp; DNS', 'Any domain registrar (managed by registrar dashboard)'),
        ('SSL Certificates', 'Let\'s Encrypt — free, automatic renewal via Certbot'),
        ('File Storage', 'Local filesystem on the VPS (sufficient for NGO use)'),
        ('Version Control', 'Git + GitHub'),
        ('Deployment', 'Git pull + systemctl restart (manual or scripted)'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 10. CURRENT DEPLOYMENT STATUS
    # ======================================================
    story.append(section_header('Current Deployment Status', 8))

    story.append(Paragraph('<b>Demo / Preview Deployment</b>', h2_style))
    story.append(Paragraph(
        'A temporary demo deployment is currently live for review and testing purposes. '
        'This will be migrated to the production VPS hosting once it is purchased and configured.',
        body_style))
    story.append(info_table([
        ('Demo URL (Public Website)', '<font color="#1a6b3c">https://frontend-chi-three-80.vercel.app</font>'),
        ('Demo Status', 'Frontend pages render correctly; awaiting production database for full functionality.'),
        ('Build Verified', 'Successful — 54 pages compiled without errors.'),
        ('Mobile Tested', 'Responsive on phones, tablets, and desktops.'),
    ]))

    story.append(Paragraph('<b>Source Code Repository</b>', h2_style))
    story.append(info_table([
        ('GitHub Repo', '<font color="#1a6b3c">https://github.com/athar223/durrani-welfare-trust</font>'),
        ('Visibility', 'Public — accessible for review and audit'),
        ('Documentation', 'Complete README, deployment guide, and inline code comments included.'),
        ('License', 'Proprietary — for exclusive use by Durrani Welfare Trust.'),
    ]))

    story.append(Paragraph('<b>Production Deployment (Next Step)</b>', h2_style))
    story.append(info_table([
        ('Required Action', '<font color="#c69c4e"><b>Purchase VPS hosting and domain name (see Section 10).</b></font>'),
        ('Setup Time', 'Approximately 4 to 6 hours after hosting is purchased.'),
        ('Final URL', 'Your chosen domain (e.g. www.duraniwelfaretrust.org).'),
        ('SSL', 'Free Let\'s Encrypt certificate, auto-renewed.'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 11. GO-LIVE DEPLOYMENT PLAN
    # ======================================================
    story.append(section_header('Go-Live Deployment Plan', 9))

    story.append(Paragraph(
        'The path from "deployed but partially working" to "fully live and ready for public '
        'use" is summarized in the steps below. Total estimated time: <b>1 to 2 hours</b>, '
        'mostly automated.',
        body_style))

    story.append(Paragraph('<b>Phase A: Purchase Hosting &amp; Domain</b>', h2_style))
    for s in numbered_steps([
        ('Buy a domain name', 'Register your domain (e.g. <i>duraniwelfaretrust.org</i>) from any registrar — Hostinger.pk, GoDaddy, or Namecheap. Cost: PKR 3,000/year approx.'),
        ('Buy a VPS hosting plan', 'Purchase a VPS plan from Hostingerpk, Navicosoft, DigitalOcean, or Vultr — recommended 2 GB RAM / 40 GB SSD. Cost: PKR 1,500/month approx.'),
        ('Get the server credentials', 'After purchase, the provider sends an email with the server IP address and root password.'),
    ]):
        story.append(s)

    story.append(Paragraph('<b>Phase B: Server Setup</b>', h2_style))
    for s in numbered_steps([
        ('Install required software', 'Connect to the VPS via SSH and install Python 3.12, Node.js 20, PostgreSQL 16, Nginx, and Gunicorn.'),
        ('Upload the platform code', 'Clone the GitHub repository to the server: <i>git clone https://github.com/athar223/durrani-welfare-trust.git</i>.'),
        ('Create the database', 'Create a PostgreSQL database, user, and grant privileges. Connection details go into the .env file.'),
        ('Install dependencies', 'Run <i>pip install -r requirements.txt</i> for backend, and <i>npm install &amp;&amp; npm run build</i> for the frontend.'),
        ('Run migrations', 'Run <i>python manage.py migrate</i> to create database tables, and <i>python manage.py createsuperuser</i> for the admin account.'),
    ]):
        story.append(s)

    story.append(Paragraph('<b>Phase C: Configure Web Server</b>', h2_style))
    for s in numbered_steps([
        ('Set up Nginx reverse proxy', 'Configure Nginx to serve the public website on port 80/443 and forward API requests to Django Gunicorn process.'),
        ('Set up Gunicorn service', 'Create a systemd service to run Django automatically on server boot.'),
        ('Set up PM2 for Next.js', 'Use PM2 process manager to run the Next.js frontend in production mode.'),
        ('Install SSL certificate', 'Use Certbot to obtain a free Let\'s Encrypt SSL certificate. HTTPS will be auto-renewed every 90 days.'),
    ]):
        story.append(s)

    story.append(Paragraph('<b>Phase D: DNS &amp; Domain Connection</b>', h2_style))
    for s in numbered_steps([
        ('Update DNS records', 'In your domain registrar\'s dashboard, point the A record of <i>yourdomain.org</i> and <i>www.yourdomain.org</i> to the VPS IP address.'),
        ('Wait for DNS propagation', 'DNS changes take 10 minutes to a few hours to spread globally. Verify by visiting your domain in a browser.'),
        ('Verify SSL is active', 'Open https://yourdomain.org in a browser — should show a green padlock.'),
    ]):
        story.append(s)

    story.append(Paragraph('<b>Phase E: Final Launch Checks</b>', h2_style))
    for s in numbered_steps([
        ('Change admin password', 'Log in with the temporary admin account and set a strong, unique password.'),
        ('Test all features', 'Submit a test donation, volunteer registration, and student enrollment form. Verify they appear in the admin dashboard.'),
        ('Set up automated backups', 'Configure a daily cron job to back up the PostgreSQL database to an off-site location (Google Drive, S3, etc.).'),
        ('Add Google Analytics (optional)', 'Add Google Analytics tracking code to monitor visitor statistics.'),
        ('Announce the launch', 'Share the new website URL on Facebook, WhatsApp, and via email to existing supporters.'),
    ]):
        story.append(s)

    story.append(PageBreak())

    # ======================================================
    # 12. HOSTING - WHAT YOU NEED & COSTS
    # ======================================================
    story.append(section_header('What You Need to Buy &amp; Total Cost', 10))

    story.append(Paragraph(
        'To take the platform live on the internet under your own domain '
        '(e.g. <i>duraniwelfaretrust.org</i>), you will need to purchase the following '
        'from any standard web hosting provider in Pakistan or internationally. All prices '
        'are in Pakistani Rupees (PKR) based on current market rates (May 2026).',
        body_style))

    story.append(Paragraph('<b>1. Domain Name (Annual, one-time per year)</b>', h2_style))
    story.append(Paragraph(
        'Your unique web address. Pick one and register it for at least 1 year. '
        'This is a separate purchase from hosting and stays yours regardless of which host you use.',
        body_style))
    story.append(cost_table([
        ('.com', 'Annual', 'PKR 2,500 – 3,500/yr', 'Most professional and recognizable. Recommended.'),
        ('.org', 'Annual', 'PKR 2,800 – 4,000/yr', 'Standard for non-profit organizations. Highly recommended for NGOs.'),
        ('.pk', 'Annual', 'PKR 3,500 – 4,500/yr', 'Pakistani country domain. Good for local recognition.'),
        ('.com.pk', 'Annual', 'PKR 3,500 – 4,500/yr', 'Pakistani commercial domain.'),
    ]))

    story.append(Paragraph('<b>2. Web Hosting (Monthly or Annual)</b>', h2_style))
    story.append(Paragraph(
        'A VPS (Virtual Private Server) is required because the platform uses Python (Django) '
        'and Node.js (Next.js). Regular shared cPanel hosting (PHP / MySQL only) will NOT work '
        'for this platform.',
        body_style))

    story.append(Paragraph('<b>Recommended — Pakistani Hosting Providers</b>', h3_style))
    story.append(cost_table([
        ('Hostingerpk', 'VPS 1', 'PKR 1,200/mo', '1 GB RAM, 20 GB SSD, Pakistani support, Karachi data center.'),
        ('Navicosoft', 'VPS Basic', 'PKR 2,500/mo', '2 GB RAM, 40 GB SSD, Urdu support, Lahore data center.'),
        ('WHC.pk', 'VPS Lite', 'PKR 1,500/mo', '1 GB RAM, 25 GB SSD, instant activation.'),
        ('PakKVM', 'KVM 1', 'PKR 1,000/mo', '1 GB RAM, 20 GB SSD, good value option.'),
    ]))

    story.append(Paragraph('<b>Alternative — International Providers (cheaper, more reliable)</b>', h3_style))
    story.append(cost_table([
        ('DigitalOcean', 'Basic', 'PKR 1,200/mo', '1 GB RAM, 25 GB SSD. Best reputation worldwide.'),
        ('Vultr', 'Cloud Compute', 'PKR 1,000/mo', '1 GB RAM, 25 GB SSD. Pay-as-you-go billing.'),
        ('Contabo', 'VPS S', 'PKR 1,200/mo', '8 GB RAM, 50 GB SSD. Best value — much more RAM per rupee.'),
        ('Hostinger', 'VPS 1', 'PKR 1,500/mo', '1 GB RAM, 50 GB SSD, beginner-friendly panel.'),
    ]))

    story.append(Paragraph('<b>3. SSL Certificate (HTTPS Security)</b>', h2_style))
    story.append(cost_table([
        ('Let\'s Encrypt', 'Standard', 'PKR 0 (Free)', 'Free SSL — recommended. Auto-renews every 90 days. Provided by every modern hosting panel.'),
        ('Premium SSL', 'Wildcard / EV', 'PKR 8,000–35,000/yr', 'Only needed for banks or e-commerce with payment processing.'),
    ]))

    story.append(Paragraph('<b>4. Database (PostgreSQL)</b>', h2_style))
    story.append(Paragraph(
        'Included free with any VPS — you install PostgreSQL on the same server. '
        'No additional cost. If you prefer a managed external database (recommended for serious '
        'production), Neon.tech offers a free tier with 0.5 GB storage — '
        'sufficient for several years of DWT data.',
        body_style))

    story.append(Paragraph('<b>5. Email Hosting (Optional)</b>', h2_style))
    story.append(cost_table([
        ('Zoho Mail', 'Free', 'PKR 0', 'Up to 5 email accounts (info@yourdomain.org). Free forever for small NGOs.'),
        ('Google Workspace', 'Business Starter', 'PKR 1,700/mo', 'Per user — professional Gmail, Drive, Docs, Meet under your domain.'),
        ('cPanel Email', 'Included', 'PKR 0', 'Most VPS providers include email accounts at no extra cost.'),
    ]))

    story.append(PageBreak())

    # Cost Summary Section
    story.append(section_header('Total Cost Summary (PKR)', None))

    story.append(Paragraph('<b>Minimum Setup — First Year</b>', h2_style))
    story.append(cost_table([
        ('Domain Name', '.org annual', 'PKR 3,000', 'One-time per year — renewable annually.'),
        ('VPS Hosting', 'Monthly × 12', 'PKR 12,000', 'PKR 1,000/month for entry-level VPS (Vultr or PakKVM).'),
        ('SSL Certificate', 'Free', 'PKR 0', 'Let\'s Encrypt — automatic.'),
        ('Database', 'Included', 'PKR 0', 'PostgreSQL installed on the same VPS.'),
        ('Email (Zoho)', 'Free', 'PKR 0', 'Up to 5 mailboxes free.'),
        ('Total Year 1', '', '<b>PKR 15,000</b>', '<b>Approximately PKR 1,250 per month average.</b>'),
    ]))

    story.append(Paragraph('<b>Recommended Setup — First Year</b>', h2_style))
    story.append(cost_table([
        ('Domain Name', '.org annual', 'PKR 3,000', 'Professional .org domain.'),
        ('VPS Hosting', 'Monthly × 12', 'PKR 18,000', 'PKR 1,500/month for stable VPS (Hostinger or Navicosoft).'),
        ('SSL Certificate', 'Free', 'PKR 0', 'Let\'s Encrypt.'),
        ('Database', 'Included', 'PKR 0', 'Self-hosted PostgreSQL.'),
        ('Setup &amp; Configuration', 'One-time', 'PKR 5,000–10,000', 'Initial server setup and deployment (one-time fee).'),
        ('Total Year 1', '', '<b>PKR 26,000–31,000</b>', '<b>About PKR 2,200 per month average.</b>'),
    ]))

    story.append(Paragraph('<b>Premium Setup — High Traffic</b>', h2_style))
    story.append(cost_table([
        ('Domain Name', '.org annual', 'PKR 3,000', 'Same as before.'),
        ('VPS Hosting', 'Monthly × 12', 'PKR 36,000', 'PKR 3,000/month for 4 GB RAM VPS — handles thousands of daily visitors.'),
        ('Backup Service', 'Monthly × 12', 'PKR 6,000', 'Off-site automated daily backups.'),
        ('Email (Workspace)', 'Monthly × 12', 'PKR 20,400', 'Google Workspace × 1 admin account.'),
        ('Total Year 1', '', '<b>PKR 65,000</b>', '<b>About PKR 5,400 per month.</b>'),
    ]))

    story.append(Paragraph('<b>What\'s Included in All Plans</b>', h2_style))
    for item in [
        'Full source code of the platform — already developed and ready to deploy.',
        'Complete documentation for installation, operation, and maintenance.',
        'HTTPS encryption (SSL) at no extra cost via Let\'s Encrypt.',
        'PostgreSQL database installed on the same server as Django.',
        'Free email accounts under the domain (via Zoho Mail free tier).',
        'Unlimited content updates through the built-in CMS — no developer needed.',
        'All ERP modules (students, staff, donations, etc.) accessible from anywhere.',
        'Public website accessible to donors and beneficiaries 24/7.',
    ]:
        story.append(Paragraph(f'&#8226; {item}', bullet_style))

    story.append(Paragraph('<b>Recommendation</b>', h2_style))
    story.append(Paragraph(
        'For DWT\'s expected traffic and operational needs, we recommend the '
        '<b>"Recommended Setup" tier at approximately PKR 26,000–31,000 for the first year</b> '
        '(roughly PKR 2,200 per month). This provides a stable, professional online presence '
        'with enough capacity for several years of growth before any upgrade is needed.',
        body_style))

    story.append(Paragraph(
        '<b>Annual renewal cost (Year 2 onwards): approximately PKR 21,000 per year</b> '
        '(only hosting + domain renewal; no setup fees).',
        body_style))

    story.append(PageBreak())

    # ======================================================
    # 13. TIMELINE
    # ======================================================
    story.append(section_header('Project Timeline', 11))

    story.append(Paragraph(
        'Major milestones across the platform lifecycle:', body_style))

    story.append(timeline_table([
        ('Phase 1: Discovery', '1 week', 'Requirements gathering, branding extraction, content audit.', 'Done'),
        ('Phase 2: Backend', '2 weeks', 'Django models, REST APIs, CMS app, JWT auth, file uploads.', 'Done'),
        ('Phase 3: Public Site', '2 weeks', 'Hero, About, Services, News, Gallery, public forms, mobile responsive.', 'Done'),
        ('Phase 4: ERP Web UI', '3 weeks', 'Admin dashboard, all CRUD pages, attendance, CMS panels, reports.', 'Done'),
        ('Phase 5: Demo Deployment', '3 days', 'Demo site published for review, GitHub repo set up, documentation complete.', 'Done'),
        ('Phase 6: Purchase Hosting', '1 day', 'Buy VPS hosting and domain name from chosen provider.', 'Pending'),
        ('Phase 7: Server Setup', '1 day', 'Install Python, Node.js, PostgreSQL, Nginx, SSL on the VPS.', 'Pending'),
        ('Phase 8: Deploy &amp; Connect', '0.5 day', 'Deploy code, run migrations, configure DNS, install SSL.', 'Pending'),
        ('Phase 9: Launch &amp; Test', '0.5 day', 'Smoke testing, change admin password, public announcement.', 'Pending'),
        ('Phase 10: Training', '2 days', 'Train DWT staff on the new web admin and CMS.', 'Pending'),
        ('Phase 11: Support', 'Ongoing', 'Bug fixes, feature requests, security updates, content help.', 'Ongoing'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 14. SECURITY
    # ======================================================
    story.append(section_header('Security &amp; Compliance', 12))

    story.append(Paragraph('<b>Authentication &amp; Authorization</b>', h2_style))
    for s in [
        '<b>JWT (JSON Web Tokens)</b> — 12-hour access tokens, 30-day refresh tokens.',
        '<b>Password hashing</b> — Django uses PBKDF2 with SHA256 by default; passwords are never stored in plaintext.',
        '<b>Role-based access control</b> — four roles (Main Admin, Limited Admin, Staff, Volunteer) with per-module permissions.',
        '<b>Session timeout</b> — Users are auto-logged-out after token expiration; refresh requires re-authentication.',
    ]:
        story.append(Paragraph(f'&#8226; {s}', bullet_style))

    story.append(Paragraph('<b>Transport &amp; Data Security</b>', h2_style))
    for s in [
        '<b>HTTPS everywhere</b> — SSL certificates auto-issued and renewed by Vercel via Let\'s Encrypt.',
        '<b>Database connections</b> — TLS-encrypted to Neon/Postgres provider.',
        '<b>Secrets management</b> — DATABASE_URL, SECRET_KEY, etc. stored as encrypted env vars on Vercel, never committed to git.',
        '<b>CORS allowlist</b> — In production, only the official domain can call the API.',
        '<b>CSRF protection</b> — Django\'s built-in middleware blocks cross-site request forgery.',
        '<b>SQL injection protection</b> — Django ORM parameterizes all queries; no raw SQL.',
        '<b>XSS protection</b> — React escapes all user input by default; Django templates auto-escape.',
    ]:
        story.append(Paragraph(f'&#8226; {s}', bullet_style))

    story.append(Paragraph('<b>Privacy &amp; Data Protection</b>', h2_style))
    for s in [
        'Beneficiary data (students, applicants) stored in encrypted database with limited access.',
        'No third-party tracking or analytics by default (Google Analytics can be added if desired).',
        'Donor anonymity option on the donation form (donor can choose to remain anonymous).',
        'Right to be forgotten — admins can delete any record on request.',
    ]:
        story.append(Paragraph(f'&#8226; {s}', bullet_style))

    story.append(Paragraph('<b>Backup &amp; Disaster Recovery</b>', h2_style))
    for s in [
        'Database is backed up automatically by Neon (point-in-time recovery within last 7 days on free tier).',
        'Source code is version-controlled in GitHub; can be redeployed to any provider from scratch in &lt; 30 minutes.',
        'Manual backup/restore is also available through the admin Backup module (SQLite export).',
        'Vercel keeps deployment history — any previous version can be rolled back instantly.',
    ]:
        story.append(Paragraph(f'&#8226; {s}', bullet_style))

    story.append(PageBreak())

    # ======================================================
    # 15. MAINTENANCE
    # ======================================================
    story.append(section_header('Maintenance &amp; Support Plan', 13))

    story.append(Paragraph('<b>Routine Maintenance (per month)</b>', h2_style))
    story.append(feature_table([
        ('Security updates', 'Apply Django, dependency, and Python security patches; takes ~1 hour.'),
        ('Database optimization', 'Review slow queries, index usage; takes ~30 min.'),
        ('Backup verification', 'Download a manual backup and verify it can be restored to a test environment.'),
        ('Content reviews', 'Audit CMS content for outdated information.'),
        ('Performance review', 'Check Vercel analytics for slow pages and high error rates.'),
        ('User account audit', 'Disable inactive admin accounts and rotate passwords every 6 months.'),
    ]))

    story.append(Paragraph('<b>Support Channels</b>', h2_style))
    story.append(feature_table([
        ('Documentation', 'Built-in PLATFORM_README.md and DEPLOYMENT.md in the repo cover all common tasks.'),
        ('GitHub Issues', 'Bug reports and feature requests can be tracked publicly or privately.'),
        ('Direct Communication', 'WhatsApp / email to the IT lead for urgent issues.'),
        ('Status Page', 'Vercel and Neon both have public status pages for upstream outage tracking.'),
    ]))

    story.append(Paragraph('<b>Recommended Operational SLA</b>', h2_style))
    story.append(info_table([
        ('Uptime target', '99.5 % (allows ~3.6 hours of downtime per month)'),
        ('Critical bug response', 'Same business day'),
        ('Non-critical bug', 'Within 3 business days'),
        ('Feature request', 'Planned in monthly sprint'),
        ('Disaster recovery time', 'Under 1 hour to restore service'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 16. FILE INVENTORY
    # ======================================================
    story.append(section_header('File &amp; Asset Inventory', 14))

    story.append(Paragraph(
        'The complete platform consists of the following major components, all stored '
        'in the GitHub repository:', body_style))

    story.append(Paragraph('<b>Backend (Django)</b>', h2_style))
    story.append(feature_table([
        ('durrani_welfare_system/', 'Django project root — settings, URLs, WSGI.'),
        ('core/', 'Custom user model, authentication, dashboard, backup.'),
        ('students/', 'Student records and attendance.'),
        ('staff/', 'Staff records, supervisors, salary, attendance.'),
        ('volunteers/', 'Volunteer registry.'),
        ('drivers/', 'Driver profiles, vehicle assignments.'),
        ('ambulance/', 'Vehicles, trips, fuel, maintenance.'),
        ('projects/', 'Community welfare projects.'),
        ('accounts/', 'Donations and expenses (finance).'),
        ('daily_expenses/', 'Day-to-day operational spending.'),
        ('salaries/', 'Monthly salary records.'),
        ('reports/', 'PDF report generators using ReportLab.'),
        ('cms/', 'NEW — Site settings, hero banners, news, gallery, services, campaigns, contact, applications, public donations.'),
        ('api/', 'NEW — DRF serializers, viewsets, JWT URLs.'),
    ]))

    story.append(Paragraph('<b>Frontend (Next.js)</b>', h2_style))
    story.append(feature_table([
        ('frontend/src/app/', 'Next.js App Router pages.'),
        ('frontend/src/app/page.tsx', 'Public home page with all sections.'),
        ('frontend/src/app/about, services, news, gallery, contact', 'Public pages.'),
        ('frontend/src/app/volunteer, enroll, donate', 'Public forms.'),
        ('frontend/src/app/admin/', 'Admin dashboard area (login + 25+ admin pages).'),
        ('frontend/src/components/', 'Reusable React components — Header, Footer, AdminLayout, DataTable, FormField, Badge, etc.'),
        ('frontend/src/lib/api.ts', 'API client with JWT handling.'),
        ('frontend/src/hooks/useAuth.ts', 'Authentication hook.'),
    ]))

    story.append(Paragraph('<b>Documentation &amp; Deployment</b>', h2_style))
    story.append(feature_table([
        ('PLATFORM_README.md', 'Complete platform documentation.'),
        ('DEPLOYMENT.md', 'Step-by-step deployment instructions for Vercel / Railway / Render.'),
        ('Procfile', 'Process definition for Railway / Render / Heroku.'),
        ('requirements.txt', 'Python dependencies.'),
        ('runtime.txt', 'Python version for deployment.'),
        ('vercel.json', 'Vercel deployment configuration.'),
        ('render.yaml', 'Render Blueprint for one-click deployment.'),
        ('.gitignore, .vercelignore', 'Files excluded from deployment bundles.'),
    ]))

    story.append(PageBreak())

    # ======================================================
    # 17. RISKS
    # ======================================================
    story.append(section_header('Risks &amp; Mitigation', 15))

    story.append(feature_table([
        ('VPS provider downtime', 'Hosting provider goes offline. Mitigation: pick a reputable provider with 99.5%+ uptime SLA; keep weekly backups off-site so the platform can be restored to a new VPS within hours.'),
        ('Server resource exhaustion', 'Heavy traffic or unoptimized queries slow down the server. Mitigation: monitor CPU/RAM via the provider dashboard; upgrade to a larger plan (still under PKR 3,000/month) when traffic grows.'),
        ('Disk space full', 'Uploaded photos, backups, and logs fill the disk. Mitigation: monthly cleanup of old logs; off-site backup rotation; alerts when disk is 80% full.'),
        ('Lost server access', 'Forgotten root password or lost SSH key. Mitigation: store credentials in a password manager; the VPS provider can reset the password via dashboard.'),
        ('SSL certificate expiry', 'Let\'s Encrypt SSL not renewing automatically. Mitigation: monitor certbot renewal cron; email alerts 14 days before expiry; manual renewal takes 2 minutes.'),
        ('Lost admin credentials', 'Cannot login to dashboard. Mitigation: at least two trusted admin accounts always active; password recovery procedure documented in operations manual.'),
        ('Security vulnerabilities', 'New CVEs disclosed in Django, Python, or other dependencies. Mitigation: monthly maintenance window applies patches; subscribe to Django security mailing list.'),
        ('Domain expiry', 'Domain not renewed in time. Mitigation: enable auto-renewal at the registrar; calendar reminder 30 days before expiry.'),
    ], col_widths=(0.8 * cm, 4 * cm, 11.2 * cm)))

    story.append(PageBreak())

    # ======================================================
    # 18. SIGN-OFF
    # ======================================================
    story.append(section_header('Acceptance &amp; Sign-off', 16))

    story.append(Paragraph(
        'By signing below, the stakeholders acknowledge that the deployment proposal '
        'has been reviewed, the architecture and costs are understood, and authorization '
        'is granted to proceed with the steps outlined in Section 9 (Go-Live Deployment '
        'Plan).', body_style))

    story.append(Spacer(1, 0.8 * cm))

    sig_data = [
        ['Role', 'Name', 'Signature', 'Date'],
        ['Project Sponsor', '', '', ''],
        ['DWT Administrator', '', '', ''],
        ['Technical Lead', '', '', ''],
        ['Finance Approver', '', '', ''],
    ]
    sig_t = Table(sig_data, colWidths=[4 * cm, 4 * cm, 4 * cm, 4 * cm], rowHeights=[0.8 * cm, 1.6 * cm, 1.6 * cm, 1.6 * cm, 1.6 * cm])
    sig_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DWT_GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.4, grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(sig_t)

    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph(
        '<b>Prepared by:</b> DWT IT &amp; Web Platform Team<br/>'
        f'<b>Date of preparation:</b> {datetime.now().strftime("%B %d, %Y")}<br/>'
        '<b>Repository:</b> https://github.com/athar223/durrani-welfare-trust<br/>'
        '<b>Current live URL:</b> https://frontend-chi-three-80.vercel.app<br/>',
        body_style))

    story.append(Spacer(1, 1.5 * cm))

    closing = Table(
        [[Paragraph(
            '<font color="white"><i>This proposal is confidential and intended '
            'solely for the leadership of the Durrani Welfare Trust.</i></font>',
            ParagraphStyle('CloseStyle', fontSize=9, alignment=TA_CENTER,
                           textColor=white)
        )]],
        colWidths=[16 * cm]
    )
    closing.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DWT_DARK),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(closing)

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f'PDF generated: {OUTPUT}')
    print(f'Size: {size_kb:.1f} KB')


if __name__ == '__main__':
    build()
