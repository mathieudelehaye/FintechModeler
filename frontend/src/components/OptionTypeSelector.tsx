import React, { ReactNode } from "react";
import { Grid, Typography } from "@mui/material";

interface OptionTypeSelectorProps {
    children?: ReactNode;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionTypeSelector: React.FC<OptionTypeSelectorProps> = ({ value, onChange }) => {
    return (
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Option Type
                </Typography>
                <label style={{ marginRight: "1rem" }}>
                    <input
                        type="radio"
                        name="type"
                        value="call"
                        checked={value === "call"}
                        onChange={onChange}
                        style={{ marginRight: "0.3rem" }}
                    />
                    Call
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="put"
                        checked={value === "put"}
                        onChange={onChange}
                        style={{ marginRight: "0.3rem" }}
                    />
                    Put
                </label>
            </fieldset>
        </Grid>
    );
};

export default OptionTypeSelector;
