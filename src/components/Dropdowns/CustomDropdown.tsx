import { useState, useEffect, useRef } from 'react';
import { FaCaretDown } from 'react-icons/fa';

export interface DropdownItem {
    label: string;
    value: string | number;
}

export function Dropdown({items, onChange, className, defaultValue}:{items: Array<DropdownItem>, onChange: Function, className?: string, defaultValue?: string}){
    const [opened, setOpened] = useState(false);
    const [value, setValue] = useState<DropdownItem>({
        value: "",
        label: defaultValue || "Select Item"
    });
    const [positionTop, setPositionTop] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectItem = (val: DropdownItem) => {
        setValue(val);
        setOpened(false);
        onChange(val.value);
    }

    useEffect(()=>{
        function handleClickOutside(event:any) {
            if(wrapperRef.current !== null){
                if (!wrapperRef.current.contains(event.target)) {
                    setOpened(false);
                }
                if ((window.innerHeight - wrapperRef.current.getBoundingClientRect().y) < 200){
                    setPositionTop(true);
                }else{
                    setPositionTop(false);
                }
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    })

    return (
        <div ref={wrapperRef} className={`d-select ${opened ? "opened" : ""} ${className? className: ""}`}>
            <div className="d-select-item" onClick={()=>setOpened(!opened)}>
                {value.label}
                <FaCaretDown />
            </div>
            <div className={`d-select-content ${positionTop ? "top" : "bottom"}`}>
                <div className="d-content-wrapper">
                    {items && items.map((item, i)=>{
                        return <div key={i} onClick={()=>selectItem(item)}>{item.label}</div>
                    })}
                </div>
            </div>
        </div>
    );
}