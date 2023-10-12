from django.http import HttpRequest
from django.shortcuts import render
# from ipware import get_client_ip
from django.shortcuts import render, redirect
from .models import UserLogin
from django.utils.crypto import get_random_string
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

def ourexpertise(request):
    return render(request, 'ourexpertise.html')

def contactus(request):
    return render(request, 'contactus.html')

def faq(request):
    return render(request, 'faq.html')

def animation(request):
    return render(request, 'animation.html')

def usps(request):
    return render(request, 'usps.html')

def about1(request):
    return render(request, 'about1.html')

def navbar(request):
    return render(request, 'navbar.html')

def base(request):
    return render(request, 'base.html')


def success(request):
    return render(request, 'success.html')

def home(request):
    return render(request, 'home.html')

def createtechuman(request):
    return render(request, 'createtechuman.html')

def about2(request):
    return render(request, 'about2.html')

def about3(request):
    return render(request, 'about3.html')

def new(request):
    return render(request, 'new.html')


# def get_client_ip_address(request):
#     req_headers = request.META
#     x_forwarded_for_value = req_headers.get('HTTP_X_FORWARDED_FOR')
#     if x_forwarded_for_value:
#         ip_addr = x_forwarded_for_value.split(',')[-1].strip()
#     else:
#         ip_addr = req_headers.get('REMOTE_ADDR')
#     return ip_addr

# from ipware import get_client_ip

# def my_view(request):
#     client_ip, is_routable = get_client_ip(request)

#     return client_ip
# views.py






def login(request):
    user_ip = request.META.get('REMOTE_ADDR', 'Unknown')
    
    if request.method == 'POST' and 'login_clicked' not in request.session:
        # Replace the following condition with your actual login logic
        # For example, you can check if the username and password match some criteria
        if request.POST.get('username') == 'your_username' and request.POST.get('password') == 'your_password':
            request.session['login_clicked'] = True
            return redirect('success')  # Redirect to dashboard on successful login

    user_count = request.session.get('user_count', 0)
    
    return render(request, 'login.html', {'user_count': user_count, 'user_ip': user_ip})


def success(request):
    return render(request, 'success.html')

def signup(request):
    return render(request, 'signup.html')