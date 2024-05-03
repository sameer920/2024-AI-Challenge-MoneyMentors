import "../styles/botIcon.css"

export default function BotIcon(props) {
    return (
        <div
            className="ml-1/2 w-40 h-48 rounded border border-gray-300 grid bg-gray-200 grid-col-1 grid-rows-2 overflow-hidden bot-button items-center cursor-pointer"
            onClick={props.onClick}
        >
            <div className="w-28 m-auto h-28">
                {props.children}
            </div>
            <div className="p-2 bg-gray-900 w-full self-end  ">
                <p className="text-white font-semibold">{props.name}</p>
            </div>
        </div>
    )
}