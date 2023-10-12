# your_app/middleware.py
from django.utils import timezone

class UserLoginMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            # Track user login count
            if 'login_count' not in request.session:
                request.session['login_count'] = 1
            else:
                request.session['login_count'] += 1

            # Store user IP and login timestamp
            user_ip = request.META.get('REMOTE_ADDR', None)
            login_timestamp = timezone.now().isoformat()

            if 'login_info' not in request.session:
                request.session['login_info'] = []

            request.session['login_info'].append({'ip': user_ip, 'timestamp': login_timestamp})
            request.session.modified = True  # Mark the session as modified

        response = self.get_response(request)
        return response
