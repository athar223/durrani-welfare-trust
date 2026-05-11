"""Management command to load sample/dummy data for testing."""
import random
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from durrani_welfare_system.core.models import User
from durrani_welfare_system.students.models import Student, StudentAttendance
from durrani_welfare_system.staff.models import StaffMember, StaffAttendance
from durrani_welfare_system.volunteers.models import Volunteer, VolunteerAttendance
from durrani_welfare_system.drivers.models import DriverProfile, DriverAttendance, DriverTripLog, DriverFuelLog
from durrani_welfare_system.ambulance.models import Vehicle, Driver, TripLog, FuelLog, MaintenanceLog
from durrani_welfare_system.projects.models import Project
from durrani_welfare_system.accounts.models import Donation, Expense
from durrani_welfare_system.daily_expenses.models import DailyExpense
from durrani_welfare_system.salaries.models import SalaryRecord


class Command(BaseCommand):
    help = 'Load sample data for Durrani Welfare Trust Management System'

    def handle(self, *args, **options):
        self.stdout.write('Loading sample data...\n')

        # ── Users ──
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin', password='admin123',
                email='admin@dwtrust.org', first_name='Admin', last_name='User',
                role='admin', phone='0300-1234567'
            )
            self.stdout.write(self.style.SUCCESS('  Created admin user (admin/admin123)'))

        if not User.objects.filter(username='limited_admin').exists():
            User.objects.create_user(
                username='limited_admin', password='admin123',
                email='limited@dwtrust.org', first_name='Limited', last_name='Admin',
                role='limited_admin', phone='0300-2345678',
                allowed_modules='students,volunteers,daily_expenses',
                is_staff=True,
            )
            self.stdout.write(self.style.SUCCESS('  Created limited admin (limited_admin/admin123)'))

        if not User.objects.filter(username='staff1').exists():
            User.objects.create_user(
                username='staff1', password='staff123',
                email='staff@dwtrust.org', first_name='Ahmad', last_name='Khan',
                role='staff', phone='0301-7654321'
            )
            self.stdout.write(self.style.SUCCESS('  Created staff user (staff1/staff123)'))

        # ── Students ──
        student_data = [
            ('Muhammad', 'Ali', 8, 'Zahid Ali', 'Father', '0300-1111111', 'primary'),
            ('Fatima', 'Bibi', 10, 'Abdul Rehman', 'Father', '0301-2222222', 'primary'),
            ('Ahmad', 'Khan', 12, 'Imran Khan', 'Father', '0302-3333333', 'middle'),
            ('Aisha', 'Noor', 14, 'Noor Muhammad', 'Father', '0303-4444444', 'middle'),
            ('Usman', 'Ghani', 16, 'Ghani Khan', 'Father', '0304-5555555', 'secondary'),
            ('Zainab', 'Fatima', 6, 'Tariq Mehmood', 'Father', '0305-6666666', 'nursery'),
            ('Bilal', 'Ahmed', 11, 'Ahmed Shah', 'Father', '0306-7777777', 'primary'),
            ('Maryam', 'Siddiqui', 15, 'Siddiq Ahmed', 'Father', '0307-8888888', 'secondary'),
            ('Hassan', 'Raza', 17, 'Raza Ali', 'Father', '0308-9999999', 'higher_secondary'),
            ('Hafsa', 'Durrani', 9, 'Durrani Khan', 'Uncle', '0309-0000000', 'primary'),
            ('Ibrahim', 'Shah', 13, 'Shah Nawaz', 'Father', '0310-1112222', 'middle'),
            ('Khadija', 'Begum', 7, 'Begum Zada', 'Mother', '0311-3334444', 'nursery'),
            ('Yusuf', 'Amin', 18, 'Amin Ullah', 'Father', '0312-5556666', 'graduation'),
            ('Sana', 'Malik', 11, 'Malik Zaman', 'Father', '0313-7778888', 'primary'),
            ('Hamza', 'Qureshi', 14, 'Qureshi Sahab', 'Guardian', '0314-9990000', 'middle'),
        ]
        students = []
        for fn, ln, age, gn, gr, cn, el in student_data:
            s, created = Student.objects.get_or_create(
                first_name=fn, last_name=ln,
                defaults={
                    'age': age, 'guardian_name': gn, 'guardian_relation': gr,
                    'contact_number': cn, 'education_level': el,
                    'admission_date': date.today() - timedelta(days=random.randint(30, 365)),
                    'address': f'Village {fn}pur, District Peshawar',
                }
            )
            students.append(s)
            if created:
                self.stdout.write(f'  Created student: {s.full_name}')

        # Student Attendance (last 7 days)
        for day_offset in range(7):
            d = date.today() - timedelta(days=day_offset)
            for student in students:
                StudentAttendance.objects.get_or_create(
                    student=student, date=d,
                    defaults={'status': random.choice(['present', 'present', 'present', 'absent', 'leave'])}
                )
        self.stdout.write(self.style.SUCCESS('  Created student attendance'))

        # ── Staff Members ──
        staff_data = [
            ('Muhammad', 'Ismail', 'teacher', '0320-1111111', 25000),
            ('Saeed', 'Ahmad', 'teacher', '0321-2222222', 22000),
            ('Nazia', 'Begum', 'teacher', '0322-3333333', 20000),
            ('Tariq', 'Mehmood', 'admin_staff', '0323-4444444', 18000),
            ('Zahid', 'Shah', 'coordinator', '0327-8888888', 30000),
            ('Waqas', 'Ahmed', 'accountant', '0329-0000000', 28000),
            ('Kamran', 'Ali', 'guard', '0330-1111222', 15000),
        ]
        staff_members = []
        for fn, ln, role, cn, salary in staff_data:
            sm, created = StaffMember.objects.get_or_create(
                first_name=fn, last_name=ln,
                defaults={
                    'role': role, 'contact_number': cn, 'base_salary': Decimal(str(salary)),
                    'joining_date': date.today() - timedelta(days=random.randint(60, 500)),
                    'address': f'Mohalla {fn}, Peshawar', 'supervisor': 'Zahid Shah',
                }
            )
            staff_members.append(sm)
            if created:
                self.stdout.write(f'  Created staff: {sm.full_name}')

        # Staff Attendance (last 7 days)
        for day_offset in range(7):
            d = date.today() - timedelta(days=day_offset)
            for sm in staff_members:
                StaffAttendance.objects.get_or_create(
                    staff_member=sm, date=d,
                    defaults={'status': random.choice(['present', 'present', 'present', 'present', 'absent'])}
                )
        self.stdout.write(self.style.SUCCESS('  Created staff attendance'))

        # ── Volunteers ──
        volunteer_data = [
            ('Amina', 'Bibi', 'teaching_volunteer', '0326-7777777', 'Teaching, Counseling'),
            ('Rukhsana', 'Khatoon', 'field_worker', '0328-9999999', 'Community Outreach, Data Collection'),
            ('Saima', 'Noor', 'medical_volunteer', '0331-2223344', 'First Aid, Health Awareness'),
            ('Adnan', 'Malik', 'fundraiser', '0332-3334455', 'Event Management, Fundraising'),
            ('Zubair', 'Khan', 'coordinator', '0333-4445566', 'Project Coordination, Reporting'),
            ('Hina', 'Shah', 'field_worker', '0334-5556677', 'Survey, Community Mobilization'),
            ('Faisal', 'Ahmed', 'teaching_volunteer', '0335-6667788', 'Tutoring, Mentoring'),
            ('Nadia', 'Begum', 'medical_volunteer', '0336-7778899', 'Nursing, Patient Care'),
        ]
        volunteers = []
        for fn, ln, role, cn, skills in volunteer_data:
            v, created = Volunteer.objects.get_or_create(
                first_name=fn, last_name=ln,
                defaults={
                    'role': role, 'contact_number': cn, 'skills': skills,
                    'status': random.choice(['active', 'active', 'active', 'on_leave']),
                    'joining_date': date.today() - timedelta(days=random.randint(30, 365)),
                    'availability': random.choice(['part_time', 'weekends', 'full_time']),
                    'assigned_tasks': f'{role.replace("_", " ").title()} duties',
                    'address': f'Area {fn}, Peshawar',
                }
            )
            volunteers.append(v)
            if created:
                self.stdout.write(f'  Created volunteer: {v.full_name}')

        # Volunteer Attendance (last 7 days)
        for day_offset in range(7):
            d = date.today() - timedelta(days=day_offset)
            for v in volunteers:
                VolunteerAttendance.objects.get_or_create(
                    volunteer=v, date=d,
                    defaults={'status': random.choice(['present', 'present', 'absent', 'leave'])}
                )
        self.stdout.write(self.style.SUCCESS('  Created volunteer attendance'))

        # ── Drivers ──
        driver_data = [
            ('Rashid', 'Khan', '0324-5555555', 'PES-DL-2024001', 'PES-1234', 'morning', 20000),
            ('Farhan', 'Ali', '0325-6666666', 'PES-DL-2024002', 'PES-5678', 'evening', 18000),
            ('Imran', 'Gul', '0337-8889900', 'PES-DL-2024003', 'PES-9012', 'rotating', 19000),
        ]
        driver_profiles = []
        for fn, ln, cn, lic, veh, shift, salary in driver_data:
            dp, created = DriverProfile.objects.get_or_create(
                license_number=lic,
                defaults={
                    'first_name': fn, 'last_name': ln, 'contact_number': cn,
                    'vehicle_assigned': veh, 'shift': shift,
                    'base_salary': Decimal(str(salary)),
                    'joining_date': date.today() - timedelta(days=random.randint(60, 400)),
                    'license_expiry': date.today() + timedelta(days=random.randint(180, 730)),
                    'address': f'Village {fn}abad, Peshawar',
                }
            )
            driver_profiles.append(dp)
            if created:
                self.stdout.write(f'  Created driver: {dp.full_name}')

        # Driver Attendance (last 7 days)
        for day_offset in range(7):
            d = date.today() - timedelta(days=day_offset)
            for dp in driver_profiles:
                DriverAttendance.objects.get_or_create(
                    driver=dp, date=d,
                    defaults={'status': random.choice(['present', 'present', 'present', 'absent'])}
                )

        # Driver Trip Logs
        for i in range(15):
            dp = random.choice(driver_profiles)
            DriverTripLog.objects.get_or_create(
                driver=dp,
                date=date.today() - timedelta(days=random.randint(0, 45)),
                patient_name=f'Patient {random.choice(["Ali", "Khan", "Ahmad"])} #{i+1}',
                defaults={
                    'vehicle_used': dp.vehicle_assigned,
                    'pickup_location': random.choice(['Hayatabad', 'University Town', 'Saddar']),
                    'drop_location': random.choice(['Lady Reading Hospital', 'KTH', 'HMC']),
                    'distance_km': Decimal(str(random.randint(5, 30))),
                }
            )

        # Driver Fuel Logs
        for dp in driver_profiles:
            for _ in range(3):
                DriverFuelLog.objects.get_or_create(
                    driver=dp,
                    date=date.today() - timedelta(days=random.randint(0, 30)),
                    fuel_liters=Decimal(str(random.randint(20, 50))),
                    defaults={
                        'vehicle_used': dp.vehicle_assigned,
                        'cost': Decimal(str(random.randint(3000, 7000))),
                        'odometer_reading': 50000 + random.randint(0, 5000),
                    }
                )
        self.stdout.write(self.style.SUCCESS('  Created driver logs'))

        # ── Ambulance Vehicles ──
        vehicles_data = [
            ('PES-1234', 'ambulance', 'Toyota HiAce', 2020),
            ('PES-5678', 'ambulance', 'Suzuki Bolan', 2019),
            ('PES-9012', 'van', 'Toyota Corolla Van', 2021),
        ]
        vehicles = []
        for vn, vt, mm, yr in vehicles_data:
            v, created = Vehicle.objects.get_or_create(
                vehicle_number=vn,
                defaults={'vehicle_type': vt, 'make_model': mm, 'year': yr}
            )
            vehicles.append(v)
            if created:
                self.stdout.write(f'  Created vehicle: {vn}')

        # Ambulance drivers
        drivers = []
        for i, dp in enumerate(driver_profiles[:2]):
            d, created = Driver.objects.get_or_create(
                name=dp.full_name,
                defaults={
                    'contact_number': dp.contact_number,
                    'license_number': dp.license_number,
                    'vehicle': vehicles[i] if i < len(vehicles) else None,
                    'joined_date': dp.joining_date,
                }
            )
            drivers.append(d)

        # Trip Logs
        if drivers and vehicles:
            for i in range(20):
                TripLog.objects.get_or_create(
                    vehicle=random.choice(vehicles),
                    driver=random.choice(drivers),
                    date=date.today() - timedelta(days=random.randint(0, 60)),
                    patient_name=f'Patient {random.choice(["Ali", "Khan", "Ahmad", "Bibi"])} #{i+1}',
                    defaults={
                        'pickup_location': random.choice(['Hayatabad', 'University Town', 'Saddar', 'GT Road']),
                        'drop_location': random.choice(['Lady Reading Hospital', 'KTH', 'HMC']),
                        'distance_km': Decimal(str(random.randint(5, 30))),
                    }
                )
        self.stdout.write(self.style.SUCCESS('  Created ambulance trip logs'))

        # Fuel & Maintenance Logs
        for v in vehicles:
            for _ in range(3):
                FuelLog.objects.get_or_create(
                    vehicle=v,
                    date=date.today() - timedelta(days=random.randint(0, 45)),
                    fuel_liters=Decimal(str(random.randint(20, 50))),
                    defaults={
                        'cost': Decimal(str(random.randint(3000, 8000))),
                        'odometer_reading': 50000 + random.randint(0, 5000),
                    }
                )
            MaintenanceLog.objects.get_or_create(
                vehicle=v,
                date=date.today() - timedelta(days=random.randint(10, 90)),
                description=random.choice(['Oil change', 'Tire replacement', 'Brake service']),
                defaults={
                    'cost': Decimal(str(random.randint(2000, 15000))),
                    'mechanic_name': 'Ustad Karim',
                }
            )
        self.stdout.write(self.style.SUCCESS('  Created fuel & maintenance logs'))

        # ── Projects ──
        projects_data = [
            ('Clean Water Initiative', 'Charsadda', 500000, 320000, 1500, 'ongoing', 'water_sanitation'),
            ('School Building Project', 'Peshawar', 2000000, 1800000, 300, 'ongoing', 'education'),
            ('Free Medical Camp', 'Mardan', 150000, 145000, 800, 'completed', 'healthcare'),
            ('Flood Relief 2024', 'Nowshera', 1000000, 980000, 5000, 'completed', 'relief'),
            ('Road Repair Initiative', 'Swabi', 300000, 50000, 2000, 'planned', 'infrastructure'),
            ('Winterization Program', 'Dir', 400000, 200000, 600, 'ongoing', 'relief'),
        ]
        for name, loc, budget, exp, bene, status, cat in projects_data:
            Project.objects.get_or_create(
                name=name,
                defaults={
                    'location': loc, 'budget': Decimal(str(budget)),
                    'expenses': Decimal(str(exp)), 'beneficiaries_count': bene,
                    'status': status, 'category': cat,
                    'start_date': date.today() - timedelta(days=random.randint(30, 180)),
                    'description': f'{name} in {loc} serving {bene} beneficiaries.',
                }
            )
        self.stdout.write(self.style.SUCCESS('  Created projects'))

        # ── Donations ──
        donors = [
            ('Haji Abdul Qadir', 'general', 'cash'),
            ('Dr. Farooq Ahmed', 'education', 'bank_transfer'),
            ('Malik Sahab', 'zakat', 'cash'),
            ('Mrs. Nasreen Akhtar', 'healthcare', 'cheque'),
            ('Khan Foundation', 'general', 'bank_transfer'),
            ('Anonymous Donor', 'sadqa', 'cash'),
            ('Overseas Pakistani Forum', 'education', 'online'),
            ('Local Business Council', 'general', 'cheque'),
            ('Dr. Ayesha Siddiqui', 'healthcare', 'bank_transfer'),
            ('Engr. Bilal Khan', 'fitrana', 'cash'),
        ]
        for _ in range(25):
            donor = random.choice(donors)
            Donation.objects.get_or_create(
                donor_name=donor[0],
                date=date.today() - timedelta(days=random.randint(0, 180)),
                amount=Decimal(str(random.choice([5000, 10000, 25000, 50000, 100000, 200000]))),
                defaults={
                    'category': donor[1], 'payment_method': donor[2],
                    'donor_contact': f'030{random.randint(0,9)}-{random.randint(1000000,9999999)}',
                }
            )
        self.stdout.write(self.style.SUCCESS('  Created donations'))

        # ── Expenses ──
        expense_items = [
            ('Teacher salaries - Monthly', 'salaries', 120000),
            ('Office rent', 'rent', 25000),
            ('Electricity bill', 'utilities', 8000),
            ('Student books and supplies', 'education', 15000),
            ('Ambulance fuel', 'transport', 12000),
            ('Medical supplies', 'medical', 20000),
            ('Office supplies', 'office', 5000),
            ('Building maintenance', 'maintenance', 10000),
            ('Food for students (monthly)', 'food', 30000),
            ('Driver salaries', 'salaries', 40000),
        ]
        for _ in range(30):
            item = random.choice(expense_items)
            Expense.objects.get_or_create(
                description=item[0],
                date=date.today() - timedelta(days=random.randint(0, 180)),
                amount=Decimal(str(item[2] + random.randint(-2000, 2000))),
                defaults={
                    'category': item[1],
                    'payment_method': random.choice(['cash', 'bank_transfer']),
                    'paid_to': random.choice(['Vendor', 'Staff', 'Utility Company']),
                }
            )
        self.stdout.write(self.style.SUCCESS('  Created expenses'))

        # ── Daily Expenses ──
        daily_categories = ['breakfast', 'lunch', 'snacks', 'health_checkup', 'medicine',
                          'cleaning', 'stationery', 'transport', 'miscellaneous']
        daily_descriptions = {
            'breakfast': ['Student breakfast', 'Morning tea & snacks for staff'],
            'lunch': ['Student lunch', 'Staff lunch'],
            'snacks': ['Evening snacks', 'Guest refreshments'],
            'health_checkup': ['Monthly health checkup', 'Eye examination camp'],
            'medicine': ['First aid supplies', 'Medicines for students'],
            'cleaning': ['Cleaning supplies', 'Washroom maintenance'],
            'stationery': ['Notebooks & pens', 'Printing & copies'],
            'transport': ['Local transport', 'Auto rickshaw fares'],
            'miscellaneous': ['Miscellaneous items', 'Emergency purchase'],
        }
        for day_offset in range(30):
            d = date.today() - timedelta(days=day_offset)
            num_expenses = random.randint(2, 5)
            for _ in range(num_expenses):
                cat = random.choice(daily_categories)
                DailyExpense.objects.get_or_create(
                    date=d,
                    category=cat,
                    description=random.choice(daily_descriptions[cat]),
                    defaults={
                        'amount': Decimal(str(random.choice([200, 500, 800, 1000, 1500, 2000, 3000]))),
                        'paid_by': random.choice(['Office', 'Tariq Mehmood', 'Zahid Shah']),
                    }
                )
        self.stdout.write(self.style.SUCCESS('  Created daily expenses (30 days)'))

        # ── Salary Records ──
        current_month = date.today().replace(day=1)
        last_month = (current_month - timedelta(days=1)).replace(day=1)

        for month in [last_month, current_month]:
            # Staff salaries
            for sm in staff_members:
                SalaryRecord.objects.get_or_create(
                    employee_type='staff',
                    employee_id=sm.id,
                    month=month,
                    defaults={
                        'employee_name': sm.full_name,
                        'base_salary': sm.base_salary,
                        'allowances': Decimal(str(random.choice([0, 1000, 2000, 3000]))),
                        'deductions': Decimal(str(random.choice([0, 500, 1000]))),
                        'bonus': Decimal(str(random.choice([0, 0, 0, 2000, 5000]))),
                        'status': 'paid' if month == last_month else 'pending',
                        'payment_date': month + timedelta(days=28) if month == last_month else None,
                        'payment_method': 'cash',
                    }
                )
            # Driver salaries
            for dp in driver_profiles:
                SalaryRecord.objects.get_or_create(
                    employee_type='driver',
                    employee_id=dp.id,
                    month=month,
                    defaults={
                        'employee_name': dp.full_name,
                        'base_salary': dp.base_salary,
                        'allowances': Decimal('1500'),
                        'deductions': Decimal(str(random.choice([0, 500]))),
                        'overtime_hours': Decimal(str(random.randint(0, 20))),
                        'overtime_rate': Decimal('200'),
                        'status': 'paid' if month == last_month else 'pending',
                        'payment_date': month + timedelta(days=28) if month == last_month else None,
                        'payment_method': 'cash',
                    }
                )
        self.stdout.write(self.style.SUCCESS('  Created salary records (2 months)'))

        self.stdout.write(self.style.SUCCESS('\n=== Sample data loaded successfully! ==='))
        self.stdout.write(self.style.SUCCESS('Login credentials:'))
        self.stdout.write(self.style.SUCCESS('  Main Admin:    admin / admin123'))
        self.stdout.write(self.style.SUCCESS('  Limited Admin: limited_admin / admin123  (Students, Volunteers, Daily Expenses only)'))
        self.stdout.write(self.style.SUCCESS('  Staff:         staff1 / staff123'))
