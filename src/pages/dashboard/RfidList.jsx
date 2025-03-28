import React, { useMemo, useState } from 'react';
import Sidebar from "../../components/Sidebar";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';

const RfidList = () => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Sample data
    const data = useMemo(() => [
        { id: 1, name: 'John Doe', age: 28, status: 'Active' },
        { id: 2, name: 'Jane Smith', age: 34, status: 'Inactive' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        { id: 3, name: 'Bob Johnson', age: 45, status: 'Active' },
        // Add more data...
    ], []);

    // Define columns
    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id',
            enableSorting: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            cell: info => <span className="font-medium">{info.getValue()}</span>,
        },
        {
            header: 'Age',
            accessorKey: 'age',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: info => (
                <span className={`px-2 py-1 rounded ${info.getValue() === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {info.getValue()}
                </span>
            ),
        },
        // Add actions column
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleView(row.original)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleUpdate(row.original)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ], []);

    // Action handlers
    const handleDelete = (id) => {
        // Add your delete logic here
        console.log('Delete item with id:', id);
        alert(`Delete item with id: ${id}`);
    };

    const handleUpdate = (data) => {
        // Add your update logic here
        console.log('Update data:', data);
        alert(`Update data: ${JSON.stringify(data)}`);
    };

    const handleView = (data) => {
        // Add your view logic here
        console.log('View data:', data);
        alert(`View data: ${JSON.stringify(data)}`);
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
                            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                            <div className="relative w-full sm:max-w-xs">
                                <input
                                    type="text"
                                    value={globalFilter}
                                    onChange={e => setGlobalFilter(e.target.value)}
                                    placeholder="Search users..."
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
                                                        {{
                                                            asc: <span className="text-blue-600">↑</span>,
                                                            desc: <span className="text-blue-600">↓</span>,
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {table.getRowModel().rows.map(row => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50 transition-colors even:bg-gray-50"
                                        >
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
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
                                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                                    {table.getPageCount()}
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