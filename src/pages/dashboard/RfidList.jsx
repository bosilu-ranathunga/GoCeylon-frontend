import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../config/config";
import { useModal } from '../../context/ModalContext';
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';

const RfidList = () => {
    const navigate = useNavigate();  // Initialize useNavigate hook
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [data, setData] = useState([]);

    const { showModal, closeModal } = useModal();

    const token = localStorage.getItem("authToken");

    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rfid`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (response.data.success) {
                setData(response.data.data);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Define columns
    const columns = useMemo(() => [
        {
            header: 'RFID Tag Code',
            accessorKey: 'rfidTagCode',
        },
        {
            header: 'Full Name',
            accessorKey: 'fullName',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Phone Number',
            accessorKey: 'phoneNumber',
        },
        {
            header: 'Country',
            accessorKey: 'nationality',
        },
        {
            header: 'Passport Number',
            accessorKey: 'passportNumber',
        },
        {
            header: 'Wallet',
            accessorKey: 'walletAmount',
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleUpdate(row.original._id)}
                        className="px-2 py-1 w-15 bg-emerald-600 text-white rounded cursor-pointer flex flex-row items-center gap-[5px]"
                    >
                        <BiSolidEdit />Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.original._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer flex flex-row items-center gap-[5px]"
                    >
                        <MdDelete />Delete
                    </button>
                </div>
            ),
        },
    ], []);

    // Action handlers
    const handleDelete = async (id) => {
        showModal({
            type: 'delete',
            title: 'Are you sure you want to delete this?',
            content: 'Once you are delete this item you can\'t undo this process.',
            buttons: [
                {
                    label: 'Confirm',
                    onClick: async () => {
                        try {
                            const response = await axios.delete(`${API_BASE_URL}/rfid/${id}`, {
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                },
                            });
                            if (response.data.success) {
                                fetchData();
                            } else {
                                console.error('Failed to delete');
                            }
                        } catch (error) {
                            console.error('Error deleting RFID:', error);
                        }
                        closeModal();
                    },
                    className: 'w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700'
                }, {
                    label: 'Cancel',
                    onClick: closeModal,
                    className: 'w-full px-4 py-2 text-white bg-gray-500 border border-gray-500 rounded hover:bg-gray-600'
                }
            ]
        });
    };

    const handleUpdate = (id) => {
        // Navigate to the update page with the RFID ID
        navigate(`/update-rfid/${id}`);
    };

    // Create table instance
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div className="bg-white w-full p-10 rounded-lg shadow-xl relative">
                    <div className="p-6 mx-auto">
                        {/* Header and Search */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">RFID Management</h2>
                            <div className="relative w-full sm:max-w-xs">
                                <input
                                    type="text"
                                    value={globalFilter}
                                    onChange={e => setGlobalFilter(e.target.value)}
                                    placeholder="Search RFID..."
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <svg
                                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th
                                                    key={header.id}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getIsSorted() && (
                                                            <span className="text-blue-600">
                                                                {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors even:bg-gray-50">
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>Show</span>
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={e => table.setPageSize(Number(e.target.value))}
                                    className="px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {[10, 20, 30, 40, 50].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                                <span>entries</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-700">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </span>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RfidList;
