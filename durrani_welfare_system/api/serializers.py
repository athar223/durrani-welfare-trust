"""REST API serializers for all DWT modules."""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from durrani_welfare_system.students.models import Student, StudentAttendance
from durrani_welfare_system.staff.models import StaffMember, StaffAttendance
from durrani_welfare_system.volunteers.models import Volunteer, VolunteerAttendance
from durrani_welfare_system.drivers.models import DriverProfile
from durrani_welfare_system.projects.models import Project
from durrani_welfare_system.accounts.models import Donation, Expense
from durrani_welfare_system.daily_expenses.models import DailyExpense
from durrani_welfare_system.salaries.models import SalaryRecord
from durrani_welfare_system.cms.models import (
    SiteSettings, HeroBanner, AboutSection, Service,
    NewsPost, GalleryAlbum, GalleryImage, DonationCampaign,
    ContactMessage, NewsletterSubscriber,
    StudentApplication, VolunteerApplication, PublicDonation,
    TeamMember, Testimonial, Statistic, Award,
)

User = get_user_model()


# ============================================================
# AUTH
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'role', 'role_display', 'phone', 'profile_image',
                  'is_active', 'is_main_admin', 'is_admin_user',
                  'allowed_modules')
        read_only_fields = ('is_main_admin', 'is_admin_user')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT token response includes user info."""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['full_name'] = user.get_full_name() or user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


# ============================================================
# CMS (Public)
# ============================================================
class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'


class HeroBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroBanner
        fields = '__all__'


class AboutSectionSerializer(serializers.ModelSerializer):
    section_display = serializers.CharField(source='get_section_display', read_only=True)

    class Meta:
        model = AboutSection
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class NewsPostListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = NewsPost
        fields = ('id', 'title', 'slug', 'category', 'category_display',
                  'summary', 'cover_image', 'author', 'is_featured',
                  'published_at')


class NewsPostDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = NewsPost
        fields = '__all__'


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ('id', 'image', 'caption', 'order', 'uploaded_at')


class GalleryAlbumSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    image_count = serializers.IntegerField(source='images.count', read_only=True)

    class Meta:
        model = GalleryAlbum
        fields = ('id', 'title', 'slug', 'description', 'cover_image',
                  'order', 'is_active', 'images', 'image_count', 'created_at')


class DonationCampaignSerializer(serializers.ModelSerializer):
    progress_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = DonationCampaign
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = TeamMember
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class StatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = '__all__'


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('id', 'is_read', 'is_replied', 'submitted_at')


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ('email',)


# ============================================================
# Public Applications
# ============================================================
class StudentApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = StudentApplication
        fields = '__all__'
        read_only_fields = ('id', 'status', 'review_notes', 'linked_student_id',
                            'submitted_at', 'updated_at')


class VolunteerApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = VolunteerApplication
        fields = '__all__'
        read_only_fields = ('id', 'status', 'review_notes', 'linked_volunteer_id',
                            'submitted_at', 'updated_at')


class PublicDonationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = PublicDonation
        fields = '__all__'
        read_only_fields = ('id', 'status', 'linked_donation_id',
                            'submitted_at', 'updated_at')


# ============================================================
# Existing Modules
# ============================================================
class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    education_level_display = serializers.CharField(source='get_education_level_display', read_only=True)

    class Meta:
        model = Student
        fields = '__all__'


class StudentAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = StudentAttendance
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = StaffMember
        fields = '__all__'


class StaffAttendanceSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff_member.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = StaffAttendance
        fields = '__all__'


class VolunteerSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Volunteer
        fields = '__all__'


class DriverSerializer(serializers.ModelSerializer):
    shift_display = serializers.CharField(source='get_shift_display', read_only=True)

    class Meta:
        model = DriverProfile
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    budget_remaining = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    budget_utilization_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class DonationSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Donation
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Expense
        fields = '__all__'


class DailyExpenseSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = DailyExpense
        fields = '__all__'


class SalaryRecordSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    employee_type_display = serializers.CharField(source='get_employee_type_display', read_only=True)
    net_salary = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = SalaryRecord
        fields = '__all__'
