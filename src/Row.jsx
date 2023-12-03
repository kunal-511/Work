import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Row = () => {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [membersPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [editableRowId, setEditableRowId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
                setMembers(response.data); // Assuming the API response is an array of members
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Logic for displaying members on current page
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    let currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

    // Filter members based on search term
    if (searchTerm) {
        currentMembers = currentMembers.filter(member =>
            Object.values(member).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }

    // Function to handle search input change
    const handleSearch = event => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset current page when the search term changes
    };



    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Edit member by ID

    const editMember = (id, newName) => {
        const updatedMembers = members.map(member =>
            member.id === id ? { ...member, name: newName } : member
        );
        setMembers(updatedMembers);
        //setEditableRowId(null); // Close editing mode
    };

    // Delete member by ID
    const deleteMember = id => {
        const filteredMembers = members.filter(member => member.id !== id);
        setMembers(filteredMembers);
        setSelectedRows(selectedRows.filter(rowId => rowId !== id)); // Remove from selected rows if deleted
    };

    // Handle row selection
    const handleRowSelection = (id) => {
        const selectedIndex = selectedRows.indexOf(id);
        let updatedSelection = [...selectedRows];

        if (selectedIndex === -1) {
            updatedSelection = [...selectedRows, id];
        } else {
            updatedSelection.splice(selectedIndex, 1);
        }

        setSelectedRows(updatedSelection);
    };

    // Toggle select/deselect all for displayed rows
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            const displayedRowsIds = currentMembers.map(member => member.id);
            setSelectedRows(displayedRowsIds);
        }
        setSelectAll(!selectAll);
    };


    // Delete selected rows
    const deleteSelectedRows = () => {
        const filteredMembers = members.filter(
            (member) => !selectedRows.includes(member.id)
        );
        setMembers(filteredMembers);
        setSelectedRows([]);
    };

    return (
        <div>
            <input
                type="text"
                placeholder='Search...'
                value={searchTerm}
                onChange={handleSearch}
            />
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />

            <table className=''>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={index} className={selectedRows.includes(member.id) ? 'selected-row' : 'row'} onClick={() => handleRowSelection(member.id)}>
                            <td>{member.id}</td>
                            <td>
                                {editableRowId === member.id ? (
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={e => editMember(member.id, e.target.value)}
                                        onBlur={() => setEditableRowId(null)}
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={() => setEditableRowId(member.id)}>
                                        {member.name}
                                    </span>
                                )}
                            </td>
                            <td>{member.email}</td>
                            <td>{member.role}</td>
                            <td>
                                <button onClick={() => setEditableRowId(member.id)}>edit</button>
                                <button onClick={() => deleteMember(member.id)}>delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <div>
                {members.length > 0 && (
                    <ul className="pagination">
                        {Array.from(
                            { length: Math.ceil(members.length / membersPerPage) },
                            (_, index) => (
                                <li key={index} onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>
            {/* Delete Selected Button */}
            <button onClick={deleteSelectedRows}>Delete Selected</button>
        </div>
    );
};

export default Row;

// ... (Navbar component remains unchanged)


const Navbar = () => {
    return (
        <>
            <nav className='navbar'>
                <div>logo</div>
                <div>
                    <input type="text" placeholder='search' />
                </div>
            </nav>
        </>
    )
}
export { Navbar }; 
