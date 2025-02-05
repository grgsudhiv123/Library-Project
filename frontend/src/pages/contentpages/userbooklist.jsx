import { useEffect, useState } from "react";
import { GetBooks, UserBorrowRecord, ReturnBorrowBook } from "../../endpoints/api.jsx";
import "./css/userbooklist.css";

const UserBookList = () => {
    const [borrowRecords, setBorrowRecords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 4;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksRes = await GetBooks();
                const borrowRes = await UserBorrowRecord();

                console.log("Books API Response:", booksRes);
                console.log("Borrow Records API Response:", borrowRes);

                if (!booksRes || !Array.isArray(booksRes)) {
                    console.error("Error: Books API returned an invalid response.");
                    return;
                }

                if (!borrowRes || !Array.isArray(borrowRes)) {
                    console.error("Error: Borrow Records API returned an invalid response.");
                    return;
                }

                // Filter only non-returned borrow records
                const filteredBorrowRecords = borrowRes
                    .filter(record => !record.is_returned)
                    .map(record => {
                        const bookDetails = booksRes.find(book => book.id === record.book);
                        return bookDetails ? { ...record, bookDetails } : null;
                    })
                    .filter(record => record !== null); // Remove null values

                setBorrowRecords(filteredBorrowRecords);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Pagination Logic
    const indexOfLastRecord = currentPage * booksPerPage;
    const indexOfFirstRecord = indexOfLastRecord - booksPerPage;
    const currentBorrowRecords = borrowRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(borrowRecords.length / booksPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const HandleBorrowReturn = async(bookId) => {
        try {
            if (!bookId) {
                alert("Invalid book ID.");
                return;
            }else{
                const msg = await ReturnBorrowBook(bookId);
                alert(msg);
            }
        } catch (error) {
            alert(error);
        }
    };
   




    return (
        <div className="user-book-container">
            <h1>Current Reading List</h1>
            {borrowRecords.length > 0 ? (
                <>
                    <div className="user-book-list">
                        {currentBorrowRecords.map((record) => (
                            <div key={record.id} className="user-book-card">
                                <img src={`http://127.0.0.1:8000${record.bookDetails.image}`} 
                                     alt={record.bookDetails.title} loading="lazy" />
                                <div className="user-book-info">
                                    <h3>{record.bookDetails.title}</h3>
                                    <p style={{ color: "blue", fontWeight: "bold" }}>
                                        Borrowed on: {record.borrow_date}
                                    </p>
                                </div>
                                <div className="user-btns-info">
                                    <button onClick={() => {
                                        HandleBorrowReturn(record.book)
                                    }}
                                    style={{
                                        backgroundImage: record.is_returned 
                                            ? "linear-gradient(135deg,rgb(3, 205, 0), #b2b2b2)" 
                                            : "linear-gradient(135deg,rgb(255, 37, 37), #b2b2b2)",
                                        fontWeight: "bold"
                                    }}
                                    >{record.is_returned ? "Borrow" : "Return"}</button>
                                    <div className="user-status-stock">
                                        <p style={{ color: record.bookDetails.stock > 0 ? "green" : "red", fontWeight: "bold" }}>
                                            {record.bookDetails.stock > 0 ? "Available" : "Not Available"}
                                        </p>
                                        <p>Stock: {record.bookDetails.stock}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="user-pagination">
                        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}>
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)}
                                    className={currentPage === i + 1 ? "active" : ""}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No borrowed books or loading books...</p>
            )}
        </div>
    );
};

export default UserBookList;
