import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin4Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";



const Row = () => {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [membersPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [editableRowId, setEditableRowId] = useState(null);
    const [editableEmailRowId, setEditableEmailRowId] = useState(null); // State for editable email row
    const [editableRoleRowId, setEditableRoleRowId] = useState(null); // State for editable role row
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [showAddForm, setShowAddForm] = useState(false); // New state to handle showing/hiding the add form
    const [newMemberData, setNewMemberData] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });
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

    };

    // Edit Email by id 
    const editEmail = (id, newEmail) => {
        const updatedMembers = members.map(member =>
            member.id === id ? { ...member, email: newEmail } : member
        );
        setMembers(updatedMembers);

    };

    // Edit role by ID
    const editRole = (id, newRole) => {
        const updatedMembers = members.map(member =>
            member.id === id ? { ...member, role: newRole } : member
        );
        setMembers(updatedMembers);

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

    const addNewMember = () => {
        setMembers([...members, newMemberData]);
        setShowAddForm(false); // Hide the add form after adding a new member
        setNewMemberData({ id: "", name: "", email: "", role: "" }); // Reset the form data
    };

    return (
        <div>
            <div className="topbar">

                <div className='flex select-all'>
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    <p>Select All</p>
                </div>
                {/* Delete Selected Button */}
                <button onClick={deleteSelectedRows} className='delete-selected red-hover'>Delete Selected</button>
                <input
                    type="text"
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={handleSearch}
                    className='trigger-search'
                />

            </div>

            <table className=''>
                <thead>
                    <tr className='table-headings'>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={index} className={selectedRows.includes(member.id) ? 'selected-row' : 'row'} onClick={() => handleRowSelection(member.id)}>
                            <td className='column '>
                                {selectedRows.includes(member.id) ? <FaCheckCircle className='checked' /> : member.id}
                            </td>
                            <td className='column'>
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
                            <td className='column'>
                                {/* Editable email field */}
                                {editableEmailRowId === member.id ? (
                                    <input
                                        type="text"
                                        value={member.email}
                                        onChange={e => editEmail(member.id, e.target.value)}
                                        onBlur={() => setEditableEmailRowId(null)}
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={() => setEditableEmailRowId(member.id)}>
                                        {member.email}
                                    </span>
                                )}
                            </td>
                            <td className="column">
                                {/* Editable role field */}
                                {editableRoleRowId === member.id ? (
                                    <input
                                        type="text"
                                        value={member.role}
                                        onChange={e => editRole(member.id, e.target.value)}
                                        onBlur={() => setEditableRoleRowId(null)}
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={() => setEditableRoleRowId(member.id)}>
                                        {member.role}
                                    </span>
                                )}
                            </td>
                            <td className='column'>
                                <button className='blue-hover btn edit-btn' onClick={() => setEditableRowId(member.id)}><FiEdit /></button>
                                <button className='red-hover btn delete-btn' onClick={() => deleteMember(member.id)}><RiDeleteBin4Line /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {/* ... (Existing code remains unchanged) */}

                {/* Button to toggle the display of the add new member form */}
                <button onClick={() => setShowAddForm(!showAddForm)} className='new-entry'>
                    {showAddForm ? "Hide Form" : "Add New Entry + "}
                </button>

                {/* Form to add a new member */}
                {showAddForm && (
                    <div>
                        <input
                            type="text"
                            placeholder="ID"
                            value={newMemberData.id}
                            onChange={(e) =>
                                setNewMemberData({ ...newMemberData, id: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={newMemberData.name}
                            onChange={(e) =>
                                setNewMemberData({ ...newMemberData, name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={newMemberData.email}
                            onChange={(e) =>
                                setNewMemberData({ ...newMemberData, email: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={newMemberData.role}
                            onChange={(e) =>
                                setNewMemberData({ ...newMemberData, role: e.target.value })
                            }
                        />
                        <button onClick={addNewMember}>Add Member </button>
                    </div>
                )}
            </div>
            {/* Pagination */}
            <div>
                {members.length > 0 && (
                    <div className="pagination flex">
                        {Array.from(
                            { length: Math.ceil(members.length / membersPerPage) },
                            (_, index) => (
                                <button className='blue-hover' key={index} onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>

        </div >
    );
};

export default Row;


