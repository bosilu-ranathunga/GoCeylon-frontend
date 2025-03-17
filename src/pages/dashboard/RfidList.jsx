import React, { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";


export default function RfidList() {
    // Define table columns
    const columns = useMemo(() => [
        { accessorKey: "fullName", header: "Full Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "nationality", header: "Nationality" },
        { accessorKey: "passportNumber", header: "Passport Number" },
    ], []);

    const table = useReactTable({
        data: travelersList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        onSortingChange: setSorting,
    });



    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6">

                {/* Traveler Table */}
                <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Traveler List</h2>
                {/* Traveler Table */}
                <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Traveler List</h2>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-gray-100">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="p-3 border border-gray-300 text-left cursor-pointer"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3 border border-gray-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
