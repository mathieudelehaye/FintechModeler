"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import {
  Box,
  Button,
  Stack,
  Input,
  Text,
  VStack,
  Container,
  chakra,
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

// Define the CashFlow type
interface CashFlow {
  id: number;
  date: string;
  value: number;
  type: "Asset" | "Liability";
}

let idCounter = 0;

export default function VirtualizedCashFlowManager() {
  // Form state
  const [form, setForm] = useState({ date: "", value: "", type: "Asset" as "Asset" | "Liability" });
  // Table data
  const [rows, setRows] = useState<CashFlow[]>([]);
  // Selected row IDs
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Column definitions
  const columns = React.useMemo<ColumnDef<CashFlow, any>[]>(
    () => [
      { header: "Date", accessorKey: "date" },
      { header: "Amount", accessorKey: "value" },
      { header: "Type", accessorKey: "type" },
    ],
    []
  );

  // Build table
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  // Virtualizer setup
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 5,
  });
  const totalSize = rowVirtualizer.getTotalSize();

  // Add new row
  const handleAdd = () => {
    if (!form.date || !form.value) return;
    const newRow: CashFlow = {
      id: idCounter++,
      date: form.date,
      value: parseFloat(form.value),
      type: form.type,
    };
    setRows(prev => [...prev, newRow]);
    setForm({ date: "", value: "", type: "Asset" });
  };

  // Delete selected
  const handleDeleteSelected = () => {
    setRows(prev => prev.filter(r => !selectedRows.has(r.id)));
    setSelectedRows(new Set());
  };

  // Toggle select all
  const toggleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedRows(new Set(rows.map(r => r.id)));
    else setSelectedRows(new Set());
  };

  // Toggle single
  const toggleSelect = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      e.target.checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  // Are all selected?
  const isAllSelected = rows.length > 0 && rows.every(r => selectedRows.has(r.id));

  return (
    <Box bg="gray.50" minH="100vh" py={10} display="flex" justifyContent="center">
      <Container maxW="4xl">
        <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
          <VStack gap={8} align="stretch">

            {/* Title */}
            <Text as="h1" fontSize="2xl" fontWeight="extrabold" textAlign="center">
              Cash Flow Manager
            </Text>

            {/* Form */}
            <Stack direction={{ base: "column", md: "row" }} gap={4}>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" color="gray.600">Date</Text>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </Box>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" color="gray.600">Amount</Text>
                <Input
                  type="number"
                  value={form.value}
                  onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                />
              </Box>
              <Box flex={1}>
                <Text mb={1} fontSize="sm" color="gray.600">Type</Text>
                <chakra.select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as "Asset" | "Liability" }))}
                  w="100%"
                  h="36px"
                  borderRadius="md"
                  borderColor="gray.200"
                >
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                </chakra.select>
              </Box>
              <Button colorScheme="blue" onClick={handleAdd} mt={{ base: 4, md: 8 }}>
                Add
              </Button>
            </Stack>

            {/* Table */}
            <Box borderWidth="1px" borderRadius="md" overflow="hidden">
              <Box
                display="grid"
                gridTemplateColumns="auto 2fr 1fr 1fr"
                bg="gray.100"
                px={4}
                py={2}
              >
                <chakra.input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
                {table.getHeaderGroups()[0].headers.map(hdg => (
                  <Text key={hdg.id} fontWeight="semibold">
                    {flexRender(hdg.column.columnDef.header, hdg.getContext())}
                  </Text>
                ))}
              </Box>

              <Box ref={parentRef} maxH="300px" overflowY="auto">
                <Box height={`${totalSize}px`} position="relative">
                  {rowVirtualizer.getVirtualItems().map(virtualRow => {
                    const row = table.getRowModel().rows[virtualRow.index];
                    return (
                      <Box
                        key={row.original.id}
                        position="absolute"
                        top={virtualRow.start}
                        left={0}
                        display="grid"
                        gridTemplateColumns="auto 2fr 1fr 1fr"
                        px={4}
                        h="30px"
                        alignItems="center"
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                      >
                        <chakra.input
                          type="checkbox"
                          checked={selectedRows.has(row.original.id)}
                          onChange={toggleSelect(row.original.id)}
                        />
                        {row.getVisibleCells().map(cell => (
                          <Text key={cell.id} whiteSpace="nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Text>
                        ))}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Delete button */}
            <Box textAlign="center">
              <Button
                colorScheme="blue"
                variant="solid"
                mt={4}
                disabled={selectedRows.size === 0}
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            </Box>

          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
