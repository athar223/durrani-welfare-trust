"""Global context processors for template rendering."""


def global_context(request):
    ctx = {
        'site_name': 'Durrani Welfare Trust',
        'site_tagline': 'Serving Humanity with Compassion',
    }
    if request.user.is_authenticated:
        ctx['user_can_delete'] = request.user.can_delete()
        ctx['is_main_admin'] = request.user.is_main_admin
        ctx['is_limited_admin'] = request.user.is_limited_admin
    return ctx
