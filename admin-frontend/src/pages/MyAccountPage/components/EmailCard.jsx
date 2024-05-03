export default function EmailCard(props) {
    return (<div className="border bg-gray-50 p rounded-md my-8">
        <div className="px-5 py-4">
            <h3 className="text-xl sm:text-2xl mb-1 font-medium">{props.heading}</h3>
            <div className="flex sm:flex-row gap-4 flex-col sm:justify-between items-center mt-4 mb-2">
                <p className="text-xl font-semibold">{props.description}</p>
                <button className="bg-gray-600 active:scale-95 sm:w-40 w-full h-10 rounded-full text-white">Edit</button>
            </div>
        </div>
    </div>)
}