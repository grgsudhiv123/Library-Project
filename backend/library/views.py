from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView;
from rest_framework.decorators import api_view, permission_classes
from .models import Book, BorrowRecord
from .serializer import BookSerializer,BookBorrowSerializer,UserRegistrationSerializer

from rest_framework.permissions import IsAuthenticated,AllowAny

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from datetime import date
from rest_framework import status



# Create your views here.

# user management and authentication api
class LoginAPI(TokenObtainPairView):
    def post(self,request,*args, **kwargs):
        try:
            # It first calls the parent class's post method to handle the actual authentication 
            # logic (checking username/password).If authentication is successful, DRF generates the token pair.
            response = super().post(request,*args, **kwargs)  
            tokens = response.data
            
            if not tokens.get("access") or not tokens.get("refresh"):  # Ensure tokens exist
                return Response({
                    'success': False,
                    'detail': 'Invalid username or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            res = Response()
            res.data = {'success' : True}
            
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res
        except:
            return Response({
                'success' : False,
                'detail' : 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            
            request.data['refresh'] = refresh_token
            
            # Calls the parent class's post method to handle the token refresh logic. 
            # It verifies the refresh token and generates a new access token.
            response = super().post(request,*args, **kwargs) 
            
            tokens = response.data
            access_token = tokens['access']
            
            res = Response()
            res.data = {'refreshed' : True}
            
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path="/"
            )
            return res
        except:
            return Response({'refreshed' : True})


@api_view(['POST'])
def LogOutAPI(request):
    try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token',path='/',samesite='None')
        res.delete_cookie('refresh_token',path='/',samesite='None')
        return res
    except:
        return Response({'success' : False})
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    username = request.user.username
    email = request.user.email
    data = {
        "username" : username,
        "email" : email
    }
    print(username)
    print(email)
    return Response({'authenticated' : True, 'userdata':data})


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer=UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)




# Book management api
class BookListAPI(APIView):
    permission_classes = [IsAuthenticated]
    # used to get all book
    def get(self, request):
        bookList = Book.objects.all()
        book_serializer = BookSerializer(bookList, many=True)
        return Response({
            "status" : 200,
            "bookdata" : book_serializer.data,
            "message" : "request sent successfully"
        })

        
    def post(self, request):
        data = request.data
        postbook_serializer = BookSerializer(data=request.data, many=True)
        if not postbook_serializer.is_valid():
            error=postbook_serializer.errors
            return Response({
                "status" : 403,
                "errors" : error,
                "message" : "something went wrong"
            })
            
        postbook_serializer.save()
        
        return Response({
            "status" : 200,
            "bookdata" : data,
            "message" : "data sent successfully"
        })
        

        
            

    

@api_view(['PUT','PATCH'])
@permission_classes([IsAuthenticated])
def BookUpdateAPI(request):
    try :
        book_obj = Book.objects.get(id=request.data['id'])
    except Book.DoesNotExist :
        return Response({
          'error' : 'Book doesnt exist'  
        }) 
    
    book_serializer = BookSerializer(book_obj, data=request.data, partial=True)
    
    if not book_serializer.is_valid():
            error=book_serializer.errors
            return Response({
                "status" : 403,
                "errors" : error,
                "message" : "something went wrong"
            })
            
    book_serializer.save()
        
    return Response({
        "status" : 200,
        "bookdata" : book_serializer.data,
        "message" : "data sent successfully"
    })
        
        
        
@api_view(['DELETE']) 
@permission_classes([IsAuthenticated])     
def BookDeleteAPI(request):
    try:
        book_obj = Book.objects.get(id=request.data['id'])
        book_obj.delete()
        return Response({
            "status" : 200,
            'message' : "successfully deleted"
        })
    except Exception as e :
        return Response({                
            "status" : 403,
            'message' : 'Invalid id'
        })
    
    
    
#  Borrow management


# get borrow record
# gives book borrow record of every users altogether
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def BookBorrowRecordApi(request):
    borrowData = BorrowRecord.objects.all()
    borrowSerializer = BookBorrowSerializer(borrowData,many=True)
    return Response({
        "status" : 200,
        "borrowData" : borrowSerializer.data,
        "message" : "request sent successfully"
    })

# gives borrow record of the logged in user only
@api_view(['GET'])
@permission_classes([AllowAny])
def userBookBorrowApi(request):
    borrowData = BorrowRecord.objects.filter(user=request.user)
    borrowSerializer = BookBorrowSerializer(borrowData,many=True)
    return Response({
        "status" : 200,
        "borrowData" : borrowSerializer.data,
        "message" : "request sent successfully"
    })
    

# user borrow book api
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def CreateBorrowApi(request):
    user = request.user
    book_id = request.data.get('book')

    try:
        book = Book.objects.get(id=book_id)

        # Check if the book is already borrowed
        existing_borrow = BorrowRecord.objects.filter(book=book, is_returned=False).first()

        if existing_borrow:
            return Response({
                'status': 403,
                'message': f'"{book.title}" is already borrowed.'
            }, status=403)

        # Create a new borrow record
        borrow_date = date.today()
        borrow_record = BorrowRecord.objects.create(
            book=book,
            user=user,
            borrow_date=borrow_date
        )

        # Update availability status
        book.update_availability()

        # Serialize and return the borrow record data
        borrow_record_serializer = BookBorrowSerializer(borrow_record)

        return Response({
            'status': 200,
            'borrowData': borrow_record_serializer.data,
            'message': f'You have successfully borrowed "{book.title}".'
        }, status=200)

    except Book.DoesNotExist:
        return Response({
            'status': 404,
            'message': 'Book not found.'
        }, status=404)
        
        
        
#  book return api
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def BorrowReturnApi(request):
    user = request.user
    book_id = request.data.get('book')

    try:
        # Get the borrow record where the book is currently borrowed by the user
        borrow_record = BorrowRecord.objects.filter(book_id=book_id, user=user, is_returned=False).first()

        if not borrow_record:
            return Response({
                'status': 404,
                'message': 'No active borrow record found for this book by the user.'
            }, status=404)
        # Update return date and mark as returned
        return_date = date.today()
        borrow_record.return_date = return_date
        borrow_record.is_returned = True
        borrow_record.save()

        # Update the book's availability status
        borrow_record.book.update_availability()

        return Response({
            'status': 200,
            'message': f'Book {borrow_record.book.title} returned successfully.',
            'return_date': return_date
        }, status=200)

    except Book.DoesNotExist:
        return Response({
            'status': 404,
            'message': 'Book not found.'
        }, status=404)
        
        
        







# sho wthe current borrow records