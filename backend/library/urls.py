from django.urls import path
from .views import BookListAPI,BookUpdateAPI,BookDeleteAPI,LoginAPI,LogOutAPI,register_user,CustomTokenRefreshView,userBookBorrowApi,BookBorrowRecordApi,CreateBorrowApi,BorrowReturnApi,is_authenticated
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('bookapi/', BookListAPI.as_view()), #get book and create new book api
    path('bookupdateapi/', BookUpdateAPI),  # put and patch or update book api
    path('bookdeleteapi/', BookDeleteAPI), # Delete book 
    path('login/', LoginAPI.as_view()),
    path('logout/', LogOutAPI),
    path('is-authenticated/', is_authenticated),
    path('register/', register_user),
    path('refresh-token/', CustomTokenRefreshView.as_view()),
    path('borrow-record/', BookBorrowRecordApi),
    path('user-borrow-record/', userBookBorrowApi),
    path('borrow-book/', CreateBorrowApi),
    path('return-borrow-book/', BorrowReturnApi),
]