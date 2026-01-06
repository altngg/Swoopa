from django.contrib import admin

from offers.models import Offer, OfferStatus

class OfferAdmin(admin.ModelAdmin):
    list_display = ['publication', 'offer_author', 'publication_author', 'created_at']

class OfferStatusAdmin(admin.ModelAdmin):
    list_display = ['name']
    
admin.site.register(Offer, OfferAdmin)
admin.site.register(OfferStatus, OfferStatusAdmin)