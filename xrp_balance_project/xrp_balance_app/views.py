# xrp_balance_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
import requests

class XrpBalanceView(APIView):
    def get(self, request, *args, **kwargs):
        account_address = request.query_params.get('account_address')
        if not account_address:
            return Response({'error': 'Please provide a valid account address'}, status=400)

        try:
            url = f'https://data.ripple.com/v2/accounts/{account_address}'
            response = requests.get(url)
            data = response.json()
            genesis_balance = data.get('account_data', {}).get('genesis_balance')
            return Response({'account_address': account_address, 'genesis_balance': genesis_balance})
        except requests.RequestException:
            return Response({'error': 'Failed to fetch data from XRPL API'}, status=500)
