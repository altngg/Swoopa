from django.contrib import admin

from .models import PublicationType, Publication, PublicationImage, Status


class PublicationImageInline(admin.TabularInline):
    model = PublicationImage
    extra = 1


class PublicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'description', 'publication_type', 'status']
    list_filter = ['publication_type', 'location', 'price']
    # сортировка по цене осущ. по заполеннности этого поля вообще
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [PublicationImageInline]

class PublicationTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

class StatusAdmin(admin.ModelAdmin):
    list_display = ['name']


admin.site.register(PublicationType, PublicationTypeAdmin)
admin.site.register(Publication, PublicationAdmin)
admin.site.register(Status, StatusAdmin)