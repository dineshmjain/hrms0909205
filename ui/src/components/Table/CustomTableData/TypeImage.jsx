import React from "react";

const TypeImage = ({ data, header, labels, bg, idx, rowSpan,css }) => {
  console.log(data);

  return (
    <td className={` p-2 bg-background group-hover:bg-backgroundHover${css} `} key={`${idx}_${header}`}>
      <div className="flex items-center justify-center" rowSpan={rowSpan}>
        {" "}
        {!data?.[header] ? (
          <span className="text-red-800"> No Image attached</span>
        ) : (
          <img
            src={data?.[header]}
            alt={data?.[header]}
            className="w-[150px] aspect-[5/1] object-cover rounded-md"
          />
        )}
      </div>
    </td>
  );
};

export default TypeImage;
