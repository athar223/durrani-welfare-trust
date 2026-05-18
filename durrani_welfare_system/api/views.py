"""REST API ViewSets for all DWT modules."""
from datetime import datetime, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db.models import Sum, Count, Q
from django.utils import timezone

from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action, api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from durrani_welfare_system.students.models import Student, StudentAttendance
from durrani_welfare_system.staff.models import StaffMember, StaffAttendance
from durrani_welfare_system.volunteers.models import Volunteer
from durrani_welfare_system.drivers.models import DriverProfile
from durrani_welfare_system.projects.models import Project
from durrani_welfare_system.accounts.models import Donation, Expense
from durrani_welfare_system.daily_expenses.models import DailyExpense
from durrani_welfare_system.salaries.models import SalaryRecord
from durrani_welfare_system.cms.models import (
    SiteSettings, HeroBanner, AboutSection, Service,
    NewsPost, GalleryAlbum, DonationCampaign,
    ContactMessage, NewsletterSubscriber,
    StudentApplication, VolunteerApplication, PublicDonation,
    TeamMember, Testimonial, Statistic, Award,
)

from . import serializers as s
from .permissions import IsAdminUser, ReadOnlyOrAdmin

User = get_user_model()


# ============================================================
# AUTH
# ============================================================
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = s.CustomTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    """Return the current authenticated user's profile."""
    return Response(s.UserSerializer(request.user).data)


# ============================================================
# CMS - Public read, admin write
# ============================================================
class SiteSettingsView(generics.RetrieveUpdateAPIView):
    """Get / update site-wide settings (singleton)."""
    serializer_class = s.SiteSettingsSerializer
    permission_classes = [ReadOnlyOrAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        return obj


def _is_admin(request):
    return request.user and request.user.is_authenticated and getattr(request.user, 'is_admin_user', False)


class HeroBannerViewSet(viewsets.ModelViewSet):
    serializer_class = s.HeroBannerSerializer
    permission_classes = [ReadOnlyOrAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return HeroBanner.objects.all()
        return HeroBanner.objects.filter(is_active=True)


class AboutSectionViewSet(viewsets.ModelViewSet):
    serializer_class = s.AboutSectionSerializer
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'section'
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return AboutSection.objects.all()
        return AboutSection.objects.filter(is_active=True)


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = s.ServiceSerializer
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return Service.objects.all()
        return Service.objects.filter(is_active=True)


class NewsPostViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'slug'
    filterset_fields = ['category', 'is_featured']
    search_fields = ['title', 'summary', 'content']
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return NewsPost.objects.all()
        return NewsPost.objects.filter(is_published=True)

    def get_serializer_class(self):
        if self.action in ('list',):
            return s.NewsPostListSerializer
        return s.NewsPostDetailSerializer


class GalleryAlbumViewSet(viewsets.ModelViewSet):
    serializer_class = s.GalleryAlbumSerializer
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return GalleryAlbum.objects.all().prefetch_related('images')
        return GalleryAlbum.objects.filter(is_active=True).prefetch_related('images')


class DonationCampaignViewSet(viewsets.ModelViewSet):
    serializer_class = s.DonationCampaignSerializer
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return DonationCampaign.objects.all()
        return DonationCampaign.objects.filter(is_active=True)


class TeamMemberViewSet(viewsets.ModelViewSet):
    serializer_class = s.TeamMemberSerializer
    permission_classes = [ReadOnlyOrAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['category']

    def get_queryset(self):
        if _is_admin(self.request):
            return TeamMember.objects.all()
        return TeamMember.objects.filter(is_active=True)


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = s.TestimonialSerializer
    permission_classes = [ReadOnlyOrAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)


class StatisticViewSet(viewsets.ModelViewSet):
    serializer_class = s.StatisticSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        if _is_admin(self.request):
            return Statistic.objects.all()
        return Statistic.objects.filter(is_active=True)


class AwardViewSet(viewsets.ModelViewSet):
    serializer_class = s.AwardSerializer
    permission_classes = [ReadOnlyOrAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if _is_admin(self.request):
            return Award.objects.all()
        return Award.objects.filter(is_active=True)


# ============================================================
# Public Submissions (no auth required to POST)
# ============================================================
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = s.ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminUser()]


class NewsletterSubscribeView(generics.CreateAPIView):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = s.NewsletterSubscriberSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        sub, created = NewsletterSubscriber.objects.get_or_create(
            email=email, defaults={'is_active': True}
        )
        if not created:
            sub.is_active = True
            sub.save()
        return Response({'message': 'Subscribed successfully', 'email': email},
                        status=status.HTTP_201_CREATED)


class StudentApplicationViewSet(viewsets.ModelViewSet):
    queryset = StudentApplication.objects.all()
    serializer_class = s.StudentApplicationSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['status', 'gender', 'scholarship_required']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        """Approve application and create a Student record."""
        app = self.get_object()
        if app.status == 'approved':
            return Response({'detail': 'Already approved'}, status=400)

        # Create student record from application
        student = Student.objects.create(
            first_name=app.full_name.split()[0] if app.full_name else '',
            last_name=' '.join(app.full_name.split()[1:]) if len(app.full_name.split()) > 1 else '',
            father_name=app.father_name,
            gender=app.gender,
            date_of_birth=app.date_of_birth,
            education_level=app.grade or 'primary',
            guardian_name=app.father_name,
            guardian_contact=app.parent_phone,
            address=app.address,
            admission_date=timezone.now().date(),
            is_active=True,
            notes=app.reason_for_support,
        )
        if app.profile_photo:
            student.profile_image = app.profile_photo
            student.save()

        app.status = 'enrolled'
        app.linked_student_id = student.id
        app.review_notes = request.data.get('notes', '')
        app.save()

        return Response({
            'detail': 'Approved and enrolled',
            'student_id': student.id,
            'application': s.StudentApplicationSerializer(app).data,
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        app = self.get_object()
        app.status = 'rejected'
        app.review_notes = request.data.get('notes', '')
        app.save()
        return Response(s.StudentApplicationSerializer(app).data)


class VolunteerApplicationViewSet(viewsets.ModelViewSet):
    queryset = VolunteerApplication.objects.all()
    serializer_class = s.VolunteerApplicationSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['status']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        app = self.get_object()
        if app.status == 'approved':
            return Response({'detail': 'Already approved'}, status=400)

        # Create volunteer record
        volunteer = Volunteer.objects.create(
            name=app.full_name,
            contact=app.phone,
            email=app.email,
            address=app.address,
            skills=app.skills,
            role='other',
            status='active',
            joining_date=timezone.now().date(),
            availability='part_time',
        )
        if app.profile_photo:
            volunteer.profile_image = app.profile_photo
            volunteer.save()

        app.status = 'approved'
        app.linked_volunteer_id = volunteer.id
        app.review_notes = request.data.get('notes', '')
        app.save()

        return Response({
            'detail': 'Approved',
            'volunteer_id': volunteer.id,
            'application': s.VolunteerApplicationSerializer(app).data,
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        app = self.get_object()
        app.status = 'rejected'
        app.review_notes = request.data.get('notes', '')
        app.save()
        return Response(s.VolunteerApplicationSerializer(app).data)


class PublicDonationViewSet(viewsets.ModelViewSet):
    queryset = PublicDonation.objects.all()
    serializer_class = s.PublicDonationSerializer
    filterset_fields = ['status', 'category', 'campaign']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminUser()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def confirm(self, request, pk=None):
        """Confirm donation and create entry in accounts.Donation."""
        pd = self.get_object()
        if pd.status == 'confirmed':
            return Response({'detail': 'Already confirmed'}, status=400)

        donation = Donation.objects.create(
            donor_name=pd.donor_name,
            contact=pd.contact,
            email=pd.email,
            amount=pd.amount,
            date=timezone.now().date(),
            category=pd.category,
            payment_method=pd.payment_method,
            reference_number=pd.reference_number,
            notes=pd.notes,
        )

        pd.status = 'confirmed'
        pd.linked_donation_id = donation.id
        pd.save()

        # Update campaign raised amount
        if pd.campaign:
            pd.campaign.raised_amount = (pd.campaign.raised_amount or Decimal('0')) + pd.amount
            pd.campaign.save()

        return Response({
            'detail': 'Confirmed',
            'donation_id': donation.id,
            'public_donation': s.PublicDonationSerializer(pd).data,
        })

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        pd = self.get_object()
        pd.status = 'rejected'
        pd.save()
        return Response(s.PublicDonationSerializer(pd).data)


# ============================================================
# User Management (main admin only)
# ============================================================
from .permissions import IsMainAdmin

class UserViewSet(viewsets.ModelViewSet):
    """CRUD for users. Main admin only."""
    queryset = User.objects.all().order_by('username')
    permission_classes = [IsMainAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'first_name', 'last_name', 'email']

    def get_serializer_class(self):
        return s.UserSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        password = data.pop('password', None)
        if hasattr(password, '__iter__') and not isinstance(password, str):
            password = password[0] if password else None
        if not password:
            return Response({'password': ['Password is required']}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(password)
        user.save()
        return Response(s.UserSerializer(user).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        password = data.pop('password', None)
        if hasattr(password, '__iter__') and not isinstance(password, str):
            password = password[0] if password else None
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if password:
            instance.set_password(password)
            instance.save()
        return Response(serializer.data)


# ============================================================
# Existing Modules (admin only)
# ============================================================
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = s.StudentSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['is_active', 'education_level', 'gender']
    search_fields = ['first_name', 'last_name', 'father_name', 'guardian_name']
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class StudentAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StudentAttendance.objects.all()
    serializer_class = s.StudentAttendanceSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'date', 'student']


class StaffViewSet(viewsets.ModelViewSet):
    queryset = StaffMember.objects.all()
    serializer_class = s.StaffSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['is_active', 'role']
    search_fields = ['first_name', 'last_name', 'contact_number']
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class StaffAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StaffAttendance.objects.all()
    serializer_class = s.StaffAttendanceSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'date', 'staff_member']


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = s.VolunteerSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'role', 'availability']
    search_fields = ['name', 'contact', 'email']
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class DriverViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = s.DriverSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['is_active', 'shift']
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = s.ProjectSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'category']
    search_fields = ['name', 'description', 'location']


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = s.DonationSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['category', 'payment_method']
    search_fields = ['donor_name', 'email']


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = s.ExpenseSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['category', 'payment_method']


class DailyExpenseViewSet(viewsets.ModelViewSet):
    queryset = DailyExpense.objects.all()
    serializer_class = s.DailyExpenseSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['category', 'date']


class SalaryRecordViewSet(viewsets.ModelViewSet):
    queryset = SalaryRecord.objects.all()
    serializer_class = s.SalaryRecordSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'employee_type']


# ============================================================
# Dashboard analytics
# ============================================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Dashboard summary statistics."""
    now = timezone.now()
    current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    today = now.date()

    total_donations = Donation.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0

    return Response({
        'total_students': Student.objects.filter(is_active=True).count(),
        'total_staff': StaffMember.objects.filter(is_active=True).count(),
        'total_volunteers': Volunteer.objects.filter(status='active').count(),
        'total_drivers': DriverProfile.objects.filter(is_active=True).count(),
        'total_donations': float(total_donations),
        'total_expenses': float(total_expenses),
        'balance': float(total_donations - total_expenses),
        'monthly_donations': float(
            Donation.objects.filter(date__gte=current_month).aggregate(t=Sum('amount'))['t'] or 0
        ),
        'monthly_expenses': float(
            Expense.objects.filter(date__gte=current_month).aggregate(t=Sum('amount'))['t'] or 0
        ),
        'today_daily_expenses': float(
            DailyExpense.objects.filter(date=today).aggregate(t=Sum('amount'))['t'] or 0
        ),
        'active_projects': Project.objects.filter(status='ongoing').count(),
        'pending_student_applications': StudentApplication.objects.filter(status='pending').count(),
        'pending_volunteer_applications': VolunteerApplication.objects.filter(status='pending').count(),
        'pending_donations': PublicDonation.objects.filter(status='pending').count(),
        'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_chart_data(request):
    """Monthly donation/expense trend for dashboard charts."""
    now = timezone.now()
    six_months_ago = (now - timedelta(days=180)).date()

    from django.db.models.functions import TruncMonth

    donations = (
        Donation.objects.filter(date__gte=six_months_ago)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )
    expenses = (
        Expense.objects.filter(date__gte=six_months_ago)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'))
        .order_by('month')
    )

    return Response({
        'labels': [d['month'].strftime('%b %Y') for d in donations],
        'donations': [float(d['total']) for d in donations],
        'expenses': [float(e['total']) for e in expenses],
    })
