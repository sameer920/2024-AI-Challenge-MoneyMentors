import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeleteModal from "../Delete/DeleteModal";
import ShareModal from "../SharePage/ShareModal";

import SettingsIcon from "@mui/icons-material/Settings";
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import ShareIcon from '@mui/icons-material/Share';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import QuizIcon from '@mui/icons-material/Quiz';
import CommentIcon from '@mui/icons-material/Comment';

import { useLocation } from "react-router-dom";

function SideBar() {
    const location= useLocation()
    console.log(location.pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [deleteModal, toggleDelete] = useState(false);
  const [shareModal, toggleShare] = useState(false);

//   ---------------------Training Child section toggle---------------------
    const [trainingChild_state, settrainingChild_state]=useState(false);
  const { id } = useParams();

  // useEffect(handleDelete, [])
  // // handleDelete()

  const handleLinkClick = (page) => {
    const dropDownPages = ["Files", "Text", "Website", "Q&A"];
    if (dropDownPages.includes(page) === false) {
      setDropdownOpen(false);
    }
    setSidebarOpen(false);
    setCurrentPage(page);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    console.log(dropdownOpen);
  };

//   ---------------------Training Child section toggle function---------------------
  const TrainingChild=()=>{
    if(trainingChild_state==false){
        settrainingChild_state(true);
    }else{
        settrainingChild_state(false)
    }
  }

  return (
    <>
        {/* ------------------------ sidebar------------------------------- */}
      <div className="fixed mt-2">
        <div className=" bg-white shadow-2xl w-10 sm:w-48 h-screen">
          <div className="flex flex-col gap-3 sm:pl-2 pt-4">

              <Link to={"/Backend/Chatbot/" + id}>
              <div className={`${location.pathname.includes("Chatbot")? "bg-gray-300":""} flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><HeadsetMicIcon/></div>
                  <div className="hidden sm:block"><h3>Chatbot</h3></div>
              </div>
              </Link>

              {/* <Link to={"/Backend/Settings/" + id}>
              <div className={`${location.pathname.includes("Settings")? "bg-gray-300":""} flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><SettingsIcon/></div>
                  <div className="hidden sm:block"><h3>Settings</h3></div>
              </div>
              </Link> */}

              <Link to={"/Backend/Dashboard/" + id}>
              <div className={`${location.pathname.includes("Dashboard")? "bg-gray-300":""} flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><DashboardIcon/></div>
                  <div className="hidden sm:block"><h3>Dashboard</h3></div>
              </div>
              </Link>


{/* ------------------------------child of Training data-------------------- */}
              <Link>
              <div onClick={()=>{TrainingChild()}} className={`${location.pathname.includes("hh")? "bg-gray-300":""} flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><ContentPasteIcon/></div>
                  <div className="hidden sm:block"><h3>Training Data</h3></div>
              </div>
              </Link>

              {
                trainingChild_state? 
                <>
                <div className="text-sm sm:ml-4">
                <Link to={"/backend/sources/files/" + id}>
                <div className={`${location.pathname.includes("/sources/files/")? "bg-gray-300":""} flex items-center gap-2
                 h-7 sm:h-10 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                    <div><FolderOpenIcon/></div>
                    <div className="hidden sm:block"><h3>Files</h3></div>
                </div>
                </Link>
                <Link to={"/backend/sources/text/" + id}>
                <div className={`${location.pathname.includes("/sources/text/")? "bg-gray-300":""} flex items-center gap-2
                 h-7 sm:h-10 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                    <div><PostAddIcon/></div>
                    <div className="hidden sm:block"><h3>Text</h3></div>
                </div>
                </Link>
                {/* <Link to={"/backend/sources/website/" + id}>
                <div className={`${location.pathname.includes("/sources/website/")? "bg-gray-300":""} flex items-center gap-2
                 h-7 sm:h-10 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                    <div><FindInPageIcon/></div>
                    <div className="hidden sm:block"><h3>Website</h3></div>
                </div>
                </Link>
                <Link to={"/backend/sources/questionAnswers/" + id}>
                <div className={`${location.pathname.includes("/sources/questionAnswers/")? "bg-gray-300":""} flex items-center gap-2
                 h-7 sm:h-10 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                    <div><QuizIcon/></div>
                    <div className="hidden sm:block"><h3>Q&A</h3></div>
                </div>
                </Link> */}
              </div>
                </> :
                <>
                    
                </>
              }


{/* ---------------------------------------------------- */}


              {/* <Link to={"/backend/integrations/" + id}>
              <div className={`${location.pathname.includes("integrations")? "bg-gray-300":""} flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><ElectricalServicesIcon/></div>
                  <div className="hidden sm:block"><h3>Integrations</h3></div>
              </div>
              </Link> */}


              {/* -----------------share bots------------------ */}
              {/* <div onClick={() => {
                    toggleShare(true);
                    handleLinkClick("Share");
                  }} className={`flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><ShareIcon/></div>
                  <div className="hidden sm:block"><h3>Share</h3></div>
              </div>
              {shareModal && (
                  <ShareModal show={shareModal} toggleShare={toggleShare} />
                )} */}

{/* --------------------------delete bots-------------------- */}
              <div onClick={() => {
                    toggleDelete(true);
                    handleLinkClick("Delete");
                  }} className={`flex items-center gap-2
               h-8 sm:h-14 pl-2 rounded-l-full active:scale-95 cursor-pointer hover:bg-gray-300`}>
                  <div><DeleteOutlineIcon/></div>
                  <div className="hidden sm:block"><h3>Delete</h3></div>
              </div>
              {deleteModal && (
                  <DeleteModal show={deleteModal} toggleDelete={toggleDelete} />
                )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
