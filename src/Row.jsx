import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Row = () => {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [membersPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Edit member by ID
    const editMember = (id, newName) => {
        const updatedMembers = members.map(member =>
            member.id === id ? { ...member, name: newName } : member
        );
        setMembers(updatedMembers);
    };

    // Delete member by ID
    const deleteMember = id => {
        const filteredMembers = members.filter(member => member.id !== id);
        setMembers(filteredMembers);
    };

    // Handle row selection
    const handleRowSelection = id => {
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
        const filteredMembers = members.filter(member => !selectedRows.includes(member.id));
        setMembers(filteredMembers);
        setSelectedRows([]);
    };

    return (
        <div>
            {/* Checkbox for select/deselect all */}
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />

            <ul className=''>
                {currentMembers.map((member, index) => (
                    <div key={index} className={selectedRows.includes(member.id) ? 'selected-row' : ''}>
                        <ul className='title-items' onClick={() => handleRowSelection(member.id)}>
                            <li> {member.id}</li>
                            <li> {member.name}</li>
                            <li> {member.email}</li>
                            <li> {member.role}</li>
                            <li>
                                <button onClick={() => editMember(member.id, 'New Name')}>edit</button>
                                <button onClick={() => deleteMember(member.id)}>delete</button>
                            </li>
                        </ul>
                    </div>
                ))}
            </ul>
            {/* Pagination */}
            <div>
                {members.length > 0 && (
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(members.length / membersPerPage) }, (_, index) => (
                            <li key={index} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </li>
                        ))}
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
