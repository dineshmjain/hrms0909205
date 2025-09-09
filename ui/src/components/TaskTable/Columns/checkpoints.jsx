import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkPointListAction } from "../../../redux/Action/Checkpoint/CheckpointAction";
import { useSelector } from "react-redux";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { MdCancel } from "react-icons/md";

const checkpoints = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  handleChange,
  handleUpdate,
  details,
  projectData,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const error = useSelector((state) => state?.error?.error);
  const actualData = subIdx == undefined ? data : subData;
  const checkpointList = useSelector((state) => state?.checkpoint?.checkpoint);
  useEffect(() => {
    // if Checkpoint of this client already exists then dont get any
    if (checkpointList?.[0]?.clientMappedId != projectData?.clientId) {
      dispatch(
        checkPointListAction({
          clientMappedId: projectData?.clientId,
        })
      );
    }
  }, []);
  let len = actualData?.checkpointIds?.length;

  return (
    <div className="">
      <Menu
        open={isOpen}
        handler={(e) => {
          if (!(details?.isEditable == false)) {
            setIsOpen(e);
          }
        }}
        allowHover
        dismiss={{ itemPress: false }}
      >
        <MenuHandler>
          <span
            className={`cursor-pointer prevent-modal-open text-sm hover:bg-gray-400 font-medium px-2 p-1 max-w-[20ch] truncate rounded-md flex self-center justify-self-center items-center  ${
              error?.[`checkpointIds-${idx}-${subIdx}`] &&
              `border-red-600 border-2 border-box  `
            }`}
          >
            {len > 0
              ? checkpointList?.find(
                  (check) => check?._id == actualData?.checkpointIds?.[0]
                )?.name + (len > 1 ? ` +${len - 1}` : ``)
              : "Select Checkpoint"}
          </span>
        </MenuHandler>
        <MenuList className="bg-gray-100 text-gray-900 flex gap-1 flex-col justify-center w-fit items-center prevent-modal-open">
          {checkpointList?.map((checkpoint, iIdx) => {
            let isSelected = len
              ? actualData?.checkpointIds?.includes(checkpoint?._id)
              : false;
            return (
              <MenuItem
                key={iIdx}
                className={`  group  p-1 px-2  flex justify-between items-center prevent-modal-open  hover:bg-opacity-80 focus:bg-gray-500  ${
                  isSelected && `bg-gray-400  `
                }`}
                onClick={() => {
                  let value = [...actualData?.checkpointIds];
                  if (isSelected) {
                    value = value.filter((item) => item != checkpoint?._id);
                  } else {
                    value.push(checkpoint?._id);
                  }
                  let e = {
                    target: {
                      name: "checkpointIds",
                      value: value,
                    },
                  };
                  handleChange(e, idx, subIdx);
                }}
              >
                <span className="h-5">{checkpoint?.name}</span>
                {isSelected && (
                  <MdCancel className="w-5 h-5 group-hover:flex hidden  text-red-900" />
                )}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
};

export default checkpoints;
