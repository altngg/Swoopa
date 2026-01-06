from django.contrib import admin

from main.models import Publication
from users.models import Location, User

class GeolocationAdmin(admin.ModelAdmin):
    list_display = ['city']


class PublicationAdminInline(admin.TabularInline):
    model = Publication
    extra = 1
    
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'location']
    list_filter = ['location']
    search_fields = ['username', 'email', 'location']
    inlines = [PublicationAdminInline]



admin.site.register(Location, GeolocationAdmin)
admin.site.register(User, UserAdmin)