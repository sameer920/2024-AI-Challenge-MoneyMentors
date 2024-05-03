import { useNavigate } from "react-router-dom";
import Header from "../sharedComponents/Header";
import serverBasePath from "../sharedComponents/imports";
import AccountInfoCard from "./components/AccountInfoCard";
import EmailCard from "./components/EmailCard";
import UsageCard from "./components/UsageCard";
import { useEffect, useState } from "react";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

export default function MyAccountPage(props) {
  const navigate = useNavigate();
//   ********************** FOR Loading ***********************************
    const [loading, setloading]= useState(true);
    // ************************* FOR DELETE ACCOUNT TOGGLE **************
    const[DeleteHide, setDeleteHide]=useState(false);

  const [user, setUser] = useState({
    email: "",
    plan: "",
    totalConversations: 0,
    usedConversations: 0,
    API: "",
  });

  const features = [
    "30 message credits/month",
    "1 chatbot",
    "400,000 characters/chatbot",
    "Embed on unlimited websites",
    "Upload multiple files",
    "View conversation history",
    "Capture leads",
    "Chatbots get deleted after 7 days of inactivity",
  ];

  function logoutUser() {
    window.open(serverBasePath + "/auth/logout", "_self");
  }

  function deleteUser() {
    fetch(serverBasePath + "/deleteAccount", {
      method: "DELETE",
      headers: new Headers({
        "content-type": "application/json",
        Accept: "application/json",
      }),
      mode: "cors",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 200) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }

  // ---------------------somthing with use effect------
  useEffect(()=>{
        
    fetch(serverBasePath+'/my-account', {
        method: 'GET',
        headers: new Headers({ 'content-type': 'application/json', 'Accept': 'application/json' }),
        mode: "cors",
        credentials: "include"
    })
    .then(async response=>{
        if (response.status === 200){
            let data = await response.json();
            setUser(data);
        }
        else if (response.status === 401){
            navigate('/login');
        }
    })
  },[])

//   ****************** FOR DELETE TOGGLE ********************************

  const DeleteAccountToggle=()=>{
    if(DeleteHide===false){
        setDeleteHide(true)
    }else{
        setDeleteHide(false)
    }
  }



  return (
    <>
      <Header />
        <div className="bg-gradient-to-r from-blue-300 ml-1 from-25%
                 to-blue-500 w-full rounded-lg mt-12 text-left">
            <div className="flex flex-col ml-3 mr-3 md:flex-row gap-20 items-center justify-center">
              <div>
                {/* Left Side */}
                <AccountInfoCard plan={user.plan} features={features} />
              </div>

              <div>
                {/* Right side */}
                <UsageCard
                  messagesSent={user.usedConversations}
                  messagesTotal={user.totalConversations}
                />
                <EmailCard heading={"Your Email"} description={user.email} />
                <EmailCard heading={"Your API key"} description={user.API} />
              </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row mb-10 justify-center items-center mt-10 gap-8">
                <h3>Are you sure you want to sign Out?</h3>
                <button className='bg-blue-900 active:scale-95 text-white px-10 py-3
                     text-xl font-medium rounded-full'
                onClick={logoutUser}>Sign Out</button>

                <div onClick={()=>DeleteAccountToggle("hidden")} className="flex items-center cursor-pointer active:scale-95">
                    <h3>More </h3>
                    <KeyboardDoubleArrowDownIcon/>
                </div>
                
        </div>



            {/* <div className="flex items-center">
                <hr className=" border-gray-300 border-t" />
                <span className="px-2 text-gray-600
                 whitespace-nowrap">Danger Zone</span>
                <hr className="w-full border-gray-300 border-t" />
            </div> */}

            {
                DeleteHide? <>
                <div className="flex items-center justify-center text-center mb-4">
                <div className="w-screen h-[1px] bg-gray-400"></div>
                <div className="w-screen"><h3>Danger Zone</h3></div>
                <div className="w-screen h-[1px] bg-gray-400"></div>
            </div>
            <div className="flex sm:flex-row flex-col text-center items-center justify-center gap-6 mb-10">
                <div>
                    <h3>Are you sure you want to delete your account? If you delete
                    your account, you will permanently lose your data.</h3>
                </div>
                <div>
                <button className='bg-red-600 active:scale-90 rounded-full text-white px-5 py-3 text-xl 
                    font-medium'
                    onClick={deleteUser}
                >Delete Account</button>
                </div>
            </div>
                </>
                :
                <>
                    
                </>
            }

            
    </>
  );
}
