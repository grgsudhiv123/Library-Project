import { useEffect, useState } from "react";
import { GetBooks, BorrowBook, UserBorrowRecord } from "../../endpoints/api.jsx";
import "./css/books.css";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [borrowRecords, setBorrowRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 7;
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const booksRes = await GetBooks();
                const borrowRes = await UserBorrowRecord();

                console.log("Books API : ", booksRes);
                console.log("Book borrow record API : ", borrowRes);

                if (!Array.isArray(booksRes) || !Array.isArray(borrowRes)) {
                    console.error("Error: Invalid API response.");
                    return;
                }

                setBooks(booksRes);
                setBorrowRecords(borrowRes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchBook();
    }, []);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openBookDetails = (book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    const closeBookDetails = () => {
        setShowModal(false);
        setTimeout(() => setSelectedBook(null), 300);
    };

    const BookBorrowHandle = async (bookId) => {
        if (!bookId) {
            alert("Invalid book ID.");
            return;
        }
        const result = await BorrowBook(bookId);
        if (result) {
            alert(result.message);
            console.log("Borrowed book:", result.borrowData);

            // Refresh borrow records after borrowing
            const updatedBorrowRes = await UserBorrowRecord();
            setBorrowRecords(updatedBorrowRes);
        } else {
            alert("Failed to borrow book.");
        }
    };

    return (
        <div className="book-container">
            {books.length > 0 ? (
                <>
                    <div className="book-grid">
                        {currentBooks.map((book) => {
                            // Find a borrow record for this specific book
                            const borrowRecord = borrowRecords.find(record => record.book === book.id);

                            return (
                                <div 
                                    key={book.id} 
                                    className="book-card" 
                                    onClick={() => openBookDetails(book)}
                                >
                                    <img src={`http://127.0.0.1:8000${book.image}`} alt={book.title} loading="lazy" />
                                    <h3>{book.title}</h3>
                                    <div className="btns-info">
                                        <button 
                                        style={{
                                            backgroundImage: borrowRecord && !borrowRecord.is_returned
                                                ? "linear-gradient(135deg, rgb(255, 37, 37), #b2b2b2)"  // Red-to-gray gradient for borrowed
                                                : "linear-gradient(135deg, rgb(3, 205, 0), #b2b2b2)"   // Green-to-gray gradient for available
                                        }}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            openBookDetails(book);
                                        }}
                                    >
                                        {borrowRecord && !borrowRecord.is_returned ? "Taken" : "Borrow"}
                                    </button>


                                        <div className="status-stock">
                                            <p style={{ color: book.stock !== 0 ? "green" : "red", fontWeight: "bold" }}>
                                                {book.stock > 0 ? "Available" : "Not Available"}
                                            </p>
                                            <p>Stock: {book.stock === 0 ? "0" : book.stock}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {[...Array(Math.ceil(books.length / booksPerPage))].map((_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}>
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(books.length / booksPerPage)))}
                            disabled={currentPage === Math.ceil(books.length / booksPerPage)}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>Loading books...</p>
            )}

            {selectedBook && (
                <div className={`modal-overlay ${showModal ? 'show' : 'hide'}`} onClick={closeBookDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeBookDetails}>X</button>
                        <div className="modal-body">
                            <img src={`http://127.0.0.1:8000${selectedBook.image}`} alt={selectedBook.title} className="book-image" />
                            <div className="book-details">
                                <h2>{selectedBook.title}</h2>
                                <p><strong>Author:</strong> {selectedBook.author}</p>
                                <p><strong>Description:</strong> {selectedBook.description}</p>
                                <p><strong>Availability:</strong> {selectedBook.availability_status}</p>
                                <p><strong>Stock:</strong> {selectedBook.stock}</p>
                                <button onClick={() => BookBorrowHandle(selectedBook.id)} className="borrow-btn">Borrow</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;
