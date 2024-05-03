import InfoBullet from "./InfoBullet";

export default function AccountInfoCard(props) {

    /*
    props:
    plan: String | describes the name of the plan the user is on
    features: String Array | Describes the features of the plans

    */



    return (

        <div class="border border-zinc-300 bg-gray-50 max-w-3xl w-full rounded-md my-8">
            <div class="px-5 py-4">
                <h3 class="text-2xl mb-1 font-medium">Your Plan</h3>
                <div class="text-xl mt-8 mb-4 font-semibold">
                    <p>You are on the {props.plan} plan</p>
                </div>
                <ul>
                    {props.features.map(feature => <InfoBullet feature={feature} />)}
                </ul>
            </div>
            <div class="border-t border-zinc-300 bg-zinc-200 p-4 text-zinc-500 rounded-b-md">
                <div class="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    <br></br>
                    <a href="#">
                        <button  class="bg-blue-600 scale-95 p-2 rounded-md text-white">Upgrade
                            plan</button>
                    </a>
                </div>
            </div>
        </div>

    )
}