"use client";

import{
  Box,
  Container,
  Input,
  SimpleGrid,
  Spinner,
  Button,
  chakra
} from "@chakra-ui/react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender
} from "@tanstack/react-table";
import React, { useState } from "react";

interface OptionData {
  id: number;
  name: string;
  type: string;
  price: number;
}

type FormData = {
  type: "call" | "put";
  expiryTime: number;
  periodNumber: number;
  volatility: number;
  continuousRfRate: number;
  initialSharePrice: number;
  strikePrice: number;
};

const numericKeys: Array<keyof Omit<FormData, "type">> = [
  "expiryTime",
  "periodNumber",
  "volatility",
  "continuousRfRate",
  "initialSharePrice",
  "strikePrice"
];

const fieldLabels: Record<keyof Omit<FormData, "type">, string> = {
  expiryTime: "Expiry Time (Years)",
  periodNumber: "Number of Periods",
  volatility: "Volatility (%)",
  continuousRfRate: "Continuous Risk-Free Rate (%)",
  initialSharePrice: "Initial Share Price ($)",
  strikePrice: "Strike Price ($)"
};

export default function OptionPricingForm() {
  const [formData, setFormData] = useState<FormData>({
    type: "call",
    expiryTime: 2,
    periodNumber: 8,
    volatility: 0.3,
    continuousRfRate: 0.04,
    initialSharePrice: 50,
    strikePrice: 60
  });
  const [optionData, setOptionData] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) } as FormData));
  };

  const handleTypeChange = (value: "call" | "put") => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOptionData([]);
    try {
      const res = await fetch(
        "https://backend20250103203956.azurewebsites.net/api/Options/price",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );
      if (!res.ok) throw new Error("Failed to fetch option price.");
      const data = (await res.json()) as OptionData[];
      setOptionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const columns = React.useMemo<ColumnDef<OptionData>[]>(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Type", accessorKey: "type" },
      {
        header: "Price",
        accessorKey: "price",
        cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`
      }
    ],
    []
  );

  const table = useReactTable({ data: optionData, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Box className="chakra-11rkf5j">
      <Container className="chakra-5pajrs">
        <chakra.form onSubmit={handleSubmit}>
          <Box mb={6} textAlign="center">
            <chakra.h5
              className="MuiTypography-root MuiTypography-h5 MuiTypography-gutterBottom chakra-momj02-MuiTypography-root"
            >
              European Option Price Calculator
            </chakra.h5>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6} className="chakra-ektqcn">
            <Box>
              <fieldset>
                <legend>Option Type</legend>
                <Box display="flex" gap={4}>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="call"
                      checked={formData.type === "call"}
                      onChange={() => handleTypeChange("call")}
                    /> Call
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="put"
                      checked={formData.type === "put"}
                      onChange={() => handleTypeChange("put")}
                    /> Put
                  </label>
                </Box>
              </fieldset>
            </Box>

            {numericKeys.map(key => (
              <Box key={key}>
                <label>
                  {fieldLabels[key]}
                  <Input
                    name={key}
                    type="number"
                    step={["continuousRfRate", "volatility", "expiryTime"].includes(key) ? 0.01 : 1}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                  />
                </label>
              </Box>
            ))}

            <Box gridColumn="1 / -1">
  <Button
    type="submit"
    size="lg"
    w="100%"
    bg="#3683cc"
    color="white"
    boxShadow="0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)"
    _hover={{
      bg: "#2f5ea8",
      boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
    }}
    _active={{
      boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)"
    }}
  >
    Calculate Price
  </Button>
</Box>
          </SimpleGrid>

          {loading && <Spinner mb={6} />}
          {error && <Box color="red.500" mb={6}>{error}</Box>}

          {optionData.length > 0 && (
            <Box>
              <chakra.table>
                <chakra.thead>
                  {table.getHeaderGroups().map(hg => (
                    <chakra.tr key={hg.id}>
                      {hg.headers.map(header => (
                        <chakra.th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </chakra.th>
                      ))}
                    </chakra.tr>
                  ))}
                </chakra.thead>
                <chakra.tbody>
                  {table.getRowModel().rows.map(row => (
                    <chakra.tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <chakra.td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </chakra.td>
                      ))}
                    </chakra.tr>
                  ))}
                </chakra.tbody>
              </chakra.table>
            </Box>
          )}
        </chakra.form>
      </Container>
    </Box>
  );
}
