import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import API_BASE_URL from "../../config/config";
import { useModal } from '../../context/ModalContext';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import * as XLSX from 'xlsx';

const Guides = () => {
    const navigate = useNavigate();
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [guides, setGuides] = useState([]);
    const { showModal, closeModal } = useModal();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/guides/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).then(response => {
            setGuides(response.data.guides);
        }).catch(error => {
            console.error('Error fetching guides:', error);
        });
    }, []);

    // Function to generate and download Excel report
    const generateExcelReport = () => {
        // Use filtered rows from the table
        const filteredRows = table.getFilteredRowModel().rows;

        // Prepare data for Excel from filtered rows
        const reportData = filteredRows.map((row, index) => ({
            ID: index + 1,
            Name: row.original.g_name,
            Email: row.original.email,
            Number: row.original.contact_number,
            Gender: row.original.gender,
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(reportData);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Guides');

        // Add headers styling
        worksheet['!cols'] = [
            { wch: 10 }, // ID column width
            { wch: 20 }, // Name column width
            { wch: 30 }, // Email column width
            { wch: 15 }, // Number column width
            { wch: 10 }, // Gender column width
        ];

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `Guides_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const filteredData = useMemo(() => {
        let filtered = [...guides];

        // Apply gender filter
        if (genderFilter) {
            filtered = filtered.filter(guide => guide.gender === genderFilter);
        }

        // Apply global search filter
        if (globalFilter) {
            const searchTerm = globalFilter.toLowerCase();
            filtered = filtered.filter(guide =>
                guide.g_name.toLowerCase().includes(searchTerm) ||
                guide.email.toLowerCase().includes(searchTerm) ||
                guide.contact_number.toLowerCase().includes(searchTerm) ||
                guide.gender.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }, [guides, genderFilter, globalFilter]);

    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorFn: (row, index) => index + 1,
            id: 'sequentialId',
            enableSorting: false,
        },
        { header: 'Name', accessorKey: 'g_name' },
        { header: 'Email', accessorKey: 'email' },
        { header: 'Number', accessorKey: 'contact_number' },
        { header: 'Gender', accessorKey: 'gender' },
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div className="bg-white w-full p-10 rounded-lg shadow-xl relative">
                    <div className="p-6 mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Guide Management</h2>
                            <div className="flex gap-4">
                                <div className="relative w-full sm:max-w-xs">
                                    <input
                                        type="text"
                                        value={globalFilter}
                                        onChange={e => setGlobalFilter(e.target.value)}
                                        placeholder="Search here..."
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md outline-none"
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
                                <div className="relative w-full max-w-xs">
                                    <select
                                        value={genderFilter}
                                        onChange={e => setGenderFilter(e.target.value)}
                                        className="block appearance-none w-full h-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-md leading-tight focus:outline-none "
                                    >
                                        <option value="">All Genders</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                        <svg
                                            className="h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    onClick={generateExcelReport}
                                    className="px-4 py-2 bg-[#007a55] text-white rounded-md"
                                >
                                    Download
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
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

export default Guides;