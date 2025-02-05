



import { useEffect, useState } from "react";
import { GetBooks, UserBorrowRecord } from "../../endpoints/api.jsx";
import "./css/userbooklist.css";

const UserHistory = () => {
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


   

    return (
        <div className="user-book-container">
            <h1>Book Borrow History List</h1>
            {borrowRecords.length > 0 ? (
                <>
                    <div className="user-book-list">
                        {currentBorrowRecords.map((record) => (
                            <div key={record.id} className="user-book-card">
                                <img src={`http://127.0.0.1:8000${record.bookDetails.image}`} 
                                     alt={record.bookDetails.title} loading="lazy" />
                                <div className="user-book-info">
                                    <h3>{record.bookDetails.title}</h3>
                                    <p>
                                        <span style={{ color: "grey", fontWeight: "bold" }}>Borrowed on: {record.borrow_date}</span>
                                        <br/>
                                        {record.return_date !== null  
                                        ? <span style={{ color: "green", fontWeight: "bold" }}>Returned on: {record.return_date}</span> 
                                        : <span style={{ color: "red", fontWeight: "bold" }}>Not returned</span>
                                        }
                                    </p>
                                </div>
                                <div className="user-btns-info">
                                    <button
                                    style={{
                                        backgroundImage: record.is_returned 
                                            ? "linear-gradient(135deg,rgb(80, 80, 80), #b2b2b2)" 
                                            : "linear-gradient(135deg,rgb(0, 153, 8), #b2b2b2)",
                                        fontWeight: "bold"
                                    }}
                                    >{record.is_returned ? "Past Borrows" : "Current read"}</button>
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

export default UserHistory;
