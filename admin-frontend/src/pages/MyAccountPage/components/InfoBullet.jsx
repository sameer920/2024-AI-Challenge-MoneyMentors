export default function InfoBullet(props) {
    return (
        <li class="flex space-x-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor" aria-hidden="true"
                class="h-5 w-5 flex-shrink-0 text-green-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span class="text-sm font-semibold text-gray-700">{props.feature}</span>
        </li>
    )
}