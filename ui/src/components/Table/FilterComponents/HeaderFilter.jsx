import { set } from "date-fns/set";
import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { MdOutlineDragIndicator } from "react-icons/md";
import { ReactSortable } from "react-sortablejs";
import TooltipMaterial from "../../TooltipMaterial/TooltipMaterial";

const HeaderFilter = ({
  setTableHeader,
  initialHeaders,
  childLabels,
  //tableHeader is the selected Headers by user . if there is a name instead of a "" (empty string) then it is selected by user
  tableHeader,
  labels,
  childHeader,
  initialChildHeaders,
  setChildHeader,
  setShowFilter,
}) => {
  // as initialHeaderS is a ref which wont result to any change on ui , so we Decalred initialHeader as state
  const [initialHeader, setInitialHeader] = useState(initialHeaders);

  const handleCheckBoxClick = (header, idx) => {
    if (tableHeader?.includes(header)) {
      setTableHeader((prev) => {
        const updatedHeaders = prev;
        updatedHeaders[idx] = "";
        return [...updatedHeaders];
      });
    } else {
      setTableHeader((prev) => {
        const updatedHeaders = prev;
        updatedHeaders[idx] = header;
        return [...updatedHeaders];
      });
    }
  };
  const handleCheckBoxClickChild = (header, idx) => {
    if (childHeader?.includes(header)) {
      setChildHeader((prev) => {
        const updatedHeaders = prev;
        updatedHeaders[idx] = "";
        return [...updatedHeaders];
      });
    } else {
      setChildHeader((prev) => {
        const updatedHeaders = prev;
        updatedHeaders[idx] = header;
        return [...updatedHeaders];
      });
    }
  };
  useEffect(() => {
    setInitialHeader([...initialHeaders]);
  }, [initialHeaders]);

  return (
    <>
      <div className="flex flex-col gap-2 p-2 ">
        <ReactSortable
          list={initialHeader}
          setList={() => { }}
          //updating both initalHeader and tableHeader
          onUpdate={({ newIndex, oldIndex }) => {
            setInitialHeader((prev) => {
              const updatedHeaders = [...prev];
              const [movedHeader] = updatedHeaders.splice(oldIndex, 1);
              updatedHeaders.splice(newIndex, 0, movedHeader);
              return updatedHeaders;
            });
            setTableHeader((prev) => {
              const updatedHeaders = [...prev];
              const [movedHeader] = updatedHeaders.splice(oldIndex, 1);
              updatedHeaders.splice(newIndex, 0, movedHeader);
              return updatedHeaders;
            });
          }}
          className="flex flex-col gap-2"
        >
          {initialHeader?.map((header, idx) => {
            const isChecked = tableHeader?.includes(header);
            return (
              <div className="flex gap-2 group items-center " key={header}>
                <TooltipMaterial content={"Drag To Reorder"}>
                  <MdOutlineDragIndicator className="w-4 h-4 opacity-0 group-hover:opacity-50 hover:cursor-grab  " />
                </TooltipMaterial>
                <input
                  id={header + "_checkbox"}
                  type="checkbox"
                  checked={isChecked}
                  className="w-5 h-5 ui-checkbox"
                  onChange={() => handleCheckBoxClick(header, idx)}
                ></input>
                <label
                  htmlFor={header + "_checkbox"}
                  className="ms-2 text-sm font-medium text-primary "
                >
                  {labels
                    ? labels[header]?.DisplayName
                    : header?.split("_")?.join(" ")}
                </label>
              </div>
            );
          })}

          {initialChildHeaders &&
            initialChildHeaders?.current?.map((header, idx) => {
              const isChecked = childHeader?.includes(header);
              return (
                <div className="flex gap-2" key={idx}>
                  <input
                    id={header + "child_checkbox"}
                    type="checkbox"
                    checked={isChecked}
                    className="w-5 h-5 ui-checkbox"
                    onChange={() => handleCheckBoxClickChild(header, idx)}
                  ></input>
                  <label
                    htmlFor={header + "child  _checkbox"}
                    className="ms-2 text-sm font-medium text-primary "
                  >
                    {childLabels
                      ? childLabels[header]?.DisplayName
                      : header?.split("_")?.join(" ")}
                  </label>
                </div>
              );
            })}
        </ReactSortable>
      </div>
    </>
  );
};

export default HeaderFilter;
