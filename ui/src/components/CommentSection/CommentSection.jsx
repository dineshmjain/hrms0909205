import React from "react";

import Comments from "./Comments";
import SideDrawer from "../Drawer/SideDrawer";

const CommentSection = ({ task, setTask, bringToFront }) => {

  
  return (
    <SideDrawer
      heading="Comments"
      isOpen={task}
      onClose={() => setTask(null)}
      bringToFront={bringToFront}
    >
      <Comments task={task}/>
    </SideDrawer>
  );
};

export default CommentSection;
