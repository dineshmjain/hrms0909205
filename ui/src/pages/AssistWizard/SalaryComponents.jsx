import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SalaryComponentsGetAction,
  SalaryComponentCreateAction,
} from "../../redux/Action/Salary/SalaryAction";
import SalaryComponentsTable from "./components/SalaryComponentsTable";
import StatutoryPercentageTable from "./components/StatutoryPercentageTable";
import StatutoryFixedTable from "./components/StatutoryFixedTable";
import TdsToggleCard from "./components/TdsToggleCard";
import AddComponentDialog from "./components/AddComponentDialog";


const SalaryAndStatutorySettings = () => {
  const dispatch = useDispatch();
  const { list: components, loading } = useSelector(
    (state) => state.salary.all
  );

  const [localComponents, setLocalComponents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newComponent, setNewComponent] = useState({
    name: "",
    type: "Earnings",
  });
  const [tdsEnabled, setTdsEnabled] = useState(true);

  useEffect(() => {
    dispatch(
      SalaryComponentsGetAction({ page: 1, limit: 100, category: "all" })
    );
  }, [dispatch]);

  useEffect(() => {
    setLocalComponents(components);
  }, [components]);

  const handleAdd = async () => {
    const payload = {
      name: newComponent.name,
      category: newComponent.type === "Earnings" ? "earning" : "deduction",
      isActive: true,
      isStatutory: false,
    };
    await dispatch(SalaryComponentCreateAction(payload));
    setOpen(false);
    setNewComponent({ name: "", type: "Earnings" });
    dispatch(
      SalaryComponentsGetAction({ page: 1, limit: 100, category: "all" })
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SalaryComponentsTable
        loading={loading}
        components={localComponents}
        setLocalComponents={setLocalComponents}
        setOpen={setOpen}
      />

      <StatutoryPercentageTable
        components={localComponents}
        setLocalComponents={setLocalComponents}
      />

      <StatutoryFixedTable
        components={localComponents}
        setLocalComponents={setLocalComponents}
      />

      <TdsToggleCard tdsEnabled={tdsEnabled} setTdsEnabled={setTdsEnabled} />

      <AddComponentDialog
        open={open}
        setOpen={setOpen}
        newComponent={newComponent}
        setNewComponent={setNewComponent}
        handleAdd={handleAdd}
      />
    </div>
  );
};

export default SalaryAndStatutorySettings;
