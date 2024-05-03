import "../styles/botIcon.css"

export default function BotIcon(props) {
    return (
        <div className="flex items-center justify-center">
                <div className="w-32 h-40 rounded-md sm:w-40 sm:h-48 border
             border-gray-300 bg-slate-100 shadow-lg active:scale-90 grid grid-col-1 grid-rows-2
              overflow-hidden bot-button items-center cursor-pointer"
                onClick={props.onClick}
            >
                <div className="w-28 m-auto h-28">
                    {props.children}
                </div>
                <div className="p-2 bg-gray-900 w-full self-end  ">
                    <p className="text-white font-semibold">{props.name}</p>
                </div>
            </div>
        </div>
    )
}