import {
    Menu,
    MenuHandler,
    Button,
    MenuList,
    MenuItem,
    Input,
} from "@material-tailwind/react";
import { useState } from "react";

export default function Dropdown({ label }) {

    const [selectedValue, setSelectedValue] = useState('')

    const handleRetrun = (e) => {
        setSelectedValue(e.target.value)
        return e.target.value
    }
    return (
        <Menu>
            <MenuHandler >
                <Input label={label} value={selectedValue} />
            </MenuHandler>
            <MenuList className="max-h-72" onClick={handleRetrun}>
                <MenuItem value={"Menu Item 1"}>Menu Item 1</MenuItem>
                <MenuItem value={"Menu Item 2"}>Menu Item 2</MenuItem>
                <MenuItem>Menu Item 3</MenuItem>
                <MenuItem>Menu Item 4</MenuItem>
                <MenuItem>Menu Item 5</MenuItem>
                <MenuItem>Menu Item 6</MenuItem>
                <MenuItem>Menu Item 7</MenuItem>
                <MenuItem>Menu Item 8</MenuItem>
                <MenuItem>Menu Item 9</MenuItem>
                <MenuItem>Menu Item 10</MenuItem>
                <MenuItem>Menu Item 11</MenuItem>
                <MenuItem>Menu Item 12</MenuItem>
                <MenuItem>Menu Item 13</MenuItem>
                <MenuItem>Menu Item 14</MenuItem>
                <MenuItem>Menu Item 15</MenuItem>
                <MenuItem>Menu Item 16</MenuItem>
                <MenuItem>Menu Item 17</MenuItem>
                <MenuItem>Menu Item 18</MenuItem>
                <MenuItem>Menu Item 19</MenuItem>
                <MenuItem>Menu Item 20</MenuItem>
            </MenuList>
        </Menu>
    );
}