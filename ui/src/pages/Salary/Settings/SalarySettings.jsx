import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import ComponentSettings from "./ComponentSettings";
import StatutorySettings from "./StatutorySettings";

export default function SalarySettings() {
  const data = [
    {
      label: "Component Settings",
      value: "component",
      element: <ComponentSettings />,
    },
    {
      label: "Statutory Settings",
      value: "statutory",
      element: <StatutorySettings />,
    },
  ];

  return (
    <Tabs value="component">
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, element }) => (
          <TabPanel key={value} value={value}>
            {element}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
