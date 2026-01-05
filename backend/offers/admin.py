from django.contrib import admin

from offers.models import Offer, OfferStatus

class OfferAdmin(admin.ModelAdmin):
    list_display = ['publication', 'chat', 'offer_author', 'publication_author', 'status_name', 'created_at']

class OfferStatusAdmin(admin.ModelAdmin):
    list_display = ['name']
    
admin.site.register(Offer, OfferAdmin)
admin.site.register(OfferStatus, OfferStatusAdmin)