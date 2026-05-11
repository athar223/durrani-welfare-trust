"""REST API URL configuration."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from . import views

router = DefaultRouter()

# CMS - Public
router.register(r'hero-banners', views.HeroBannerViewSet, basename='hero-banner')
router.register(r'about-sections', views.AboutSectionViewSet, basename='about-section')
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'news', views.NewsPostViewSet, basename='news')
router.register(r'gallery', views.GalleryAlbumViewSet, basename='gallery')
router.register(r'campaigns', views.DonationCampaignViewSet, basename='campaign')
router.register(r'contact-messages', views.ContactMessageViewSet, basename='contact-message')

# Public submissions
router.register(r'student-applications', views.StudentApplicationViewSet, basename='student-application')
router.register(r'volunteer-applications', views.VolunteerApplicationViewSet, basename='volunteer-application')
router.register(r'public-donations', views.PublicDonationViewSet, basename='public-donation')

# User Management (main admin)
router.register(r'users', views.UserViewSet, basename='user')

# Existing modules
router.register(r'students', views.StudentViewSet, basename='student')
router.register(r'student-attendance', views.StudentAttendanceViewSet, basename='student-attendance')
router.register(r'staff', views.StaffViewSet, basename='staff')
router.register(r'staff-attendance', views.StaffAttendanceViewSet, basename='staff-attendance')
router.register(r'volunteers', views.VolunteerViewSet, basename='volunteer')
router.register(r'drivers', views.DriverViewSet, basename='driver')
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'donations', views.DonationViewSet, basename='donation')
router.register(r'expenses', views.ExpenseViewSet, basename='expense')
router.register(r'daily-expenses', views.DailyExpenseViewSet, basename='daily-expense')
router.register(r'salaries', views.SalaryRecordViewSet, basename='salary')

urlpatterns = [
    # Auth
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/me/', views.me_view, name='auth_me'),

    # Site settings (singleton)
    path('site-settings/', views.SiteSettingsView.as_view(), name='site-settings'),

    # Newsletter
    path('newsletter/subscribe/', views.NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),

    # Dashboard
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('dashboard/chart/', views.dashboard_chart_data, name='dashboard-chart'),

    # All viewsets
    path('', include(router.urls)),
]
