from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('outofstock', 'Out of Stock'),
    ]

    title = models.CharField(max_length=250)
    author = models.CharField(max_length=255)
    ISBN = models.CharField(max_length=13, unique=True)
    category = models.CharField(max_length=250)
    published_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='books/',blank=True, null=True)    
    stock = models.PositiveIntegerField(default=0)

    availability_status = models.CharField(
        max_length=20, choices=AVAILABILITY_CHOICES, default='available'
    )

    def __str__(self):
        return f"{self.title} by {self.author}"

    def update_availability(self):
        """ Update book availability based on stock and active borrow records """
        if self.stock is None or self.stock == 0:
            self.availability_status = 'outofstock'
        else:
            active_borrow_records = self.borrow_records.filter(is_returned=False)
            self.availability_status = 'reserved' if active_borrow_records.exists() else 'available'

        self.save()

    def decrease_stock(self):
        """ Reduce stock by 1 and update availability """
        if self.stock > 0:
            self.stock -= 1
            self.update_availability()

    def increase_stock(self, amount=1):
        """ Increase stock by a given amount and update availability """
        self.stock += amount
        self.update_availability()


class BorrowRecord(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrow_records')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='borrow_records')
    borrow_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.return_date:
            self.is_returned = True
            self.book.increase_stock()  # Return book to stock
        else:
            self.is_returned = False
            self.book.decrease_stock()  # Reduce stock when borrowed

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"

    class Meta:
        verbose_name = "Borrow Record"
        verbose_name_plural = "Borrow Records"
