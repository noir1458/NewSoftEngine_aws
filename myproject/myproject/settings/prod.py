from .base import *
import os

DEBUG = True  # 일시적으로 True로 변경하여 디버깅

ALLOWED_HOSTS = ['3.38.60.106']

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'mydatabase'),
        'USER': os.environ.get('DB_USER', 'myuser'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'mypassword'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
