# xrp_balance_app/urls.py
from django.urls import path
from xrp_balance_app.views import XrpBalanceView

urlpatterns = [
    path('get_balance/', XrpBalanceView.as_view(), name='get_balance'),
]
