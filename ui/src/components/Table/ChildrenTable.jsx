import GetTDbyType from "./CustomTableData/GetTDbyType";
import TypeObject from "./CustomTableData/TypeObject";

const ChildrenTable = ({
  pageData,
  tableHeader,
  status,
  labels,
  childHeader,
  childerenRows,
  activePage,
  numberOfRowsPerPage,
  actions,
  hideSlNo = false,
}) => {
  return (
    <tbody className="bg-background divide-y divide-gray-400">
      {pageData?.map((data, idx) => {
        const childCount = data?.[childerenRows?.name]?.length || 0;
        /// if child array is empty then just print the row with no child values

        return childCount == 0 ? (
          <tr className=" text-gray-900 text-center text-nowrap  " key={idx}>
            {!hideSlNo && (
              <td
                className={`px-6 py-4 maxsm:px-2 maxsm:py-2 font-normal`}
                key={`${idx}`}
                rowSpan={1}
              >
                <span className={`px-2 p-1 rounded-sm `}>
                  {activePage * numberOfRowsPerPage + idx + 1}
                </span>
              </td>
            )}
            {tableHeader?.map((header) => {
              const dataName = data?.[header];
              let bg = "";
              if (status?.[header]) {
                bg = status?.[header][dataName];
              }

              return (
                header && (
                  <GetTDbyType
                    key={`${idx}-${header}`}
                    data={data}
                    labels={labels}
                    bg={bg}
                    header={header}
                    idx={idx}
                    rowSpan={1}
                    css={"border-x border-gray-400"}
                  />
                )
              );
            })}
            {childHeader?.map((header) => {
              return (
                header && (
                  <td
                    className="border-x border-gray-400"
                    key={`${idx}-${header}`}
                  >
                    -
                  </td>
                )
              );
            })}

            {actions && (
              <td className="px-6 py-4  border-x border-gray-400 font-normal" rowSpan={1}>
                <div className="flex gap-2 justify-center">
                  {actions?.map((action, aidx) => {
                    let currentItemIdx = activePage * numberOfRowsPerPage + idx;
                    return (
                      <span
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={action?.title}
                        key={`actions-${aidx}`}
                        className="cursor-pointer"
                        onClick={() => action?.onClick(data, currentItemIdx)}
                      >
                        {action?.text}
                      </span>
                    );
                  })}
                </div>
              </td>
            )}
          </tr>
        ) : (
          /// elese print with child rows

          data?.[childerenRows?.name]?.map((childData, cidx) => {
            return (
              <tr
                className=" text-gray-900 text-center text-nowrap  "
                key={`${idx}-${cidx}`}
              >
                {!hideSlNo && cidx == 0 && (
                  <td
                    className={`px-6 py-4 maxsm:px-2 maxsm:py-2 font-normal`}
                    key={`slno-${idx}-${cidx}`}
                    rowSpan={childCount}
                  >
                    <span className={`px-2 p-1 rounded-sm `}>
                      {activePage * numberOfRowsPerPage + idx + 1}
                    </span>
                  </td>
                )}
                {cidx === 0 &&
                  tableHeader?.map((header) => {
                    const dataName = data?.[header];
                    let bg = "";
                    if (status?.[header]) {
                      bg = status?.[header][dataName];
                    }

                    return (
                      header && (
                        <GetTDbyType
                          key={`${idx}-${header}`}
                          data={data}
                          labels={labels}
                          bg={bg}
                          header={header}
                          idx={idx}
                          rowSpan={childCount}
                          css={"border-x border-gray-400"}
                        />
                      )
                    );
                  })}
                {childHeader?.map((header) => {
                  const dataName = childData?.[header];
                  let bg = "";
                  if (status?.[header]) {
                    bg = status[header][dataName];
                  }

                  return (
                    header && (
                      <GetTDbyType
                        key={`${idx}-${header}`}
                        data={childData}
                        labels={childerenRows?.labels}
                        bg={bg}
                        header={header}
                        idx={idx}
                        rowSpan={1}
                        css={"border-x border-gray-400"}
                        mainData={data}
                        subIdx={cidx}
                      />
                    )
                  );
                })}

                {actions && cidx === 0 && (
                  <td
                    className="px-6 py-4  border-x border-gray-400 font-normal"
                    rowSpan={childCount}
                  >
                    <div className="flex gap-2 justify-center">
                      {actions?.map((action, aidx) => {
                        let currentItemIdx =
                          activePage * numberOfRowsPerPage + idx;
                        return (
                          <span
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={action?.title}
                            key={`actions-${aidx}`}
                            className="cursor-pointer"
                            onClick={() =>
                              action?.onClick(data, currentItemIdx)
                            }
                          >
                            {action?.text}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            );
          })
        );
      })}
    </tbody>
  );
};
export default ChildrenTable;
