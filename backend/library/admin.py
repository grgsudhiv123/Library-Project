from django.contrib import admin
from .models import Book, BorrowRecord

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'ISBN', 'category', 'stock', 'availability_status', 'published_date')
    search_fields = ('title', 'author', 'ISBN', 'category')
    list_filter = ('availability_status', 'category')
    readonly_fields = ('availability_status',)



class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'borrow_date', 'return_date', 'is_returned')
    list_filter = ('is_returned', 'borrow_date')  # Filter records based on return status and date
    search_fields = ('book__title', 'user__username')
    readonly_fields = ('is_returned',)
    
admin.site.register(Book, BookAdmin)
admin.site.register(BorrowRecord, BorrowRecordAdmin)

