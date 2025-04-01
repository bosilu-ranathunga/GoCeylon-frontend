import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../../components/Sidebar";
import API_BASE_URL from "../../config/config";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";

const Business = () => {
    const navigate = useNavigate();
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [businessData, setBusinessData] = useState([]);

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) return;

        axios
            .get(`${API_BASE_URL}/api/business/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setBusinessData(response.data);
                } else {
                    console.error("Invalid API response format:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching Business:", error);
                alert("Failed to fetch business data. Please try again later.");
            });
    }, [token]);

    const columns = useMemo(
        () => [
            { header: "Name", accessorKey: "business_name" },
            { header: "Category", accessorKey: "business_category" },
            { header: "Number", accessorKey: "contact_number" },
            { header: "Address", accessorKey: "address" },
        ],
        []
    );

    const table = useReactTable({
        data: businessData,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Business Data", 14, 10);
        autoTable(doc, {
            head: [["Name", "Category", "Number", "Address"]],
            body: businessData.map((row) => [
                row.business_name,
                row.business_category,
                row.contact_number,
                row.address,
            ]),
        });
        doc.save("business_data.pdf");
    };

    return (
        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div className="bg-white w-full p-10 rounded-lg shadow-xl relative">
                    <div className="p-6 mx-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Business Management</h2>
                            <div className="flex gap-4">
                                <div class="relative w-full sm:max-w-xs"><input type="text" placeholder="Search RFID..." class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="" /><svg class="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                                <button
                                    onClick={exportToPDF}
                                    className="px-4 py-2 bg-[#007a55] text-white rounded-lg"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 even:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>Show</span>
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                                    className="px-2 py-1 border rounded-md"
                                >
                                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>{pageSize}</option>
                                    ))}
                                </select>
                                <span>entries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-4 py-2 border rounded-md">
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm">Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
                                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-4 py-2 border rounded-md">
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

export default Business;