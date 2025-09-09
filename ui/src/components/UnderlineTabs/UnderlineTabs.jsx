// src/components/common/UnderlineTabs.jsx
import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export default function UnderlineTabs({
  tabs,
  activeTab,
  setActiveTab,
  renderContent,
}) {
  return (
    <Tabs value={activeTab.toString()} className="w-full">
      {/* Tabs Header */}
      <TabsHeader
        className="flex items-center justify-start gap-6 border-b border-gray-50  bg-transparent rounded-none p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-50 shadow-none rounded-none  ",
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            value={index.toString()}
            onClick={() => setActiveTab(index)}
            className={`relative text-sm font-medium px-4 transition-colors duration-200
              ${
                activeTab === index
                  ? "text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsHeader>

      {/* Tabs Body */}
      <TabsBody>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={index.toString()} className="p-0">
            {renderContent(tab, index)}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
